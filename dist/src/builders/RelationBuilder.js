"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationBuilder = void 0;
const Builder_1 = require("./Builder");
class RelationBuilder extends Builder_1.Builder {
    build({ relations }) {
        relations === null || relations === void 0 ? void 0 : relations.forEach((relationName) => {
            this.addRelation(relationName);
        });
    }
    addRelation(relationExpression) {
        const relationPaths = relationExpression.split(".");
        const { relationsAliasMapping, select } = this.queryBuilderMapper;
        if (relationPaths.length > 2)
            return this;
        const relationDefinition = relationExpression.split(":");
        const relationName = relationDefinition[0];
        const relationAlias = relationDefinition.length == 1 ? relationPaths.at(-1) : relationDefinition.at(-1);
        // if (relationsAliasMapping[relationAlias]) {
        //   if (!select.includes(relationsAliasMapping[relationAlias])) {
        //     this.queryBuilder.addSelect(relationsAliasMapping[relationAlias]);
        //   }
        //   return this;
        // }
        if (relationPaths.length > 1) {
            this.queryBuilder.leftJoin(relationName, relationAlias);
        }
        else {
            this.queryBuilder.leftJoin(`${this.queryBuilder.expressionMap.mainAlias.name}.${relationName}`, relationAlias);
        }
        return this;
    }
}
exports.RelationBuilder = RelationBuilder;
