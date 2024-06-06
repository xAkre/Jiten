import { defineConfig } from 'drizzle-kit';

const config = defineConfig({
    dialect: 'postgresql',
    schema: [
        'src/lib/database/schema/customTypes.ts',
        'src/lib/database/schema/jmdict',
    ],
    out: 'src/lib/database/migrations',
});

export default config;
