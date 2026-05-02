# Practice 4: GraphQL in NestJS - Schema-First + Code-First

## ✅ Deliverables Completed

### 1. Screenshot of Playground Query Result
- **Query**: `products { id name price category { id name } }` (with category relation)
- **Status**: GraphQL Playground accessible at http://localhost:3000/graphql
- **Result**: Query successfully returns products with nested category information

### 2. Commit History
```
c5db579  add productsByCategory query (schema-first + code-first)
15d4d76  code-first working
fee495f  schema-first working
```

**Key commits showing progression:**
- **fee495f (schema-first working)**: Initial schema-first implementation
  - Created SDL schema (`shop.graphql`)
  - Schema-first resolvers for Category/Product
  - `@Resolver('Product')` with `@ResolveField('category')`

- **15d4d76 (code-first working)**: Switched to code-first mode
  - Switched AppModule to `autoSchemaFile`
  - Implemented code-first resolvers with decorators (`@Resolver(() => ProductType)`)
  - Added GraphQL types and inputs with class decorators
  - Auto-generated `schema.gql`

- **c5db579 (Challenge 1)**: Added `productsByCategory(categoryId)` query
  - Schema-first: updated `shop.graphql` + resolver
  - Code-first: added `@Query` method with `@Args`
  - Both approaches implemented

### 3. Comparison & Reflection (Part C Answers)

#### Q1: In schema-first, what happens if resolver name doesn't match schema?
**Answer**: The application throws an error during schema generation. GraphQL Factory uses `@graphql-tools/schema` which validates that all resolver names match their corresponding schema type/field names. If a resolver is defined but not in the schema (e.g., `@Query('products')` resolver but no `products` in `.graphql`), the schema builder fails to register it. This creates a mismatch—the schema won't have the field, so GraphQL queries can't use it.

#### Q2: In code-first, where do types and inputs come from?
**Answer**: Types and inputs are defined as **TypeScript classes** decorated with GraphQL decorators:
- `@ObjectType()` classes define GraphQL object types (e.g., `CategoryType`)
- `@InputType()` classes define GraphQL input types (e.g., `CreateProductInput`)
- Fields are decorated with `@Field()` and specify their GraphQL type using type functions like `() => ID`, `() => Float`, etc.
- The schema is automatically generated at build-time from these class definitions into `schema.gql`

#### Q3: Which approach is easier for frontend team collaboration?
**Answer**: **Schema-first is easier for frontend collaboration**
- The `.graphql` file serves as a single source of truth (contract-driven development)
- Frontend and backend teams can agree on the schema first, before implementing resolvers
- Frontend can develop queries/mutations immediately against the schema
- No dependency on backend's TypeScript class structure
- Schema is language-agnostic and human-readable
- Better for API-first design patterns

#### Q4: Which approach is easier for refactoring in TypeScript?
**Answer**: **Code-first is easier for refactoring in TypeScript**
- Types live in TypeScript; refactoring field names automatically updates both code and schema
- IDE support (find references, rename refactoring) works seamlessly
- Type safety: changes to entity models propagate to GraphQL automatically
- No need to keep `.graphql` files in sync—NestJS handles it
- Validation decorators (class-validator) live with type definitions
- Prevents type mismatches between code and schema
- Better for rapidly evolving APIs

## Implementation Details

### Challenge 1: productsByCategory Query ✅
**Schema-first SDL:**
```graphql
productsByCategory(categoryId: ID!): [Product!]!
```

**Schema-first Resolver:**
```typescript
@Query('productsByCategory')
productsByCategory(@Args('categoryId') categoryId: string) {
  return this.productService.findByCategory(Number(categoryId));
}
```

**Code-first Query:**
```typescript
@Query(() => [ProductType])
productsByCategory(@Args('categoryId') categoryId: number) {
  return this.productService.findByCategory(categoryId);
}
```

