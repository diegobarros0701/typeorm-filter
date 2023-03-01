import { Builder } from "./Builder";
import { RelationBuilder } from "./RelationBuilder";
import { SelectBuilder } from "./SelectBuilder";
import { SortBuilder } from "./SortBuilder";
import { WhereBuilder } from "./WhereBuilder";
import { CustomFieldWhereBuilder } from "./CustomFieldWhereBuilder";
import { ModifyQueryBuilder } from "./ModifyQueryBuilder";
import { SearchBuilder } from "./SearchBuilder";
import { FilterQuery } from "../types";

export class QueryBuilder<T> extends Builder<T> {
  build(filterQuery: FilterQuery<T>) {
    const buildersClasses: Array<typeof Builder> = [
      ModifyQueryBuilder,
      CustomFieldWhereBuilder,
      SelectBuilder,
      SortBuilder,
      WhereBuilder,
      RelationBuilder,
      SearchBuilder,
    ];

    buildersClasses.forEach((builderClass) => {
      new builderClass(this.queryBuilder, this.configuration).updateQueryBuilderMapper().build(
        Object.assign<FilterQuery<T>, {}>(
          {
            page: 1,
            limit: undefined,
            s: undefined,
            filter: [],
            relations: [],
            order: [],
            select: [],
            searchColumns: [],
          },
          filterQuery
        )
      );
    });

    return this.queryBuilder;
  }
}
