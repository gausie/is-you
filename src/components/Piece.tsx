import * as React from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from 'rebass';

import { Entity } from '../state';

type Props = {
  entity: Entity,
  size: number,
};

interface PositionProps extends BoxProps {
  x: number,
  y: number,
  size: number,
};

const Position = styled(Box)<PositionProps>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.x * props.size}px;
  top: ${props => props.y * props.size}px;
  font-size: ${props => props.size}px;
  text-align: center;
  overflow: hidden;
`;

export default function Piece({ size, entity }: Props) {
  return (
    <Position
      x={entity.coords[0]}
      y={entity.coords[1]}
      size={size}
    >{entity.type}</Position>
  );
}
