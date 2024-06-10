import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { kanjiDicCharacterTable } from './kanjiDicCharacter';

const kanjiDicCharacterMeaningTable = pgTable('kanjidic_character_meaning', {
    meaning: text('meaning').notNull(),
    language: text('language').notNull(),
    kanjiDicCharacterId: text('kanjidic_character_id')
        .notNull()
        .references(() => kanjiDicCharacterTable.id, {
            onDelete: 'cascade',
        }),
});

const kanjiDicCharacterMeaningRelations = relations(
    kanjiDicCharacterMeaningTable,
    ({ one }) => ({
        kanjiElement: one(kanjiDicCharacterTable, {
            fields: [kanjiDicCharacterMeaningTable.kanjiDicCharacterId],
            references: [kanjiDicCharacterTable.id],
            relationName: 'meanings',
        }),
    }),
);

export { kanjiDicCharacterMeaningTable, kanjiDicCharacterMeaningRelations };
