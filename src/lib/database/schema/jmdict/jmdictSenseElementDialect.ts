import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictSenseElementTable } from './jmdictSenseElement';

const jmdictSenseElementDialectTable = pgTable(
    'jmdict_sense_element_dialect',
    {
        dialect: text('dialect').notNull(),
        jmdictSenseElementId: text('jmdict_sense_element_id')
            .notNull()
            .references(() => jmdictSenseElementTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => {
        return {
            primaryKey: primaryKey({
                columns: [table.dialect, table.jmdictSenseElementId],
            }),
        };
    },
);

const jmdictSenseElementDialectRelations = relations(
    jmdictSenseElementDialectTable,
    ({ one }) => ({
        senseElement: one(jmdictSenseElementTable, {
            fields: [jmdictSenseElementDialectTable.jmdictSenseElementId],
            references: [jmdictSenseElementTable.id],
            relationName: 'dialects',
        }),
    }),
);

export { jmdictSenseElementDialectTable, jmdictSenseElementDialectRelations };
