import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { jmdictGlossTypeEnum } from '../customTypes';
import { jmdictSenseElementTable } from './jmdictSenseElement';

const jmdictSenseElementGlossTable = pgTable('jmdict_sense_element_gloss', {
    gloss: text('gloss').notNull(),
    language: text('language').notNull(),
    gender: text('gender'),
    type: jmdictGlossTypeEnum('type'),
    jmdictSenseElementId: text('jmdict_sense_element_id')
        .notNull()
        .references(() => jmdictSenseElementTable.id, {
            onDelete: 'cascade',
        }),
});

const jmdictSenseElementGlossRelations = relations(
    jmdictSenseElementGlossTable,
    ({ one }) => ({
        senseElement: one(jmdictSenseElementTable, {
            fields: [jmdictSenseElementGlossTable.jmdictSenseElementId],
            references: [jmdictSenseElementTable.id],
            relationName: 'glosses',
        }),
    }),
);

export { jmdictSenseElementGlossTable, jmdictSenseElementGlossRelations };
