import { Subjects } from './subjects';
import { Stan } from 'node-nats-streaming';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];

  constructor(protected client: Stan) {}

  public publish(data: T['data']) {
    return new Promise<void>((resolve, reject) => {
      console.log('Publisher connected to NATS.');

      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}
