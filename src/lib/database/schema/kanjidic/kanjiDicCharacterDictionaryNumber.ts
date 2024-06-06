import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { kanjiDicCharacterTable } from './kanjiDicCharacter';

const kanjiDicCharacterDictionaryNumberTable = pgTable(
    'kanjidic_character_dictionary_number',
    {
        number: text('number').notNull(),
        dictionary: text('dictionary').notNull(),
        page: text('page'),
        volume: text('volume'),
        kanjiDicCharacterId: text('kanjidic_character_id')
            .notNull()
            .references(() => kanjiDicCharacterTable.id, {
                onDelete: 'cascade',
            }),
    },
);

const kanjiDicCharacterDictionaryNumberRelations = relations(
    kanjiDicCharacterDictionaryNumberTable,
    ({ one }) => ({
        kanjiElement: one(kanjiDicCharacterTable, {
            fields: [
                kanjiDicCharacterDictionaryNumberTable.kanjiDicCharacterId,
            ],
            references: [kanjiDicCharacterTable.id],
            relationName: 'dictionaryNumbers',
        }),
    }),
);

export {
    kanjiDicCharacterDictionaryNumberTable,
    kanjiDicCharacterDictionaryNumberRelations,
};
