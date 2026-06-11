import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PostsApi, type Post } from '../api/client'

const HeroMetric = ({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) => (
  <div className="metric-card" style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
  </div>
)

const TerminalHeader = () => {
  const [line, setLine] = useState(0)
  const lines = [
    '$ docker compose up -d',
    '✔ Container devops-test-db     Started',
    '✔ Container devops-test-app    Started',
    '✔ Container devops-test-nginx  Started',
    '✔ Container devops-test-frontend Started',
    '$ curl http://localhost/api/posts',
    '→ HTTP 200 OK  [{"id":1,"title":"Hello World"...}]',
  ]

  useEffect(() => {
    if (line >= lines.length) return
    const t = setTimeout(() => setLine(l => l + 1), 600)
    return () => clearTimeout(t)
  }, [line])

  return (
    <div className="terminal" style={{ width: '100%', maxWidth: 560 }}>
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: '#ef4444' }} />
        <div className="terminal-dot" style={{ background: '#f59e0b' }} />
        <div className="terminal-dot" style={{ background: '#10b981' }} />
        <span style={{ color: '#475569', fontSize: 12, marginLeft: 8, fontFamily: 'JetBrains Mono, monospace' }}>
          zsh — devops-practical
        </span>
      </div>
      <div className="terminal-body" style={{ padding: '16px 20px', minHeight: 160, background: '#060d1a' }}>
        {lines.slice(0, line).map((l, i) => (
          <div key={i} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 2,
            color: l.startsWith('$') ? '#00d4ff' : l.startsWith('✔') ? '#10b981' : l.startsWith('→') ? '#f59e0b' : '#94a3b8',
          }}>
            {l}
          </div>
        ))}
        {line < lines.length && (
          <span className="animate-blink" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00d4ff', fontSize: 12 }}>▊</span>
        )}
      </div>
    </div>
  )
}

const PipelineMini = () => {
  const stages = [
    { label: 'Checkout', icon: '📥', status: 'done' },
    { label: 'Test', icon: '🧪', status: 'done' },
    { label: 'Build', icon: '🔨', status: 'done' },
    { label: 'Deploy', icon: '🚀', status: 'done' },
    { label: 'Cleanup', icon: '🧹', status: 'done' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '20px 0' }}>
      {stages.map((stage, i) => (
        <div key={stage.label} style={{ display: 'flex', alignItems: 'center', flex: i < stages.length - 1 ? 1 : 'unset' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>{stage.icon}</div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace' }}>{stage.label}</span>
          </div>
          {i < stages.length - 1 && (
            <div className="pipeline-connector" style={{ height: 2, flex: 1, margin: '0 4px', marginBottom: 20 }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setPosts(await PostsApi.list())
    } catch {
      setError('Unable to reach the API. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return
    setDeleting(id)
    try {
      await PostsApi.remove(id)
      setPosts(p => p.filter(x => x.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.body.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '60px 24px 40px',
        background: 'linear-gradient(180deg, rgba(0,212,255,0.04) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(148,163,184,0.06)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60,
            alignItems: 'center',
          }} className="hero-grid">

            {/* Left: Heading */}
            <div className="animate-slide-in">
              <div className="status-badge status-success" style={{ marginBottom: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                API Connected · Laravel 11
              </div>
              <h1 style={{
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 16,
              }}>
                <span className="gradient-text">DevOps</span>
                <br />
                <span style={{ color: 'var(--text-primary)' }}>Practical App</span>
              </h1>
              <p style={{
                color: 'var(--text-secondary)', fontSize: 16, maxWidth: 480, lineHeight: 1.8,
                marginBottom: 28,
              }}>
                A full-stack CRUD application containerised with <strong style={{ color: 'var(--accent-cyan)' }}>Docker Compose</strong>,
                deployed via <strong style={{ color: 'var(--accent-blue)' }}>Jenkins CI/CD</strong>,
                and served through an <strong style={{ color: 'var(--accent-purple)' }}>Nginx</strong> reverse proxy.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/posts/new" className="btn-primary">
                  <span>+ Create Post</span>
                </Link>
                <Link to="/pipeline" className="btn-ghost">
                  <span>🔄 View Pipeline</span>
                </Link>
              </div>

              <PipelineMini />
            </div>

            {/* Right: Terminal */}
            <div className="animate-slide-in delay-200" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TerminalHeader />
            </div>
          </div>

          {/* Metrics row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            marginTop: 40,
          }} className="metrics-grid">
            <HeroMetric icon="📝" label="Total Posts" value={loading ? '...' : posts.length} color="var(--accent-cyan)" />
            <HeroMetric icon="🐳" label="Containers" value="4" color="var(--accent-blue)" />
            <HeroMetric icon="✅" label="Tests Passing" value="7" color="var(--accent-green)" />
            <HeroMetric icon="⚡" label="Build Time" value="~45s" color="var(--accent-purple)" />
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
                📝 Posts API — Live Data
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                GET /api/posts · MySQL 8.0 · Laravel Eloquent ORM
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍  Search posts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ width: 240, padding: '9px 14px', fontSize: 13 }}
              />
              <button onClick={load} className="btn-ghost" style={{ padding: '9px 16px', fontSize: 13 }}>
                ↺ Refresh
              </button>
              <Link to="/posts/new" className="btn-primary" style={{ padding: '9px 18px', fontSize: 13 }}>
                <span>+ New Post</span>
              </Link>
            </div>
          </div>

          {/* States */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                border: '3px solid rgba(0,212,255,0.2)',
                borderTopColor: 'var(--accent-cyan)',
                animation: 'spin-slow 0.8s linear infinite',
              }} />
              <span style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>
                Fetching from API...
              </span>
            </div>
          )}

          {error && !loading && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 12, padding: 24, textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
              <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>{error}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
                $ docker compose ps
              </p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              border: '1px dashed rgba(148,163,184,0.15)',
              borderRadius: 16,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 8 }}>
                {searchTerm ? 'No posts match your search' : 'No posts yet'}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
                POST /api/posts to create one
              </p>
              {!searchTerm && (
                <Link to="/posts/new" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
                  <span>Create First Post</span>
                </Link>
              )}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: 20,
            }}>
              {filtered.map((post, idx) => (
                <article
                  key={post.id}
                  className="glass-card animate-slide-in"
                  style={{
                    padding: 24,
                    animationDelay: `${idx * 0.05}s`,
                    animationFillMode: 'forwards',
                    opacity: deleting === post.id ? 0.5 : 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {/* Card top bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      background: 'rgba(148,163,184,0.08)',
                      padding: '4px 10px',
                      borderRadius: 6,
                    }}>
                      ID: #{String(post.id).padStart(4, '0')}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(post.created_at)}</div>
                  </div>

                  {/* Content */}
                  <h3 style={{
                    fontSize: 17, fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 10,
                    lineHeight: 1.4,
                  }}>
                    {post.title}
                  </h3>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: 14,
                    lineHeight: 1.7,
                    marginBottom: 20,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {post.body}
                  </p>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="btn-ghost"
                      style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: 13 }}
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      className="btn-danger"
                      style={{ flex: 1, justifyContent: 'center', padding: '8px' }}
                    >
                      {deleting === post.id ? '⏳' : '🗑️'} Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { display: none !important; }
          .metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
