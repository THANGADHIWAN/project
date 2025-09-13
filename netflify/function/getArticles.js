import fs from "fs";
import path from "path";

export async function handler() {
  try {
    const articlesDir = path.join(process.cwd(), "public/articles");
    const files = fs.readdirSync(articlesDir);

    const articles = files
      .filter((f) => f.endsWith(".md"))
      .map((f) => ({
        name: f.replace(".md", ""),
        title: f.replace(".md", "").replace(/-/g, " ")
      }));

    return {
      statusCode: 200,
      body: JSON.stringify(articles)
    };
  } catch (err) {
    return { statusCode: 500, body: "Error reading articles" };
  }
}
