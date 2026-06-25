/** Messages already logged, so each warning fires only once per session. */
const warned = new Set<string>();

/**
 * Logs `message` to the console exactly once and only
 * outside production.
 */
export function warnOnce(message: string): void {
  if (typeof process !== 'undefined' && process.env?.['NODE_ENV'] === 'production') return;
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(message);
}
