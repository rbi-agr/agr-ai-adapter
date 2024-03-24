import { configDotenv } from 'dotenv';
configDotenv();


const documentClassSchema = {
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
