import { useState, useEffect } from 'react'

type Stage = {
  name: string
  icon: string
  duration: string
  status: 'success' | 'running' | 'queued'
  commands: string[]
  description: string
}

const pipelineStages: Stage[] = [
  {
    name: 'Checkout',
    icon: '📥',
    duration: '3s',
    status: 'success',
    commands: ['git fetch origin master', 'git reset --hard origin/master'],
    description: 'Pulls latest code from GitHub master branch using stored credentials.',
  },
  {
    name: 'Backend Tests',
    icon: '🧪',
    duration: '28s',
    status: 'success',
    commands: [
      'docker build -t devopspractical-test -f Dockerfile .',
      'docker run --rm -e APP_ENV=testing -e DB_CONNECTION=sqlite ...',
      'composer install --no-interaction --prefer-dist',
      'php artisan test',
    ],
    description: 'Builds an isolated test container, installs dependencies, and runs 7 PHPUnit feature tests against an in-memory SQLite database.',
  },
  {
    name: 'Deploy',
    icon: '🚀',
    duration: '45s',
    status: 'success',
    commands: [
      'docker compose build app frontend',
      'docker compose up -d --remove-orphans',
      'php artisan migrate --force',
      'php artisan config:cache',
      'php artisan route:cache',
      'docker compose restart nginx frontend',
    ],
    description: 'Builds production Docker images, brings up all 4 containers, runs DB migrations, and caches Laravel configs.',
  },
  {
    name: 'Cleanup',
    icon: '🧹',
    duration: '5s',
    status: 'success',
    commands: ['docker image prune -f'],
    description: 'Removes dangling Docker images to reclaim disk space on the build server.',
  },
]

const dockerServices = [
  { name: 'devops-test-app', image: 'php:8.4-fpm', port: '—', icon: '🐘', color: '#8b5cf6', status: 'healthy' },
  { name: 'devops-test-nginx', image: 'nginx:alpine', port: ':80', icon: '🌐', color: '#3b82f6', status: 'healthy' },
  { name: 'devops-test-frontend', image: 'node:alpine', port: ':3000', icon: '⚛️', color: '#00d4ff', status: 'healthy' },
  { name: 'devops-test-db', image: 'mysql:8.0', port: '—', icon: '🗄️', color: '#10b981', status: 'healthy' },
]

const TerminalLog = ({ lines, color = '#00d4ff' }: { lines: string[], color?: string }) => (
  <div style={{
    background: '#020811',
    border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: 10, overflow: 'hidden',
  }}>
    <div style={{
      background: '#040d1a', padding: '8px 14px',
      borderBottom: '1px solid rgba(0,212,255,0.1)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
      <span style={{ fontSize: 11, color: '#475569', marginLeft: 6, fontFamily: 'JetBrains Mono, monospace' }}>
        jenkins — pipeline output
      </span>
    </div>
    <div style={{ padding: '14px 16px' }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12, lineHeight: 1.9,
          color: line.startsWith('$') ? color : line.startsWith('[') ? '#10b981' : '#64748b',
        }}>
          {line}
        </div>
      ))}
    </div>
  </div>
)

