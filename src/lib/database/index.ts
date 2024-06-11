import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as jmdictSchema from './schema/jmdict';
import * as kanjiDicSchema from './schema/kanjidic';

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

const sql = neon(databaseUrl);
const database = drizzle(sql, {
    schema: {
        ...jmdictSchema,
        ...kanjiDicSchema,
    },
});

export { database };
