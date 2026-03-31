import { Module } from '@nestjs/common';
import { EVENT_PUBLISHER } from './tokens';

const eventStore = { lastEvent: null as any };

@Module({
  providers: [
    {
      provide: EVENT_PUBLISHER,
      useValue: {
        publish: (event: string, payload: any) => {
          const eventData = {
            event,
            payload,
            timestamp: new Date().toISOString(),
          };
          eventStore.lastEvent = eventData;
          console.log(`[CORE EVENT] ${event}`, payload);
        },
      },
    },
    {
      provide: 'EVENT_STORE',
      useValue: eventStore,
    },
  ],
  exports: [EVENT_PUBLISHER, 'EVENT_STORE'],
})
export class CoreModule {}
