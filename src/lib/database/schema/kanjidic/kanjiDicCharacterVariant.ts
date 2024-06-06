import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { kanjiDicCharacterTable } from './kanjiDicCharacter';
import { kanjiDicVariantTypeEnum } from '../customTypes';

const kanjiDicCharacterVariantTable = pgTable('kanjidic_character_variant', {
    variant: text('variant').notNull(),
    type: kanjiDicVariantTypeEnum('type').notNull(),
    kanjiDicCharacterId: text('kanjidic_character_id')
        .notNull()
        .references(() => kanjiDicCharacterTable.id, {
            onDelete: 'cascade',
        }),
});

const kanjiDicCharacterVariantRelations = relations(
    kanjiDicCharacterVariantTable,
    ({ one }) => ({
        kanjiElement: one(kanjiDicCharacterTable, {
            fields: [kanjiDicCharacterVariantTable.kanjiDicCharacterId],
            references: [kanjiDicCharacterTable.id],
            relationName: 'variants',
        }),
    }),
);

export { kanjiDicCharacterVariantTable, kanjiDicCharacterVariantRelations };
