import { FilterQuery } from "../types";
import { Builder } from "./Builder";

export class ModifyQueryBuilder<T> extends Builder<T> {
  build({}: FilterQuery<T>) {
    this.configuration.modify?.(this.queryBuilder, this.queryBuilder.expressionMap.mainAlias.name);
  }
}
