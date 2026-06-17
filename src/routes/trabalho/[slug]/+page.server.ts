import fs from 'fs';
import path from 'path';

interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  role: string;
  status: string;
  stack: string[];
  github?: string;
  url?: string;
  details: string;
  architecture: string;
  diagrams?: { title: string; svg: string }[];
}

// Gera as rotas estáticas na compilação (SSG)
export async function entries() {
  try {
    const projectsJsonPath = path.resolve('src/data/projects.json');
    if (fs.existsSync(projectsJsonPath)) {
      const projectsData: ProjectData[] = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf-8'));
      return projectsData.map(project => ({ slug: project.id }));
    }
  } catch (error) {
    console.error('Erro ao gerar entries para projetos:', error);
  }
  return [];
}

export async function load({ params }) {
  const { slug } = params;
  
  try {
    const projectsJsonPath = path.resolve('src/data/projects.json');
    if (fs.existsSync(projectsJsonPath)) {
      const projectsData: ProjectData[] = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf-8'));
      const project = projectsData.find(p => p.id === slug);
      if (project) {
        return {
          project
        };
      }
    }
  } catch (error) {
    console.error(`Erro ao carregar projeto ${slug}:`, error);
  }
  
  throw new Error(`Project not found: ${slug}`);
}
