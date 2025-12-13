import { defineConfig, mergeConfig } from 'vite'
import { createComponentViteConfig } from 'component-vite-config'

export default defineConfig(({ command, mode }) => {

    let base = createComponentViteConfig({ root: __dirname, command, mode })

    if(typeof base === 'function') {
        base = base({ command, mode })
    }

    return mergeConfig(base, {
        // Add local overrides here if needed.
    })
})