import { dictionarySchema, generateSchema } from "./generateSchema.js";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { type } from "arktype";

const parseDictionary = type("string.json.parse").to(dictionarySchema);

const main = async (): Promise<void> => {
    await generateSchema();

    const filePaths = (await readdir("./src/dictionaries", { withFileTypes: true }))
        .filter((file) => file.isFile() && file.name.endsWith(".json"))
        .map((file) => join("./src/dictionaries", file.name));

    const dictionaryPromises = filePaths.map(async (path) => {
        const data = await readFile(path, "utf-8");
        const parsed = parseDictionary(data);
        return parsed instanceof type.errors ? [] : parsed.items;
    });

    const dictionary = (await Promise.all(dictionaryPromises)).flat();
    const tsv = dictionary
        .map((item) => `${item.reading}\t${item.word}\t${item.partOfSpeech}\t${item.comment ?? ""}`)
        .join("\n");
    await mkdir("./dist", { recursive: true });
    await writeFile("./dist/dictionary.tsv", `${tsv}\n`);
};

void main();
