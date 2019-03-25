import { createStandardAction } from 'typesafe-actions';

export const keypress = createStandardAction('keypress')<KeyboardEvent>();
