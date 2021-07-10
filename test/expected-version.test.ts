import {
    AppendExpectedRevision,
    END,
    EventStoreDBClient,
    jsonEvent,
    FORWARDS,
    START,
    JSONEventType,
    NO_STREAM,
    BACKWARDS,
} from '@eventstore/db-client';

type userCreatedEventType = JSONEventType<'user-created', { name: string }>;
type userUpdatedEventType = JSONEventType<'user-updated', { name: string }>;

const client = new EventStoreDBClient(
    { endpoint: 'localhost:2113' },
    { insecure: true },
);

describe('expected version', () => {
    it.skip('create user no stream', async () => {
        const streamName = 'user-123';
        const event = jsonEvent({
            type: 'user-created',
            data: {
                name: 'Beata',
            },
        });
        const result = await client.appendToStream(streamName, event, {
            expectedRevision: NO_STREAM,
        });
        console.log('result', result);
    });

    it.skip('read user', async () => {
        const events = await client.readStream<userCreatedEventType>('user-123', {});
    });

    it.skip('update user expect next revision', async () => {
        const streamName = 'user-123';

        const events = await client.readStream<userCreatedEventType>('user-123', {
            maxCount: 1,
            fromRevision: END,
            direction: BACKWARDS,
        });
        const lastRevision = events[0].event?.revision;

        const event = jsonEvent<userUpdatedEventType>({
            type: 'user-updated',
            data: {
                name: 'Beata' + ~~(Math.random() * 1000),
            },
        });
        const result = await client.appendToStream(streamName, event, {
            expectedRevision: lastRevision,
        });
    });
});
