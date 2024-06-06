import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import {
    kanjiDicQueryCodeTypeEnum,
    kanjiDicQueryCodeSkipMisclassEnum,
} from '../customTypes';
import { kanjiDicCharacterTable } from './kanjiDicCharacter';

const kanjiDicCharacterQueryCodeTable = pgTable(
    'kanjidic_character_query_code',
    {
        code: text('code').notNull(),
        type: kanjiDicQueryCodeTypeEnum('type').notNull(),
        skipMisclass: kanjiDicQueryCodeSkipMisclassEnum('skip_misclass'),
        kanjiDicCharacterId: text('kanjidic_character_id')
            .notNull()
            .references(() => kanjiDicCharacterTable.id, {
                onDelete: 'cascade',
            }),
    },
);

const kanjiDicCharacterQueryCodeRelations = relations(
    kanjiDicCharacterQueryCodeTable,
    ({ one }) => ({
        kanjiElement: one(kanjiDicCharacterTable, {
            fields: [kanjiDicCharacterQueryCodeTable.kanjiDicCharacterId],
            references: [kanjiDicCharacterTable.id],
            relationName: 'queryCodes',
        }),
    }),
);

export { kanjiDicCharacterQueryCodeTable, kanjiDicCharacterQueryCodeRelations };
