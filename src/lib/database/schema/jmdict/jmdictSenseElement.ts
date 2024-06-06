import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { uuid } from '../customTypes';
import { jmdictEntryTable } from './jmdictEntry';
import { jmdictSenseElementAdditionalInformationTable } from './jmdictSenseElementAdditionalInformation';
import { jmdictSenseElementAntonymTable } from './jmdictSenseElementAntonym';
import { jmdictSenseElementCrossReferenceTable } from './jmdictSenseElementCrossReference';
import { jmdictSenseElementDialectTable } from './jmdictSenseElementDialect';
import { jmdictSenseElementFieldOfApplicationTable } from './jmdictSenseElementFieldOfApplication';
import { jmdictSenseElementGlossTable } from './jmdictSenseElementGloss';
import { jmdictSenseElementMiscellaneousInformationTable } from './jmdictSenseElementMiscellaneousInformation';
import { jmdictSenseElementPartOfSpeechTable } from './jmdictSenseElementPartOfSpeech';
import { jmdictSenseElementSourceLanguageTable } from './jmdictSenseElementSourceLanguage';

const jmdictSenseElementTable = pgTable('jmdict_sense_element', {
    id: uuid('id').primaryKey(),
    jmdictEntryId: text('jmdict_entry_id')
        .notNull()
        .references(() => jmdictEntryTable.id, {
            onDelete: 'cascade',
        }),
});

const jmdictSenseElementRelations = relations(
    jmdictSenseElementTable,
    ({ one, many }) => ({
        entry: one(jmdictEntryTable, {
            fields: [jmdictSenseElementTable.jmdictEntryId],
            references: [jmdictEntryTable.id],
            relationName: 'senseElements',
        }),
        additionalInformation: many(
            jmdictSenseElementAdditionalInformationTable,
            {
                relationName: 'additionalInformation',
            },
        ),
        antonyms: many(jmdictSenseElementAntonymTable, {
            relationName: 'antonyms',
        }),
        crossReferences: many(jmdictSenseElementCrossReferenceTable, {
            relationName: 'crossReferences',
        }),
        dialects: many(jmdictSenseElementDialectTable, {
            relationName: 'dialects',
        }),
        fieldsOfApplication: many(jmdictSenseElementFieldOfApplicationTable, {
            relationName: 'fieldsOfApplication',
        }),
        glosses: many(jmdictSenseElementGlossTable, {
            relationName: 'glosses',
        }),
        miscellaneousInformation: many(
            jmdictSenseElementMiscellaneousInformationTable,
            {
                relationName: 'miscellaneousInformation',
            },
        ),
        partsOfSpeech: many(jmdictSenseElementPartOfSpeechTable, {
            relationName: 'partsOfSpeech',
        }),
        sourceLanguages: many(jmdictSenseElementSourceLanguageTable, {
            relationName: 'sourceLanguages',
        }),
    }),
);

export { jmdictSenseElementTable, jmdictSenseElementRelations };
