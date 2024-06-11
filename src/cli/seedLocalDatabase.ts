#!/usr/bin/env node

/**
 * This script is used to migrate and seed a local database with JMdict and KanjiDic data for development purposes
 */

import pg from 'pg';
import ProgressBar from 'progress';
import { program } from 'commander';
import { type PgTableWithColumns } from 'drizzle-orm/pg-core';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import {
    JMdictParser,
    KanjiDicParser,
    type JMdictEntry,
    type KanjiDicCharacter,
} from 'jmdict.js';
import * as jmdictSchema from '@/lib/database/schema/jmdict';
import * as kanjiDicSchema from '@/lib/database/schema/kanjidic';
import { colors, withColor, hideCursor } from '@/utilities/cli';

/* Define command line options */

program
    .usage('--database-url <url> --jmdict-file <path> --kanjidic-file <path>')
    .requiredOption('--database-url <url>', 'The URL of the database to seed')
    .requiredOption(
        '--migrations-folder <path>',
        'The path to the database migrations folder',
    )
    .requiredOption('--jmdict-file <path>', 'The path to the JMdict XML file')
    .requiredOption(
        '--kanjidic-file <path>',
        'The path to the KanjiDic XML file',
    )
    .parse(process.argv);

const { databaseUrl, jmdictFile, kanjidicFile, migrationsFolder } =
    program.opts();

/* Connect to the database */

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
const database = drizzle(client);

/* Migrate tables */

await migrate(database, {
    migrationsFolder: migrationsFolder,
});

type Transaction = NodePgDatabase;

/* Parse the JMdict and KanjiDic files */

hideCursor();
console.log(withColor('Parsing JMdict file...', colors.fgYellow));
const jmdict = await JMdictParser.fromXmlFile(jmdictFile);
console.log(withColor('Parsed JMdict file', colors.fgGreen));

console.log(withColor('Parsing KanjiDic file...', colors.fgYellow));
const kanjidic = await KanjiDicParser.fromXmlFile(kanjidicFile);
console.log(withColor('Parsed KanjiDic file', colors.fgGreen));

/**
 * Insert a single entry into a table and return the row
 *
 * @param entry - The entry to insert
 * @param transaction - The transaction to use
 * @returns The inserted row
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const singleInsert = async <T extends PgTableWithColumns<any>>(
    transaction: Transaction,
    table: T,
    entry: T['$inferInsert'] = {},
): Promise<T['$inferSelect']> => {
    const result = await transaction.insert(table).values(entry).returning();
    return result[0];
};

/**
 * Inserts entries into a table only if the entries array is not empty
 *
 * @param transaction - The database transaction to use
 * @param table - The table to insert the entries into
 * @param entries - The array of entries to insert
 * @returns The inserted rows, or null if the array was empty
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const insertNonEmptyArray = async <T extends PgTableWithColumns<any>>(
    transaction: Transaction,
    table: T,
    entries: T['$inferInsert'][],
): Promise<T['$inferSelect'] | null> => {
    if (entries.length === 0) {
        return null;
    }
    return await transaction.insert(table).values(entries);
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
    const { id: jmdictEntryId } = await singleInsert(
        transaction,
        jmdictSchema.jmdictEntryTable,
    );

    for (const {
        kanji,
        additionalInformation = [],
        priority = [],
    } of kanjiElements) {
        const { id: jmdictKanjiElementId } = await singleInsert(
            transaction,
            jmdictSchema.jmdictKanjiElementTable,
            { jmdictEntryId, kanji },
        );

        await Promise.all([
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictKanjiElementAdditionalInformationTable,
                additionalInformation.map((additionalInformation) => ({
                    jmdictKanjiElementId,
                    additionalInformation,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictKanjiElementPriorityTable,
                priority.map((priority) => ({
                    jmdictKanjiElementId,
                    priority,
                })),
            ),
        ]);
    }

    for (const {
        reading,
        noKanjiReading,
        additionalInformation = [],
        priority = [],
        restrictedReading = [],
    } of readingElements) {
        const { id: jmdictReadingElementId } = await singleInsert(
            transaction,
            jmdictSchema.jmdictReadingElementTable,
            {
                jmdictEntryId,
                reading,
                noKanjiReading: noKanjiReading ?? false,
            },
        );

        await Promise.all([
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictReadingElementAdditionalInformationTable,
                additionalInformation.map((additionalInformation) => ({
                    jmdictReadingElementId,
                    additionalInformation,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictReadingElementPriorityTable,
                priority.map((priority) => ({
                    jmdictReadingElementId,
                    priority,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictReadingElementRestrictedReadingTable,
                restrictedReading.map((restrictedReading) => ({
                    jmdictReadingElementId,
                    restrictedReading,
                })),
            ),
        ]);
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
        const { id: jmdictSenseElementId } = await singleInsert(
            transaction,
            jmdictSchema.jmdictSenseElementTable,
            { jmdictEntryId },
        );

        await Promise.all([
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictSenseElementAdditionalInformationTable,
                additionalInformation.map((additionalInformation) => ({
                    jmdictSenseElementId,
                    additionalInformation,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictSenseElementAntonymTable,
                antonyms.map((antonym) => ({
                    jmdictSenseElementId,
                    antonym,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictSenseElementCrossReferenceTable,
                crossReferences.map((crossReference) => ({
                    jmdictSenseElementId,
                    ...crossReference,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictSenseElementDialectTable,
                dialects.map((dialect) => ({
                    jmdictSenseElementId,
                    dialect,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictSenseElementFieldOfApplicationTable,
                fieldsOfApplication.map((fieldOfApplication) => ({
                    jmdictSenseElementId,
                    fieldOfApplication,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictSenseElementGlossTable,
                glosses.map((gloss) => ({
                    jmdictSenseElementId,
                    ...gloss,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictSenseElementMiscellaneousInformationTable,
                miscellaneous.map((miscellaneousInformation) => ({
                    jmdictSenseElementId,
                    miscellaneousInformation,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictSenseElementPartOfSpeechTable,
                partsOfSpeech.map((partOfSpeech) => ({
                    jmdictSenseElementId,
                    partOfSpeech,
                })),
            ),
            insertNonEmptyArray(
                transaction,
                jmdictSchema.jmdictSenseElementSourceLanguageTable,
                sourceLanguages.map((sourceLanguage) => ({
                    jmdictSenseElementId,
                    ...sourceLanguage,
                })),
            ),
        ]);
    }
};

/**
 * Seed a KanjiDic character into the database
 *
 * @param param0 - The KanjiDic character to seed
 * @param transaction - The transaction to use
 */
