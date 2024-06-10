import { relations } from 'drizzle-orm';
import { pgTable, text, index } from 'drizzle-orm/pg-core';
import { uuid } from '../customTypes';
import { jmdictEntryTable } from './jmdictEntry';
import { jmdictKanjiElementAdditionalInformationTable } from './jmdictKanjiElementAdditionalInformation';
import { jmdictKanjiElementPriorityTable } from './jmdictKanjiElementPriority';

const jmdictKanjiElementTable = pgTable(
    'jmdict_kanji_element',
    {
        id: uuid('id').primaryKey(),
        kanji: text('kanji').notNull(),
        jmdictEntryId: text('jmdict_entry_id')
            .notNull()
            .references(() => jmdictEntryTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => ({
        idIndex: index('jmdict_kanji_element_id_index').on(table.id),
        kanjiIndex: index('jmdict_kanji_element_kanji_index').on(table.kanji),
    }),
);

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
