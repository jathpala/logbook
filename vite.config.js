import { sveltekit } from '@sveltejs/kit/vite'
import ViteRestart from 'vite-plugin-restart'
import ViteYaml from '@modyfi/vite-plugin-yaml'
import path from 'path'

const config = {
    plugins: [
        sveltekit(),
        ViteRestart({
            restart: [
                'src/styles/*.scss'
            ]
        }),
        ViteYaml()
    ],
    resolve: {
        alias: {
          '$': path.resolve('src'),
		  '$lib': path.resolve(path.join('src', 'lib')),
          '$styles': path.resolve(path.join('src', 'styles')),
          '$components': path.resolve(path.join('src', 'components')),
          '$stores': path.resolve(path.join('src', 'stores')),
        }
    },
    envPrefix: 'LOGBOOK_'
}

export default config
