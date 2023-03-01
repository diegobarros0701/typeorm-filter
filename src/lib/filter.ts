import { Repository, SelectQueryBuilder } from "typeorm";
import { FilterConfiguration } from "../types/FilterConfiguration";
import { paginate } from "./paginate";
import { QueryBuilder } from "../builders/QueryBuilder";
import { PaginationConfiguration } from "../types/PaginationConfiguration";
import { FilterQuery } from "../types";

export async function filter<T>(
  repositoryOrQueryBuilder: SelectQueryBuilder<T> | Repository<T>,
  query: FilterQuery<T> = {},
  configuration: FilterConfiguration<T> & {
    paginationSettings?: PaginationConfiguration;
  } = {}
): Promise<any> {
  configuration.paginate = !(configuration.paginate === false);
  configuration.ignoreException = !(configuration.ignoreException === false);

  if (repositoryOrQueryBuilder instanceof Repository) {
    repositoryOrQueryBuilder = repositoryOrQueryBuilder.createQueryBuilder("base");
  }

  query.filter = query.filter ?? [];
  query.page = query.page ?? undefined;
  query.limit = query.limit ?? undefined;
  query.relations = query.relations ?? [];
  query.order = query.order ?? [];
  query.select = query.select ?? [];
  query.s = query.s ?? undefined;

  try {
    const qb = new QueryBuilder(repositoryOrQueryBuilder, configuration);
    const modifiedQueryBuilder = qb.build(query);

    if (configuration.paginate) {
      return await paginate(modifiedQueryBuilder, {
        page: query.page,
        limit: query.limit,
        ...configuration.paginationSettings,
      });
    } else {
      return await modifiedQueryBuilder.getMany().then((r) => ({ data: r, meta: { pagination: null } }));
    }
  } catch (err) {
    if (!configuration.ignoreException) {
      throw err;
    }

    console.error(err);

    return configuration.paginate
      ? {
          data: [],
          meta: {
            error: err.message,
            pagination: {
              page: 0,
              perPage: 0,
              total: 0,
              pages: 0,
            },
          },
        }
      : {
          data: [],
          meta: {
            error: err.message,
            pagination: null,
          },
        };
  }
}
