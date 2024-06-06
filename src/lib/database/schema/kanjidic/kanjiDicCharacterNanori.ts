import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { kanjiDicCharacterTable } from './kanjiDicCharacter';

const kanjiDicCharacterNanoriTable = pgTable('kanjidic_character_nanori', {
    nanori: text('nanori').notNull(),
    kanjiDicCharacterId: text('kanjidic_character_id')
        .notNull()
        .references(() => kanjiDicCharacterTable.id, {
            onDelete: 'cascade',
        }),
});

const kanjiDicCharacterNanoriRelations = relations(
    kanjiDicCharacterNanoriTable,
    ({ one }) => ({
        kanjiElement: one(kanjiDicCharacterTable, {
            fields: [kanjiDicCharacterNanoriTable.kanjiDicCharacterId],
            references: [kanjiDicCharacterTable.id],
            relationName: 'nanoris',
        }),
    }),
);

export { kanjiDicCharacterNanoriTable, kanjiDicCharacterNanoriRelations };
