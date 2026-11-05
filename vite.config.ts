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
                error: 'GEMINI_API_KEY is not configured or is a placeholder in Secrets.',
                needsApiKey: true,
              }));
              return;
            }

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({
              apiKey: apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const selectedModel = model === 'lyria-3-pro-preview' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';
            const trackPrompt = prompt || 'Generate a high-energy FIFA EA Sports FC style stadium anthem with infectious drum beats, synth brass, and modern bass.';

            const response = await ai.models.generateContentStream({
              model: selectedModel,
              contents: trackPrompt,
            });

            const audioChunks: Buffer[] = [];
            let lyrics = '';
            let mimeType = 'audio/mpeg';

            for await (const chunk of response) {
              const parts = chunk.candidates?.[0]?.content?.parts;
              if (!parts) continue;
              for (const part of parts) {
                if (part.inlineData?.data) {
                  if (audioChunks.length === 0 && part.inlineData.mimeType) {
                    mimeType = part.inlineData.mimeType;
                  }
                  audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
                }
                if (part.text) {
                  lyrics += part.text;
                }
              }
            }

            if (audioChunks.length === 0) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                error: 'No audio data received from Lyria model.',
              }));
              return;
            }

            const audioBase64 = Buffer.concat(audioChunks).toString('base64');
            const audioDataUrl = `data:${mimeType};base64,${audioBase64}`;

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              audioDataUrl,
              lyrics,
              model: selectedModel,
              prompt: trackPrompt,
            }));
          } catch (err: unknown) {
            const error = err as Error;
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: error.message || 'Error generating music with Lyria',
            }));
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
            const { token } = JSON.parse(body || '{}');
            if (!token || typeof token !== 'string' || !token.trim()) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                error: 'GitHub Personal Access Token is required to push to github.com/dsrichard97/La-Liga-MathModel.',
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
    base: './',
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

