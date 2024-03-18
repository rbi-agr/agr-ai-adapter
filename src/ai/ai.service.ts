import { HttpException, Injectable } from '@nestjs/common';
import { DetectLanguageDto } from './dto/detect-language.dto';
import { LoggerService } from 'src/logger/logger.service';
import { TranslateLanguageDto } from './dto/translate-language.dto';
import { CheckIntentDto } from './dto/check-intent-dto';
import { GetAIResponseDto } from './dto/get-ai-response.dto';
import axios from 'axios';
import { INSIDE_API, RESPONSE_RECEIVED, ERROR_MESSAGE, DETECT_LANGUAGE_API, INTENT_CLASSIFIER_API, TRANSLATE_LANGUAGE_API, GENERAL_TASK_API } from './ai.constants';

@Injectable()
export class AIService {
  constructor(private logger: LoggerService) {}
  async detectLanguage(detectLanguageDto: DetectLanguageDto) {
    try {
      //Calling the translator API for detecting the language.
      this.logger.info(INSIDE_API);
      let response = await axios.post(DETECT_LANGUAGE_API, detectLanguageDto);
      this.logger.info(RESPONSE_RECEIVED);
      return response.data;
    } catch (error) {
      this.logger.error(ERROR_MESSAGE, 'Optional Error Trace');
      throw new HttpException(error.response || 'AI-Service not running', error.response?.status || error.status || 500);
    }
  }
  async translateLanguage(translateLanguageDto: TranslateLanguageDto) {
    try {
      //Calling the translator API for translating the language.
      this.logger.info(INSIDE_API);
      let response = await axios.post(TRANSLATE_LANGUAGE_API, translateLanguageDto);
      this.logger.info(RESPONSE_RECEIVED);
      return response.data;
    } catch (error) {
      this.logger.error(ERROR_MESSAGE, 'Optional error trace');
      throw new HttpException(error.response || 'AI-Service not running', error.response?.status || error.status || 500);
    }
  }
  async checkIntent(checkIntentDto: CheckIntentDto) {
    try {
      //Calling the intent classifier API for checking the intent.
      this.logger.info(INSIDE_API);
      let response = await axios.post(INTENT_CLASSIFIER_API, checkIntentDto);
      this.logger.info(RESPONSE_RECEIVED);
      return response.data;
    } catch (error) {
      this.logger.error(ERROR_MESSAGE, 'Optional error trace');
      throw new HttpException(error.response || 'AI-Service not running', error.response?.status || error.status || 500);
    }
  }
  async getAIResponse(getAIResponseDto: GetAIResponseDto) {
    try {
      //Calling the mistralAI API for checking the transaction dates.
      this.logger.info(INSIDE_API);
      let response = await axios.post(GENERAL_TASK_API, getAIResponseDto);
      this.logger.info(RESPONSE_RECEIVED);
      return response.data;
    } catch (error) {
      this.logger.error(ERROR_MESSAGE, 'Optional error trace');
      throw new HttpException(error.response || 'AI-Service not running', error.response?.status || error.status || 500);
    }
  }
}
