import React from 'react';
import useResizeObserver from 'use-resize-observer';
import { Flex, Box } from 'rebass';

import { actions, reducer, initialState } from '../state';

import Board from './Board';
import Piece from './Piece';

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [boardRef, boardWidth] = useResizeObserver();

  const width = state.current[0].length;
  const height = state.current.length;

  React.useEffect(() => {
    const cb = (e: KeyboardEvent) => dispatch(actions.keypress(e));
    window.addEventListener('keydown', cb);
    return () => window.removeEventListener('keydown', cb);
  });

  const pieceSize = boardWidth / width;

  return (
    <Flex justifyContent="center">
      <Box width={1/3}>
        <Board ref={boardRef} ratio={height / width}>
          {state.current.map(
            (row, y) => row.map((cell, x) => cell.map((entity, z) => <Piece key={`${x}.${y}.${z}`} size={pieceSize} x={x} y={y}>{entity[1]}</Piece>))
          )}
        </Board>
      </Box>
    </Flex>
  );
}
