import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictSenseElementTable } from './jmdictSenseElement';

const jmdictSenseElementPartOfSpeechTable = pgTable(
    'jmdict_sense_element_part_of_speech',
    {
        partOfSpeech: text('part_of_speech').notNull(),
        jmdictSenseElementId: text('jmdict_sense_element_id')
            .notNull()
            .references(() => jmdictSenseElementTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => {
        return {
            primaryKey: primaryKey({
                columns: [table.partOfSpeech, table.jmdictSenseElementId],
            }),
        };
    },
);

const jmdictSenseElementPartOfSpeechRelations = relations(
    jmdictSenseElementPartOfSpeechTable,
    ({ one }) => ({
        senseElement: one(jmdictSenseElementTable, {
            fields: [jmdictSenseElementPartOfSpeechTable.jmdictSenseElementId],
            references: [jmdictSenseElementTable.id],
            relationName: 'partsOfSpeech',
        }),
    }),
);

export {
    jmdictSenseElementPartOfSpeechTable,
    jmdictSenseElementPartOfSpeechRelations,
};
