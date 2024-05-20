import { HttpException, Injectable } from '@nestjs/common';
import { DetectLanguageDto } from './dto/detect-language.dto';
import { LoggerService } from 'src/logger/logger.service';
import { TranslateLanguageDto } from './dto/translate-language.dto';
import { CheckIntentDto } from './dto/check-intent-dto';
import { RuleEngineDto } from './dto/rule-engine-dto';
import { GetAIResponseDto } from './dto/get-ai-response.dto';
import axios from 'axios';
import { RESPONSE_RECEIVED, ERROR_MESSAGE, DETECT_LANGUAGE_API, INTENT_CLASSIFIER_API, RULE_ENGINE_API, TRANSLATE_LANGUAGE_API, GENERAL_TASK_API, MODEL_NAME } from './ai.constants';

@Injectable()
export class AIService {
  constructor(private logger: LoggerService) {}

  async detectLanguage(detectLanguageDto: DetectLanguageDto) {
    try {
      //Calling the translator API for detecting the language.
      this.logger.info('Inside the Language detection API');
      let response = await axios.post(DETECT_LANGUAGE_API, detectLanguageDto);
      this.logger.info(RESPONSE_RECEIVED);
      return response.data;
    } catch (error) {
      this.logger.error(ERROR_MESSAGE, 'Optional Error Trace');
      throw new HttpException(error.response || 'Language detection service is not running.', error.response?.status || error.status || 500);
    }
  }
  async translateLanguage(translateLanguageDto: TranslateLanguageDto) {
    try {
      //Calling the translator API for translating the language.
      this.logger.info('Inside the Language translation API');
      let response = await axios.post(TRANSLATE_LANGUAGE_API, translateLanguageDto);
      this.logger.info(RESPONSE_RECEIVED);
      return response.data;
    } catch (error) {
      this.logger.error(ERROR_MESSAGE, 'Optional error trace');
      throw new HttpException(error.response || 'Language translation service is not running.', error.response?.status || error.status || 500);
    }
  }
  async checkIntent(checkIntentDto: CheckIntentDto) {
    try {
      //Calling the intent classifier API for checking the intent.
      this.logger.info('Inside the intent classification API');

      let response = await axios.post(INTENT_CLASSIFIER_API, checkIntentDto);
      this.logger.info(RESPONSE_RECEIVED);
      return response.data;
    } catch (error) {
      this.logger.error(ERROR_MESSAGE, 'Optional error trace');
      throw new HttpException(error.response || 'Intent Classification service is not running', error.response?.status || error.status || 500);
    }
  }
  async getAIResponse(getAIResponseDto: GetAIResponseDto) {
    try {
      //Calling the mistralAI API
      this.logger.info('Inside the Mistral conversational API');

      const promptPayload = {
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: 'I am Helpful AI Bank Assitant and can help with various task and information'
          },
          {
            role: 'user',
            content: getAIResponseDto.userprompt
          }
        ],
        stream: false
      };

      let response = await axios.post(GENERAL_TASK_API, promptPayload);

      this.logger.info(RESPONSE_RECEIVED);
      return response.data.message.content;
    } catch (error) {
      this.logger.error(ERROR_MESSAGE, 'Optional error trace');
      throw new HttpException(error.response || 'AI-Service not running', error.response?.status || error.status || 500);
    }
  }

  async ruleEngine(ruleEngineDto: RuleEngineDto) {
    try {
      //Calling the intent classifier API for checking the intent.
      this.logger.info('Inside the rule engine API');

      let response = await axios.post(RULE_ENGINE_API, ruleEngineDto);
      this.logger.info(RESPONSE_RECEIVED);
      return response.data;
    } catch (error) {
      this.logger.error(ERROR_MESSAGE, 'Optional error trace');
      throw new HttpException(error.response || 'Rule Engine service is not running', error.response?.status || error.status || 500);
    }
  }
}
