type ClassValue = string | number | boolean | null | undefined;

type ClassValueOrArray = ClassValue | ClassValueOrArray[] | Record<string, boolean>;

export const classNames = (...values: ClassValueOrArray[]): string => {
  const result: string[] = [];

  const appendValue = (value: ClassValueOrArray) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach(appendValue);
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, enabled]) => {
        if (enabled) result.push(key);
      });
      return;
    }

    result.push(String(value));
  };

  values.forEach(appendValue);
  return result.join(' ');
};
