import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  // // you need to put in a group for listeners.  That way, if you
  // // have more than one, they do not all get the events, it is spread out
  abstract queueGroupName: string;
  protected ackWait = 5000;

  constructor(protected client: Stan) {}

  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        // sets so that we get all messages ever created delivered
        // need durable name (next) and queue group to all work together
        .setDeliverAllAvailable()
        // this option makes it so that you have to acknowledge you received
        // the event.  That way, you do not lose information on the events
        // you have processed.
        .setManualAckMode(true)
        // sets the time nats will continue to reach our service
        .setAckWait(this.ackWait)
        // sets so that nats keeps track of events already processed,
        // so they are not duplicated
        // to work correctly, you need the queue group in the subscription (so
        // it's not relying on just one service.)
        .setDurableName(this.queueGroupName)
    );
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  abstract onMessage(data: T['data'], message: Message): void;

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
