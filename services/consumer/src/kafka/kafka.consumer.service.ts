// src/kafka/kafka.consumer.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { KafkaConsumerConfig } from './kafka.consumer.config';
import { EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor(private readonly kafkaConfig: KafkaConsumerConfig) {}

  async onModuleInit() {
    await this.startConsumer();
  }

  private async startConsumer() {
    const consumer = await this.kafkaConfig.connect();

    // Subscribe to topics
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: false });
    await consumer.subscribe({ topic: 'user-events', fromBeginning: false });

    // Start consuming
    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        
        // Add null check for message.value
        if (!message.value) {
          this.logger.warn(`Empty message received from ${topic}[${partition}]`);
          return;
        }

        const value = message.value.toString();
        this.logger.log(`[${topic}][${partition}] Received message`);

        try {
          const parsedMessage = JSON.parse(value);
          this.processMessage(topic, parsedMessage);
        } catch (error) {
          this.logger.error(`Error processing message: ${error.message}`);
          // Consider adding dead letter queue logic here
        }
      },
    });
  }

  private processMessage(topic: string, message: any) {
    switch (topic) {
      case 'test-topic':
        this.handleTestEvent(message);
        break;
      case 'user-events':
        this.handleUserEvent(message);
        break;
      default:
        this.logger.warn(`No handler for topic: ${topic}`);
    }
  }

  private handleTestEvent(message: any) {
    this.logger.log(`Test Event: ${JSON.stringify(message)}`);
    // Your test event logic here
  }

  private handleUserEvent(message: any) {
    this.logger.log(`User Event [${message.event}]: ${JSON.stringify(message)}`);
    // Your user event logic here
  }

  async onModuleDestroy() {
    await this.kafkaConfig.disconnect();
  }
}