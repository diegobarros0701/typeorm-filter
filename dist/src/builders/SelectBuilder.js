"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectBuilder = void 0;
const Builder_1 = require("./Builder");
class SelectBuilder extends Builder_1.Builder {
    build({ select }) {
        if (!select.length)
            return;
        const { relationsAliasMapping, relationsAliasInverseMapping } = this.queryBuilderMapper;
        const fieldsToSelect = select.map((fieldName) => {
            if (relationsAliasMapping[fieldName]) {
                return relationsAliasMapping[fieldName];
            }
            if (relationsAliasInverseMapping[fieldName]) {
                return fieldName;
            }
            return fieldName;
            // return fieldName.split(".").length > 1 ? fieldName : `"${this.queryBuilder.expressionMap.mainAlias.name}"."${fieldName}"`;
        });
        this.queryBuilder.addSelect(fieldsToSelect);
    }
}
exports.SelectBuilder = SelectBuilder;
