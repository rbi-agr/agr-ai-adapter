import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  controllers: [AIController],
  providers: [AIService, LoggerService],
})
export class AIModule {}
