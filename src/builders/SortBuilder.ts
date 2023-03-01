import { StringHelper } from '../helpers/StringHelper';
import { FilterQuery } from '../types';
import { Builder } from './Builder';

export class SortBuilder<T> extends Builder<T> {
  build({ order }: FilterQuery<T>) {
    if (!order.length) return;

    const ordersCondition = {};
    for (const fieldToOrder of order) {
      const orderDefinition = StringHelper.split(fieldToOrder, ':');
      let fieldName = orderDefinition[0];
      const fieldOrder = orderDefinition[1];

      const fieldNamePath = fieldName.split('.');

      if (fieldNamePath.length > 1 && this.queryBuilderMapper.relationsAliasMapping[fieldNamePath[0]]) {
        fieldName = fieldName.replace(/^.*\.(.*)/, `${this.queryBuilderMapper.relationsAliasMapping[fieldNamePath[0]]}.$1`);
      }

      if (!this.canSortField(fieldName)) {
        continue;
      }

      ordersCondition[fieldName] = (fieldOrder?.toUpperCase() as any) || 'ASC';
    }

    this.queryBuilder.orderBy(ordersCondition);
  }

  private canSortField(fieldName: string) {
    const fieldNamePath = fieldName.split('.');

    return (
      this.queryBuilderMapper.select.includes(fieldNamePath[0]) &&
      (!this.configuration?.sortableColumns || this.configuration.sortableColumns.includes(fieldName))
    );
  }
}
