import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env' });

let databaseUrl: string;
if (process.env.NODE_ENV === 'development') {
    if (!process.env.DEVELOPMENT_DATABASE_URL) {
        throw new Error('DEVELOPMENT_DATABASE_URL is not set');
    }

    databaseUrl = process.env.DEVELOPMENT_DATABASE_URL;
} else {
    if (!process.env.PRODUCTION_DATABASE_URL) {
        throw new Error('PRODUCTION_DATABASE_URL is not set');
    }

    databaseUrl = process.env.PRODUCTION_DATABASE_URL;
}

const config = defineConfig({
    dialect: 'postgresql',
    schema: [
        'src/lib/database/schema/customTypes.ts',
        'src/lib/database/schema/jmdict',
        'src/lib/database/schema/kanjidic',
    ],
    out: 'src/lib/database/migrations',
    dbCredentials: {
        url: databaseUrl,
    },
});

export default config;
