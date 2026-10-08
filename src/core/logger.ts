import { Logger } from '../types';

const loggers: Map<string, Logger> = new Map();

/**
 * Get or create a logger instance by name
 * Uses singleton pattern - one logger per name
 * @param name Logger name (default: "automation")
 * @returns Logger instance
 */
export function getLogger(name: string = 'automation'): Logger {
  if (loggers.has(name)) {
    return loggers.get(name)!;
  }

  const logger: Logger = {
    info: (message: string): void => {
      console.log(`${new Date().toISOString()} | INFO | ${name} | ${message}`);
    },
    warn: (message: string): void => {
      console.warn(`${new Date().toISOString()} | WARN | ${name} | ${message}`);
    },
    error: (message: string): void => {
      console.error(`${new Date().toISOString()} | ERROR | ${name} | ${message}`);
    },
  };

  loggers.set(name, logger);
  return logger;
}

export { Logger };
