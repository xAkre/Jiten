import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictSenseElementTable } from './jmdictSenseElement';

const jmdictSenseElementFieldOfApplicationTable = pgTable(
    'jmdict_sense_element_field_of_application',
    {
        fieldOfApplication: text('field_of_application').notNull(),
        jmdictSenseElementId: text('jmdict_sense_element_id')
            .notNull()
            .references(() => jmdictSenseElementTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => {
        return {
            primaryKey: primaryKey({
                columns: [table.fieldOfApplication, table.jmdictSenseElementId],
            }),
        };
    },
);

const jmdictSenseElementFieldOfApplicationRelations = relations(
    jmdictSenseElementFieldOfApplicationTable,
    ({ one }) => ({
        senseElement: one(jmdictSenseElementTable, {
            fields: [
                jmdictSenseElementFieldOfApplicationTable.jmdictSenseElementId,
            ],
            references: [jmdictSenseElementTable.id],
            relationName: 'fieldsOfApplication',
        }),
    }),
);

export {
    jmdictSenseElementFieldOfApplicationTable,
    jmdictSenseElementFieldOfApplicationRelations,
};
