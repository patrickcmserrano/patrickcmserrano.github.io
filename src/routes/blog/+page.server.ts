import fs from 'fs';
import path from 'path';

export async function load() {
  try {
    const postsJsonPath = path.resolve('static/posts.json');
    if (fs.existsSync(postsJsonPath)) {
      const postsData = JSON.parse(fs.readFileSync(postsJsonPath, 'utf-8'));
      // Ordenar por data decrescente
      postsData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return {
        posts: postsData
      };
    }
  } catch (error) {
    console.error('Erro ao ler posts.json no servidor:', error);
  }
  return {
    posts: []
  };
}
