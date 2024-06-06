import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { kanjiDicReadingOnTypeEnum } from '../customTypes';
import { kanjiDicCharacterTable } from './kanjiDicCharacter';

const kanjiDicCharacterReadingTable = pgTable('kanjidic_character_reading', {
    reading: text('reading').notNull(),
    type: text('type').notNull(),
    onType: kanjiDicReadingOnTypeEnum('on_type'),
    status: text('status'),
    kanjiDicCharacterId: text('kanjidic_character_id')
        .notNull()
        .references(() => kanjiDicCharacterTable.id, {
            onDelete: 'cascade',
        }),
});

const kanjiDicCharacterReadingRelations = relations(
    kanjiDicCharacterReadingTable,
    ({ one }) => ({
        kanjiElement: one(kanjiDicCharacterTable, {
            fields: [kanjiDicCharacterReadingTable.kanjiDicCharacterId],
            references: [kanjiDicCharacterTable.id],
            relationName: 'readings',
        }),
    }),
);

export { kanjiDicCharacterReadingTable, kanjiDicCharacterReadingRelations };