### Challenge 2: Validation (Code-First) ✅
**CreateProductInput with Validators:**
```typescript
@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => ID)
  categoryId: number;
}
```

**ValidationPipe enabled in main.ts:**
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);
```

## Project Architecture

### File Structure
```
src/
├── graphql/
│   ├── schema/
│   │   └── shop.graphql                      # Schema-first SDL
│   ├── types/
│   │   ├── category.type.ts                  # Code-first ObjectType
│   │   └── product.type.ts                   # Code-first ObjectType
│   ├── inputs/
│   │   └── create-product.input.ts           # Code-first InputType (with validators)
│   ├── resolvers/
│   │   ├── category.resolver.ts              # Schema-first resolver
│   │   ├── product.resolver.ts               # Schema-first resolver (with @ResolveField)
│   │   ├── category.codefirst.resolver.ts    # Code-first resolver
│   │   └── product.codefirst.resolver.ts     # Code-first resolver (with @ResolveField)
│   ├── graphql.module.ts                     # GraphQL feature module
│   └── schema.gql                            # Auto-generated (code-first only)
├── modules/
│   ├── category/
│   │   ├── category.entity.ts                # TypeORM entity
│   │   ├── category.service.ts               # Business logic
│   │   ├── category.module.ts
│   │   └── category.repository.ts
│   └── product/
│       ├── product.entity.ts                 # TypeORM entity with ManyToOne relation
│       ├── product.service.ts                # Business logic (findByCategory)
│       ├── product.module.ts
│       └── product.repository.ts
└── app.module.ts                             # GraphQL toggle: typePaths vs autoSchemaFile
```

### Key Relation
**Product → Category (ManyToOne)**
- Product entity has `categoryId` + `@ManyToOne()` relation
- Both schema-first and code-first expose `category: Category` field
- Uses `@ResolveField()` to lazy-load category data

## How to Switch Between Modes

### Mode 1: Schema-First
Edit `src/app.module.ts`:
```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  typePaths: [join(process.cwd(), 'src/graphql/schema/*.graphql')],
  playground: true,
})
```

### Mode 2: Code-First  
Edit `src/app.module.ts`:
```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
  playground: true,
})
```

## Testing

### Example Queries (Both Modes)

**Fetch Products with Category:**
```graphql
query {
  products {
    id
    name
    price
    category {
      id
      name
    }
  }
}
```

**Create Category:**
```graphql
mutation {
  createCategory(name: "Electronics") {
    id
    name
  }
}
```

**Create Product (Code-First Input):**
```graphql
mutation {
  createProduct(input: { name: "Laptop", price: 999.99, categoryId: 1 }) {
    id
    name
    category { name }
  }
}
```

**Filter by Category:**
```graphql
query {
  productsByCategory(categoryId: 1) {
    id
    name
    price
  }
}
```

## Personal Preference: Code-First

**Why I prefer code-first for this project:**
1. **Type Safety**: TypeScript classes ensure schema matches business logic
2. **Developer Experience**: IDE refactoring support; rename a property and everything updates
3. **Validation Integration**: Class-validator decorators live with type definitions
4. **Rapid Development**: No need to maintain two sources of truth (TS + GraphQL)
5. **Scalability**: As features grow, auto-generation keeps schema in sync
6. **Testing**: Validators and types tested together

**When to use schema-first:**
- Designing new APIs with non-TS teams (frontend, product, design)
- Contract-first development where schema is negotiated first
- Polyglot teams (clients in multiple languages)
- When API stability matters more than rapid iteration

---

## Summary Stats
- **Total Files Created**: 15+ files
- **Packages Added**: @nestjs/graphql, @apollo/server@^5, @nestjs/apollo
- **Key Features**: Schema-first, Code-first, Relations, Validation, Mutations, Queries
- **Commits**: 3 strategic commits showing progression
- **Time Complexity**: ~2.5 hours (setup + both approaches + challenges)
