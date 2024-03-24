import { configDotenv } from 'dotenv';
configDotenv();


export const MISTRAL_API_URL = process.env.MISTRAL_URL
export const WEAVIATE_URL = process.env.WEAVIATE_URL
export const WEAVIATE_HTTP = process.env.WEAVIATE_HTTP

export const DocumentClassSchema = {
    class: "Document",
    description: "Stores documents in smaller chunks",
    properties: [
        {
            name: "content",
            dataType: ["text"],
            description: "The text content of the document",
        },
    ],
};
