import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PostsList(){
  const [posts, setPosts] = useState([]);
  useEffect(()=>{
    fetch('/content/index.json')
      .then(r => r.ok ? r.json() : [])
      .then(setPosts)
      .catch(()=>setPosts([]));
  },[]);

  return (
    <div>
      <h2>All Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      <ul>
        {posts.map(p=> (
          <li key={p.slug}>
            <Link to={`/post/${p.slug}`}>{p.title}</Link>
            {p.date && <small> — {new Date(p.date).toLocaleDateString()}</small>}
            <p>{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
