import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { uuid } from '../customTypes';
import { jmdictEntryTable } from './jmdictEntry';
import { jmdictKanjiElementAdditionalInformationTable } from './jmdictKanjiElementAdditionalInformation';
import { jmdictKanjiElementPriorityTable } from './jmdictKanjiElementPriority';

const jmdictKanjiElementTable = pgTable('jmdict_kanji_element', {
    id: uuid('id').primaryKey(),
    kanji: text('kanji').notNull(),
    jmdictEntryId: text('jmdict_entry_id')
        .notNull()
        .references(() => jmdictEntryTable.id, {
            onDelete: 'cascade',
        }),
});

const jmdictKanjiElementRelations = relations(
    jmdictKanjiElementTable,
    ({ one, many }) => ({
        entry: one(jmdictEntryTable, {
            fields: [jmdictKanjiElementTable.jmdictEntryId],
            references: [jmdictEntryTable.id],
            relationName: 'kanjiElements',
        }),
        additionalInformation: many(
            jmdictKanjiElementAdditionalInformationTable,
            {
                relationName: 'additionalInformation',
            },
        ),
        priority: many(jmdictKanjiElementPriorityTable, {
            relationName: 'priority',
        }),
    }),
);

export { jmdictKanjiElementTable, jmdictKanjiElementRelations };
