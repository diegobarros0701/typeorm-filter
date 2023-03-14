# typeorm-filter

The `typeorm-filter` provides

- [Install](#install)
- [How to use](#how-to-use)
- [Methods](#methods)
- [Conditional operators](#conditional-operators)
  - [eq](#eq)
  - [contains](#contains)
  - [in](#in)
  - [gt](#gt)
  - [gte](#gte)
  - [lt](#lt)
  - [lte](#lte)
  - [between](#between)
  - [not](#not)
  - [is_null](#is_null)
  - [is_true](#is_true)
  - [starts_with](#starts_with)
  - [ends_with](#ends_with)
- [Logical operators](#logical-operators)
  - [$and](#and)
  - [$or](#or)
- [Advanced Usage](#advanced-usage)
  - [Multiple filters](#multiple-filters)
  - [Nested logical operators](#nested-logical-operators)
  - [Grouping conditions](#grouping-conditions)
- [Parsing query string](#parsing-query-string)
- [Decorators](#decorators)
  - [NestJS](#nestjs)
- [Why not the find API?](#why-not-the-find-api)

## Install

With npm

```bash
npm install typeorm-filter
```

With yarn

```bash
yarn add typeorm-filter
```

## How to use

```typescript
import { filter } from "src/helpers/typeorm-filter";

const userRepository = getRepository(User);
const users = filter(userRepository, {
  filter: [
    {
      email: {
        starts_with: "admin",
        ends_with: "@gmail.com",
      },
    },
  ],
});
```

The previous filter will map to the following SQL condition:

```sql
WHERE (email ILIKE 'admin%' AND email ILIKE '%gmail.com')
```

You can do as many combinations as you like.

## Methods

### filter&lt;T&gt;(repository, query, configuration)

```typescript
filter(repository, {
	page: 1,
	limit: undefined,
	filter: [],
	relations: [],
	order: [],
	select: [],
	s: undefined,
	searchColumns: []
}, {
	filterableColumns: [],
	sortableColumns: [],
	searchableColumns: [],
	customFieldFilter: {},
	modify: (queryBuilder, tableAlias?:  string) =>  void,
	paginate: true,
	ignoreException: true
})
```

##### query.page

The current page

##### query.limit

The limit per page

##### query.filter

More details [here](#conditional-operators)

##### query.relations

Array containing all the relations to be joined on the main table

##### query.order

Array containing all the fields to be ordered. Possible values are: `field` or `field:asc` or `field:desc`.  
For example: `['firstName: desc', 'lastName:asc', 'createdAt']`

##### query.select

Array containing all the fields that will be added to the response

##### query.s

String to filter the `query.SearchColumns`

##### query.searchColumns

Array containing all the columns that will be filtered with the `query.s`

##### configuration.filterableColumns

Array containing all the columns that can be filtered. When empty, all the columns can be filtered.

##### configuration.sortableColumns

Array containing all the columns that can be sorted. When empty, all the columns can be sorted.

##### configuration.searchableColumns

Array containing all the columns that can be searched with the [`query.s`](#query.s). When empty, all the columns can be sorted.

##### configuration.customFieldFilter

Object containing all custom filters. When this field is found inside the `query.filter` the custom filter specified here will be applied.

##### configuration.modify

Function where you can access the query builder for the specified `repository`.

##### configuration.paginate

Boolean value that defines if the query has to be paginated. Default is true.

##### configuration.ignoreException

Boolean value that defines if the exception (when exists) has to be ignored. For example, if the specified field do not exists, that will throw an exception in the database. Default is true.

#### Complete example

```typescript
// user.model.ts
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isAdmin: boolean;

  @Column()
  createdAt: Date;
}
```

```typescript
// profile.model.ts
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

```typescript
// user-profile.model.ts
export class UserProfile {
  @Column()
  userId: number;

  @Column()
  profileId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Profile)
  profile: Profile;
}
```

```typescript
const userRepository = getRepository(User);

const users = filter<User>(
  repository,
  {
    page: 1,
    limit: 10,
    filter: [{ firstName: { contains: "jo", not: { eq: "John" } } }, { lastName: { not: { eq: "Doe" } } }],
    relations: ["profiles"],
    order: ["firstName:asc", "lastName:desc", "createdAt"],
    select: ["id", "firstName", "profiles.name"],
    s: "john",
    searchColumns: ["firstName"],
  },
  {
    filterableColumns: ["firstName", "lastName", "isAdmin"],
    sortableColumns: ["firstName", "lastName", "createdAt"],
    searchableColumns: ["firstName", "lastName"],
    customFieldFilter: {
      hasProfile: (queryBuilder, filterValue, mainTableAlias) => {
        queryBuilder.where(`${mainTableAlias}.profiles IS NOT NULL`);
      },
    },
    modify: (queryBuilder, mainTableAlias) => {
      queryBuilder.where(`(${mainTableAlias}.firstName || ${mainTableAlias}.lastName) IS NOT NULL`);
    },
    paginate: true,
    ignoreException: true,
  }
);

// {
//   data: [],
//   meta: { pagination: { page: 1, perPage: 10, total: 100, pages: 10 } }
// }
console.log(users);
```

#### query.s and query.filter

If you use both filters, they will be joined with logical operator `AND`. For example:

```typescript
filter(userRepository, {
  s: "john",
  searchColumns: ["firstName", "lastName"],
  filter: [{ email: { eq: "admin@gmail.com" } }, { createdAt: { gte: "2022-08-01" } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE
-- query.s
(firstName ILIKE '%john%' OR lastName ILIKE '%john%')

AND -- LOGICAL OPERATOR JOIN query.s WITH query.filter

-- query.filter
((email = 'admin@gmail.com') AND (createdAt >= '2022-08-01'))
```

#### Filter response

The filter function will return the results with the following structure:

```json
{
  "data": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2022-07-02 13:32:12"
    },
    {
      "firstName": "Mike",
      "lastName": "Tyson",
      "createdAt": "2022-02-01 11:32:12"
    }
  ],
  "meta": {
    "error": null,
    "pagination": {
      "page": 1,
      "perPage": 2,
      "pages": 50,
      "total": 100
    }
  }
}
```

If something goes wrong with the query, the `meta.error` property will contain an string with the error message.

## Conditional operators

- [eq](#eq)
- [contains](#contains)
- [in](#in)
- [gt](#gt)
- [gte](#gte)
- [lt](#lt)
- [lte](#lte)
- [between](#between)
- [not](#not)
- [is_null](#is_null)
- [starts_with](#starts_with)
- [ends_with](#ends_with)

### eq

Example:

```typescript
filter(userRepository, {
  filters: [{ email: { eq: "admin@gmail.com" } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE email = 'admin@gmail.com'
```

### contains

Example:

```typescript
filter(userRepository, {
  filters: [{ email: { contains: "admin" } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE email ILIKE '%admin%'
```

### in

Example:

```typescript
filter(userRepository, {
  filters: [{ email: { in: ["admin@gmail.com", "moderator@gmail.com"] } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE email IN ('admin@gmail.com', 'moderator@gmail.com')
```

### gt

Example:

```typescript
filter(userRepository, {
  filters: [{ created_at: { gt: "2019-08-01" } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE created_at > '2019-08-01'
```

### gte

Example:

```typescript
filter(userRepository, {
  filters: [{ created_at: { gte: "2019-08-01" } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE created_at >= '2019-08-01'
```

### lt

Example:

```typescript
filter(userRepository, {
  filters: [{ created_at: { lt: "2018-08-01" } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE created_at < '2018-08-01'
```

### lte

Example:

```typescript
filter(userRepository, {
  filters: [{ created_at: { lte: "2018-08-01" } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE created_at <= '2018-08-01'
```

### between

Example:

```typescript
filter(userRepository, {
  filters: [{ created_at: { between: ["2018-08-01", "2019-08-01"] } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE created_at BETWEEN '2018-08-01' AND '2019-08-01'
```

### not

Example:

```typescript
filter(userRepository, {
  filters: [{ email: { not: { eq: "user@gmail.com" } } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE email != 'user@gmail.com'
```

### is_null

Example:

```typescript
filter(userRepository, {
  filters: [{ email: { is_null: true } }, { first_name: { is_null: false } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE email IS NULL AND first_name IS NOT NULL
```

### starts_with

Example:

```typescript
filter(userRepository, {
  filters: [{ email: { starts_with: "admin" } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE email ILIKE 'admin%'
```

### ends_with

Example:

```typescript
filter(userRepository, {
  filters: [{ email: { ends_with: "@gmail.com" } }],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE email ILIKE '%@gmail.com'
```

## Logical operators

- [$or](#or)
- [$and](#or)

### $or

Example:

```typescript
filter(userRepository, {
  filters: [
    {
      $or: [{ email: { eq: "admin@gmail.com" } }, { is_admin: { is_true: true } }],
    },
  ],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE (email = 'admin@gmail.com') OR (is_admin IS TRUE)
```

#### Single field

When inside a field, you can use `$or` as an object to apply multiple conditions to the same field.

```typescript
filter(userRepository, {
  filters: [
    {
      email: {
        $or: {
          starts_with: "admin",
          ends_with: "@gmail.com",
        },
      },
    },
  ],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE (email ILIKE 'admin%' OR email ILIKE '%@gmail.com')
```

### $and

Example:

```typescript
filter(userRepository, {
  filters: [
    {
      $and: [{ email: { eq: "admin@gmail.com" } }, { created_at: { gte: "2022-08-01" } }],
    },
  ],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE (email ILIKE '%@gmail.com') AND (email >= '2022-08-01')
```

**Note:** The `AND` is used by `default` when there is multiple conditions, the example is just to illustrate how to use if needed.
In other words, this is the same:

```typescript
filter(userRepository, {
  filters: [{ email: { eq: "admin@gmail.com" } }, { created_at: { gte: "2022-08-01" } }],
});
```

The use case for the `$and` is most suitable for a more [advanced usage](#advanced-usage)

## Advances usage

### Multiple filters

You can apply as many filters as you want:

```typescript
filter(userRepository, [
	filters: [
		{ first_name: { not: { eq: 'John' } } },
		{ first_name: { contains: 'ke' } },
		{ last_name: { not: { eq: 'Doe' } } }
	]
])
```

That will be mapped to the following SQL condition:

```sql
WHERE
	(first_name != 'John')
	AND (first_name ILIKE '%ke%')
	AND (last_name != 'Doe')
```

### Multiple conditions on same field

If you want to apply multiple conditions to the same field, just added more the others conditions on the field object.

```typescript
filter(userRepository, {
  filters: [
    {
      first_name: {
        not: { eq: "John" },
        contains: "ke",
      },
    },
  ],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE (first_name != 'John' AND first_name ILIKE '%ke%')
```

### Nested logical operators

You can nested logical operators as many as you want. Each nested object or array will encapsulated in a new group.

```typescript
await filter(pessoaRepository, {
  filter: [
    {
      $or: [
        {
          $or: [],
          field: {
            $or: { $or: { $or: {} } },
          },
        },
      ],
    },
  ],
});
```

### Grouping conditions

Each array and element of the filter creates a new group.

```typescript
await filter(pessoaRepository, {
  filter: [
    {
      $and: [
        {
          $or: [
            {
              first_name: { starts_with: "di" },
              last_name: { ends_with: "go" },
              age: { $or: { gte: 18, lte: 60 } },
            },
            {
              $or: [{ profile: { eq: "admin" } }, { profile: { eq: "manager" } }],
              is_public_access: { is_true: true },
            },
            {
              profile: { eq: "not required" },
            },
          ],
        },
        {
          status: { eq: "online" },
        },
      ],
      $or: [
        {
          priority: { eq: 1, $or: { lte: 1, gte: 3 } },
        },
        {
          priority: { eq: 2 },
        },
      ],
    },
    {
      first_name: {
        not: {
          eq: "teste",
          $or: {
            starts_with: "p",
            ends_with: "g",
          },
          $or: {
            starts_with: "di",
            ends_with: "go",
            not: {
              eq: "teste",
              $or: {
                starts_with: "10",
                ends_with: "11",
              },
            },
          },
        },
      },
    },
  ],
});
```

That will be mapped to the following SQL condition:

```sql
WHERE
    (
        (
            (
                (
                    (
                        (
                            first_name ILIKE 'di%'
                            AND last_name ILIKE '%go'
                            AND (
                                age >= 18
                                OR age <= 60
                            )
                        )
                        OR (
                            (
                                (profile = 'admin')
                                OR (profile = 'manager')
                            )
                            AND (is_public_access IS TRUE)
                        )
                        OR (profile = 'not required')
                    )
                )
                AND (CAST(status AS TEXT) = $ 9)
            )
            AND (
                (
                    priority = 1
                    AND (
                        priority <= 1
                        OR priority >= 3
                    )
                )
                OR (priority = 2)
            )
        )
        AND (
            (
                first_name != 'teste'
                AND (
                    first_name NOT ILIKE 'p%'
                    OR first_name NOT ILIKE '%g')
                )
            )
            AND (
                first_name ILIKE 'di%'
                OR first_name ILIKE 'go%'
                AND (
                    first_name != 'teste')
                    AND (
                        first_name NOT ILIKE '10%'
                        OR first_name NOT ILIKE '%11'
                    )
                )
            )
        )
    )
```

## Using with query string

The `typeorm-filter` helps you to create the filter from a query string, for that just build the query string according to the filter array from the filter function options.

Example 1:

```
?page=1
&limit=50
&select[]=firstName
&select[]=lastName
&order[]=firstName:desc
&filter[][0][email][starts_with]=admin
&filter[][0][email][ends_with]=@gmail.com
&filter[][1][created_at][lte]=2020-01-01
```

Example 2:

```
?
page=1
&limit=50
&s='john'
&searchColumns[]=firstName
&searchColumns[]=lastName
```

Most frameworks already converts the query string to the expected. But if this is not your case you can use the [`createFilterFromQuery`](#create-filter-from-query) function:

```typescript
import express from "express";
import { createFilterFromQuery } from "typeorm-filter";

const app = express();

app.get("/", function (req, res) {
  const filter = createFilterFromQuery({ query: req.query });

  return filter;
});
```

## Decorators

### NestJS

#### ParsedFilterQuery<T<T>>

This decorator will automatically create the filter from the incoming query string using the `createFilterFromQuery`function.

```typescript
@Get()
async index(@ParsedFilterQuery() query: FilterQuery<User>) {
	return query;
}
```

## Why not the Find API?
