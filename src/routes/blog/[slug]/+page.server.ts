import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Tipo para os metadados do post
interface PostMetadata {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

// Gera as rotas estáticas na compilação (SSG)
export async function entries() {
  try {
    const postsJsonPath = path.resolve('static/posts.json');
    if (fs.existsSync(postsJsonPath)) {
      const postsData: PostMetadata[] = JSON.parse(fs.readFileSync(postsJsonPath, 'utf-8'));
      return postsData.map(post => ({ slug: post.id }));
    }
  } catch (error) {
    console.error('Erro ao gerar entries para posts do blog:', error);
  }
  return [];
}

export async function load({ params }) {
  const { slug } = params;
  
  let content = '';
  let lang = 'en';
  
  const ptPath = path.resolve(`static/posts/${slug}.pt.md`);
  const enPath = path.resolve(`static/posts/${slug}.en.md`);
  const defaultPath = path.resolve(`static/posts/${slug}.md`);
  
  if (fs.existsSync(ptPath)) {
    content = fs.readFileSync(ptPath, 'utf-8');
    lang = 'pt';
  } else if (fs.existsSync(enPath)) {
    content = fs.readFileSync(enPath, 'utf-8');
    lang = 'en';
  } else if (fs.existsSync(defaultPath)) {
    content = fs.readFileSync(defaultPath, 'utf-8');
    lang = 'en';
  } else {
    throw new Error(`Post not found: ${slug}`);
  }
  
  // Converter markdown para HTML no servidor
  // Como são arquivos locais confiáveis e estáticos, a conversão direta é segura e muito rápida
  const parsedHtml = await marked(content);
  
  // Buscar metadados adicionais
  let metadata: PostMetadata = {
    id: slug,
    title: slug.replace(/-/g, ' '),
    excerpt: '',
    date: '',
    readTime: '10 min',
    tags: []
  };
  
  try {
    const postsJsonPath = path.resolve('static/posts.json');
    if (fs.existsSync(postsJsonPath)) {
      const postsData: PostMetadata[] = JSON.parse(fs.readFileSync(postsJsonPath, 'utf-8'));
      const found = postsData.find(p => p.id === slug);
      if (found) {
        metadata = found;
      }
    }
  } catch (error) {
    console.error(`Erro ao carregar metadados do post ${slug}:`, error);
  }
  
  return {
    slug,
    metadata,
    html: parsedHtml,
    lang
  };
}
