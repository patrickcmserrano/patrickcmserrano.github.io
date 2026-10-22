import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function blogAudioAdminPlugin(): Plugin {
  return {
    name: 'blog-audio-admin-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__admin/blog-audio/')) {
          return next();
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });

        req.on('end', () => {
          try {
            const payload = JSON.parse(body || '{}');
            const slug = String(payload.slug || '').replace(/[^a-zA-Z0-9_-]/g, '');
            const sectionId = String(payload.sectionId || '').replace(/[^a-zA-Z0-9_-]/g, '');

            if (!slug || !sectionId) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'slug e sectionId são obrigatórios' }));
              return;
            }

            const postAudioDir = path.resolve('static', 'audio', 'posts', slug);
            const manifestPath = path.join(postAudioDir, 'manifest.json');

            if (req.url === '/__admin/blog-audio/save') {
              const { audioBase64, mimeType, duration, title } = payload;
              if (!audioBase64) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'audioBase64 ausente' }));
                return;
              }

              fs.mkdirSync(postAudioDir, { recursive: true });

              const ext = mimeType?.includes('ogg')
                ? 'ogg'
                : mimeType?.includes('mp4') || mimeType?.includes('m4a')
                  ? 'm4a'
                  : mimeType?.includes('mpeg') || mimeType?.includes('mp3')
                    ? 'mp3'
                    : 'webm';

              const fileName = `${sectionId}.${ext}`;
              const filePath = path.join(postAudioDir, fileName);
              const buffer = Buffer.from(audioBase64, 'base64');
              fs.writeFileSync(filePath, buffer);

              let manifest: Record<string, any> = { slug, updatedAt: new Date().toISOString(), sections: {} };
              if (fs.existsSync(manifestPath)) {
                try {
                  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
                } catch {
                  // recria se corrompido
                }
              }
              if (!manifest.sections) manifest.sections = {};

              const entry = {
                sectionId,
                title: title || sectionId,
                file: fileName,
                url: `/audio/posts/${slug}/${fileName}`,
                duration: Number(duration) || 0,
                mimeType: mimeType || 'audio/webm',
                recordedAt: new Date().toISOString()
              };

              manifest.sections[sectionId] = entry;
              manifest.updatedAt = new Date().toISOString();

              fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, entry, manifest }));
              return;
            }

            if (req.url === '/__admin/blog-audio/delete') {
              if (fs.existsSync(manifestPath)) {
                const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
                const existing = manifest.sections?.[sectionId];
                if (existing?.file) {
                  const filePath = path.join(postAudioDir, existing.file);
                  if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                  }
                }
                if (manifest.sections) {
                  delete manifest.sections[sectionId];
                }
                manifest.updatedAt = new Date().toISOString();
                fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, manifest }));
                return;
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
              return;
            }

            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not found' }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Erro interno ao salvar áudio' }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [
    blogAudioAdminPlugin(),
    sveltekit(),
    tailwindcss()
  ],
  ssr: {
    noExternal: ['svelte-icons']
  }
});