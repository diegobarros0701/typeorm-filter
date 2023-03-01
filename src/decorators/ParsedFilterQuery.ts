import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { parseFilterQuery } from "../lib/parse-filter-query";
// import { ArrayHelper } from "../helpers/ArrayHelper";

export const ParsedFilterQuery = createParamDecorator(({ includeHeaders }: { includeHeaders?: string[] } = {}, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();

  // const page = request.query.page ? Number(request.query.page) : undefined;
  // const limit = request.query.limit ? Number(request.query.limit) : undefined;
  // const filter = request.query.filter || {};
  // const order = ArrayHelper.convertFromString(request.query.order?.toString() ?? "");
  // const select = ArrayHelper.convertFromString(request.query.select?.toString() ?? "");
  // const relations = ArrayHelper.convertFromString(request.query.relations?.toString() ?? "");
  // const s = request.query.s?.toString()?.trim();
  // const searchColumns = ArrayHelper.convertFromString(request.query.searchColumns?.toString() ?? "");

  // if (includeHeaders && request.headers) {
  //   includeHeaders.forEach((includeHeader) => {
  //     if (request.headers[includeHeader]) {
  //       filter[includeHeader] = request.headers[includeHeader];
  //     }
  //   });
  // }

  // return {
  //   page,
  //   limit,
  //   filter,
  //   order,
  //   select,
  //   relations,
  //   s,
  //   searchColumns,
  // };

  return parseFilterQuery({ query: request.query });
});
