import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const context = require.context("../content", false, /\.md$/);
      const files = context.keys();
      const loaded = await Promise.all(
        files.map(async (file) => {
          const response = await fetch(file.replace("../", "/"));
          const text = await response.text();
          return {
            slug: file.replace("./", "").replace(".md", ""),
            body: text,
          };
        })
      );
      setPosts(loaded);
    }
    loadPosts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      {posts.map((post) => (
        <div key={post.slug} className="mb-8 pb-4 border-b">
          <h2 className="text-xl font-semibold mb-2">{post.slug}</h2>
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}
