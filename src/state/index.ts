import { getType, ActionType } from 'typesafe-actions';
import * as R from 'ramda';
import * as actions from './actions';

type MapOf<T> = { [key: string]: T };

type Coords = [number, number];

type Noun = ['noun', string];
const noun = (symbol: string): Noun => ['noun', symbol];

type Connector = ['connector', string];
const connector: MapOf<Connector> = {
  Is: ['connector', '='],
  And: ['connector', '&'],
  Not: ['connector', '🚫'],
}

type Action = ['action', string];
const action: MapOf<Action> = {
  Move: ['action', '🚗'],
  Push: ['action', 'push'],
  Stop: ['action', '🛑'],
  You: ['action', '🇺'],
};

type Thing = Action | Noun;
export type Entity = Connector | Thing;

const getDiscr = (ent: Entity) => ent[0];
const getValue = (ent: Entity) => ent[1];
const isAction = (ent: Entity): ent is Action => getDiscr(ent) === 'action';
const isNoun = (ent: Entity): ent is Noun  => getDiscr(ent) === 'noun';
const isThing = (ent: Entity): ent is Thing => isNoun(ent) || isAction(ent);
const isConnector = (ent: Entity): ent is Connector => getDiscr(ent) === 'connector';
const compare = R.curry((a: Entity, b: Entity) => getDiscr(a) === getDiscr(b) && getValue(a) === getValue(b));

type Relationship = boolean;
type Rule = [Thing, Relationship, Thing];
type NestedRule = [Thing[], Relationship, Thing[]];

type Cell = Entity[];
type Row = Cell[];
type Grid = Row[];

enum Move {
  Up,
  Right,
  Down,
  Left,
  Wait,
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

function getTransform(move: Move): Coords {
  switch (move) {
    case Move.Up: return [0, -1];
    case Move.Right: return [1, 0];
    case Move.Down: return [0, 1];
    case Move.Left: return [-1, 0];
    default: return [0, 0];
  }
}

const applyTransform = (a: Coords, b: Coords): Coords => [a[0] + b[0], a[1] + b[1]];

const isEmpty = (cell: Cell) => cell.length === 0;

const flattenRules = (nested: NestedRule[]) => nested.flatMap(
  n => R.xprod(n[0], n[2]).map(R.insert<Thing | boolean>(1, n[1])) as [Thing, boolean, Thing][]
);

function getNestedRulesFromLine(line: Row): NestedRule[] {
  const rules: NestedRule[] = [];

  for (let i = 0; i < line.length; i++) {
    let cell = line[i];
    if (isEmpty(cell)) continue;

    const thing1 = cell.filter(isThing);
    if (isEmpty(thing1)) continue;

    cell = line[++i];
    if (!cell) continue;
    if (!cell.some(compare(connector.Is))) continue;

    do {
      cell = line[++i];
      if (!cell) break;
      let relationship = true;
      if (cell.some(compare(connector.Not))) {
        relationship = false;
        cell = line[++i];
        if (!cell) break;
      }

      const thing2 = cell.filter(isThing);
      if (isEmpty(thing2)) break;
      rules.push([thing1, relationship, thing2])

      cell = line[++i];
      if (!cell) break;
    } while(cell.some(compare(connector.And)));
  }

  return rules;
}

function getRulesFromLine(line: Row): Rule[] {
  return flattenRules(getNestedRulesFromLine(line));
}

function getRules(grid: Grid) {
  const lines = [...grid, ...R.transpose(grid)];
  return lines.flatMap(getRulesFromLine);
}

function applyMove(grid: Grid, move: Move) {
  const rules = getRules(grid);
  console.log(rules);
  return grid;
}

type State = {
  current: Grid,
  stack: Grid[],
};

export const initialState: State = {
  current: [
    [[], [noun('🕴️')], [connector.Is], [action.You] ,[]],
    [[noun('🐈')], [connector.Is], [noun('🐦')], [connector.And] ,[]],
    [[], [connector.Not], [], [] ,[]],
    [[], [action.Move], [], [] ,[]],
    [[noun('🛀')], [connector.Is], [noun('🔪')], [connector.And] ,[noun('🏺')]],
  ],
  stack: [],
};

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

export { actions };
