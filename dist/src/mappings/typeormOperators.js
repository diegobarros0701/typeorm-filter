"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeormMappingOperators = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../enums");
exports.typeormMappingOperators = {
    [enums_1.FilterOperator.BETWEEN]: typeorm_1.Between,
    [enums_1.FilterOperator.CONTAINS]: typeorm_1.ILike,
    [enums_1.FilterOperator.STARTS_WITH]: typeorm_1.ILike,
    [enums_1.FilterOperator.ENDS_WITH]: typeorm_1.ILike,
    [enums_1.FilterOperator.IN]: typeorm_1.In,
    [enums_1.FilterOperator.EQUALS]: typeorm_1.Equal,
    [enums_1.FilterOperator.GT]: typeorm_1.MoreThan,
    [enums_1.FilterOperator.GTE]: typeorm_1.MoreThanOrEqual,
    [enums_1.FilterOperator.LT]: typeorm_1.LessThan,
    [enums_1.FilterOperator.LTE]: typeorm_1.LessThanOrEqual,
    [enums_1.FilterOperator.IS_NULL]: typeorm_1.IsNull,
};
