import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictReadingElementTable } from './jmdictReadingElement';

const jmdictReadingElementAdditionalInformationTable = pgTable(
    'jmdict_reading_element_additional_information',
    {
        additionalInformation: text('additional_information').notNull(),
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
                    table.additionalInformation,
                    table.jmdictReadingElementId,
                ],
            }),
        };
    },
);

const jmdictReadingElementAdditionalInformationRelations = relations(
    jmdictReadingElementAdditionalInformationTable,
    ({ one }) => ({
        readingElement: one(jmdictReadingElementTable, {
            fields: [
                jmdictReadingElementAdditionalInformationTable.jmdictReadingElementId,
            ],
            references: [jmdictReadingElementTable.id],
            relationName: 'readingElement',
        }),
    }),
);

export {
    jmdictReadingElementAdditionalInformationTable,
    jmdictReadingElementAdditionalInformationRelations,
};
