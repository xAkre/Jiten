# Jiten

Jiten is a Japanese - English dictionary built on the [JMdict](http://www.edrdg.org/jmdict/j_jmdict.html) project

## NPM Scripts

-   `npm run lint` - Lint the codebase
-   `npm run format` - Format the codebase
-   `npm run pre:push` - Ready the codebase for a push
-   `npm run test` - Run tests
-   `npm run dev` - Start the development server
-   `npm run build` - Build the project
-   `npm run preview` - Preview the build
-   `npm run database:generate` - Generate database migrations based on the schema
-   `npm run database:seed:local` - Migrate and seed a local database with JMdict and KanjiDic data
    -   Flags
        -   `--database-url` - The database URL to seed
        -   `--jmdict-file` - The JMdict file to seed
        -   `--kanjidic-file` - The KanjiDic file to seed
    -   The script assumes the database is a PostgreSQL database, and that the database has already been created
    -   Example usage:

```bash
npm run database:seed:local -- --database-url="postgresql://localhost:5432/jiten" --jmdict-file="./data/JMdict" --kanjidic-file="./data/kanjidic"
```
