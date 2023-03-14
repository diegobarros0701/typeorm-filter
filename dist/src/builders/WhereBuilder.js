"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhereBuilder = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../enums");
const Builder_1 = require("./Builder");
class WhereBuilder extends Builder_1.Builder {
    build({ filters: filters }) {
        this.buildConditionsFromFilter(filters, this.queryBuilder);
    }
    buildConditionsFromFilter(filters, queryBuilder, { filterWith } = { filterWith: null }) {
        queryBuilder.andWhere(new typeorm_1.Brackets((qb) => {
            for (const filter of filters) {
                qb[!filterWith || filterWith === "AND" ? "andWhere" : "orWhere"](new typeorm_1.Brackets((qb2) => {
                    for (const filterKey in filter) {
                        if (["AND", "OR"].includes(filterKey) && Array.isArray(filter[filterKey])) {
                            this.buildConditionsFromFilter(filter[filterKey], qb2, { filterWith: filterKey });
                        }
                        else {
                            const fieldName = filterKey;
                            const fieldOperators = filter[fieldName];
                            if (!this.canFilterField(fieldName)) {
                                continue;
                            }
                            qb2.andWhere(new typeorm_1.Brackets((qb3) => {
                                this.buildFieldConditionsFromFilter(qb3, fieldName, fieldOperators);
                            }));
                        }
                    }
                }));
            }
        }));
    }
    buildFieldConditionsFromFilter(qb, fieldName, 
    // fieldFilters: FieldFilter<any>,
    fieldFilters, { negate, filterWith } = { negate: false, filterWith: null }) {
        var _a;
        console.log({ fieldFilters });
        if ((_a = this.configuration.customFilter) === null || _a === void 0 ? void 0 : _a[fieldName]) {
            if (filterWith === "OR") {
                qb.orWhere(new typeorm_1.Brackets((qbInner) => {
                    this.configuration.customFilter[fieldName](qbInner, fieldFilters, this.queryBuilder.expressionMap.mainAlias.name);
                }));
            }
            else {
                qb.andWhere(new typeorm_1.Brackets((qbInner) => {
                    this.configuration.customFilter[fieldName](qbInner, fieldFilters, this.queryBuilder.expressionMap.mainAlias.name);
                }));
            }
            return;
        }
        for (const fieldFilter in fieldFilters) {
            if (fieldFilter === "OR") {
                qb.andWhere(new typeorm_1.Brackets((qb2) => {
                    this.buildFieldConditionsFromFilter(qb2, fieldName, fieldFilters[fieldFilter], { negate, filterWith: fieldFilter });
                }));
            }
            else if (fieldFilter === "NOT") {
                qb.andWhere(new typeorm_1.Brackets((qb2) => {
                    this.buildFieldConditionsFromFilter(qb2, fieldName, fieldFilters[fieldFilter], { negate: true });
                }));
            }
            else {
                qb[filterWith === "OR" ? "orWhere" : "andWhere"](this.buildWhereCondition(fieldName, { negate, operator: enums_1.FilterOperator[fieldFilter.toUpperCase()] }, fieldFilters[fieldFilter]));
            }
        }
    }
    canFilterField(fieldName) {
        var _a, _b;
        return !((_b = (_a = this.configuration) === null || _a === void 0 ? void 0 : _a.filterableColumns) === null || _b === void 0 ? void 0 : _b.length) || this.configuration.filterableColumns.includes(fieldName);
    }
}
exports.WhereBuilder = WhereBuilder;
