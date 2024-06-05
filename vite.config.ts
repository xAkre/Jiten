import { type UserConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

const config: UserConfig = {
    plugins: [sveltekit()],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}'],
    },
};

export default config;
