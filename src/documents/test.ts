import axios from "axios";
import weaviate, { Class, ClassProperty, Client } from 'weaviate-client';
import { TextLoader, PDFLoader } from "langchain/document_loaders";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitters";
import { Ollama } from "langchain/llms";

// Types for document schema and loading
interface DocumentClassSchema {
    class: string;
    description: string;
    properties: ClassProperty[];
}

// Initialize Weaviate client


// Define document class schema
const documentClassSchema: DocumentClassSchema = {
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

// Ensures the class exists or creates it if not
const ensureClassExists = async (className: string, classSchema: DocumentClassSchema): Promise<void> => {
    try {
        const exists: boolean = await client.schema.exists(className);
        if (!exists) {
            await client.schema.classCreator(classSchema);
            console.log(`Class ${className} created.`);
        }
    } catch (error) {
        console.error(`Failed to ensure class ${className} exists:`, error);
    }
};

// Load and store documents from a text file and a PDF
const loadAndStoreDocuments = async (): Promise<void> => {
    await ensureClassExists("Document", documentClassSchema);

    // Load data from files
    const loader = new TextLoader("./data.txt");
    const pdfLoader = new PDFLoader("./enterpreneur.pdf");
    const docs = await loader.load(); // Assume load returns all content if mixing text and PDFs

    // Split the text and get document list as response
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        separators: ['\n\n', '\n', ' ', ''],
        chunkOverlap: 200
    });

    const splitDoc = await splitter.splitDocuments(docs);

    console.log("Storing the data in DB");
    for (const page of splitDoc) {
        try {
            await client.data.creator()
                .withClassName('Document')
                .withProperties({ content: page.pageContent })
                .do();
            console.log(`Document stored with content: ${page.pageContent}`);
        } catch (error) {
            console.error("Failed to store document in Weaviate:", error);
        }
    }
};

// Function to search for similar documents based on embeddings
const searchSimilarDocuments = async (query: string): Promise<string> => {
    try {
        const response = await client.graphql.get()
            .withNearText({ concepts: [query] })
            .withLimit(10)
            .withClassName('Document')
            .withFields('content')
            .do();

        console.log("Similar documents found:", response.data.Get.Document);
        return response.data.Get.Document.map((item: {content: string}) => item.content).join(", ")

    } catch (error) {
        console.error("Failed to search similar documents:", error);
        return ""; // Return an empty string in case of error
    }
};

// Execution example
(async () => {
    const userQuery: string = "can you tell me how elon muck started in his life";
    const content: string = await searchSimilarDocuments(userQuery);
    const finalPrompt: string = "Use the content: '''" + content + "'''. And then reply to the user query: '''" + userQuery + "'''";

    const answer = await ollamaLLM.invoke(finalPrompt);

    console.log("answer");
    console.log(answer);
})();