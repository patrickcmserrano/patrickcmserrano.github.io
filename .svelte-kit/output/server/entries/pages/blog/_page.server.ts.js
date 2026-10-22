import fs from "fs";
import path from "path";
async function load() {
  try {
    const postsJsonPath = path.resolve("static/posts.json");
    if (fs.existsSync(postsJsonPath)) {
      const postsData = JSON.parse(fs.readFileSync(postsJsonPath, "utf-8")).map((post) => {
        let hasAudio = false;
        const manifestPath = path.resolve(`static/audio/posts/${post.id}/manifest.json`);
        if (fs.existsSync(manifestPath)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
            hasAudio = Object.keys(manifest.sections || {}).length > 0;
          } catch {
          }
        }
        return { ...post, hasAudio };
      });
      postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return {
        posts: postsData
      };
    }
  } catch (error) {
    console.error("Erro ao ler posts.json no servidor:", error);
  }
  return {
    posts: []
  };
}
export {
  load
};
