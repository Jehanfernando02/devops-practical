import { BrowserRouter, Link, Route, Routes } from 'react-router'
import PostsList from './pages/PostsList'
import PostCreate from './pages/PostCreate'
import PostEdit from './pages/PostEdit'

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <Link to="/" className="text-lg font-bold">DevOps Test App</Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<PostsList />} />
            <Route path="/posts/new" element={<PostCreate />} />
            <Route path="/posts/:id/edit" element={<PostEdit />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
