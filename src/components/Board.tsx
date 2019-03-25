import * as React from 'react';
import styled from 'styled-components';
import { Card, CardProps} from 'rebass';

interface Props extends CardProps {
  ratio: number,
  children?: React.ReactNode,
};

const Board = styled(Card)<Props>`
  padding-top: ${props => props.ratio * 100}%;
  position: relative;
`

Board.defaultProps = {
  border: '1px solid',
  borderColor: 'black',
};

export default Board;
