import { FilterQuery } from "../types";
import { Builder } from "./Builder";

export class SelectBuilder<T> extends Builder<T> {
  build({ select }: FilterQuery<T>): void {
    if (!select.length) return;

    const { relationsAliasMapping, relationsAliasInverseMapping } = this.queryBuilderMapper;

    const fieldsToSelect = select.map((fieldName) => {
      if (relationsAliasMapping[fieldName]) {
        return relationsAliasMapping[fieldName];
      }

      if (relationsAliasInverseMapping[fieldName]) {
        return fieldName;
      }

      return fieldName;
      // return fieldName.split(".").length > 1 ? fieldName : `"${this.queryBuilder.expressionMap.mainAlias.name}"."${fieldName}"`;
    });

    this.queryBuilder.addSelect(fieldsToSelect);
  }
}
