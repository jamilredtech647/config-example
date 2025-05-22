// src/kafka/kafka.producer.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaProducerConfig } from './kafka.producer.config';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private producer;

  constructor(private readonly kafkaConfig: KafkaProducerConfig) {}

  async onModuleInit() {
    this.producer = await this.kafkaConfig.connect();
  }

  async onModuleDestroy() {
    await this.kafkaConfig.disconnect();
  }

  async produceMessage(topic: string, message: any) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });
      console.log(`Message sent to topic "${topic}" successfully`);
    } catch (error) {
      console.error('Error producing message:', error);
      throw error;
    }
  }
}