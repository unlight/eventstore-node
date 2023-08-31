import {
  EventStoreDBClient,
  jsonEvent,
  FORWARDS,
  START,
  JSONEventType,
} from '@eventstore/db-client';
import cuid from 'cuid';

import expect from 'expect';

const client = new EventStoreDBClient(
  {
    endpoint: 'localhost:2113',
  },
  { insecure: true },
);

type PlayerMove = JSONEventType<
  'PlayerMove',
  {
    playerId: number;
    position: number;
  }
>;

describe('tick tack toe', (): void => {
  it('smoke', () => {
    expect(1).toEqual(1);
  });

  it('player 1 wins', async () => {
    const stream = `game-${cuid()}`;
    const events = [
      jsonEvent({
        type: 'PlayerMove',
        data: {
          playerId: 1,
          position: 1,
        },
      }),
      jsonEvent({
        type: 'PlayerMove',
        data: {
          playerId: 2,
          position: 4,
        },
      }),
      jsonEvent({
        type: 'PlayerMove',
        data: {
          playerId: 1,
          position: 2,
        },
      }),
      jsonEvent({
        type: 'PlayerMove',
        data: {
          playerId: 2,
          position: 5,
        },
      }),
      jsonEvent({
        type: 'PlayerMove',
        data: {
          playerId: 1,
          position: 3,
        },
      }),
    ];
    await client.appendToStream(stream, events);

    // Restore state from events
    const game = new Game();
    const streamEvents = client.readStream<PlayerMove>(stream, {
      fromRevision: START,
    });
    for await (const streamEvent of streamEvents) {
      const event = streamEvent.event;
      switch (event?.type) {
        case 'PlayerMove':
          game.move(event.data.playerId, event.data.position);
          break;
      }
    }
  });

  // it('first move to eventstore', async () => {
  //     const event = jsonEvent({
  //         type: 'PlayerMove',
  //         data: {
  //             playerId: 1,
  //             position: 5,
  //         },
  //     });
  //     await client.appendToStream('game-1', event);
  // });

  // it('first move', () => {
  //     const game = new Game();
  //     game.move(1, 5);
  //     game.getState();
  // });
});

class Game {
  private board = new Board();
  private player1 = new Player();
  private player2 = new Player();

  move(playerId: number, position: number) {
    let player: Player;
    switch (playerId) {
      case 1:
        player = this.player1;
        break;
      case 2:
        player = this.player2;
        break;
      default:
        throw new Error();
    }
    this.board.setMark(playerId, position);
  }

  getWinner() {}

  getState() {}
}

class Board {
  private field = [
    new Mark(1),
    new Mark(2),
    new Mark(3),
    new Mark(4),
    new Mark(5),
    new Mark(6),
    new Mark(7),
    new Mark(8),
    new Mark(9),
  ];

  setMark(playerId: number, position: number) {
    const mark = this.field.find(m => m.position === position);
    if (!mark) {
      throw new Error('Invalid position');
    }
    if (mark.isOwned()) {
      throw new Error('Already owned');
    }
    mark.setPlayerId(playerId);
  }
}

class Player {
  constructor() {}
}

class Mark {
  private _playerId: number = -1;
  constructor(readonly position: number) {}

  setPlayerId(playerId: number) {
    this._playerId = playerId;
  }

  getPlayerId() {
    return this._playerId;
  }

  isOwned() {
    return this.getPlayerId() > 0;
  }
}
