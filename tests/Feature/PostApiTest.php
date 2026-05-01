<?php

namespace Tests\Feature;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_posts(): void
    {
        Post::factory()->count(3)->create();

        $this->getJson('/api/posts')
            ->assertOk()
            ->assertJsonCount(3);
    }

    public function test_can_create_post(): void
    {
        $payload = ['title' => 'Hello', 'body' => 'World body'];

        $this->postJson('/api/posts', $payload)
            ->assertCreated()
            ->assertJsonFragment($payload);

        $this->assertDatabaseHas('posts', $payload);
    }

    public function test_create_post_validates_required_fields(): void
    {
        $this->postJson('/api/posts', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'body']);
    }

    public function test_can_show_post(): void
    {
        $post = Post::factory()->create();

        $this->getJson("/api/posts/{$post->id}")
            ->assertOk()
            ->assertJsonFragment(['id' => $post->id, 'title' => $post->title]);
    }

    public function test_show_returns_404_for_missing_post(): void
    {
        $this->getJson('/api/posts/999')->assertNotFound();
    }

    public function test_can_update_post(): void
    {
        $post = Post::factory()->create();

        $this->putJson("/api/posts/{$post->id}", ['title' => 'Updated'])
            ->assertOk()
            ->assertJsonFragment(['title' => 'Updated']);

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'title' => 'Updated']);
    }

    public function test_update_validates_fields(): void
    {
        $post = Post::factory()->create();

        $this->putJson("/api/posts/{$post->id}", ['title' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_can_delete_post(): void
    {
        $post = Post::factory()->create();

        $this->deleteJson("/api/posts/{$post->id}")->assertNoContent();

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }
}
