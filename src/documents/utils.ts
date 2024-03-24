
export const ensureClassExists = async (db, className, classSchema) => {
    try {
        const exists = await db.schema.exists(className);
        if (!exists) {
            await db.schema.classCreator(classSchema);
            console.log(`Class ${className} created.`);
        }
    } catch (error) {
        console.error(`Failed to ensure class ${className} exists:`, error);
    }
};

export const detectContentType = (fileContent: Buffer): string  => {
    const signature = fileContent.toString('hex', 0, 4);
    switch (signature) {
        case '25504446':
            return 'application/pdf';
        case '504b0304':
            return 'application/msword';
        default:
            return '';
    }
}

export const splitContent = (content: string): string[] => {
    const chunkSize = 1024;
    const chunks = [];
    for (let i = 0; i < content.length; i += chunkSize) {
        chunks.push(content.slice(i, i + chunkSize));
    }
    return chunks;
}

export const getClassSchema = (name: string) => {

     return {
        class: name,
        description: "Stores documents in smaller chunks",
        properties: [
            {
                name: "content",
                dataType: ["text"],
                description: "The text content of the document",
            },
        ],
    };
}