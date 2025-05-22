// src/kafka/kafka.consumer.config.ts
import { Kafka, Consumer, ConsumerConfig } from 'kafkajs';

export class KafkaConsumerConfig {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      brokers: ['localhost:9093'], // Match your producer config
      clientId: 'nestjs-consumer', // Unique for consumer
    });

    const consumerConfig: ConsumerConfig = {
      groupId: 'nestjs-consumer-group', // Important for consumer groups
      allowAutoTopicCreation: true, // Optional
    };

    this.consumer = this.kafka.consumer(consumerConfig);
  }

  async connect() {
    await this.consumer.connect();
    return this.consumer;
  }

  async disconnect() {
    await this.consumer.disconnect();
  }

  getConsumer() {
    return this.consumer;
  }
}