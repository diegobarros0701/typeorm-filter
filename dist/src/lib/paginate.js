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
exports.paginate = void 0;
function paginate(queryBuilder, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = (config === null || config === void 0 ? void 0 : config.page) || 1;
        let limit = (config === null || config === void 0 ? void 0 : config.limit) || (config === null || config === void 0 ? void 0 : config.defaultLimit) || 10;
        if ((config === null || config === void 0 ? void 0 : config.defaultLimit) && limit > config.defaultLimit) {
            limit = config.defaultLimit;
        }
        if (limit && (config === null || config === void 0 ? void 0 : config.maxLimit) && limit > (config === null || config === void 0 ? void 0 : config.maxLimit)) {
            limit = config.maxLimit;
        }
        let result = [];
        if (config === null || config === void 0 ? void 0 : config.raw) {
            const resultCount = yield queryBuilder.getCount();
            const resultData = yield queryBuilder
                .limit(limit)
                .offset((page - 1) * limit)
                .getRawMany();
            result = [resultData, resultCount];
        }
        else {
            result = yield queryBuilder
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
    });
}
exports.paginate = paginate;
