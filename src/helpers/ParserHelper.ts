export class ParserHelper {
  static try<type>(value: any): type {
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  }
}
