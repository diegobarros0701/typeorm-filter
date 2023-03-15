import { StringHelper } from "../helpers/StringHelper";
import { FilterQuery } from "../types";
import { Builder } from "./Builder";

export class SortBuilder<T> extends Builder<T> {
  build({ order }: FilterQuery<T>) {
    if (!order.length) return;

    const ordersCondition = {};
    for (const orderExpression of order) {
      const orderExpressionParts = StringHelper.split(orderExpression, ":");
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

      ordersCondition[[relationName, fieldName].join(".")] = (orderBy?.toUpperCase() as any) || "ASC";
    }

    this.queryBuilder.orderBy(ordersCondition);
  }

  private canSortField(fieldName: string) {
    const fullFieldName = !fieldName.includes(".") ? `${this.queryBuilder.expressionMap.mainAlias.name}.${fieldName}` : fieldName;

    return !this.configuration?.sortableColumns || this.configuration.sortableColumns.includes(fullFieldName);
  }
}
