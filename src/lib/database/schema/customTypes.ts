import { text, pgEnum } from 'drizzle-orm/pg-core';
import { v4 } from 'uuid';

/**
 * A custom type for a UUID v4 column
 *
 * @param columnName - The name of the column
 * @returns A column definition for a UUID column. The column is not nullable, unique, and has a default value of a UUID v4 string
 */
const uuid = (columnName: string) => {
    return text(columnName).notNull().unique().$default(v4);
};

const jmdictGlossTypeEnum = pgEnum('jmdict_gloss_type', [
    'figurative',
    'literal',
    'explanation',
    'trademark',
]);

const jmdictSourceLanguageTypeEnum = pgEnum('jmdict_source_language_type', [
    'full',
    'partial',
]);

export { uuid, jmdictGlossTypeEnum, jmdictSourceLanguageTypeEnum };
