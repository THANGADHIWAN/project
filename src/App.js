import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Articles from "./Articles";
import Article from "./Article";

export default function App() {
  return (
    <Router>
      <nav className="p-4 space-x-4 border-b bg-gray-100">
        <Link to="/">Home</Link>
        <Link to="/articles">Articles</Link>
        <a href="/admin" target="_blank" rel="noreferrer">Admin</a>
      </nav>

      <div className="p-4">
        <Routes>
          <Route path="/" element={<h1>Welcome to My Blog</h1>} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<Article />} />
        </Routes>
      </div>
    </Router>
  );
}
