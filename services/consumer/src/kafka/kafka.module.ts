// src/kafka/kafka.module.ts
import { Module } from '@nestjs/common';
import { KafkaConsumerConfig } from './kafka.consumer.config';
import { KafkaConsumerService } from './kafka.consumer.service';

@Module({
  providers: [KafkaConsumerConfig, KafkaConsumerService],
  exports: [KafkaConsumerService],
})
export class KafkaModule {}