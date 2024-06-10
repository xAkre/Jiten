import { relations } from 'drizzle-orm';
import { pgTable, text, boolean, index } from 'drizzle-orm/pg-core';
import { uuid } from '../customTypes';
import { jmdictEntryTable } from './jmdictEntry';
import { jmdictReadingElementAdditionalInformationTable } from './jmdictReadingElementAdditionalInformation';
import { jmdictReadingElementPriorityTable } from './jmdictReadingElementPriority';
import { jmdictReadingElementRestrictedReadingTable } from './jmdictReadingElementRestrictedReading';

const jmdictReadingElementTable = pgTable(
    'jmdict_reading_element',
    {
        id: uuid('id').primaryKey(),
        reading: text('reading').notNull(),
        noKanjiReading: boolean('no_kanji_reading').notNull(),
        jmdictEntryId: text('jmdict_entry_id')
            .notNull()
            .references(() => jmdictEntryTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => ({
        idIndex: index('jmdict_reading_element_id_index').on(table.id),
        readingIndex: index('jmdict_reading_element_reading_index').on(
            table.reading,
        ),
    }),
);

const jmdictReadingElementRelations = relations(
    jmdictReadingElementTable,
    ({ one, many }) => ({
        entry: one(jmdictEntryTable, {
            fields: [jmdictReadingElementTable.jmdictEntryId],
            references: [jmdictEntryTable.id],
            relationName: 'readingElements',
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
