import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DetectLanguageDto } from './dto/detect-language.dto';
import { LoggerService } from 'src/logger/logger.service';
import { TranslateLanguageDto } from './dto/translate-language.dto';
import { CheckIntentDto } from './dto/check-intent-dto';
import { CheckTransactionDatesDto } from './dto/check-transaction-dates.dto';
import axios from 'axios';

@Injectable()
export class AIService {
  constructor(private logger: LoggerService) {}
  async detectLanguage(detectLanguageDto: DetectLanguageDto) {
    try {
      //Calling the translator API for detecting the language.
      let response = await axios.post('https://rbih-agr.free.beeceptor.com/detectlanguage', detectLanguageDto);
      return response.data;
    } catch (error) {
      this.logger.error('This is an error log message', 'Optional error trace');
      throw new HttpException(error.response || 'Wallet service not running', error.response?.status || error.status || 500);
    }
  }
  async translateLanguage(translateLanguageDto: TranslateLanguageDto) {
    try {
      //Calling the translator API for translating the language.
      let response = await axios.post('https://rbih-agr.free.beeceptor.com/translatelanguage', translateLanguageDto);
      return response.data;
    } catch (error) {
      this.logger.error('This is an error log message', 'Optional error trace');
      throw new HttpException(error.response || 'Wallet service not running', error.response?.status || error.status || 500);
    }
  }
  async checkIntent(checkIntentDto: CheckIntentDto) {
    try {
      //Call the intent classifier API for checking the intent.
      let response = await axios.post('https://rbih-agr.free.beeceptor.com/checkIntent', checkIntentDto);
      return response.data;
    } catch (error) {
      this.logger.error('This is an error log message', 'Optional error trace');
      throw new HttpException(error.response || 'Wallet service not running', error.response?.status || error.status || 500);
    }
  }
  async checkTransactionDates(checkTransactionDatesDto: CheckTransactionDatesDto) {
    try {
      //Call the mistral API for checking the transaction dates.
      let response = await axios.post('https://rbih-agr.free.beeceptor.com/checkTransactionDates', checkTransactionDatesDto);
      return response.data;
    } catch (error) {
      this.logger.error('This is an error log message', 'Optional error trace');
      throw new HttpException(error.response || 'Wallet service not running', error.response?.status || error.status || 500);
    }
  }
}
