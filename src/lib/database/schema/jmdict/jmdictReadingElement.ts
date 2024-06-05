import { relations } from 'drizzle-orm';
import { pgTable, text, boolean } from 'drizzle-orm/pg-core';
import { uuid } from '../customTypes';
import { jmdictEntryTable } from './jmdictEntry';
import { jmdictReadingElementAdditionalInformationTable } from './jmdictReadingElementAdditionalInformation';
import { jmdictReadingElementPriorityTable } from './jmdictReadingElementPriority';
import { jmdictReadingElementRestrictedReadingTable } from './jmdictReadingElementRestrictedReading';

const jmdictReadingElementTable = pgTable('jmdict_reading_element', {
    id: uuid('id').primaryKey(),
    reading: text('reading').notNull(),
    noKanjiReading: boolean('no_kanji_reading').notNull(),
    jmdictEntryId: text('jmdict_entry_id')
        .notNull()
        .references(() => jmdictEntryTable.id, {
            onDelete: 'cascade',
        }),
});

const jmdictReadingElementRelations = relations(
    jmdictReadingElementTable,
    ({ one, many }) => ({
        entry: one(jmdictEntryTable, {
            fields: [jmdictReadingElementTable.jmdictEntryId],
            references: [jmdictEntryTable.id],
            relationName: 'entry',
        }),
        additionalInformation: many(
            jmdictReadingElementAdditionalInformationTable,
            {
                relationName: 'additionalInformation',
            },
        ),
        priority: many(jmdictReadingElementPriorityTable, {
            relationName: 'priority',
        }),
        restrictedReading: many(jmdictReadingElementRestrictedReadingTable, {
            relationName: 'restrictedReadings',
        }),
    }),
);

export { jmdictReadingElementTable, jmdictReadingElementRelations };
