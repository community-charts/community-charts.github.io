const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOG_DIR = path.join(__dirname, '../blog');
const OUT_PATH = path.join(__dirname, '../src/data/latestBlogPosts.json');

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

const posts = files.map(filename => {
  const filePath = path.join(BLOG_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  // Derive permalink from filename (Docusaurus default)
  const slug = data.slug || filename.replace(/\.mdx?$/, '');
  return {
    id: slug,
    title: data.title || slug,
    date: data.date || filename.slice(0, 10),
    description: data.description || '',
    permalink: `/blog/${slug}`,
  };
});

posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(posts, null, 2));

console.log(`Wrote ${posts.length} blog posts to ${OUT_PATH}`);
