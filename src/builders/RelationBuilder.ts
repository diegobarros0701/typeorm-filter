import { FilterQuery } from "../types";
import { Builder } from "./Builder";

export class RelationBuilder<T> extends Builder<T> {
  build({ relations }: FilterQuery<T>) {
    relations?.forEach((relationName: string) => {
      this.addRelation(relationName);
    });
  }

  private addRelation(relationName: string) {
    const relationPaths = relationName.split(".");
    const { relationsAliasMapping, select } = this.queryBuilderMapper;

    if (relationPaths.length > 2) return this;

    const relationAlias = relationPaths.at(-1);

    if (relationsAliasMapping[relationAlias]) {
      if (!select.includes(relationsAliasMapping[relationAlias])) {
        this.queryBuilder.addSelect(relationsAliasMapping[relationAlias]);
      }

      return this;
    }

    if (relationPaths.length > 1) {
      this.queryBuilder.leftJoinAndSelect(relationName, relationAlias);
    } else {
      this.queryBuilder.leftJoinAndSelect(`${this.queryBuilder.alias}.${relationName}`, relationAlias);
    }

    return this;
  }
}
