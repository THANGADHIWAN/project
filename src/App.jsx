import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import PostsList from './pages/PostsList'
import PostPage from './pages/PostPage'

export default function App(){
  return (
    <div className="container">
      <header>
        <h1><Link to="/">My Blog</Link></h1>
        <nav><Link to="/">All posts</Link> | <a href="/admin">Admin</a></nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<PostsList/>} />
          <Route path="/post/:slug" element={<PostPage/>} />
        </Routes>
      </main>

      <footer>
        <small>Built with Vite + Decap CMS</small>
      </footer>
    </div>
  )
}
