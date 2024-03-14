import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AIController],
  providers: [AIService,PrismaService],
})
export class UserModule {}
