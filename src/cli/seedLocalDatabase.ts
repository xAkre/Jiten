#!/usr/bin/env node

/**
 * This script is used to seed a local database with JMdict and KanjiDic data for development purposes.
 * It assumes that the database has already been created and that the schema has been migrated
 */

import pg from 'pg';
import ProgressBar from 'progress';
import { program } from 'commander';
import { type PgTableWithColumns } from 'drizzle-orm/pg-core';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { JMdictParser, KanjiDicParser, type JMdictEntry } from 'jmdict.js';
import * as jmdictSchema from '@/lib/database/schema/jmdict';
import { colors, withColor, hideCursor } from '@/utilities/cli';

/* Define command line options */

program
    .usage('--database-url <url> --jmdict-file <path> --kanjidic-file <path>')
    .requiredOption('--database-url <url>', 'The URL of the database to seed')
    .requiredOption('--jmdict-file <path>', 'The path to the JMdict XML file')
    .requiredOption(
        '--kanjidic-file <path>',
        'The path to the KanjiDic XML file',
    )
    .parse(process.argv);

const { databaseUrl, jmdictFile, kanjidicFile } = program.opts();

/* Connect to the database */

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
const database = drizzle(client);
type Transaction = NodePgDatabase;

/* Parse the JMdict and KanjiDic files */

hideCursor();
console.log(withColor('Parsing JMdict file...', colors.fgYellow));
const jmdict = await JMdictParser.fromXmlFile(jmdictFile);
console.log(withColor('Parsed JMdict file', colors.fgGreen));

console.log(withColor('Parsing KanjiDic file...', colors.fgYellow));
const kanjidic = await KanjiDicParser.fromXmlFile(kanjidicFile);
console.log(withColor('Parsed KanjiDic file', colors.fgGreen));

/* Helper functions */

/**
 * Insert a single entry into a table and return the row
 *
 * @param entry - The entry to insert
 * @param transaction - The transaction to use
 * @returns The inserted row
 */
const singleInsert = async <T extends PgTableWithColumns<any>>(
    transaction: Transaction,
    table: T,
    entry: T['$inferInsert'] = {},
): Promise<T['$inferSelect']> => {
    const result = await transaction.insert(table).values(entry).returning();
    return result[0];
};

/**
 * Seed a JMdict entry into the database
 *
 * @param param0 - The JMdict entry to seed
 * @param transaction - The transaction to use
 */
const seedJMdictEntry = async (
    {
        kanji: kanjiElements = [],
        readings: readingElements = [],
        senses: senseElements = [],
    }: JMdictEntry,
    transaction: Transaction,
) => {
    const { id: entryId } = await singleInsert(
        transaction,
        jmdictSchema.jmdictEntryTable,
    );

    for (const {
        kanji,
        additionalInformation = [],
        priority = [],
    } of kanjiElements) {
        const { id: kanjiElementId } = await singleInsert(
            transaction,
            jmdictSchema.jmdictKanjiElementTable,
            { jmdictEntryId: entryId, kanji },
        );

        for (const _additionalInformation of additionalInformation) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictKanjiElementAdditionalInformationTable,
                {
                    jmdictKanjiElementId: kanjiElementId,
                    additionalInformation: _additionalInformation,
                },
            );
        }
        for (const _priority of priority) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictKanjiElementPriorityTable,
                { jmdictKanjiElementId: kanjiElementId, priority: _priority },
            );
        }
    }

    for (const {
        reading,
        noKanjiReading,
        additionalInformation = [],
        priority = [],
        restrictedReading = [],
    } of readingElements) {
        const { id: readingElementId } = await singleInsert(
            transaction,
            jmdictSchema.jmdictReadingElementTable,
            {
                jmdictEntryId: entryId,
                reading,
                noKanjiReading: noKanjiReading ?? false,
            },
        );

        for (const _additionalInformation of additionalInformation) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictReadingElementAdditionalInformationTable,
                {
                    jmdictReadingElementId: readingElementId,
                    additionalInformation: _additionalInformation,
                },
            );
        }
        for (const _priority of priority) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictReadingElementPriorityTable,
                {
                    jmdictReadingElementId: readingElementId,
                    priority: _priority,
                },
            );
        }
        for (const _restrictedReading of restrictedReading) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictReadingElementRestrictedReadingTable,
                {
                    jmdictReadingElementId: readingElementId,
                    restrictedReading: _restrictedReading,
                },
            );
        }
    }

    for (const {
        additionalInformation = [],
        antonyms = [],
        crossReferences = [],
        dialects = [],
        fieldsOfApplication = [],
        glosses = [],
        miscellaneous = [],
        partsOfSpeech = [],
        sourceLanguages = [],
    } of senseElements) {
        const { id: senseId } = await singleInsert(
            transaction,
            jmdictSchema.jmdictSenseElementTable,
            { jmdictEntryId: entryId },
        );

        for (const _additionalInformation of additionalInformation) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictSenseElementAdditionalInformationTable,
                {
                    jmdictSenseElementId: senseId,
                    additionalInformation: _additionalInformation,
                },
            );
        }

        for (const antonym of antonyms) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictSenseElementAntonymTable,
                { jmdictSenseElementId: senseId, antonym },
            );
        }

        for (const crossReference of crossReferences) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictSenseElementCrossReferenceTable,
                { jmdictSenseElementId: senseId, ...crossReference },
            );
        }

        for (const dialect of dialects) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictSenseElementDialectTable,
                { jmdictSenseElementId: senseId, dialect },
            );
        }

        for (const fieldOfApplication of fieldsOfApplication) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictSenseElementFieldOfApplicationTable,
                { jmdictSenseElementId: senseId, fieldOfApplication },
            );
        }

        for (const gloss of glosses) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictSenseElementGlossTable,
                { jmdictSenseElementId: senseId, ...gloss },
            );
        }

        for (const miscellaneousInformation of miscellaneous) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictSenseElementMiscellaneousInformationTable,
                {
                    jmdictSenseElementId: senseId,
                    miscellaneousInformation,
                },
            );
        }

        for (const partOfSpeech of partsOfSpeech) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictSenseElementPartOfSpeechTable,
                { jmdictSenseElementId: senseId, partOfSpeech },
            );
        }

        for (const sourceLanguage of sourceLanguages) {
            await singleInsert(
                transaction,
                jmdictSchema.jmdictSenseElementSourceLanguageTable,
                { jmdictSenseElementId: senseId, ...sourceLanguage },
            );
        }
    }
};

const progress = new ProgressBar(
    withColor(
        'Seeding JMdict entries [:bar] [:current/:total] [:percent complete] [:elapsed elapsed]',
        colors.fgYellow,
    ),
    {
        total: jmdict.entries.length,
        width: 50,
    },
);

/* Seed the database with JMdict data */

for (const entry of jmdict.entries) {
    try {
        await database.transaction(async (transaction) => {
            await seedJMdictEntry(entry, transaction);
        });
    } catch (error) {
        console.error(
            withColor(`Error seeding JMdict entry: ${entry.id}`, colors.fgRed),
        );
        console.error(error);
    } finally {
        progress.tick();
    }
}

process.exit(0);
