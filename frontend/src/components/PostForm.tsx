import { useState, type FormEvent } from 'react'
import type { PostInput } from '../api/client'

type Errors = Partial<Record<keyof PostInput, string[]>>

type Props = {
  initial?: PostInput
  submitLabel: string
  onSubmit: (data: PostInput) => Promise<void>
}

export default function PostForm({ initial, submitLabel, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await onSubmit({ title, body })
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { errors?: Errors } } }
      if (e.response?.status === 422 && e.response.data?.errors) {
        setErrors(e.response.data.errors)
      } else {
        alert('Something went wrong')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Title field */}
      <div>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
          marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <span style={{ color: 'var(--accent-cyan)' }}>▸</span> TITLE
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title..."
          className="input-field"
          style={{ fontSize: 15 }}
          disabled={saving}
        />
        {errors.title?.map((m) => (
          <p key={m} style={{
            color: '#ef4444', fontSize: 12, marginTop: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>⚠</span> {m}
          </p>
        ))}
      </div>

      {/* Body field */}
      <div>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
          marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <span style={{ color: 'var(--accent-cyan)' }}>▸</span> BODY
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          placeholder="Write your post content here..."
          className="input-field"
          style={{ resize: 'vertical', fontSize: 15, lineHeight: 1.7 }}
          disabled={saving}
        />
        {errors.body?.map((m) => (
          <p key={m} style={{
            color: '#ef4444', fontSize: 12, marginTop: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span>⚠</span> {m}
          </p>
        ))}
      </div>

      {/* Payload preview */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(0,212,255,0.15)',
        borderRadius: 10, padding: 16,
      }}>
        <div style={{
          fontSize: 11, color: 'var(--accent-cyan)', marginBottom: 8,
          fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          POST /api/posts — Request Preview
        </div>
        <pre style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12, color: '#94a3b8', lineHeight: 1.8, overflow: 'auto',
        }}>
          {JSON.stringify({ title: title || '...', body: body || '...' }, null, 2)}
        </pre>
      </div>

      {/* Submit button */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
            {saving ? (
              <>
                <span style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  display: 'inline-block',
                  animation: 'spin-slow 0.8s linear infinite',
                }} />
                Saving...
              </>
            ) : (
              <>{submitLabel}</>
            )}
          </span>
        </button>
        {saving && (
          <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
            Sending to API...
          </span>
        )}
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  )
}
