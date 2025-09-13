import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function Article() {
  const { slug } = useParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/articles/${slug}.md`)
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch(() => setContent("# Article not found"));
  }, [slug]);

  return <ReactMarkdown>{content}</ReactMarkdown>;
}
