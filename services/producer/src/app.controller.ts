import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaProducerService } from './kafka/kafka.producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kafkaProducer: KafkaProducerService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-message')
  async sendMessageToKafka(
    @Body() body: { topic: string; message: any }
  ) {
    try {
      await this.kafkaProducer.produceMessage(body.topic, body.message);
      return { 
        status: 'success',
        message: `Message sent to Kafka topic ${body.topic}`
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to send message to Kafka',
        error: error.message
      };
    }
  }

  @Get('test-kafka')
  async testKafka() {
    const testMessage = {
      event: 'TEST_EVENT',
      timestamp: new Date().toISOString(),
      data: { foo: 'bar', num: 42 }
    };

    try {
      await this.kafkaProducer.produceMessage('test-topic', testMessage);
      return {
        status: 'success',
        message: 'Test message sent to Kafka',
        data: testMessage
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to send test message',
        error: error.message
      };
    }
  }
}