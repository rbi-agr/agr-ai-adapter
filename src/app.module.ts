import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AIModule } from './ai/ai.module';
import { LoggerModule } from './logger/logger.module';
import { DocumentsModule } from './documents/documents.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AIModule,
    LoggerModule,
    DocumentsModule,
    MulterModule.register({
      dest: '../../uploads'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}