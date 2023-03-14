"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedFilterQuery = void 0;
const common_1 = require("@nestjs/common");
const parse_filter_query_1 = require("../lib/parse-filter-query");
// import { ArrayHelper } from "../helpers/ArrayHelper";
exports.ParsedFilterQuery = (0, common_1.createParamDecorator)(({ includeHeaders } = {}, ctx) => {
    const request = ctx.switchToHttp().getRequest();
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
    return (0, parse_filter_query_1.parseFilterQuery)({ query: request.query });
});
