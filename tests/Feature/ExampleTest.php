<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * Test that the API health endpoint returns a successful response.
     * Replaces the default Laravel example that tested GET / (not used in this API-only app).
     */
    public function test_health_endpoint_returns_ok(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'ok']);
    }
}
