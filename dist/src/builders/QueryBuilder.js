"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const Builder_1 = require("./Builder");
const RelationBuilder_1 = require("./RelationBuilder");
const SelectBuilder_1 = require("./SelectBuilder");
const SortBuilder_1 = require("./SortBuilder");
const WhereBuilder_1 = require("./WhereBuilder");
const ModifyQueryBuilder_1 = require("./ModifyQueryBuilder");
const SearchBuilder_1 = require("./SearchBuilder");
class QueryBuilder extends Builder_1.Builder {
    build(filterQuery) {
        const buildersClasses = [ModifyQueryBuilder_1.ModifyQueryBuilder, SelectBuilder_1.SelectBuilder, SortBuilder_1.SortBuilder, WhereBuilder_1.WhereBuilder, RelationBuilder_1.RelationBuilder, SearchBuilder_1.SearchBuilder];
        buildersClasses.forEach((builderClass) => {
            new builderClass(this.queryBuilder, this.configuration).updateQueryBuilderMapper().build(Object.assign({
                page: 1,
                limit: undefined,
                search: undefined,
                filters: [],
                relations: [],
                order: [],
                select: [],
            }, filterQuery));
        });
        return this.queryBuilder;
    }
}
exports.QueryBuilder = QueryBuilder;
