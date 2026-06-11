import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import PostForm from '../components/PostForm'
import { PostsApi, type Post } from '../api/client'

export default function PostEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    PostsApi.get(id).then(setPost).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, flexDirection: 'column', gap: 16 }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid rgba(0,212,255,0.2)',
        borderTopColor: 'var(--accent-cyan)',
        animation: 'spin-slow 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>
        GET /api/posts/{id}
      </p>
      <style>{`@keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )

  if (!post) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
      <p style={{ color: 'var(--text-secondary)' }}>Post not found</p>
      <Link to="/" className="btn-ghost" style={{ marginTop: 20, display: 'inline-flex' }}>← Back</Link>
    </div>
  )

  return (
    <div style={{ padding: '60px 24px 80px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Dashboard</Link>
          <span>›</span>
          <span>Edit Post #{String(post.id).padStart(4, '0')}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>✏️</div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Edit Post</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
                PUT /api/posts/{post.id} · HTTP 200 OK
              </p>
            </div>
          </div>
        </div>

        {/* Existing data chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--text-secondary)',
        }}>
          <span style={{ color: '#8b5cf6' }}>●</span>
          Editing: <strong style={{ color: 'var(--text-primary)' }}>{post.title.substring(0, 40)}{post.title.length > 40 ? '...' : ''}</strong>
        </div>

        {/* Form card */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <PostForm
            submitLabel="💾 Save Changes"
            initial={{ title: post.title, body: post.body }}
            onSubmit={async (data) => {
              await PostsApi.update(post.id, data)
              navigate('/')
            }}
          />
        </div>
      </div>
    </div>
  )
}
