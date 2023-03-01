export class StringHelper {
  static split(text: string, pattern: string) {
    return text.split(pattern).map((v) => v.trim());
  }
}