const seedKanjiDicCharacter = async (
    {
        kanji,
        codepoints,
        miscellaneous,
        radicals,
        dictionaryNumbers = [],
        meanings = [],
        nanori = [],
        queryCodes = [],
        readings = [],
    }: KanjiDicCharacter,
    transaction: Transaction,
) => {
    const { id: kanjiDicCharacterId } = await singleInsert(
        transaction,
        kanjiDicSchema.kanjiDicCharacterTable,
        {
            kanji,
            strokeCount: +miscellaneous.strokeCount,
            grade: miscellaneous.grade,
            frequency: miscellaneous.frequency,
            jlptLevel: miscellaneous.jlpt,
            radicalName: miscellaneous.radicalName,
        },
    );

    await Promise.all([
        insertNonEmptyArray(
            transaction,
            kanjiDicSchema.kanjiDicCharacterCodepointTable,
            codepoints.map((codepoint) => ({
                kanjiDicCharacterId,
                ...codepoint,
            })),
        ),
        insertNonEmptyArray(
            transaction,
            kanjiDicSchema.kanjiDicCharacterRadicalTable,
            radicals.map((radical) => ({
                kanjiDicCharacterId,
                ...radical,
            })),
        ),
        insertNonEmptyArray(
            transaction,
            kanjiDicSchema.kanjiDicCharacterDictionaryNumberTable,
            dictionaryNumbers.map((dictionaryNumber) => ({
                kanjiDicCharacterId,
                ...dictionaryNumber,
            })),
        ),
        insertNonEmptyArray(
            transaction,
            kanjiDicSchema.kanjiDicCharacterMeaningTable,
            meanings.map((meaning) => ({
                kanjiDicCharacterId,
                ...meaning,
            })),
        ),
        insertNonEmptyArray(
            transaction,
            kanjiDicSchema.kanjiDicCharacterNanoriTable,
            nanori.map((nanori) => ({
                kanjiDicCharacterId,
                nanori,
            })),
        ),
        insertNonEmptyArray(
            transaction,
            kanjiDicSchema.kanjiDicCharacterQueryCodeTable,
            queryCodes.map((queryCode) => ({
                kanjiDicCharacterId,
                ...queryCode,
            })),
        ),
        insertNonEmptyArray(
            transaction,
            kanjiDicSchema.kanjiDicCharacterReadingTable,
            readings.map((reading) => ({
                kanjiDicCharacterId,
                reading: reading.reading,
                type: reading.type,
                onType: reading.onType?.replace('ja_', '') as
                    | 'kun'
                    | 'on'
                    | undefined,
                status: reading.status,
            })),
        ),
    ]);
};

/* Seed the database with JMdict data */

let progress = new ProgressBar(
    withColor(
        'Seeding JMdict entries [:bar] [:current/:total] [:percent complete] [:elapsed elapsed]',
        colors.fgYellow,
    ),
    {
        total: jmdict.entries.length,
        width: 50,
    },
);

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

console.log(withColor('Seeded JMdict entries', colors.fgGreen));

/* Seed the database with KanjiDic data */

progress = new ProgressBar(
    withColor(
        'Seeding KanjiDic characters [:bar] [:current/:total] [:percent complete] [:elapsed elapsed]',
        colors.fgYellow,
    ),
    {
        total: kanjidic.characters.length,
        width: 50,
    },
);

for (const character of kanjidic.characters) {
    try {
        await database.transaction(async (transaction) => {
            await seedKanjiDicCharacter(character, transaction);
        });
    } catch (error) {
        console.error(
            withColor(
                `Error seeding KanjiDic character: ${character.kanji}`,
                colors.fgRed,
            ),
        );
        console.error(error);
    } finally {
        progress.tick();
    }
}

console.log(withColor('Seeded KanjiDic characters', colors.fgGreen));

process.exit(0);
