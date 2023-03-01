import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { PessoaTeste } from "../../test/entities/PessoaTeste";
import { FilterOperator } from "../enums";
import { FieldFilter, FilterQuery, FilterQueryFilter } from "../types";
import { Builder } from "./Builder";

export class WhereBuilder<T> extends Builder<T> {
  build({ filter: filters }: FilterQuery<T>) {
    this.buildConditionsFromFilter(filters, this.queryBuilder);
  }

  private buildConditionsFromFilter(
    // field: string,
    // fieldOperators: any,
    filters: FilterQueryFilter<any>,
    queryBuilder: WhereExpressionBuilder,
    { filterWith }: { filterWith?: string } = { filterWith: null }
  ) {
    queryBuilder.andWhere(
      new Brackets((qb) => {
        for (const filter of filters) {
          qb[!filterWith || filterWith === "$and" ? "andWhere" : "orWhere"](
            new Brackets((qb2) => {
              for (const filterKey in filter) {
                if (["$and", "$or"].includes(filterKey) && Array.isArray(filter[filterKey])) {
                  this.buildConditionsFromFilter(filter[filterKey], qb2, { filterWith: filterKey });
                } else {
                  const fieldName = filterKey;
                  const fieldOperators = filter[fieldName];

                  if (!this.canFilterField(fieldName)) {
                    continue;
                  }

                  this.buildFieldConditionsFromFilter(qb2, fieldName, fieldOperators);
                }
              }
            })
          );
        }
      })
    );
  }

  private buildFieldConditionsFromFilter(
    qb: WhereExpressionBuilder,
    fieldName: string,
    // fieldFilters: FieldFilter<any>,
    fieldFilters: any,
    { negate, filterWith }: { negate?: boolean; filterWith?: "$or" | "$and" } = { negate: false, filterWith: null }
  ) {
    for (const fieldFilter in fieldFilters) {
      if (fieldFilter === "$or") {
        qb.andWhere(
          new Brackets((qb2) => {
            this.buildFieldConditionsFromFilter(qb2, fieldName, fieldFilters[fieldFilter], { negate, filterWith: fieldFilter });
          })
        );
      } else if (fieldFilter === "not") {
        qb.andWhere(
          new Brackets((qb2) => {
            this.buildFieldConditionsFromFilter(qb2, fieldName, fieldFilters[fieldFilter], { negate: true });
          })
        );
      } else {
        if (filterWith === "$or") {
          qb.orWhere(this.buildWhereCondition(fieldName, { negate, operator: FilterOperator[fieldFilter.toUpperCase()] }, fieldFilters[fieldFilter]));
        } else {
          qb.andWhere(this.buildWhereCondition(fieldName, { negate, operator: FilterOperator[fieldFilter.toUpperCase()] }, fieldFilters[fieldFilter]));
        }
      }
    }
  }

  private canFilterField(fieldName: string) {
    return !this.configuration?.filterableColumns?.length || this.configuration.filterableColumns.includes(fieldName);
  }
}
