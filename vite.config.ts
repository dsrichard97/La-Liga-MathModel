import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import dotenv from 'dotenv';
dotenv.config();

function lyriaMusicPlugin(): Plugin {
  return {
    name: 'lyria-music-plugin',
    configureServer(server) {
      server.middlewares.use('/api/generate-music', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { prompt, model } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                error: 'GEMINI_API_KEY is missing or invalid in server environment.',
              }));
              return;
            }

            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-2.5-flash'}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                }),
              }
            );

            const data = await response.json();
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      });
    },
  };
}

function gitPushPlugin(): Plugin {
  return {
    name: 'git-push-plugin',
    configureServer(server) {
      server.middlewares.use('/api/git-push', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { githubToken } = JSON.parse(body || '{}');
            const token = githubToken || process.env.GITHUB_TOKEN;

            if (!token) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                error: 'GitHub Token is required to push changes.',
              }));
              return;
            }

            const cleanToken = token.trim();
            const { exec } = await import('child_process');

            // Ensure any recent files are staged and committed
            exec('git add . && (git commit -m "feat: complete Liga MX stats, custom La Liga model builder, D3.js radar compare, and GitHub Pages build" || true)', () => {
              const targetRemote = `https://${cleanToken}@github.com/dsrichard97/La-Liga-MathModel.git`;
              exec(`git push "${targetRemote}" main:main --force`, (err, stdout, stderr) => {
                if (err) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: false,
                    error: stderr || err.message,
                    hint: 'Ensure your Personal Access Token has repo access and the repository exists on GitHub.',
                  }));
                  return;
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  message: 'Successfully pushed codebase to github.com/dsrichard97/La-Liga-MathModel! GitHub Pages deployment triggered.',
                  details: stdout || stderr,
                }));
              });
            });
          } catch (e: unknown) {
            const error = e as Error;
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/La-Liga-MathModel/',
    plugins: [react(), tailwindcss(), lyriaMusicPlugin(), gitPushPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
