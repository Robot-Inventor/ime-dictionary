import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type } from "arktype";
import { writeFile } from "node:fs/promises";

const dir = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(dir, "./dictionary.schema.json");

const dictionarySchema = type({
    items: type({
        "comment?": "string",
        partOfSpeech:
            "'名詞' | '固有名詞' | '人名' | '姓' | '名' | '組織' | '地名' | '動詞' | '形容詞' | '副詞' | '助動詞' | '助詞' | '感動詞' | '接続詞' | '接頭詞' | '連体詞' | '記号' | '顔文字' | '短縮よみ' | 'サジェストのみ' | '品詞なし'",
        reading: "string",
        word: "string"
    }).array()
});

const generateSchema = async (): Promise<void> => {
    const schema = dictionarySchema.toJsonSchema();
    // oxlint-disable-next-line no-magic-numbers
    await writeFile(schemaPath, JSON.stringify(schema, null, 4));
};

export { dictionarySchema, generateSchema };
