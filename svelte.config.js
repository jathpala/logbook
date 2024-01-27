import adapter from "@sveltejs/adapter-static"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

const config = {
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "index.html",
      precompress: false,
      strict: false
    }),
    files: {
      assets: "src/static"
    }
  },
  preprocess: [vitePreprocess()]
}

export default config
