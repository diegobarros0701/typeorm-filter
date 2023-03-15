"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortBuilder = void 0;
const StringHelper_1 = require("../helpers/StringHelper");
const Builder_1 = require("./Builder");
class SortBuilder extends Builder_1.Builder {
    build({ order }) {
        if (!order.length)
            return;
        const ordersCondition = {};
        for (const orderExpression of order) {
            const orderExpressionParts = StringHelper_1.StringHelper.split(orderExpression, ":");
            const fieldNameParts = orderExpressionParts[0].split(".");
            let relationName = fieldNameParts.length > 1 ? fieldNameParts[0] : null;
            const fieldName = fieldNameParts.length > 1 ? fieldNameParts[1] : fieldNameParts[0];
            const orderBy = orderExpressionParts[1];
            if (!relationName) {
                relationName = this.queryBuilder.expressionMap.mainAlias.name;
            }
            if (!this.canSortField(fieldName)) {
                continue;
            }
            ordersCondition[[relationName, fieldName].join(".")] = (orderBy === null || orderBy === void 0 ? void 0 : orderBy.toUpperCase()) || "ASC";
        }
        this.queryBuilder.orderBy(ordersCondition);
    }
    canSortField(fieldName) {
        var _a;
        const fullFieldName = !fieldName.includes(".") ? `${this.queryBuilder.expressionMap.mainAlias.name}.${fieldName}` : fieldName;
        return !((_a = this.configuration) === null || _a === void 0 ? void 0 : _a.sortableColumns) || this.configuration.sortableColumns.includes(fullFieldName);
    }
}
exports.SortBuilder = SortBuilder;
