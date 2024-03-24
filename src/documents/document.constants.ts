import { configDotenv } from 'dotenv';
configDotenv();


export const MISTRAL_API_URL = process.env.MISTRAL_URL
export const WEAVIATE_URL = process.env.WEAVIATE_URL
export const WEAVIATE_HTTP = process.env.WEAVIATE_HTTP


