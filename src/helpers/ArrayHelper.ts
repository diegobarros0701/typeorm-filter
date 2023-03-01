export class ArrayHelper {
  /**
   * Try to convert an array-like string to array type
   *
   * @param value String on the following format: "[1, 2, 3, ...]"
   * @returns An array containg the values or an empty array if the conversion is not possible
   */
  static convertFromString(value: string): Array<string | number> {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return [];

    try {
      return JSON.parse(value);
    } catch (err) {
      return [];
    }
  }
}
