"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyQueryBuilder = void 0;
const Builder_1 = require("./Builder");
class ModifyQueryBuilder extends Builder_1.Builder {
    build({}) {
        var _a, _b;
        (_b = (_a = this.configuration).modify) === null || _b === void 0 ? void 0 : _b.call(_a, this.queryBuilder, this.queryBuilder.expressionMap.mainAlias.name);
    }
}
exports.ModifyQueryBuilder = ModifyQueryBuilder;