const InfraCard = ({ icon, title, items, color }: { icon: string, title: string, items: { label: string, value: string }[], color: string }) => (
  <div className="glass-card" style={{ padding: 22 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <h3 style={{ fontSize: 14, fontWeight: 700, color }}>{title}</h3>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(item => (
        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</span>
          <span style={{
            fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)',
            background: 'rgba(148,163,184,0.08)', padding: '2px 8px', borderRadius: 4,
          }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
)

export default function Pipeline() {
  const [selectedStage, setSelectedStage] = useState<Stage>(pipelineStages[0])
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const totalDuration = pipelineStages.reduce((sum, s) => sum + parseInt(s.duration), 0)

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '60px 24px 40px',
        background: 'linear-gradient(180deg, rgba(59,130,246,0.05) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(148,163,184,0.06)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, marginBottom: 40 }}>
            <div>
              <div className="status-badge status-success" style={{ marginBottom: 16 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                Last build: SUCCESS · #{Math.floor(Math.random() * 50) + 80}
              </div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 10 }}>
                <span className="gradient-text">CI/CD</span> Pipeline
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 500, lineHeight: 1.7 }}>
                Jenkins declarative pipeline running on Docker-in-Docker. Triggered on every push to <code style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>master</code>.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Build Duration', value: `~${totalDuration}s`, icon: '⏱️', color: 'var(--accent-cyan)' },
                { label: 'Test Coverage', value: '7 Tests', icon: '✅', color: 'var(--accent-green)' },
                { label: 'Stages', value: '4 Stages', icon: '🔄', color: 'var(--accent-blue)' },
              ].map(m => (
                <div key={m.label} className="metric-card" style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline flow */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(13,31,60,0.4)',
            border: '1px solid rgba(148,163,184,0.08)',
            borderRadius: 16, padding: '24px 32px',
            overflowX: 'auto',
          }}>
            {pipelineStages.map((stage, i) => (
              <div key={stage.name} style={{ display: 'flex', alignItems: 'center', flex: i < pipelineStages.length - 1 ? 1 : 'unset', minWidth: 0 }}>
                <button
                  onClick={() => setSelectedStage(stage)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: selectedStage.name === stage.name
                      ? 'rgba(16,185,129,0.25)'
                      : 'rgba(16,185,129,0.1)',
                    border: selectedStage.name === stage.name
                      ? '2px solid rgba(16,185,129,0.8)'
                      : '2px solid rgba(16,185,129,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                    transition: 'all 0.2s ease',
                    boxShadow: selectedStage.name === stage.name ? '0 0 20px rgba(16,185,129,0.4)' : 'none',
                  }}>
                    {stage.icon}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: 12, fontWeight: 700,
                      color: selectedStage.name === stage.name ? '#10b981' : 'var(--text-secondary)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      {stage.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{stage.duration}</div>
                  </div>
                </button>
                {i < pipelineStages.length - 1 && (
                  <div className="pipeline-connector" style={{ flex: 1, margin: '0 4px', marginBottom: 28 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stage detail + Docker services */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="pipeline-grid">

            {/* Stage detail */}
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>
                Stage Detail
              </h2>
              <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{selectedStage.icon}</span>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{selectedStage.name}</h3>
                    <div className="status-badge status-success" style={{ display: 'inline-flex', marginTop: 4, padding: '2px 10px', fontSize: 11 }}>
                      ✓ {selectedStage.status.toUpperCase()} · {selectedStage.duration}
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
                  {selectedStage.description}
                </p>
                <TerminalLog
                  lines={[
                    `[Pipeline] Stage: ${selectedStage.name}`,
                    ...selectedStage.commands.map(c => `$ ${c}`),
                    `[Pipeline] ✓ Stage complete in ${selectedStage.duration}`,
                  ]}
                />
              </div>
            </div>

            {/* Docker services */}
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>
                Docker Services
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {dockerServices.map(svc => (
                  <div key={svc.name} className="glass-card" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: `${svc.color}15`,
                        border: `1px solid ${svc.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, flexShrink: 0,
                      }}>
                        {svc.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                          color: svc.color, fontWeight: 600,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {svc.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                          {svc.image}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        {svc.port !== '—' && (
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                            color: 'var(--text-muted)', background: 'rgba(148,163,184,0.08)',
                            padding: '2px 8px', borderRadius: 4,
                          }}>
                            {svc.port}
                          </span>
                        )}
                        <div className="status-badge status-success" style={{ padding: '3px 10px', fontSize: 10 }}>
                          ● healthy
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Network diagram */}
              <div style={{ marginTop: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>
                  Network Topology
                </h2>
                <div className="glass-card" style={{ padding: 20 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 2.2, color: 'var(--text-secondary)' }}>
                    <div style={{ color: 'var(--accent-cyan)' }}>app-network (bridge)</div>
                    <div>├── <span style={{ color: '#3b82f6' }}>nginx</span> → :80 <span style={{ color: '#10b981' }}>← Internet</span></div>
                    <div>│   └── proxy_pass → <span style={{ color: '#8b5cf6' }}>app:9000</span></div>
                    <div>├── <span style={{ color: '#8b5cf6' }}>app</span> (PHP-FPM) → <span style={{ color: '#10b981' }}>db:3306</span></div>
                    <div>├── <span style={{ color: '#00d4ff' }}>frontend</span> (React SPA) → :80</div>
                    <div>└── <span style={{ color: '#10b981' }}>db</span> (MySQL 8.0) — healthcheck ✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jenkinsfile snippet */}
          <div style={{ marginTop: 40 }}>
            <div className="divider" style={{ marginBottom: 40 }} />
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
              <span className="gradient-text">Jenkinsfile</span> — Declarative Pipeline
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
              A Jenkins declarative pipeline that automates the entire test-build-deploy cycle. Click any stage above to inspect its commands.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <InfraCard
                icon="🔧"
                title="Tech Stack"
                color="var(--accent-cyan)"
                items={[
                  { label: 'Backend', value: 'Laravel 11 · PHP 8.4' },
                  { label: 'Frontend', value: 'React 19 · TypeScript' },
                  { label: 'Database', value: 'MySQL 8.0' },
                  { label: 'Web Server', value: 'Nginx Alpine' },
                ]}
              />
              <InfraCard
                icon="🐳"
                title="Docker Setup"
                color="var(--accent-blue)"
                items={[
                  { label: 'Containers', value: '4 services' },
                  { label: 'Network', value: 'app-network (bridge)' },
                  { label: 'Volumes', value: 'db-data, storage-data' },
                  { label: 'Base Image', value: 'php:8.4-fpm' },
                ]}
              />
              <InfraCard
                icon="⚙️"
                title="Jenkins CI/CD"
                color="var(--accent-purple)"
                items={[
                  { label: 'Pipeline', value: 'Declarative (Groovy)' },
                  { label: 'Trigger', value: 'Push to master' },
                  { label: 'Test DB', value: 'SQLite in-memory' },
                  { label: 'Deploy', value: 'Docker Compose' },
                ]}
              />
              <InfraCard
                icon="✅"
                title="Test Suite"
                color="var(--accent-green)"
                items={[
                  { label: 'Framework', value: 'PHPUnit (Laravel)' },
                  { label: 'Tests', value: '7 feature tests' },
                  { label: 'Coverage', value: 'Posts CRUD API' },
                  { label: 'Isolation', value: 'RefreshDatabase' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .pipeline-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
