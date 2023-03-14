import { SelectQueryBuilder } from "typeorm";
import { PaginationConfiguration } from "../types/PaginationConfiguration";

export async function paginate<T>(queryBuilder: SelectQueryBuilder<T>, config?: PaginationConfiguration) {
  const page = config?.page || 1;
  let limit = config?.limit || config?.defaultLimit || 10;

  if (config?.defaultLimit && limit > config.defaultLimit) {
    limit = config.defaultLimit;
  }

  if (limit && config?.maxLimit && limit > config?.maxLimit) {
    limit = config.maxLimit;
  }

  let result = [];
  if (config?.raw) {
    const resultCount = await queryBuilder.getCount();
    const resultData = await queryBuilder
      .limit(limit)
      .offset((page - 1) * limit)
      .getRawMany();

    result = [resultData, resultCount];
  } else {
    result = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
  }

  return {
    data: result[0],
    meta: {
      pagination: {
        page: Number(page),
        perPage: Number(limit),
        total: result[1],
        pages: Math.ceil(result[1] / limit),
      },
    },
  };
}
