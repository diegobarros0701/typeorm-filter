"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringHelper = void 0;
class StringHelper {
    static split(text, pattern) {
        return text.split(pattern).map((v) => v.trim());
    }
}
exports.StringHelper = StringHelper;
