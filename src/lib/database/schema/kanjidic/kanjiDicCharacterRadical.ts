import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { kanjiDicRadicalTypeEnum } from '../customTypes';
import { kanjiDicCharacterTable } from './kanjiDicCharacter';

const kanjiDicCharacterRadicalTable = pgTable('kanjidic_character_radical', {
    radical: text('radical').notNull(),
    type: kanjiDicRadicalTypeEnum('type').notNull(),
    kanjiDicCharacterId: text('kanjidic_character_id')
        .notNull()
        .references(() => kanjiDicCharacterTable.id, {
            onDelete: 'cascade',
        }),
});

const kanjiDicCharacterRadicalRelations = relations(
    kanjiDicCharacterRadicalTable,
    ({ one }) => ({
        kanjiElement: one(kanjiDicCharacterTable, {
            fields: [kanjiDicCharacterRadicalTable.kanjiDicCharacterId],
            references: [kanjiDicCharacterTable.id],
            relationName: 'radicals',
        }),
    }),
);

export { kanjiDicCharacterRadicalTable, kanjiDicCharacterRadicalRelations };
