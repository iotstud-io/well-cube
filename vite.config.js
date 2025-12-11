import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path'
import fs from 'node:fs'

const loadComponents = () => {
    const raw = fs.readFileSync(path.resolve(__dirname, 'exposes.json'), 'utf8')
    const json = JSON.parse(raw)
    return Array.isArray(json.components) ? json.components : []
}

export default defineConfig(() => {
    const components = loadComponents()
    const entries = Object.fromEntries(
        components.map(c => [c.name, path.resolve(__dirname, 'src', `${c.name}.jsx`)])
    )

    return {
        plugins: [
            react({ fastRefresh: false }),
            viteStaticCopy({ targets: [{ src: 'exposes.json', dest: '' }] }),
            {
                name: 'dev-public-writes',
                apply: 'serve',
                configureServer(server) {

                    for(const c of components) {

                        const contents = `export { default } from '/src/${c.name}.jsx'`
                        const out = path.resolve(__dirname, 'public', `${c.name}.esm.js`)

                        fs.mkdirSync(path.dirname(out), { recursive: true })
                        fs.writeFileSync(out, contents, 'utf8')
                    }

                    const src = path.resolve(__dirname, 'exposes.json')
                    const dest = path.resolve(__dirname, 'public', 'exposes.json')

                    fs.mkdirSync(path.dirname(dest), { recursive: true })
                    fs.copyFileSync(src, dest)

                    server.middlewares.use((req, res, next) => {

                        const url = req.url || ''

                        if(url.endsWith('.esm.js')) {

                            const name = path.basename(url)
                            const file = path.resolve(__dirname, 'public', name)

                            if(fs.existsSync(file)) {
                                res.setHeader('Access-Control-Allow-Origin', '*')
                                res.setHeader('Content-Type', 'application/javascript')
                                res.end(fs.readFileSync(file))
                                return
                            }
                        }

                        next()
                    })
                }
            }
        ],
        publicDir: 'public',
        server: { port: 5173, cors: true, hmr: false },
        build: {
            rollupOptions: {
                input: entries,
                external: [
                    'react',
                    'react-dom/client',
                    'react/jsx-runtime',
                    'react/jsx-dev-runtime'
                ],
                output: {
                    dir: 'dist',
                    entryFileNames: '[name].esm.js'
                },
                preserveEntrySignatures: 'strict'
            }
        }
    }
})
