import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        files: {
            appTemplate: 'src/index.html',
        },
        alias: {
            "@/*": "./src/*",
        }
    },
};

export default config;
