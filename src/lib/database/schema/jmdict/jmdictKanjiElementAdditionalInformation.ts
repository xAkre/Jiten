import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { jmdictKanjiElementTable } from './jmdictKanjiElement';

const jmdictKanjiElementAdditionalInformationTable = pgTable(
    'jmdict_kanji_element_additional_information',
    {
        additionalInformation: text('additional_information').notNull(),
        jmdictKanjiElementId: text('jmdict_kanji_element_id')
            .notNull()
            .references(() => jmdictKanjiElementTable.id, {
                onDelete: 'cascade',
            }),
    },
    (table) => {
        return {
            primaryKey: primaryKey({
                columns: [
                    table.additionalInformation,
                    table.jmdictKanjiElementId,
                ],
            }),
        };
    },
);

const jmdictKanjiElementAdditionalInformationRelations = relations(
    jmdictKanjiElementAdditionalInformationTable,
    ({ one }) => ({
        kanjiElement: one(jmdictKanjiElementTable, {
            fields: [
                jmdictKanjiElementAdditionalInformationTable.jmdictKanjiElementId,
            ],
            references: [jmdictKanjiElementTable.id],
            relationName: 'additionalInformation',
        }),
    }),
);

export {
    jmdictKanjiElementAdditionalInformationTable,
    jmdictKanjiElementAdditionalInformationRelations,
};
