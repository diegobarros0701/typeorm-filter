// import { ParserHelper } from "../helpers/ParserHelper";
// import { FilterQuery } from "../types";
// import { Builder } from "./Builder";
// export class CustomFieldWhereBuilder<T> extends Builder<T> {
//   build({ filter }: FilterQuery<T>) {
//     if (!filter || !this.configuration.customFieldFilter) return;
//     const { customFieldFilter } = this.configuration;
//     for (const fieldName in filter) {
//       if (!customFieldFilter[fieldName] || !filter[fieldName]) {
//         continue;
//       }
//       customFieldFilter[fieldName](this.queryBuilder, ParserHelper.try(filter[fieldName]), this.queryBuilder.alias);
//     }
//   }
// }
