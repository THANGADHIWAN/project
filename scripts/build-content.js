// Converts content/posts/*.md into public/content/*.json
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');
const { remark } = require('remark');
const html = require('remark-html');

const SRC = path.join(__dirname, '..', 'content', 'posts');
const OUT = path.join(__dirname, '..', 'public', 'content');
fs.ensureDirSync(OUT);

const mdFiles = glob.sync(`${SRC}/**/*.md`);

const postsMeta = [];

(async () => {
  for (const file of mdFiles) {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = matter(raw);
    const slug = path.basename(file, path.extname(file));
    const processed = await remark().use(html).process(parsed.content || '');
    const bodyHtml = String(processed);

    const out = {
      slug,
      ...parsed.data,
      body: bodyHtml
    };

    fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(out, null, 2));

    postsMeta.push({ slug, title: parsed.data.title || slug, date: parsed.data.date || null, excerpt: parsed.data.excerpt || '' });
  }

  postsMeta.sort((a,b)=> new Date(b.date || 0) - new Date(a.date || 0));
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(postsMeta, null, 2));
  console.log(`Built ${postsMeta.length} posts`);
})();
