"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../enums");
const typeormOperators_1 = require("../mappings/typeormOperators");
class Builder {
    constructor(queryBuilder, configuration) {
        this.queryBuilder = queryBuilder;
        this.configuration = configuration !== null && configuration !== void 0 ? configuration : {
            searchableColumns: [],
            filterableColumns: [],
            sortableColumns: [],
            ignoreException: false,
            paginate: false,
            modify: null,
            customFilter: null,
        };
        this.queryBuilderMapper = {
            select: [],
            relationsAliasMapping: {},
            relationsAliasInverseMapping: {},
            relations: [],
            order: {},
        };
    }
    build(filterQuery) {
        throw new Error("Method not implemented.");
    }
    getMappedColumnName(fieldName) {
        var _a, _b;
        const { relationsAliasMapping } = this.queryBuilderMapper;
        const fieldNamePaths = fieldName.split(".");
        let isFieldFromRelation = false;
        if (fieldNamePaths.length > 1 && (relationsAliasMapping === null || relationsAliasMapping === void 0 ? void 0 : relationsAliasMapping[fieldNamePaths[0]])) {
            isFieldFromRelation = true;
            return isFieldFromRelation ? fieldName.replace(fieldNamePaths[0], relationsAliasMapping[fieldNamePaths[0]]) : fieldName;
        }
        else if (!(relationsAliasMapping === null || relationsAliasMapping === void 0 ? void 0 : relationsAliasMapping[fieldNamePaths[0]])) {
            return `${(_b = (_a = this.queryBuilder.expressionMap) === null || _a === void 0 ? void 0 : _a.mainAlias) === null || _b === void 0 ? void 0 : _b.name}.${fieldNamePaths[fieldNamePaths.length - 1]}`;
        }
    }
    updateQueryBuilderMapper() {
        this.queryBuilder.expressionMap.joinAttributes.map((j) => {
            this.queryBuilderMapper.relationsAliasMapping[j.relation.propertyName] = j.alias.name;
            this.queryBuilderMapper.relationsAliasInverseMapping[j.alias.name] = j.relation.propertyName;
            this.queryBuilderMapper.relations.push(j.relation.propertyName);
        });
        this.queryBuilderMapper.order = this.queryBuilder.expressionMap.allOrderBys;
        this.queryBuilderMapper.select = this.queryBuilder.expressionMap.selects.map((s) => { var _a; return (_a = s.aliasName) !== null && _a !== void 0 ? _a : s.selection; });
        return this;
    }
    buildWhereCondition(columnName, { operator, negate }, ...parameters) {
        switch (operator) {
            case enums_1.FilterOperator.CONTAINS:
                parameters[0] = `%${parameters[0]}%`;
                break;
            case enums_1.FilterOperator.STARTS_WITH:
                parameters[0] = `${parameters[0]}%`;
                break;
            case enums_1.FilterOperator.ENDS_WITH:
                parameters[0] = `%${parameters[0]}`;
                break;
            case enums_1.FilterOperator.CONTAINS:
            case enums_1.FilterOperator.STARTS_WITH:
            case enums_1.FilterOperator.ENDS_WITH:
            case enums_1.FilterOperator.EQUALS:
                break;
        }
        if (!columnName.includes(".")) {
            columnName = `${this.queryBuilder.expressionMap.mainAlias.name}.${columnName}`;
        }
        const typeOrmFindOperator = typeormOperators_1.typeormMappingOperators[operator];
        const wherePredicate = this.queryBuilder["getWherePredicateCondition"](`CAST(${columnName} AS TEXT)`, negate ? (0, typeorm_1.Not)(typeOrmFindOperator(...parameters)) : typeOrmFindOperator(...parameters));
        const whereCondition = this.queryBuilder["createWhereConditionExpression"](wherePredicate);
        return whereCondition;
    }
}
exports.Builder = Builder;
