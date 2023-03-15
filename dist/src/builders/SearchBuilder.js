"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBuilder = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../enums");
const Builder_1 = require("./Builder");
class SearchBuilder extends Builder_1.Builder {
    build({ search }) {
        var _a;
        const { searchableColumns } = this.configuration;
        if ((_a = search === null || search === void 0 ? void 0 : search.fields) === null || _a === void 0 ? void 0 : _a.length) {
            this.queryBuilder.andWhere(new typeorm_1.Brackets((qb) => {
                for (const field of search.fields) {
                    const fullFieldName = !field.includes(".") ? `${this.queryBuilder.expressionMap.mainAlias.name}.${field}` : field;
                    if (searchableColumns && !searchableColumns.includes(fullFieldName)) {
                        continue;
                    }
                    qb.orWhere(this.buildWhereCondition(field, { operator: enums_1.FilterOperator.CONTAINS, negate: false }, search.term));
                }
            }));
        }
    }
}
exports.SearchBuilder = SearchBuilder;
