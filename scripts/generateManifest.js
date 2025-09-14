// scripts/generateManifest.js
const fs = require("fs");
const path = require("path");

const articlesDir = path.join(__dirname, "../public/articles");
const manifestPath = path.join(articlesDir, "manifest.json");

function generateManifest() {
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  const manifest = files.map((f) => {
    const name = f.replace(".md", "");
    // optional: read first line of markdown as title
    const filePath = path.join(articlesDir, f);
    const content = fs.readFileSync(filePath, "utf-8");
    const titleMatch = content.match(/^title:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1] : name.replace(/-/g, " ");
    return { name, title };
  });

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("✅ manifest.json generated:", manifestPath);
}

generateManifest();
