import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictKanjiElementTable } from './jmdictKanjiElement';

const jmdictKanjiElementPriorityTable = pgTable(
    'jmdict_kanji_element_priority',
    {
        priority: text('priority').notNull(),
        jmdictKanjiElementId: text('jmdict_kanji_element_id')
            .notNull()
            .references(() => jmdictKanjiElementTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => {
        return {
            primaryKey: primaryKey({
                columns: [table.priority, table.jmdictKanjiElementId],
            }),
        };
    },
);

const jmdictKanjiElementPriorityRelations = relations(
    jmdictKanjiElementPriorityTable,
    ({ one }) => ({
        kanjiElement: one(jmdictKanjiElementTable, {
            fields: [jmdictKanjiElementPriorityTable.jmdictKanjiElementId],
            references: [jmdictKanjiElementTable.id],
            relationName: 'priority',
        }),
    }),
);

export { jmdictKanjiElementPriorityTable, jmdictKanjiElementPriorityRelations };
