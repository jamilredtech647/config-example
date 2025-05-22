// src/kafka/kafka.producer.config.ts
import { Kafka, Producer } from 'kafkajs';

export class KafkaProducerConfig {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      brokers: ['localhost:9093'], // Replace with your Kafka broker(s)
      clientId: 'nestjs-producer',
    });

    this.producer = this.kafka.producer();
  }

  async connect() {
    await this.producer.connect();
    return this.producer;
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}