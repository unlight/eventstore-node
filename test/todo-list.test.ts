import {
  EventStoreDBClient,
  jsonEvent,
  FORWARDS,
  START,
  JSONEventType,
  EventType,
} from '@eventstore/db-client';
import { typeid, TypeID } from 'typeid-js';
import expect from 'expect';

const client = new EventStoreDBClient(
  {
    endpoint: 'localhost:2113',
  },
  { insecure: true },
);

type ItemAdded = JSONEventType<
  'ItemAdded',
  {
    name: string;
  }
>;

type ItemResolved = JSONEventType<'ItemResolved', {}>;

describe('todo list', (): void => {
  it('smoke', () => {
    expect(1).toEqual(1);
  });

  it('add and resolve one item', async () => {
    const stream = typeid('list').toString();
    const events = [
      jsonEvent<ItemAdded>({
        id: typeid('item').toUUID(),
        type: 'ItemAdded',
        data: { name: 'Buy milk' },
      }),
      jsonEvent<ItemResolved>({
        id: typeid('item').toUUID(),
        type: 'ItemResolved',
        data: {},
      }),
    ];
    await client.appendToStream(stream, events);

    const streamIter = client.readStream<ItemAdded | ItemResolved>(stream, {
      fromRevision: START,
      direction: FORWARDS,
    });

    const result = {};

    for await (const { event } of streamIter) {
      if (event?.type === 'ItemAdded') {
        result['name'] = event.data.name;
      } else if (event?.type === 'ItemResolved') {
        result['resolved'] = true;
      }
    }
  });
});
