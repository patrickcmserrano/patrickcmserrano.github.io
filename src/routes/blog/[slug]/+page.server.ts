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

export interface ArticleSection {
  id: string;
  title: string;
  isIntro: boolean;
  headingHtml: string;
  bodyHtml: string;
}

export interface SectionAudioEntry {
  sectionId: string;
  title: string;
  file: string;
  url: string;
  duration: number;
  mimeType: string;
  recordedAt: string;
}

export interface PostAudioManifest {
  slug: string;
  updatedAt?: string;
  sections: Record<string, SectionAudioEntry>;
}

function slugifyHeading(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'secao';
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function splitHtmlIntoSections(html: string): ArticleSection[] {
  const h2Regex = /<h2(?:\s+[^>]*)?>([\s\S]*?)<\/h2>/gi;
  const matches = [...html.matchAll(h2Regex)];

  if (matches.length === 0) {
    return [
      {
        id: 'intro',
        title: 'Artigo Completo',
        isIntro: true,
        headingHtml: '',
        bodyHtml: html
      }
    ];
  }

  const sections: ArticleSection[] = [];
  const usedIds = new Set<string>();

  const firstIndex = matches[0].index ?? 0;
  const introBody = html.slice(0, firstIndex).trim();
  if (introBody.replace(/<hr\s*\/?>/gi, '').trim().length > 0) {
    sections.push({
      id: 'intro',
      title: 'Introdução',
      isIntro: true,
      headingHtml: '',
      bodyHtml: introBody
    });
    usedIds.add('intro');
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const headingFullHtml = match[0];
    const headingInnerHtml = match[1];
    const cleanTitle = stripHtmlTags(headingInnerHtml) || `Seção ${i + 1}`;

    let baseId = `sec-${slugifyHeading(cleanTitle)}`;
    let uniqueId = baseId;
    let counter = 2;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }
    usedIds.add(uniqueId);

    const bodyStart = (match.index ?? 0) + headingFullHtml.length;
    const bodyEnd = i + 1 < matches.length ? (matches[i + 1].index ?? html.length) : html.length;
    const bodyHtml = html.slice(bodyStart, bodyEnd).trim();

    sections.push({
      id: uniqueId,
      title: cleanTitle,
      isIntro: false,
      headingHtml: headingFullHtml,
      bodyHtml
    });
  }

  return sections;
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
  
  // Remover o título H1 inicial do markdown (evita duplicação com o <h1> do cabeçalho da página)
  const contentWithoutLeadingH1 = content.replace(/^\s*#\s+[^\r\n]+[\r\n]*/, '');

  // Converter markdown para HTML no servidor
  // Como são arquivos locais confiáveis e estáticos, a conversão direta é segura e muito rápida
  const parsedHtml = await marked(contentWithoutLeadingH1);
  const sections = splitHtmlIntoSections(parsedHtml);

  // Carregar manifesto de áudios gravados (se existir)
  let audioManifest: PostAudioManifest = {
    slug,
    sections: {}
  };
  try {
    const manifestPath = path.resolve(`static/audio/posts/${slug}/manifest.json`);
    if (fs.existsSync(manifestPath)) {
      audioManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      if (!audioManifest.sections) {
        audioManifest.sections = {};
      }
    }
  } catch (error) {
    console.error(`Erro ao carregar manifesto de áudio para ${slug}:`, error);
  }
  
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
    sections,
    audioManifest,
    lang
  };
}
