"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterOperator = void 0;
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["EQUALS"] = "equals";
    FilterOperator["CONTAINS"] = "contains";
    FilterOperator["IN"] = "in";
    FilterOperator["GT"] = "gt";
    FilterOperator["GTE"] = "gte";
    FilterOperator["LT"] = "lt";
    FilterOperator["LTE"] = "lte";
    FilterOperator["BETWEEN"] = "between";
    FilterOperator["NOT"] = "not";
    FilterOperator["IS_NULL"] = "is_null";
    FilterOperator["STARTS_WITH"] = "starts_with";
    FilterOperator["ENDS_WITH"] = "ends_with";
})(FilterOperator = exports.FilterOperator || (exports.FilterOperator = {}));
