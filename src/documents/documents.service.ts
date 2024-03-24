import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';
import axios from "axios";
import weaviate, { Class, ClassProperty, Client } from 'weaviate-client';
import { TextLoader, PDFLoader } from "langchain/document_loaders";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitters";
import { Ollama } from "langchain/llms";


const client: Client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8999',
});

// Parameters for Ollama initialization may need to be adjusted
// based on the actual available constructors from 'langchain'.
const ollamaLLM = new Ollama({
  baseUrl: "http://0.0.0.0:11434",
  model: "mistral",
  temperature: 0.4
});
@Injectable()
export class DocumentsService {

  async uploadDocument(file: any): Promise<void> {
    const contentType = this.detectContentType(file);
    if (contentType === 'application/pdf') {
      await this.processPDF(file.buffer, file.originalname);
    } else if (contentType === 'application/msword') {
      await this.processDOCX(file.buffer, file.originalname);
    } else {
      throw new Error('Unsupported file format');
    }
  }

  private detectContentType(fileContent: Buffer): string {
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

  // private async processPDF(buffer: Buffer, filename: string): Promise<void> {
  //   const pdfDoc = await pdfLib.PDFDocument.load(buffer);
  //   const pages = pdfDoc.getPages();
  //   const textContent = await Promise.all(pages.map(async (page: any) => await page.getText));
  //   console.log({textContent});
  //   const chunks = this.splitContent(textContent.join('\n'));
  //   const embeddings = await this.generateEmbeddings(chunks);
  //   await this.createDocuments(embeddings, filename);
  // }

  private async processPDF(buffer: Buffer, filename: string): Promise<void> {
    const loadingTask = pdfjs.getDocument({ data: buffer });
    const pdfDocument = await loadingTask.promise;

    const textContent: string[] = [];

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContentStream = await page.getTextContent();
      const pageText = textContentStream.items.map((item:any) => item.str).join('');
      textContent.push(pageText);
    }

    const allText = textContent.join('\n');
    const chunks = this.splitContent(allText);
    const embeddings = await this.generateEmbeddings(chunks);
    await this.createDocuments(embeddings, filename);
  }

  private async processDOCX(buffer: Buffer, filename: string): Promise<void> {
    const { value } = await mammoth.extractRawText({ buffer });
    const textContent = value;
    const chunks = this.splitContent(textContent);
    const embeddings = await this.generateEmbeddings(chunks);
    await this.createDocuments(embeddings, filename);
  }

  private splitContent(content: string): string[] {
    const chunkSize = 1024;
    const chunks = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private async generateEmbeddings(chunks: string[]) {
    // const embeddings = await Promise.all(
    //   chunks.map(async (chunk) => {
    //     try {
    //       const response = await axios.post(this.mistralApiUrl, {
    //         model: 'mistral-embed',
    //         input: [chunk],
    //         encoding_format: 'float',
    //       }, {
    //         headers: {
    //           "Authorization": "Bearer "
    //         }
    //       });
    //       console.log({ response });
    //       return response.data.embeddings[0];
    //     } catch (error) {
    //       console.error('Error generating embedding for chunk:', chunk, error);
    //       return 'error_embedding';
    //     }
    //   })
    // );
    const embeddings = await Promise.all(
      chunks.map(async (chunk) => {
        try {
          const response = await axios.post('http://localhost:11434/api/embeddings', {
            model: "nomic-embed-text",
            prompt: chunk
          });
          return {
            "content": chunk,
            "embedding": response.data
          };
        } catch (error) {
          console.error('Error generating embedding for chunk:', chunk, error);
        }
      })
    );
    console.log(embeddings);
    return embeddings;
  }

  private async createDocuments(embeddings, fileName): Promise<void> {
    const schema = {
      classes: [
        {
          class: "Document",
          description: "A file with the name" + fileName,
          properties: [
            {
              dataType: ["text"],
              name: "content",
            },
            {
              dataType: ["vector"],
              name: "embedding",
            },
          ],
          vectorIndexType: "hnsw",
          vectorizer: "none", // Since we're providing the embeddings directly
        },
      ],
    };
    const client: WeaviateClient = weaviate.client({
      scheme: 'https',
      host: 'rbih-agr-5048scvf.weaviate.network',
      apiKey: new ApiKey('ka3f7i5F6QX34gEqgvwldTlWaewsM9Ib8SFs'),
    }); 
    try {
      const response = await client.data.creator()
        .withClassName('Document')
        .withProperties(document)
        .do();
      console.log('Document created:', response);
    } catch (error) {
      console.error('Error storing document in Weaviate:', error);
      throw new Error('Failed to store document in Weaviate');
    }
  }
}
