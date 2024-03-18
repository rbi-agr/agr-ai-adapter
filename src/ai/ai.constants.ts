import { configDotenv } from 'dotenv';
configDotenv();

export const INSIDE_API = 'Inside API.';
export const RESPONSE_RECEIVED = 'Received response from API.';
export const ERROR_MESSAGE = 'This is an error log message';
export const DETECT_LANGUAGE_API = process.env.DETECT_LANGUAGE_API;
export const TRANSLATE_LANGUAGE_API = process.env.TRANSLATE_LANGUAGE_API;
export const INTENT_CLASSIFIER_API = process.env.INTENT_CLASSIFIER_API;
export const GENERAL_TASK_API = process.env.GENERAL_TASK_API;
