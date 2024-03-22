import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AIModule } from './ai/ai.module';
import { LoggerModule } from './logger/logger.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AIModule,
    LoggerModule,
    DocumentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}