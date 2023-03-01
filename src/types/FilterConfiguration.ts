import { SelectQueryBuilder } from "typeorm";

export type FilterConfiguration<T> = {
  filterableColumns?: string[];
  sortableColumns?: string[];
  searchableColumns?: string[];
  customFieldFilter?: {
    [fieldName: string]: (queryBuilder: SelectQueryBuilder<T>, fielterValue: any, tableAlias?: string) => void;
  };
  modify?: (queryBuilder: SelectQueryBuilder<T>, tableAlias?: string) => void;
  paginate?: boolean;
  ignoreException?: boolean;
};
