import { FilterQuery } from "../types";
import { Builder } from "./Builder";

export class RelationBuilder<T> extends Builder<T> {
  build({ relations }: FilterQuery<T>) {
    relations?.forEach((relationName: string) => {
      this.addRelation(relationName);
    });
  }

  private addRelation(relationExpression: string) {
    const relationPaths = relationExpression.split(".");
    const { relationsAliasMapping, select } = this.queryBuilderMapper;

    if (relationPaths.length > 2) return this;

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
    } else {
      this.queryBuilder.leftJoin(`${this.queryBuilder.expressionMap.mainAlias.name}.${relationName}`, relationAlias);
    }

    return this;
  }
}
