import { Brackets } from 'typeorm';
import { FilterOperator } from '../enums';
import { FilterQuery } from '../types';
import { Builder } from './Builder';

export class SearchBuilder<T> extends Builder<T> {
  build({ s }: FilterQuery<T>) {
    const { searchableColumns } = this.configuration;

    if (s && this.configuration.searchableColumns?.length) {
      this.queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const searchColumn of searchableColumns) {
            if (!searchableColumns.includes(searchColumn)) {
              continue;
            }

            qb.orWhere(this.buildWhereCondition(searchColumn, { operator: FilterOperator.CONTAINS, negate: false }, `%${s}%`));
          }
        })
      );
    }
  }
}
