import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function PostPage(){
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(()=>{
    fetch(`/content/${slug}.json`)
      .then(r => r.ok ? r.json() : null)
      .then(setPost)
      .catch(()=>setPost(null));
  },[slug]);

  if(!post) return <p>Loading or post not found.</p>;

  return (
    <article>
      <h2>{post.title}</h2>
      {post.date && <time>{new Date(post.date).toLocaleDateString()}</time>}
      {post.cover && <img src={post.cover} alt="cover" style={{maxWidth:'100%'}}/>}
      <div dangerouslySetInnerHTML={{__html: post.body}} />
    </article>
  );
}
