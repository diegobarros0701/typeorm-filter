import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { FilterOperator } from "../enums";
import { FilterQuery, FilterQueryFilter } from "../types";
import { Builder } from "./Builder";

export class WhereBuilder<T> extends Builder<T> {
  build({ filters: filters }: FilterQuery<T>) {
    this.buildConditionsFromFilter(filters, this.queryBuilder);
  }

  private buildConditionsFromFilter(
    filters: FilterQueryFilter<any>,
    queryBuilder: WhereExpressionBuilder,
    { filterWith }: { filterWith?: string } = { filterWith: null }
  ) {
    queryBuilder.andWhere(
      new Brackets((qb) => {
        for (const filter of filters) {
          qb[!filterWith || filterWith === "AND" ? "andWhere" : "orWhere"](
            new Brackets((qb2) => {
              for (const filterKey in filter) {
                if (["AND", "OR"].includes(filterKey) && Array.isArray(filter[filterKey])) {
                  this.buildConditionsFromFilter(filter[filterKey], qb2, { filterWith: filterKey });
                } else {
                  const fieldName = filterKey;
                  const fieldOperators = filter[fieldName];

                  if (!this.canFilterField(fieldName)) {
                    continue;
                  }

                  qb2.andWhere(
                    new Brackets((qb3) => {
                      this.buildFieldConditionsFromFilter(qb3, fieldName, fieldOperators);
                    })
                  );
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
    { negate, filterWith }: { negate?: boolean; filterWith?: "OR" | "AND" } = { negate: false, filterWith: null }
  ) {
    if (this.configuration.customFieldFilter?.[fieldName]) {
      if (filterWith === "OR") {
        qb.orWhere(
          new Brackets((qbInner) => {
            this.configuration.customFieldFilter[fieldName](qbInner, fieldFilters, this.queryBuilder.expressionMap.mainAlias.name);
          })
        );
      } else {
        qb.andWhere(
          new Brackets((qbInner) => {
            this.configuration.customFieldFilter[fieldName](qbInner, fieldFilters, this.queryBuilder.expressionMap.mainAlias.name);
          })
        );
      }

      return;
    }

    // console.log({ fieldFilters });

    for (const fieldFilter in fieldFilters) {
      if (fieldFilter === "OR") {
        qb.andWhere(
          new Brackets((qb2) => {
            this.buildFieldConditionsFromFilter(qb2, fieldName, fieldFilters[fieldFilter], { negate, filterWith: fieldFilter });
          })
        );
      } else if (fieldFilter === "NOT") {
        qb.andWhere(
          new Brackets((qb2) => {
            this.buildFieldConditionsFromFilter(qb2, fieldName, fieldFilters[fieldFilter], { negate: true });
          })
        );
      } else {
        qb[filterWith === "OR" ? "orWhere" : "andWhere"](
          this.buildWhereCondition(fieldName, { negate, operator: FilterOperator[fieldFilter.toUpperCase()] }, fieldFilters[fieldFilter])
        );
      }
    }
  }

  private canFilterField(fieldName: string) {
    return !this.configuration?.filterableColumns?.length || this.configuration.filterableColumns.includes(fieldName);
  }
}
