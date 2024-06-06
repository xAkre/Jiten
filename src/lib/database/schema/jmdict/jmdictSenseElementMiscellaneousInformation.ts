import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictSenseElementTable } from './jmdictSenseElement';

const jmdictSenseElementMiscellaneousInformationTable = pgTable(
    'jmdict_sense_element_miscellaneous_information',
    {
        miscellaneousInformation: text('miscellaneous_information').notNull(),
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
                    table.miscellaneousInformation,
                    table.jmdictSenseElementId,
                ],
            }),
        };
    },
);

const jmdictSenseElementMiscellaneousInformationRelations = relations(
    jmdictSenseElementMiscellaneousInformationTable,
    ({ one }) => ({
        senseElement: one(jmdictSenseElementTable, {
            fields: [
                jmdictSenseElementMiscellaneousInformationTable.jmdictSenseElementId,
            ],
            references: [jmdictSenseElementTable.id],
            relationName: 'miscellaneousInformation',
        }),
    }),
);

export {
    jmdictSenseElementMiscellaneousInformationTable,
    jmdictSenseElementMiscellaneousInformationRelations,
};
