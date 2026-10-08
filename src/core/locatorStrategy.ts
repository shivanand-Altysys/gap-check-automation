import { LocatorStrategy } from '../types';

/**
 * Re-export LocatorStrategy enum for direct usage
 */
export { LocatorStrategy };

/**
 * Type-safe locator strategy type
 */
export type LocatorStrategyType = typeof LocatorStrategy[keyof typeof LocatorStrategy];
