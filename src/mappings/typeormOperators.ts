import { Between, Equal, ILike, In, IsNull, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual } from "typeorm";
import { FilterOperator } from "../enums";

export const typeormMappingOperators = {
  [FilterOperator.BETWEEN]: Between,
  [FilterOperator.CONTAINS]: ILike,
  [FilterOperator.STARTS_WITH]: ILike,
  [FilterOperator.ENDS_WITH]: ILike,
  [FilterOperator.IN]: In,
  [FilterOperator.EQUALS]: Equal,
  [FilterOperator.GT]: MoreThan,
  [FilterOperator.GTE]: MoreThanOrEqual,
  [FilterOperator.LT]: LessThan,
  [FilterOperator.LTE]: LessThanOrEqual,
  [FilterOperator.IS_NULL]: IsNull,
};
