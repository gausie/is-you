import { getType, ActionType } from 'typesafe-actions';
import * as actions from './actions';

export type Coords = [number, number];

export type Noun = string;

export enum Connector {
  Is,
  And,
  Not,
};

export enum Action {
  Move,
  Push,
  Stop,
  You,
};

export type Entity = { type: 'connector', value: Connector } |
                     { type: 'action', value: Action } |
                     { type: 'noun', value: Noun };

export type Rule = [Noun, Action];

export type Cell = Entity[];
export type Row = Cell[];
export type Grid = Row[];

export enum Move {
  Up,
  Right,
  Down,
  Left,
  Wait,
};

type State = {
  current: Grid,
  stack: Grid[],
};

export { actions };

const man: Entity = {
  type: 'noun',
  value: '🕴️',
};

export const initialState: State = {
  current: [
    [[], [man], [], [] ,[]],
    [[], [], [], [] ,[]],
    [[], [], [], [] ,[]],
    [[], [], [], [] ,[]],
    [[], [], [], [] ,[]],
  ],
  stack: [],
};

function getMove(event: KeyboardEvent) {
  switch (event.key) {
    case 'Up':
    case 'ArrowUp':
      return Move.Up;
    case 'Right':
    case 'ArrowRight':
      return Move.Right
    case 'Down':
    case 'ArrowDown':
      return Move.Down;
    case 'Left':
    case 'ArrowLeft':
      return Move.Left;
    default: return null;
  }
}

export function getTransform(move: Move): Coords {
  switch (move) {
    case Move.Up: return [0, -1];
    case Move.Right: return [1, 0];
    case Move.Down: return [0, 1];
    case Move.Left: return [-1, 0];
    default: return [0, 0];
  }
}

export function applyTransform(a: Coords, b: Coords): Coords {
  return [a[0] + b[0], a[1] + b[1]];
}

function containsConnector(cell: Cell, value: Connector) {
  return cell.some(entity => entity.type === 'connector' && entity.value === value)
}

function containsAction(cell: Cell, value: Action) {
  return cell.some(entity => entity.type === 'action' && entity.value === value)
}

function getRulesFromLine(line: Row) {
  let finishedRules = [];
  let rules = [];
  line.forEach(cell => {
    if (rule.length === 0) 
  });
  return finishedRules;
}

function getRules(grid: Grid) {
  let rules = [];

  grid.forEach(
    (row, y) => row.forEach(
      (cell, x) => {
        if (cell.length == 0) return;

        const rules = [
          ...getRulesFromLine(row.slice(x)),
          ...getRulesFromLine(grid.slice(y).map(r => r[x]))
        ];
      }
    )
  );
}

function applyMove(grid: Grid, move: Move) {
  const rules = getRules(grid);
  console.log(rules);
  return grid;
}

export function reducer(state: State, action: ActionType<typeof actions>) {
  switch (action.type) {
    case getType(actions.keypress): {
      const move = getMove(action.payload);
      if (move === null) return state;
      action.payload.preventDefault();

      return {
        ...state,
        current: applyMove(state.current, move),
        stack: [...state.stack, state.current],
      };
    }
    default: return state;
  }
}
