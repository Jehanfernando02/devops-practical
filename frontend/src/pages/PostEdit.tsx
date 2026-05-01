import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import PostForm from '../components/PostForm'
import { PostsApi, type Post } from '../api/client'

export default function PostEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    if (!id) return
    PostsApi.get(id).then(setPost)
  }, [id])

  if (!post) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <PostForm
        submitLabel="Update"
        initial={{ title: post.title, body: post.body }}
        onSubmit={async (data) => {
          await PostsApi.update(post.id, data)
          navigate('/')
        }}
      />
    </div>
  )
}
