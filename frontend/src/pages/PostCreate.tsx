import { useNavigate } from 'react-router'
import PostForm from '../components/PostForm'
import { PostsApi } from '../api/client'

export default function PostCreate() {
  const navigate = useNavigate()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">New Post</h1>
      <PostForm
        submitLabel="Create"
        onSubmit={async (data) => {
          await PostsApi.create(data)
          navigate('/')
        }}
      />
    </div>
  )
}
