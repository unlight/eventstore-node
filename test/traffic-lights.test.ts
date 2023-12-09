import {
  EventStoreDBClient,
  jsonEvent,
  FORWARDS,
  START,
  JSONEventType,
} from '@eventstore/db-client';
import { typeid, TypeID } from 'typeid-js';
import expect from 'expect';

const client = new EventStoreDBClient(
  {
    endpoint: 'localhost:2113',
  },
  { insecure: true },
);

describe('traffic lights', (): void => {
  it('smoke', () => {
    expect(1).toEqual(1);
    const uuid = typeid('green').toUUID();
    const type = TypeID.fromUUID('green', uuid);
  });

  it('cycle', async () => {
    const stream = typeid('stoplight').toString();
    const events = [
      jsonEvent({
        id: typeid('yellow').toUUID(),
        type: 'Yellow',
        data: {},
      }),
      jsonEvent({
        id: typeid('green').toUUID(),
        type: 'Green',
        data: {},
      }),
      jsonEvent({
        id: typeid('red').toUUID(),
        type: 'red',
        data: {},
      }),
    ];
    await client.appendToStream(stream, events);
  });
});
