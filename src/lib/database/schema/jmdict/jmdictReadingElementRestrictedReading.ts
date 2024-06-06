import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictReadingElementTable } from './jmdictReadingElement';

const jmdictReadingElementRestrictedReadingTable = pgTable(
    'jmdict_reading_element_restricted_reading',
    {
        restrictedReading: text('restricted_reading').notNull(),
        jmdictReadingElementId: text('jmdict_reading_element_id')
            .notNull()
            .references(() => jmdictReadingElementTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => {
        return {
            primaryKey: primaryKey({
                columns: [
                    table.restrictedReading,
                    table.jmdictReadingElementId,
                ],
            }),
        };
    },
);

const jmdictReadingElementRestrictedReadingRelations = relations(
    jmdictReadingElementRestrictedReadingTable,
    ({ one }) => ({
        readingElement: one(jmdictReadingElementTable, {
            fields: [
                jmdictReadingElementRestrictedReadingTable.jmdictReadingElementId,
            ],
            references: [jmdictReadingElementTable.id],
            relationName: 'restrictedReadings',
        }),
    }),
);

export {
    jmdictReadingElementRestrictedReadingTable,
    jmdictReadingElementRestrictedReadingRelations,
};
