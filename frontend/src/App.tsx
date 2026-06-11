import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router'
import PostsList from './pages/PostsList'
import PostCreate from './pages/PostCreate'
import PostEdit from './pages/PostEdit'
import Pipeline from './pages/Pipeline'
import { useState, useEffect } from 'react'

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // close mobile nav on route change (kept for future mobile menu)
  void location

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(5, 10, 20, 0.95)' : 'rgba(5, 10, 20, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(0,212,255,0.15)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, #00d4ff, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800,
            }}>⚙</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#f0f6ff', lineHeight: 1.1 }}>DevOps Practical</div>
              <div style={{ fontSize: 10, color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>FULL STACK · CI/CD · DOCKER</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>⚡</span> Dashboard
            </NavLink>
            <NavLink to="/pipeline" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>🔄</span> CI/CD Pipeline
            </NavLink>
          </nav>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="status-badge status-success" style={{ display: 'flex' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              Live
            </div>
            <Link to="/posts/new" className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
              <span>+ New Post</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="grid-bg">
        <NavBar />
        <main style={{ paddingTop: 64 }}>
          <Routes>
            <Route path="/" element={<PostsList />} />
            <Route path="/posts/new" element={<PostCreate />} />
            <Route path="/posts/:id/edit" element={<PostEdit />} />
            <Route path="/pipeline" element={<Pipeline />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(148,163,184,0.08)',
          padding: '32px 24px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
              {['Docker', 'Laravel', 'React', 'TypeScript', 'Jenkins', 'Nginx', 'MySQL'].map(tech => (
                <span key={tech} className="tech-pill">{tech}</span>
              ))}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              Built with passion · Laravel 11 + React 19 + TypeScript · Deployed via Docker Compose + Jenkins CI/CD
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
