import { relations } from 'drizzle-orm';
import { pgTable, text, boolean } from 'drizzle-orm/pg-core';
import { jmdictSourceLanguageTypeEnum } from '../customTypes';
import { jmdictSenseElementTable } from './jmdictSenseElement';

const jmdictSenseElementSourceLanguageTable = pgTable(
    'jmdict_sense_element_source_language',
    {
        word: text('word'),
        language: text('language').notNull(),
        type: jmdictSourceLanguageTypeEnum('type'),
        wasei: boolean('wasei').notNull(),
        jmdictSenseElementId: text('jmdict_sense_element_id')
            .notNull()
            .references(() => jmdictSenseElementTable.id, {
                onDelete: 'cascade',
            }),
    },
);

const jmdictSenseElementSourceLanguageRelations = relations(
    jmdictSenseElementSourceLanguageTable,
    ({ one }) => ({
        senseElement: one(jmdictSenseElementTable, {
            fields: [
                jmdictSenseElementSourceLanguageTable.jmdictSenseElementId,
            ],
            references: [jmdictSenseElementTable.id],
            relationName: 'sourceLanguages',
        }),
    }),
);

export {
    jmdictSenseElementSourceLanguageTable,
    jmdictSenseElementSourceLanguageRelations,
};
