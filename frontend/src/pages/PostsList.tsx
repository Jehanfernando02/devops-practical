import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PostsApi, type Post } from '../api/client'

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      setPosts(await PostsApi.list())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return
    await PostsApi.remove(id)
    setPosts((p) => p.filter((x) => x.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link to="/posts/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          New Post
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-600">No posts yet.</p>
      ) : (
        <ul className="divide-y border rounded">
          {posts.map((post) => (
            <li key={post.id} className="p-4 flex justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="font-semibold">{post.title}</h2>
                <p className="text-gray-700 text-sm whitespace-pre-line">{post.body}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
