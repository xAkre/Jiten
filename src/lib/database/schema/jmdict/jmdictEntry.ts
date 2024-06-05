import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import { uuid } from '../customTypes';
import { jmdictKanjiElementTable } from './jmdictKanjiElement';

const jmdictEntryTable = pgTable('jmdict_entry', {
    id: uuid('id').primaryKey(),
});

const jmdictEntryRelations = relations(jmdictEntryTable, ({ many }) => ({
    kanjiElements: many(jmdictKanjiElementTable, {
        relationName: 'kanjiElements',
    }),
}));

export { jmdictEntryTable, jmdictEntryRelations };
