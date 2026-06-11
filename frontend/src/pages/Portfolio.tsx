import { useState } from 'react'

type Project = {
  title: string
  subtitle: string
  description: string
  tech: string[]
  icon: string
  color: string
  highlight: string
  deployedUrl?: string
  category: string
  featured?: boolean
}

const projects: Project[] = [
  {
    title: 'Real-Time Event Ticketing System',
    subtitle: 'Concurrent Web Application',
    description:
      'A multi-threaded ticketing engine where vendors release and customers purchase tickets across concurrent threads, with every transaction streamed live to a React dashboard via WebSocket. Features a thread-safe ticket pool, color-coded activity feed, and real-time metrics.',
    tech: ['React', 'Spring Boot', 'Java', 'WebSockets', 'REST API', 'Multi-threading', 'OOP'],
    icon: '🎟️',
    color: '#3b82f6',
    highlight: 'rgba(59,130,246,0.15)',
    category: 'Backend · Real-time',
    featured: true,
  },
  {
    title: 'MediQueue',
    subtitle: 'Clinical Appointment & Patient Flow Management System',
    description:
      'A full-stack healthcare system streamlining clinic operations with slot-conflict-aware appointment booking, real-time queue tracking, a doctor dashboard for consultation notes, an admin panel for managing doctors and departments, a notification and reminder system, and full audit logging with role-based access for admins, doctors, and patients.',
    tech: ['FastAPI', 'PostgreSQL', 'Redis', 'React', 'Redux Toolkit', 'Axios', 'SQLAlchemy', 'Alembic', 'JWT'],
    icon: '🏥',
    color: '#10b981',
    highlight: 'rgba(16,185,129,0.15)',
    category: 'Full Stack · Healthcare',
    featured: true,
  },
  {
    title: 'WeNeighbour',
    subtitle: 'Smart Living Android App for Apartment Communities',
    description:
      'A community management Android app (available on Play Store) for apartment complexes with real-time safety alerts, QR-based visitor management, event scheduling, community forums, and a verified services directory.',
    tech: ['Flutter', 'Node.js', 'MongoDB', 'AWS', 'Firebase', 'Google Calendar API'],
    icon: '🏘️',
    color: '#8b5cf6',
    highlight: 'rgba(139,92,246,0.15)',
    category: 'Mobile · AWS · Cloud',
    featured: true,
  },
  {
    title: 'ForgeAI',
    subtitle: 'AI-Powered Multi-Agent Personal Coaching Platform',
    description:
      'AI-powered multi-agent platform where six specialized agents collaborate in real time using intelligent routing, tool calling, RAG-based memory, SQLite persistence, MCP architecture, and workflow orchestration. Currently ongoing.',
    tech: ['React', 'Vite', 'Python', 'Flask', 'LangChain', 'LangGraph', 'Gemini 2.5 Flash', 'ChromaDB', 'SQLAlchemy', 'MCP Protocol'],
    icon: '🤖',
    color: '#f59e0b',
    highlight: 'rgba(245,158,11,0.15)',
    category: 'AI · Multi-Agent · RAG',
    featured: true,
  },
  {
    title: 'Imperial Fit',
    subtitle: 'Innovative E-Commerce & Fitness Lifestyle Solution',
    description:
      'A modern full-stack fitness platform with personalized workout plans, progress tracking, a gym product store with Stripe payments, secure authentication via Clerk, and a motivational community feed wrapped in a responsive mobile-friendly UI.',
    tech: ['ReactJS', 'Vite', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Clerk', 'Stripe', 'RESTful API'],
    icon: '💪',
    color: '#ef4444',
    highlight: 'rgba(239,68,68,0.15)',
    deployedUrl: '#',
    category: 'Full Stack · E-Commerce',
    featured: true,
  },
  {
    title: 'DevOps Practical App',
    subtitle: 'This Application — Full-Stack CRUD + CI/CD',
    description:
      'The very app you\'re looking at. A containerised Laravel + React application deployed with Docker Compose and Jenkins CI/CD pipelines, served through Nginx, backed by MySQL, with automated PHP feature tests baked into the pipeline.',
    tech: ['Laravel 11', 'React 19', 'TypeScript', 'Docker', 'Jenkins', 'Nginx', 'MySQL', 'PHP 8.4'],
    icon: '⚙️',
    color: '#00d4ff',
    highlight: 'rgba(0,212,255,0.15)',
    category: 'DevOps · CI/CD · Docker',
    featured: true,
  },
]

const skillCategories = [
  {
    category: 'DevOps & Cloud',
    icon: '☁️',
    color: '#00d4ff',
    skills: ['Docker', 'Docker Compose', 'Jenkins', 'CI/CD Pipelines', 'Nginx', 'AWS', 'Firebase', 'Git'],
  },
  {
    category: 'Backend',
    icon: '⚡',
    color: '#10b981',
    skills: ['Laravel 11', 'Spring Boot', 'FastAPI', 'Node.js', 'Express.js', 'Flask', 'REST APIs', 'WebSockets'],
  },
  {
    category: 'Frontend',
    icon: '🎨',
    color: '#8b5cf6',
    skills: ['React 19', 'TypeScript', 'Vite', 'Redux Toolkit', 'Tailwind CSS', 'Flutter', 'React Router'],
  },
  {
    category: 'Data & AI',
    icon: '🤖',
    color: '#f59e0b',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'ChromaDB', 'LangChain', 'LangGraph', 'SQLAlchemy'],
  },
]

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '70px 24px 50px',
        background: 'linear-gradient(180deg, rgba(139,92,246,0.06) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(148,163,184,0.06)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="status-badge status-running" style={{ display: 'inline-flex', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }}></span>
            5+ Projects · Full Stack · DevOps · AI
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            <span className="gradient-text">Software</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>Projects</span>
          </h1>
          <p style={{
            color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.8, maxWidth: 600, margin: '0 auto 40px',
          }}>
            A portfolio spanning full-stack systems, real-time applications, cloud-native mobile apps,
            and AI multi-agent platforms — each built end-to-end with production-grade thinking.
          </p>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['All', 'DevOps · CI/CD · Docker', 'AI · Multi-Agent · RAG', 'Full Stack · Healthcare', 'Backend · Real-time'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 100,
                  border: activeFilter === f ? '1px solid var(--accent-cyan)' : '1px solid rgba(148,163,184,0.15)',
                  background: activeFilter === f ? 'rgba(0,212,255,0.12)' : 'transparent',
                  color: activeFilter === f ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section style={{ padding: '50px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
            gap: 24,
          }}>
            {filtered.map((project, idx) => (
              <article
                key={project.title}
                className="glass-card animate-slide-in"
                style={{
                  padding: 28,
                  animationDelay: `${idx * 0.07}s`,
                  opacity: 0,
                  animationFillMode: 'forwards',
                  borderColor: `rgba(${project.color === '#00d4ff' ? '0,212,255' : project.color === '#3b82f6' ? '59,130,246' : project.color === '#10b981' ? '16,185,129' : project.color === '#8b5cf6' ? '139,92,246' : project.color === '#f59e0b' ? '245,158,11' : '239,68,68'},0.2)`,
                }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: project.highlight,
                      border: `1px solid ${project.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 26, flexShrink: 0,
                    }}>
                      {project.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: 10, color: project.color, fontFamily: 'JetBrains Mono, monospace',
                        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4,
                      }}>
                        {project.category}
                      </div>
                    </div>
                  </div>
                  {project.deployedUrl && (
                    <a
                      href={project.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px',
                        background: 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.3)',
                        borderRadius: 100, fontSize: 11, color: 'var(--accent-green)',
                        textDecoration: 'none', fontWeight: 600, flexShrink: 0,
                      }}
                    >
                      🔗 Live
                    </a>
                  )}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: 18, fontWeight: 800, color: 'var(--text-primary)',
                  marginBottom: 6, lineHeight: 1.3,
                }}>
                  {project.title}
                </h3>
                <p style={{
                  fontSize: 12, color: project.color,
                  fontStyle: 'italic', marginBottom: 14,
                }}>
                  {project.subtitle}
                </p>

                {/* Description */}
                <p style={{
                  color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75,
                  marginBottom: 20,
                }}>
                  {project.description}
                </p>

                {/* Tech pills */}
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 6,
                  paddingTop: 16, borderTop: '1px solid var(--border-subtle)',
                }}>
                  {project.tech.map(t => (
                    <span key={t} className="tech-pill" style={{ borderColor: `${project.color}30`, color: project.color }}>
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Skills section */}
      <section style={{ padding: '20px 24px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="divider" style={{ marginBottom: 60 }} />

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800 }}>
              <span className="gradient-text">Technical</span> Skills
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>
              Technologies used across all projects
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {skillCategories.map(cat => (
              <div key={cat.category} className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 22 }}>{cat.icon}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: cat.color }}>{cat.category}</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {cat.skills.map(skill => (
                    <span key={skill} style={{
                      padding: '5px 12px',
                      background: `${cat.color}12`,
                      border: `1px solid ${cat.color}25`,
                      borderRadius: 8,
                      fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          article { min-width: unset !important; }
        }
      `}</style>
    </div>
  )
}
