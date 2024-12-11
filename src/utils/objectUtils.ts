/**
 * Checks if the provided item is an object (excluding arrays).
 *
 * @param {any} item - The item to be checked.
 * @returns {boolean} - Returns true if the item is an object (excluding arrays), otherwise false.
 */
export function isObject(item: any): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep copies and merges multiple objects into a target object.
 * @param {boolean} deepCopy - Whether to perform a deep copy or not.
 * @param {any} target - The target object to modify and return.
 * @param {...any[]} sources - One or more source objects to merge into the target object.
 * @returns {any} The modified target object.
 */
export function extend(deepCopy: boolean, target: any, ...sources: any[]): any {
  for (const source of sources) {
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (deepCopy && isObject(source[key])) {
          target[key] = extend(deepCopy, target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      });
    }
  }
  return target;
}
