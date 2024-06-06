import { relations } from 'drizzle-orm';
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { uuid } from '../customTypes';
import { kanjiDicCharacterCodepointTable } from './kanjiDicCharacterCodepoint';
import { kanjiDicCharacterDictionaryNumberTable } from './kanjiDicCharacterDictionaryNumber';
import { kanjiDicCharacterMeaningTable } from './kanjiDicCharacterMeaning';
import { kanjiDicCharacterNanoriTable } from './kanjiDicCharacterNanori';
import { kanjiDicCharacterQueryCodeTable } from './kanjiDicCharacterQueryCode';
import { kanjiDicCharacterRadicalTable } from './kanjiDicCharacterRadical';
import { kanjiDicCharacterReadingTable } from './kanjiDicCharacterReading';
import { kanjiDicCharacterVariantTable } from './kanjiDicCharacterVariant';

const kanjiDicCharacterTable = pgTable('kanjidic_character', {
    id: uuid('id').primaryKey(),
    kanji: text('kanji').notNull(),
    strokeCount: integer('stroke_count').notNull(),
    grade: text('grade'),
    frequency: text('frequency'),
    radicalName: text('radical_name'),
    jlptLevel: text('jlpt_level'),
});

const kanjiDicCharacterRelations = relations(
    kanjiDicCharacterTable,
    ({ many }) => ({
        codepoints: many(kanjiDicCharacterCodepointTable, {
            relationName: 'codepoints',
        }),
        dictionaryNumbers: many(kanjiDicCharacterDictionaryNumberTable, {
            relationName: 'dictionaryNumbers',
        }),
        meanings: many(kanjiDicCharacterMeaningTable, {
            relationName: 'meanings',
        }),
        nanoris: many(kanjiDicCharacterNanoriTable, {
            relationName: 'nanoris',
        }),
        queryCodes: many(kanjiDicCharacterQueryCodeTable, {
            relationName: 'queryCodes',
        }),
        radicals: many(kanjiDicCharacterRadicalTable, {
            relationName: 'radicals',
        }),
        readings: many(kanjiDicCharacterReadingTable, {
            relationName: 'readings',
        }),
        variants: many(kanjiDicCharacterVariantTable, {
            relationName: 'variants',
        }),
    }),
);

export { kanjiDicCharacterTable, kanjiDicCharacterRelations };
