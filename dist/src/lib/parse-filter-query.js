"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFilterQuery = void 0;
const ArrayHelper_1 = require("../helpers/ArrayHelper");
function parseFilterQuery({ query }) {
    var _a, _b, _c, _d, _e, _f;
    const page = query.page ? Number(query.page) : undefined;
    const limit = query.limit ? Number(query.limit) : undefined;
    const filter = query.filters || {};
    const order = ArrayHelper_1.ArrayHelper.convertFromString((_b = (_a = query.order) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : ""); // order=["pf.pessoa.nome:desc", "pf.cpf:asc"]
    const select = ArrayHelper_1.ArrayHelper.convertFromString((_d = (_c = query.select) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "");
    const relations = ArrayHelper_1.ArrayHelper.convertFromString((_f = (_e = query.relations) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : "");
    // const s = query.s?.toString()?.trim();
    // const searchColumns = ArrayHelper.convertFromString(query.searchColumns?.toString() ?? "");
    const search = query.search;
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
        search,
        // s,
        // searchColumns,
    };
}
exports.parseFilterQuery = parseFilterQuery;
