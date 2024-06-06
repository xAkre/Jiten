import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictSenseElementTable } from './jmdictSenseElement';

const jmdictSenseElementAntonymTable = pgTable(
    'jmdict_sense_element_antonym',
    {
        antonym: text('antonym').notNull(),
        jmdictSenseElementId: text('jmdict_sense_element_id')
            .notNull()
            .references(() => jmdictSenseElementTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => {
        return {
            primaryKey: primaryKey({
                columns: [table.antonym, table.jmdictSenseElementId],
            }),
        };
    },
);

const jmdictSenseElementAntonymRelations = relations(
    jmdictSenseElementAntonymTable,
    ({ one }) => ({
        senseElement: one(jmdictSenseElementTable, {
            fields: [jmdictSenseElementAntonymTable.jmdictSenseElementId],
            references: [jmdictSenseElementTable.id],
            relationName: 'antonyms',
        }),
    }),
);

export { jmdictSenseElementAntonymTable, jmdictSenseElementAntonymRelations };
