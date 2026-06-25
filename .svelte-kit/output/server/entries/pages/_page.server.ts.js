import fs from "fs";
import path from "path";
async function load() {
  let featuredProjects = [];
  let recentPosts = [];
  try {
    const projectsJsonPath = path.resolve("src/data/projects.json");
    if (fs.existsSync(projectsJsonPath)) {
      featuredProjects = JSON.parse(fs.readFileSync(projectsJsonPath, "utf-8")).slice(0, 4);
    }
    const postsJsonPath = path.resolve("static/posts.json");
    if (fs.existsSync(postsJsonPath)) {
      recentPosts = JSON.parse(fs.readFileSync(postsJsonPath, "utf-8")).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
    }
  } catch (error) {
    console.error("Erro ao carregar dados da Home no servidor:", error);
  }
  return {
    featuredProjects,
    recentPosts
  };
}
export {
  load
};
