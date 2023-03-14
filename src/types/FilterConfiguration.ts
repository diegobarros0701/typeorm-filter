import { SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";

export interface FilterConfiguration<T> {
  filterableColumns?: string[];
  sortableColumns?: string[];
  searchableColumns?: string[];
  customFieldFilter?: {
    [fieldName: string]: (queryBuilder: WhereExpressionBuilder, fielterValue: any, tableAlias?: string) => void;
  };
  modify?: (queryBuilder: SelectQueryBuilder<T>, tableAlias?: string) => void;
  paginate?: boolean;
  ignoreException?: boolean;
}
