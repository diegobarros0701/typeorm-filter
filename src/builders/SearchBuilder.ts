import { Brackets } from "typeorm";
import { FilterOperator } from "../enums";
import { FilterQuery } from "../types";
import { Builder } from "./Builder";

export class SearchBuilder<T> extends Builder<T> {
  build({ s, searchColumns }: FilterQuery<T>) {
    const { searchableColumns } = this.configuration;

    if (s && searchColumns?.length) {
      this.queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const searchColumn of searchColumns) {
            if (searchableColumns?.length && !searchableColumns.includes(searchColumn)) {
              continue;
            }

            qb.orWhere(this.buildWhereCondition(searchColumn, { operator: FilterOperator.CONTAINS, negate: false }, `%${s}%`));
          }
        })
      );
    }
  }
}
