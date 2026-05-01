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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {errors.title?.map((m) => (
          <p key={m} className="text-red-600 text-sm mt-1">{m}</p>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full border rounded px-3 py-2"
        />
        {errors.body?.map((m) => (
          <p key={m} className="text-red-600 text-sm mt-1">{m}</p>
        ))}
      </div>
      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded"
      >
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
