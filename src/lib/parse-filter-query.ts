import { ArrayHelper } from "../helpers/ArrayHelper";
import { FilterQuery } from "../types";

export function parseFilterQuery({ query }: { query: FilterQuery<any> }) {
  const page = query.page ? Number(query.page) : undefined;
  const limit = query.limit ? Number(query.limit) : undefined;
  const filter = query.filter || {};
  const order = ArrayHelper.convertFromString(query.order?.toString() ?? ""); // order=["pf.pessoa.nome:desc", "pf.cpf:asc"]
  const select = ArrayHelper.convertFromString(query.select?.toString() ?? "");
  const relations = ArrayHelper.convertFromString(query.relations?.toString() ?? "");
  const s = query.s?.toString()?.trim();
  const searchColumns = ArrayHelper.convertFromString(query.searchColumns?.toString() ?? "");

  //   if (includeHeaders && request.headers) {
  //     includeHeaders.forEach((includeHeader) => {
  //       if (request.headers[includeHeader]) {
  //         filter[includeHeader] = request.headers[includeHeader];
  //       }
  //     });
  //   }

  return {
    page,
    limit,
    filter,
    order,
    select,
    relations,
    s,
    searchColumns,
  };
}
