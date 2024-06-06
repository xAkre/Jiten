import { relations } from 'drizzle-orm';
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { jmdictSenseElementTable } from './jmdictSenseElement';

const jmdictSenseElementCrossReferenceTable = pgTable(
    'jmdict_sense_element_cross_reference',
    {
        word: text('word').notNull(),
        reading: text('reading'),
        senseIndex: integer('sense_index'),
        jmdictSenseElementId: text('jmdict_sense_element_id')
            .notNull()
            .references(() => jmdictSenseElementTable.id, {
                onDelete: 'cascade',
            }),
    },
);

const jmdictSenseElementCrossReferenceRelations = relations(
    jmdictSenseElementCrossReferenceTable,
    ({ one }) => ({
        senseElement: one(jmdictSenseElementTable, {
            fields: [
                jmdictSenseElementCrossReferenceTable.jmdictSenseElementId,
            ],
            references: [jmdictSenseElementTable.id],
            relationName: 'crossReferences',
        }),
    }),
);

export {
    jmdictSenseElementCrossReferenceTable,
    jmdictSenseElementCrossReferenceRelations,
};
