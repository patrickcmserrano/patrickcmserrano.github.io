import fs from 'fs';
import path from 'path';

export async function load() {
  try {
    const projectsJsonPath = path.resolve('src/data/projects.json');
    if (fs.existsSync(projectsJsonPath)) {
      const projectsData = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf-8'));
      return {
        projects: projectsData
      };
    }
  } catch (error) {
    console.error('Erro ao ler projects.json no servidor:', error);
  }
  return {
    projects: []
  };
}
