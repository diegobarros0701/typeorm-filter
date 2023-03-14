import { FilterOperator } from "../enums/FilterOperator";
import { FilterConfiguration } from "./FilterConfiguration";

export type FieldFilter<T> =
  | {
      [k in keyof T]?:
        | {
            [key in FilterOperator]?: any;
          }
        | { OR: { [key in FilterOperator]?: any } | { not: { [key in Exclude<FilterOperator, "not" | "OR">]?: any } } };
    }
  | {
      [k in keyof T]?: {
        not: { [key in Exclude<FilterOperator, "not">]?: any } | { OR: { [key in Exclude<FilterOperator, "not">]?: any } };
      };
    }
  | { [k: string]: any };

export type FilterQueryFilter<T> = Array<{ AND: FilterQueryFilter<T> } | { OR: FilterQueryFilter<T> } | FieldFilter<T>>;

export type FilterQuery<T> = {
  page?: number;
  limit?: number;
  filters?: FilterQueryFilter<T>;
  relations?: string[];
  order?: string[];
  select?: string[];
  search?: {
    term: string;
    fields?: string[];
  };
};
