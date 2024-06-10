import { relations } from 'drizzle-orm';
import { pgTable, index } from 'drizzle-orm/pg-core';
import { uuid } from '../customTypes';
import { jmdictKanjiElementTable } from './jmdictKanjiElement';
import { jmdictReadingElementTable } from './jmdictReadingElement';
import { jmdictSenseElementTable } from './jmdictSenseElement';

const jmdictEntryTable = pgTable(
    'jmdict_entry',
    {
        id: uuid('id').primaryKey(),
    },
    (table) => ({
        idIndex: index('jmdict_entry_id_index').on(table.id),
    }),
);

const jmdictEntryRelations = relations(jmdictEntryTable, ({ many }) => ({
    kanjiElements: many(jmdictKanjiElementTable, {
        relationName: 'kanjiElements',
    }),
    readingElements: many(jmdictReadingElementTable, {
        relationName: 'readingElements',
    }),
    senseElements: many(jmdictSenseElementTable, {
        relationName: 'senseElements',
    }),
}));

export { jmdictEntryTable, jmdictEntryRelations };
