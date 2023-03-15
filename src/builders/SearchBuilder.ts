import { Brackets } from "typeorm";
import { FilterOperator } from "../enums";
import { FilterQuery } from "../types";
import { Builder } from "./Builder";

export class SearchBuilder<T> extends Builder<T> {
  build({ search }: FilterQuery<T>) {
    const { searchableColumns } = this.configuration;

    if (search?.fields?.length) {
      this.queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const field of search.fields) {
            const fullFieldName = !field.includes(".") ? `${this.queryBuilder.expressionMap.mainAlias.name}.${field}` : field;

            if (searchableColumns && !searchableColumns.includes(fullFieldName)) {
              continue;
            }

            qb.orWhere(this.buildWhereCondition(field, { operator: FilterOperator.CONTAINS, negate: false }, search.term));
          }
        })
      );
    }
  }
}
