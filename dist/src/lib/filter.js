"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
const typeorm_1 = require("typeorm");
const paginate_1 = require("./paginate");
const QueryBuilder_1 = require("../builders/QueryBuilder");
function filter(repositoryOrQueryBuilder, query = {}, configuration = {}) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        configuration.paginate = !(configuration.paginate === false);
        configuration.ignoreException = !(configuration.ignoreException === false);
        if (repositoryOrQueryBuilder instanceof typeorm_1.Repository || repositoryOrQueryBuilder.constructor.name == "Repository") {
            repositoryOrQueryBuilder = repositoryOrQueryBuilder.createQueryBuilder();
        }
        query.filters = (_a = query.filters) !== null && _a !== void 0 ? _a : [];
        query.page = (_b = query.page) !== null && _b !== void 0 ? _b : undefined;
        query.limit = (_c = query.limit) !== null && _c !== void 0 ? _c : undefined;
        query.relations = (_d = query.relations) !== null && _d !== void 0 ? _d : [];
        query.order = (_e = query.order) !== null && _e !== void 0 ? _e : [];
        query.select = (_f = query.select) !== null && _f !== void 0 ? _f : [];
        query.search = (_g = query.search) !== null && _g !== void 0 ? _g : undefined;
        try {
            const qb = new QueryBuilder_1.QueryBuilder(repositoryOrQueryBuilder, configuration);
            const modifiedQueryBuilder = qb.build(query);
            if (configuration.paginate) {
                return yield (0, paginate_1.paginate)(modifiedQueryBuilder, Object.assign({ page: query.page, limit: query.limit }, configuration.paginationSettings));
            }
            else {
                return yield modifiedQueryBuilder.getMany().then((r) => ({ data: r, meta: { pagination: null } }));
            }
        }
        catch (err) {
            if (!configuration.ignoreException) {
                throw err;
            }
            console.error(err);
            return {
                data: [],
                meta: {
                    error: err.message,
                    pagination: configuration.paginate
                        ? {
                            page: 0,
                            perPage: 0,
                            total: 0,
                            pages: 0,
                        }
                        : null,
                },
            };
        }
    });
}
exports.filter = filter;
