import { FilterOperator } from "../enums/FilterOperator";

export type FieldFilter<T> =
  | {
      [k in keyof T]?:
        | {
            [key in FilterOperator]?: any;
          }
        | { $or: { [key in FilterOperator]?: any } | { not: { [key in Exclude<FilterOperator, "not" | "$or">]?: any } } };
    }
  | {
      [k in keyof T]?: {
        not: { [key in Exclude<FilterOperator, "not">]?: any } | { $or: { [key in Exclude<FilterOperator, "not">]?: any } };
      };
    };

export type FilterQueryFilter<T> = Array<{ $and: FilterQueryFilter<T> } | { $or: FilterQueryFilter<T> } | FieldFilter<T>>;

export type FilterQuery<T> = {
  page?: number;
  limit?: number;
  filter?: FilterQueryFilter<T>;
  relations?: string[];
  order?: string[];
  select?: string[];
  s?: string;
  searchColumns?: string[];
};
