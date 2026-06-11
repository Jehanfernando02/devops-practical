import { useNavigate, Link } from 'react-router'
import PostForm from '../components/PostForm'
import { PostsApi } from '../api/client'

export default function PostCreate() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '60px 24px 80px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Dashboard</Link>
          <span>›</span>
          <span>Create Post</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>✍️</div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Create New Post</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
                POST /api/posts · HTTP 201 Created
              </p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <PostForm
            submitLabel="🚀 Create Post"
            onSubmit={async (data) => {
              await PostsApi.create(data)
              navigate('/')
            }}
          />
        </div>
      </div>
    </div>
  )
}
