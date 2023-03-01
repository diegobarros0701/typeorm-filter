import { Not, SelectQueryBuilder } from "typeorm";
import { FilterOperator } from "../enums";
import { typeormMappingOperators } from "../mappings/typeormOperators";
import { FilterQuery } from "../types";
import { FilterConfiguration } from "../types/FilterConfiguration";

export interface IBuilder<T> {
  build(filterQuery: FilterQuery<T>): void;
}

export class Builder<T> implements IBuilder<T> {
  protected queryBuilder: SelectQueryBuilder<T>;
  protected configuration: FilterConfiguration<T>;
  protected queryBuilderMapper: {
    select?: string[];
    relationsAliasMapping?: {
      [k: string]: string;
    };
    relationsAliasInverseMapping?: {
      [k: string]: string;
    };
    relations?: string[];
    order?: {
      [k: string]: "DESC" | "ASC" | { order: "DESC" | "ASC"; nulls?: "NULLS FIRST" | "NULLS LAST" };
    };
  };

  constructor(queryBuilder: SelectQueryBuilder<T>, configuration?: FilterConfiguration<T>) {
    this.queryBuilder = queryBuilder;
    this.configuration = configuration ?? {
      searchableColumns: [],
      filterableColumns: [],
      sortableColumns: [],
      ignoreException: false,
      paginate: false,
      modify: null,
      customFieldFilter: null,
    };
    this.queryBuilderMapper = {
      select: [],
      relationsAliasMapping: {},
      relationsAliasInverseMapping: {},
      relations: [],
      order: {},
    };
  }

  build(filterQuery: FilterQuery<T>): void {
    throw new Error("Method not implemented.");
  }

  protected getMappedColumnName(fieldName: string) {
    const { relationsAliasMapping } = this.queryBuilderMapper;
    const fieldNamePaths = fieldName.split(".");
    let isFieldFromRelation = false;

    if (fieldNamePaths.length > 1 && relationsAliasMapping?.[fieldNamePaths[0]]) {
      isFieldFromRelation = true;

      return isFieldFromRelation ? fieldName.replace(fieldNamePaths[0], relationsAliasMapping[fieldNamePaths[0]]) : fieldName;
    } else if (!relationsAliasMapping?.[fieldNamePaths[0]]) {
      return `${this.queryBuilder.expressionMap?.mainAlias?.name}.${fieldNamePaths[fieldNamePaths.length - 1]}`;
    }
  }

  public updateQueryBuilderMapper() {
    this.queryBuilder.expressionMap.joinAttributes.map((j) => {
      this.queryBuilderMapper.relationsAliasMapping[j.relation.propertyName] = j.alias.name;
      this.queryBuilderMapper.relationsAliasInverseMapping[j.alias.name] = j.relation.propertyName;
      this.queryBuilderMapper.relations.push(j.relation.propertyName);
    });
    this.queryBuilderMapper.order = this.queryBuilder.expressionMap.allOrderBys;
    this.queryBuilderMapper.select = this.queryBuilder.expressionMap.selects.map((s) => s.aliasName ?? s.selection);

    return this;
  }

  protected buildWhereCondition(
    columnName: string,
    { operator, negate }: { operator: FilterOperator; negate?: boolean },
    ...parameters: Array<string | number>
  ) {
    switch (operator) {
      case FilterOperator.CONTAINS:
        parameters[0] = `%${parameters[0]}%`;
        break;
      case FilterOperator.STARTS_WITH:
        parameters[0] = `${parameters[0]}%`;
        break;
      case FilterOperator.ENDS_WITH:
        parameters[0] = `%${parameters[0]}`;
        break;
      case FilterOperator.CONTAINS:
      case FilterOperator.STARTS_WITH:
      case FilterOperator.ENDS_WITH:
      case FilterOperator.EQ:
        // columnName = `CAST(${columnName} AS TEXT)`;
        break;
    }

    const typeOrmFindOperator = typeormMappingOperators[operator];
    const wherePredicate = this.queryBuilder["getWherePredicateCondition"](
      `CAST(${columnName} AS TEXT)`,
      negate ? Not(typeOrmFindOperator(...parameters)) : typeOrmFindOperator(...parameters)
    );
    const whereCondition = this.queryBuilder["createWhereConditionExpression"](wherePredicate);

    return whereCondition;
  }
}
