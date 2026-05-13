/**
 * Class Name Utility
 * Helper for conditional CSS class composition
 */

export const classNames = (...args: (string | undefined | boolean)[]): string => {
  return args
    .filter((arg): arg is string => typeof arg === 'string' && arg.length > 0)
    .join(' ')
}
