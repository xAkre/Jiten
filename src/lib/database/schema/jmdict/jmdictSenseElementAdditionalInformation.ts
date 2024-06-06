import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictSenseElementTable } from './jmdictSenseElement';

const jmdictSenseElementAdditionalInformationTable = pgTable(
    'jmdict_sense_element_additional_information',
    {
        additionalInformation: text('additional_information').notNull(),
        jmdictSenseElementId: text('jmdict_sense_element_id')
            .notNull()
            .references(() => jmdictSenseElementTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => {
        return {
            primaryKey: primaryKey({
                columns: [
                    table.additionalInformation,
                    table.jmdictSenseElementId,
                ],
            }),
        };
    },
);

const jmdictSenseElementAdditionalInformationRelations = relations(
    jmdictSenseElementAdditionalInformationTable,
    ({ one }) => ({
        senseElement: one(jmdictSenseElementTable, {
            fields: [
                jmdictSenseElementAdditionalInformationTable.jmdictSenseElementId,
            ],
            references: [jmdictSenseElementTable.id],
            relationName: 'additionalInformation',
        }),
    }),
);

export {
    jmdictSenseElementAdditionalInformationTable,
    jmdictSenseElementAdditionalInformationRelations,
};
