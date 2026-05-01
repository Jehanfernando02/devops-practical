import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
})

export type Post = {
  id: number
  title: string
  body: string
  created_at: string
  updated_at: string
}

export type PostInput = {
  title: string
  body: string
}

export const PostsApi = {
  list: () => api.get<Post[]>('/posts').then((r) => r.data),
  get: (id: number | string) => api.get<Post>(`/posts/${id}`).then((r) => r.data),
  create: (data: PostInput) => api.post<Post>('/posts', data).then((r) => r.data),
  update: (id: number | string, data: Partial<PostInput>) =>
    api.put<Post>(`/posts/${id}`, data).then((r) => r.data),
  remove: (id: number | string) => api.delete(`/posts/${id}`).then((r) => r.data),
}
