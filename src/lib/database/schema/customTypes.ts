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

const kanjiDicCodepointStandardEnum = pgEnum('kanjidic_codepoint_standard', [
    'jis208',
    'jis212',
    'jis213',
    'ucs',
]);

const kanjiDicRadicalTypeEnum = pgEnum('kanjidic_radical_type', [
    'classical',
    'nelson_c',
]);

const kanjiDicVariantTypeEnum = pgEnum('kanjidic_variant_type', [
    'jis208',
    'jis212',
    'jis213',
    'deroo',
    'njecd',
    's_h',
    'nelson_c',
    'oneill',
    'ucs',
]);

const kanjiDicQueryCodeTypeEnum = pgEnum('kanjidic_query_code_type', [
    'skip',
    'sh_desc',
    'four_corner',
    'deroo',
    'misclass',
]);

const kanjiDicQueryCodeSkipMisclassEnum = pgEnum(
    'kanjidic_query_code_skip_misclass',
    ['posn', 'stroke_count', 'stroke_and_posn', 'stroke_diff'],
);

const kanjiDicReadingOnTypeEnum = pgEnum('kanjidic_reading_on_type', [
    'kun',
    'on',
]);

export {
    uuid,
    jmdictGlossTypeEnum,
    jmdictSourceLanguageTypeEnum,
    kanjiDicCodepointStandardEnum,
    kanjiDicRadicalTypeEnum,
    kanjiDicVariantTypeEnum,
    kanjiDicQueryCodeTypeEnum,
    kanjiDicQueryCodeSkipMisclassEnum,
    kanjiDicReadingOnTypeEnum,
};
