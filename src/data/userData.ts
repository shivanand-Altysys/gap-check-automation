// data/userData.ts

import { UserData } from '../types';

/**
 * Default template for generated users
 */
export const DefaultUserTemplate: Partial<UserData> = {
  password: 'StrongP@ss1',
  groups: ['admin'],
};
