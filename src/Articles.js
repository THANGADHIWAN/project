import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("/articles/manifest.json")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch(() => setArticles([]));
  }, []);

  if (!articles.length) return <p>No articles yet.</p>;

  return (
    <div>
      <h2>Articles</h2>
      <ul>
        {articles.map((a) => (
          <li key={a.name}>
            <Link to={`/articles/${a.name}`}>{a.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
