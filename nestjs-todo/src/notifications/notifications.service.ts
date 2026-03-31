import { Inject, Injectable } from '@nestjs/common';
import { EVENT_PUBLISHER } from 'src/core/tokens';

type EventPublisher = { publish: (event: string, payload: any) => void };

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(EVENT_PUBLISHER)
    private readonly publisher: EventPublisher,
    @Inject('EVENT_STORE')
    private readonly eventStore: any,
  ) {}

  notify(event: string, payload: any) {
    this.publisher.publish(event, payload);
    return { ok: true };
  }

  getLastEvent() {
    return (
      this.eventStore.lastEvent || {
        event: 'none',
        payload: null,
        timestamp: null,
      }
    );
  }
}
