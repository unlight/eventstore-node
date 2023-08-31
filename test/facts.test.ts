import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';

describe.only('facts', () => {
  let client: EventStoreDBClient;
  before(() => {
    client = new EventStoreDBClient(
      {
        endpoint: 'localhost:2113',
      },
      { insecure: true },
    );
  });

  it('test', async () => {
    const streamName = 'booking-123';
    const event = jsonEvent<any>({
      type: 'seat-reserved',
      data: {},
    });
    const appendResult = await client.appendToStream(streamName, event);
  });

  it('test cuid as id fails', async () => {
    const streamName = 'shipment-123';
    const event = jsonEvent<any>({
      id: '123',
      type: 'dummy-type-event',
      data: {},
    });
    try {
      const appendResult = await client.appendToStream(streamName, event);
    } catch {}
  });

  after(async () => {
    await client.dispose();
  });
});
