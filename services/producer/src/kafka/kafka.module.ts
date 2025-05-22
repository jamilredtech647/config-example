// src/kafka/kafka.module.ts
import { Module } from '@nestjs/common';
import { KafkaProducerConfig } from './kafka.producer.config';
import { KafkaProducerService } from './kafka.producer.service';

@Module({
  providers: [KafkaProducerConfig, KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}