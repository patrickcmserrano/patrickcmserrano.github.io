import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

type LocalizedString = string | { pt: string; en: string; es: string };

interface ProjectData {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  excerpt: LocalizedString;
  role: LocalizedString;
  status: LocalizedString;
  stack: string[];
  github?: string;
  url?: string;
  details: LocalizedString;
  architecture: LocalizedString;
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
        // Parse details and architecture markdown to HTML dynamically
        const parseMarkdown = async (field: LocalizedString) => {
          if (field && typeof field === 'object') {
            const parsed: any = {};
            for (const lang of Object.keys(field)) {
              parsed[lang] = await marked((field as any)[lang]);
            }
            return parsed;
          } else if (typeof field === 'string') {
            return await marked(field);
          }
          return field;
        };

        const processedProject = {
          ...project,
          details: await parseMarkdown(project.details),
          architecture: await parseMarkdown(project.architecture)
        };

        return {
          project: processedProject
        };
      }
    }
  } catch (error) {
    console.error(`Erro ao carregar projeto ${slug}:`, error);
  }
  
  throw new Error(`Project not found: ${slug}`);
}
