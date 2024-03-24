import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';
import weaviate, { WeaviateClient } from 'weaviate-ts-client';
import {detectContentType, ensureClassExists, getClassSchema, splitContent} from "./utils";
import {MISTRAL_API_URL, WEAVIATE_HTTP, WEAVIATE_URL} from "./document.constants";
import {RagDataDto} from "./dto/rag-data-dto";
import {Ollama} from "@langchain/community/llms/ollama";

const client: WeaviateClient = weaviate.client({
  scheme: WEAVIATE_HTTP,
  host: WEAVIATE_URL,
});

const ollamaLLM = new Ollama({
  baseUrl: MISTRAL_API_URL,
  model: "mistral",
  temperature: 0
});

@Injectable()
export class DocumentsService {

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
    const chunks: any = splitContent(allText);
    return await chunks
  }
  private async processDOCX(buffer: Buffer, filename: string): Promise<void> {
    const { value } = await mammoth.extractRawText({ buffer });
    const textContent = value;
    const chunks: any = splitContent(textContent);
    return await chunks
  }
  async createDocuments(chunks, fileName): Promise<object> {
    await ensureClassExists(client, "Document", getClassSchema("Document") )
    console.log("Storing the data in DB");
    if (chunks && chunks.length > 0) {
      for (const page of chunks) {
        try {
          await client.data.creator()
              .withClassName('Document')
              .withProperties({ content: page })
              .do();
          console.log(`Document stored with content: ${page}`);
        } catch (error) {
          console.error("Failed to store document in Weaviate:", error);
        }
      }
      return { message: `Document stored with content from : ${fileName}`}
    }
    return { message: `No Data to store from file: ${fileName}`}
  }

  async uploadDocument(file: any): Promise<void> {
    const contentType = detectContentType(file);
    let chunks: any = []
    if (contentType === 'application/pdf') {
      chunks =  await this.processPDF(file.buffer, file.originalname);
    } else if (contentType === 'application/msword') {
      chunks = await this.processDOCX(file.buffer, file.originalname);
    } else {
      throw new Error('Unsupported file format');
    }
    return chunks
  }

  async getRagResponse(ragDataDto: RagDataDto) {
    const userQuery = ragDataDto.text
    try {
      const response = await client.graphql.get()
          .withNearText({ concepts: [userQuery] })
          .withLimit(10)
          .withClassName('Document')
          .withFields('content')
          .do();

      console.log("Similar documents found:", response.data.Get.Document);
      return response.data.Get.Document.map((item)=> item.content).join(".\n")
    } catch (error) {
      console.error("Failed to search similar documents:", error);
    }
  }

  async getMistralResponse(ragDataDto: RagDataDto, ragDoc: any) {

    const finalPrompt = "Use the content: '''" + ragDoc + "'''." +
        " And then reply to the user Query : '''" + ragDataDto.text + "'''"
    const answer = await ollamaLLM.invoke(finalPrompt);
    return answer
  }
}
