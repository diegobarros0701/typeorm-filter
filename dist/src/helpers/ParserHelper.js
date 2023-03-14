"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserHelper = void 0;
class ParserHelper {
    static try(value) {
        try {
            return JSON.parse(value);
        }
        catch (err) {
            return value;
        }
    }
}
exports.ParserHelper = ParserHelper;
