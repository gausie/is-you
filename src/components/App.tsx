import React from 'react';
import useResizeObserver from 'use-resize-observer';
import { Flex, Box } from 'rebass';

import { actions, reducer, initialState } from '../state';

import Board from './Board';
import Piece from './Piece';

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [boardRef, boardWidth] = useResizeObserver();

  React.useEffect(() => {
    const cb = (e: KeyboardEvent) => dispatch(actions.keypress(e));
    window.addEventListener('keydown', cb);
    return () => window.removeEventListener('keydown', cb);
  });

  const pieceSize = boardWidth / state.width;

  return (
    <Flex justifyContent="center">
      <Box width={1/3}>
        <Board ref={boardRef} ratio={state.height / state.width}>
          {state.current.map(entity => <Piece key={entity.id} size={pieceSize} entity={entity} />)}
        </Board>
      </Box>
    </Flex>
  );
}
