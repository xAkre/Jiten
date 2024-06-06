import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictReadingElementTable } from './jmdictReadingElement';

const jmdictReadingElementPriorityTable = pgTable(
    'jmdict_reading_element_priority',
    {
        priority: text('priority').notNull(),
        jmdictReadingElementId: text('jmdict_reading_element_id')
            .notNull()
            .references(() => jmdictReadingElementTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => {
        return {
            primaryKey: primaryKey({
                columns: [table.priority, table.jmdictReadingElementId],
            }),
        };
    },
);

const jmdictReadingElementPriorityRelations = relations(
    jmdictReadingElementPriorityTable,
    ({ one }) => ({
        readingElement: one(jmdictReadingElementTable, {
            fields: [jmdictReadingElementPriorityTable.jmdictReadingElementId],
            references: [jmdictReadingElementTable.id],
            relationName: 'priority',
        }),
    }),
);

export {
    jmdictReadingElementPriorityTable,
    jmdictReadingElementPriorityRelations,
};
