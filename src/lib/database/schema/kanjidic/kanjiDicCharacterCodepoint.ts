import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { kanjiDicCodepointStandardEnum } from '../customTypes';
import { kanjiDicCharacterTable } from './kanjiDicCharacter';

const kanjiDicCharacterCodepointTable = pgTable(
    'kanjidic_character_codepoint',
    {
        codepoint: text('codepoint').notNull(),
        standard: kanjiDicCodepointStandardEnum('standard').notNull(),
        kanjiDicCharacterId: text('kanjidic_character_id')
            .notNull()
            .references(() => kanjiDicCharacterTable.id, {
                onDelete: 'cascade',
            }),
    },
);

const kanjiDicCharacterCodepointRelations = relations(
    kanjiDicCharacterCodepointTable,
    ({ one }) => ({
        kanjiElement: one(kanjiDicCharacterTable, {
            fields: [kanjiDicCharacterCodepointTable.kanjiDicCharacterId],
            references: [kanjiDicCharacterTable.id],
            relationName: 'codepoints',
        }),
    }),
);

export { kanjiDicCharacterCodepointTable, kanjiDicCharacterCodepointRelations };
