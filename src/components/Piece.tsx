import * as React from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from 'rebass';

interface Props extends BoxProps {
  x: number,
  y: number,
  size: number,
  children?: React.ReactNode,
};

const Piece = styled(Box)<Props>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.x * props.size}px;
  top: ${props => props.y * props.size}px;
  font-size: ${props => props.size}px;
  line-height: ${props => props.size}px;
  text-align: center;
  overflow: hidden;
`;

export default Piece;
