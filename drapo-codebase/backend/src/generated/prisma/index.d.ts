
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model KYCStatusHistory
 * 
 */
export type KYCStatusHistory = $Result.DefaultSelection<Prisma.$KYCStatusHistoryPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model CasbinRule
 * 
 */
export type CasbinRule = $Result.DefaultSelection<Prisma.$CasbinRulePayload>
/**
 * Model KYC
 * 
 */
export type KYC = $Result.DefaultSelection<Prisma.$KYCPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model Scope
 * 
 */
export type Scope = $Result.DefaultSelection<Prisma.$ScopePayload>
/**
 * Model UserRole
 * 
 */
export type UserRole = $Result.DefaultSelection<Prisma.$UserRolePayload>
/**
 * Model RoleScope
 * 
 */
export type RoleScope = $Result.DefaultSelection<Prisma.$RoleScopePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const KYCStatus: {
  APPLIED: 'APPLIED',
  PROCESSING: 'PROCESSING',
  ON_HOLD: 'ON_HOLD',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type KYCStatus = (typeof KYCStatus)[keyof typeof KYCStatus]

}

export type KYCStatus = $Enums.KYCStatus

export const KYCStatus: typeof $Enums.KYCStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more KYCStatusHistories
 * const kYCStatusHistories = await prisma.kYCStatusHistory.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more KYCStatusHistories
   * const kYCStatusHistories = await prisma.kYCStatusHistory.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.kYCStatusHistory`: Exposes CRUD operations for the **KYCStatusHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KYCStatusHistories
    * const kYCStatusHistories = await prisma.kYCStatusHistory.findMany()
    * ```
    */
  get kYCStatusHistory(): Prisma.KYCStatusHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.casbinRule`: Exposes CRUD operations for the **CasbinRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CasbinRules
    * const casbinRules = await prisma.casbinRule.findMany()
    * ```
    */
  get casbinRule(): Prisma.CasbinRuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kYC`: Exposes CRUD operations for the **KYC** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KYCS
    * const kYCS = await prisma.kYC.findMany()
    * ```
    */
  get kYC(): Prisma.KYCDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scope`: Exposes CRUD operations for the **Scope** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Scopes
    * const scopes = await prisma.scope.findMany()
    * ```
    */
  get scope(): Prisma.ScopeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userRole`: Exposes CRUD operations for the **UserRole** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserRoles
    * const userRoles = await prisma.userRole.findMany()
    * ```
    */
  get userRole(): Prisma.UserRoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roleScope`: Exposes CRUD operations for the **RoleScope** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoleScopes
    * const roleScopes = await prisma.roleScope.findMany()
    * ```
    */
  get roleScope(): Prisma.RoleScopeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    KYCStatusHistory: 'KYCStatusHistory',
    Notification: 'Notification',
    CasbinRule: 'CasbinRule',
    KYC: 'KYC',
    User: 'User',
    Role: 'Role',
    Scope: 'Scope',
    UserRole: 'UserRole',
    RoleScope: 'RoleScope'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "kYCStatusHistory" | "notification" | "casbinRule" | "kYC" | "user" | "role" | "scope" | "userRole" | "roleScope"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      KYCStatusHistory: {
        payload: Prisma.$KYCStatusHistoryPayload<ExtArgs>
        fields: Prisma.KYCStatusHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KYCStatusHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KYCStatusHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload>
          }
          findFirst: {
            args: Prisma.KYCStatusHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KYCStatusHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload>
          }
          findMany: {
            args: Prisma.KYCStatusHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload>[]
          }
          create: {
            args: Prisma.KYCStatusHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload>
          }
          createMany: {
            args: Prisma.KYCStatusHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KYCStatusHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload>[]
          }
          delete: {
            args: Prisma.KYCStatusHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload>
          }
          update: {
            args: Prisma.KYCStatusHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload>
          }
          deleteMany: {
            args: Prisma.KYCStatusHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KYCStatusHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KYCStatusHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload>[]
          }
          upsert: {
            args: Prisma.KYCStatusHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCStatusHistoryPayload>
          }
          aggregate: {
            args: Prisma.KYCStatusHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKYCStatusHistory>
          }
          groupBy: {
            args: Prisma.KYCStatusHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<KYCStatusHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.KYCStatusHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<KYCStatusHistoryCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      CasbinRule: {
        payload: Prisma.$CasbinRulePayload<ExtArgs>
        fields: Prisma.CasbinRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CasbinRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CasbinRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload>
          }
          findFirst: {
            args: Prisma.CasbinRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CasbinRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload>
          }
          findMany: {
            args: Prisma.CasbinRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload>[]
          }
          create: {
            args: Prisma.CasbinRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload>
          }
          createMany: {
            args: Prisma.CasbinRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CasbinRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload>[]
          }
          delete: {
            args: Prisma.CasbinRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload>
          }
          update: {
            args: Prisma.CasbinRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload>
          }
          deleteMany: {
            args: Prisma.CasbinRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CasbinRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CasbinRuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload>[]
          }
          upsert: {
            args: Prisma.CasbinRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CasbinRulePayload>
          }
          aggregate: {
            args: Prisma.CasbinRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCasbinRule>
          }
          groupBy: {
            args: Prisma.CasbinRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<CasbinRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.CasbinRuleCountArgs<ExtArgs>
            result: $Utils.Optional<CasbinRuleCountAggregateOutputType> | number
          }
        }
      }
      KYC: {
        payload: Prisma.$KYCPayload<ExtArgs>
        fields: Prisma.KYCFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KYCFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KYCFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload>
          }
          findFirst: {
            args: Prisma.KYCFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KYCFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload>
          }
          findMany: {
            args: Prisma.KYCFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload>[]
          }
          create: {
            args: Prisma.KYCCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload>
          }
          createMany: {
            args: Prisma.KYCCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KYCCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload>[]
          }
          delete: {
            args: Prisma.KYCDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload>
          }
          update: {
            args: Prisma.KYCUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload>
          }
          deleteMany: {
            args: Prisma.KYCDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KYCUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KYCUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload>[]
          }
          upsert: {
            args: Prisma.KYCUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KYCPayload>
          }
          aggregate: {
            args: Prisma.KYCAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKYC>
          }
          groupBy: {
            args: Prisma.KYCGroupByArgs<ExtArgs>
            result: $Utils.Optional<KYCGroupByOutputType>[]
          }
          count: {
            args: Prisma.KYCCountArgs<ExtArgs>
            result: $Utils.Optional<KYCCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      Scope: {
        payload: Prisma.$ScopePayload<ExtArgs>
        fields: Prisma.ScopeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScopeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScopeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload>
          }
          findFirst: {
            args: Prisma.ScopeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScopeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload>
          }
          findMany: {
            args: Prisma.ScopeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload>[]
          }
          create: {
            args: Prisma.ScopeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload>
          }
          createMany: {
            args: Prisma.ScopeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScopeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload>[]
          }
          delete: {
            args: Prisma.ScopeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload>
          }
          update: {
            args: Prisma.ScopeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload>
          }
          deleteMany: {
            args: Prisma.ScopeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScopeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScopeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload>[]
          }
          upsert: {
            args: Prisma.ScopeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScopePayload>
          }
          aggregate: {
            args: Prisma.ScopeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScope>
          }
          groupBy: {
            args: Prisma.ScopeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScopeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScopeCountArgs<ExtArgs>
            result: $Utils.Optional<ScopeCountAggregateOutputType> | number
          }
        }
      }
      UserRole: {
        payload: Prisma.$UserRolePayload<ExtArgs>
        fields: Prisma.UserRoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserRoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserRoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          findFirst: {
            args: Prisma.UserRoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserRoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          findMany: {
            args: Prisma.UserRoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>[]
          }
          create: {
            args: Prisma.UserRoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          createMany: {
            args: Prisma.UserRoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserRoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>[]
          }
          delete: {
            args: Prisma.UserRoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          update: {
            args: Prisma.UserRoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          deleteMany: {
            args: Prisma.UserRoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserRoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserRoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>[]
          }
          upsert: {
            args: Prisma.UserRoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserRolePayload>
          }
          aggregate: {
            args: Prisma.UserRoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserRole>
          }
          groupBy: {
            args: Prisma.UserRoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserRoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserRoleCountArgs<ExtArgs>
            result: $Utils.Optional<UserRoleCountAggregateOutputType> | number
          }
        }
      }
      RoleScope: {
        payload: Prisma.$RoleScopePayload<ExtArgs>
        fields: Prisma.RoleScopeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleScopeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleScopeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload>
          }
          findFirst: {
            args: Prisma.RoleScopeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleScopeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload>
          }
          findMany: {
            args: Prisma.RoleScopeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload>[]
          }
          create: {
            args: Prisma.RoleScopeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload>
          }
          createMany: {
            args: Prisma.RoleScopeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleScopeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload>[]
          }
          delete: {
            args: Prisma.RoleScopeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload>
          }
          update: {
            args: Prisma.RoleScopeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload>
          }
          deleteMany: {
            args: Prisma.RoleScopeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleScopeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleScopeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload>[]
          }
          upsert: {
            args: Prisma.RoleScopeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleScopePayload>
          }
          aggregate: {
            args: Prisma.RoleScopeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoleScope>
          }
          groupBy: {
            args: Prisma.RoleScopeGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleScopeGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleScopeCountArgs<ExtArgs>
            result: $Utils.Optional<RoleScopeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    kYCStatusHistory?: KYCStatusHistoryOmit
    notification?: NotificationOmit
    casbinRule?: CasbinRuleOmit
    kYC?: KYCOmit
    user?: UserOmit
    role?: RoleOmit
    scope?: ScopeOmit
    userRole?: UserRoleOmit
    roleScope?: RoleScopeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type KYCCountOutputType
   */

  export type KYCCountOutputType = {
    statusHistories: number
  }

  export type KYCCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    statusHistories?: boolean | KYCCountOutputTypeCountStatusHistoriesArgs
  }

  // Custom InputTypes
  /**
   * KYCCountOutputType without action
   */
  export type KYCCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCCountOutputType
     */
    select?: KYCCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * KYCCountOutputType without action
   */
  export type KYCCountOutputTypeCountStatusHistoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KYCStatusHistoryWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    kycs: number
    notifications: number
    userRoles: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kycs?: boolean | UserCountOutputTypeCountKycsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
    userRoles?: boolean | UserCountOutputTypeCountUserRolesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountKycsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KYCWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUserRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserRoleWhereInput
  }


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    users: number
    scopes: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | RoleCountOutputTypeCountUsersArgs
    scopes?: boolean | RoleCountOutputTypeCountScopesArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserRoleWhereInput
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountScopesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleScopeWhereInput
  }


  /**
   * Count Type ScopeCountOutputType
   */

  export type ScopeCountOutputType = {
    roles: number
  }

  export type ScopeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roles?: boolean | ScopeCountOutputTypeCountRolesArgs
  }

  // Custom InputTypes
  /**
   * ScopeCountOutputType without action
   */
  export type ScopeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScopeCountOutputType
     */
    select?: ScopeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ScopeCountOutputType without action
   */
  export type ScopeCountOutputTypeCountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleScopeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model KYCStatusHistory
   */

  export type AggregateKYCStatusHistory = {
    _count: KYCStatusHistoryCountAggregateOutputType | null
    _avg: KYCStatusHistoryAvgAggregateOutputType | null
    _sum: KYCStatusHistorySumAggregateOutputType | null
    _min: KYCStatusHistoryMinAggregateOutputType | null
    _max: KYCStatusHistoryMaxAggregateOutputType | null
  }

  export type KYCStatusHistoryAvgAggregateOutputType = {
    id: number | null
    kycId: number | null
  }

  export type KYCStatusHistorySumAggregateOutputType = {
    id: number | null
    kycId: number | null
  }

  export type KYCStatusHistoryMinAggregateOutputType = {
    id: number | null
    kycId: number | null
    oldStatus: string | null
    newStatus: string | null
    changedAt: Date | null
  }

  export type KYCStatusHistoryMaxAggregateOutputType = {
    id: number | null
    kycId: number | null
    oldStatus: string | null
    newStatus: string | null
    changedAt: Date | null
  }

  export type KYCStatusHistoryCountAggregateOutputType = {
    id: number
    kycId: number
    oldStatus: number
    newStatus: number
    changedAt: number
    _all: number
  }


  export type KYCStatusHistoryAvgAggregateInputType = {
    id?: true
    kycId?: true
  }

  export type KYCStatusHistorySumAggregateInputType = {
    id?: true
    kycId?: true
  }

  export type KYCStatusHistoryMinAggregateInputType = {
    id?: true
    kycId?: true
    oldStatus?: true
    newStatus?: true
    changedAt?: true
  }

  export type KYCStatusHistoryMaxAggregateInputType = {
    id?: true
    kycId?: true
    oldStatus?: true
    newStatus?: true
    changedAt?: true
  }

  export type KYCStatusHistoryCountAggregateInputType = {
    id?: true
    kycId?: true
    oldStatus?: true
    newStatus?: true
    changedAt?: true
    _all?: true
  }

  export type KYCStatusHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KYCStatusHistory to aggregate.
     */
    where?: KYCStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KYCStatusHistories to fetch.
     */
    orderBy?: KYCStatusHistoryOrderByWithRelationInput | KYCStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KYCStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KYCStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KYCStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KYCStatusHistories
    **/
    _count?: true | KYCStatusHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KYCStatusHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KYCStatusHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KYCStatusHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KYCStatusHistoryMaxAggregateInputType
  }

  export type GetKYCStatusHistoryAggregateType<T extends KYCStatusHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateKYCStatusHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKYCStatusHistory[P]>
      : GetScalarType<T[P], AggregateKYCStatusHistory[P]>
  }




  export type KYCStatusHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KYCStatusHistoryWhereInput
    orderBy?: KYCStatusHistoryOrderByWithAggregationInput | KYCStatusHistoryOrderByWithAggregationInput[]
    by: KYCStatusHistoryScalarFieldEnum[] | KYCStatusHistoryScalarFieldEnum
    having?: KYCStatusHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KYCStatusHistoryCountAggregateInputType | true
    _avg?: KYCStatusHistoryAvgAggregateInputType
    _sum?: KYCStatusHistorySumAggregateInputType
    _min?: KYCStatusHistoryMinAggregateInputType
    _max?: KYCStatusHistoryMaxAggregateInputType
  }

  export type KYCStatusHistoryGroupByOutputType = {
    id: number
    kycId: number
    oldStatus: string
    newStatus: string
    changedAt: Date
    _count: KYCStatusHistoryCountAggregateOutputType | null
    _avg: KYCStatusHistoryAvgAggregateOutputType | null
    _sum: KYCStatusHistorySumAggregateOutputType | null
    _min: KYCStatusHistoryMinAggregateOutputType | null
    _max: KYCStatusHistoryMaxAggregateOutputType | null
  }

  type GetKYCStatusHistoryGroupByPayload<T extends KYCStatusHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KYCStatusHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KYCStatusHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KYCStatusHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], KYCStatusHistoryGroupByOutputType[P]>
        }
      >
    >


  export type KYCStatusHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kycId?: boolean
    oldStatus?: boolean
    newStatus?: boolean
    changedAt?: boolean
    kyc?: boolean | KYCDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kYCStatusHistory"]>

  export type KYCStatusHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kycId?: boolean
    oldStatus?: boolean
    newStatus?: boolean
    changedAt?: boolean
    kyc?: boolean | KYCDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kYCStatusHistory"]>

  export type KYCStatusHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kycId?: boolean
    oldStatus?: boolean
    newStatus?: boolean
    changedAt?: boolean
    kyc?: boolean | KYCDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kYCStatusHistory"]>

  export type KYCStatusHistorySelectScalar = {
    id?: boolean
    kycId?: boolean
    oldStatus?: boolean
    newStatus?: boolean
    changedAt?: boolean
  }

  export type KYCStatusHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kycId" | "oldStatus" | "newStatus" | "changedAt", ExtArgs["result"]["kYCStatusHistory"]>
  export type KYCStatusHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kyc?: boolean | KYCDefaultArgs<ExtArgs>
  }
  export type KYCStatusHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kyc?: boolean | KYCDefaultArgs<ExtArgs>
  }
  export type KYCStatusHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kyc?: boolean | KYCDefaultArgs<ExtArgs>
  }

  export type $KYCStatusHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KYCStatusHistory"
    objects: {
      kyc: Prisma.$KYCPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      kycId: number
      oldStatus: string
      newStatus: string
      changedAt: Date
    }, ExtArgs["result"]["kYCStatusHistory"]>
    composites: {}
  }

  type KYCStatusHistoryGetPayload<S extends boolean | null | undefined | KYCStatusHistoryDefaultArgs> = $Result.GetResult<Prisma.$KYCStatusHistoryPayload, S>

  type KYCStatusHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KYCStatusHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KYCStatusHistoryCountAggregateInputType | true
    }

  export interface KYCStatusHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KYCStatusHistory'], meta: { name: 'KYCStatusHistory' } }
    /**
     * Find zero or one KYCStatusHistory that matches the filter.
     * @param {KYCStatusHistoryFindUniqueArgs} args - Arguments to find a KYCStatusHistory
     * @example
     * // Get one KYCStatusHistory
     * const kYCStatusHistory = await prisma.kYCStatusHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KYCStatusHistoryFindUniqueArgs>(args: SelectSubset<T, KYCStatusHistoryFindUniqueArgs<ExtArgs>>): Prisma__KYCStatusHistoryClient<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KYCStatusHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KYCStatusHistoryFindUniqueOrThrowArgs} args - Arguments to find a KYCStatusHistory
     * @example
     * // Get one KYCStatusHistory
     * const kYCStatusHistory = await prisma.kYCStatusHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KYCStatusHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, KYCStatusHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KYCStatusHistoryClient<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KYCStatusHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCStatusHistoryFindFirstArgs} args - Arguments to find a KYCStatusHistory
     * @example
     * // Get one KYCStatusHistory
     * const kYCStatusHistory = await prisma.kYCStatusHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KYCStatusHistoryFindFirstArgs>(args?: SelectSubset<T, KYCStatusHistoryFindFirstArgs<ExtArgs>>): Prisma__KYCStatusHistoryClient<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KYCStatusHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCStatusHistoryFindFirstOrThrowArgs} args - Arguments to find a KYCStatusHistory
     * @example
     * // Get one KYCStatusHistory
     * const kYCStatusHistory = await prisma.kYCStatusHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KYCStatusHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, KYCStatusHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__KYCStatusHistoryClient<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KYCStatusHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCStatusHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KYCStatusHistories
     * const kYCStatusHistories = await prisma.kYCStatusHistory.findMany()
     * 
     * // Get first 10 KYCStatusHistories
     * const kYCStatusHistories = await prisma.kYCStatusHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kYCStatusHistoryWithIdOnly = await prisma.kYCStatusHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KYCStatusHistoryFindManyArgs>(args?: SelectSubset<T, KYCStatusHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KYCStatusHistory.
     * @param {KYCStatusHistoryCreateArgs} args - Arguments to create a KYCStatusHistory.
     * @example
     * // Create one KYCStatusHistory
     * const KYCStatusHistory = await prisma.kYCStatusHistory.create({
     *   data: {
     *     // ... data to create a KYCStatusHistory
     *   }
     * })
     * 
     */
    create<T extends KYCStatusHistoryCreateArgs>(args: SelectSubset<T, KYCStatusHistoryCreateArgs<ExtArgs>>): Prisma__KYCStatusHistoryClient<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KYCStatusHistories.
     * @param {KYCStatusHistoryCreateManyArgs} args - Arguments to create many KYCStatusHistories.
     * @example
     * // Create many KYCStatusHistories
     * const kYCStatusHistory = await prisma.kYCStatusHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KYCStatusHistoryCreateManyArgs>(args?: SelectSubset<T, KYCStatusHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KYCStatusHistories and returns the data saved in the database.
     * @param {KYCStatusHistoryCreateManyAndReturnArgs} args - Arguments to create many KYCStatusHistories.
     * @example
     * // Create many KYCStatusHistories
     * const kYCStatusHistory = await prisma.kYCStatusHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KYCStatusHistories and only return the `id`
     * const kYCStatusHistoryWithIdOnly = await prisma.kYCStatusHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KYCStatusHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, KYCStatusHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KYCStatusHistory.
     * @param {KYCStatusHistoryDeleteArgs} args - Arguments to delete one KYCStatusHistory.
     * @example
     * // Delete one KYCStatusHistory
     * const KYCStatusHistory = await prisma.kYCStatusHistory.delete({
     *   where: {
     *     // ... filter to delete one KYCStatusHistory
     *   }
     * })
     * 
     */
    delete<T extends KYCStatusHistoryDeleteArgs>(args: SelectSubset<T, KYCStatusHistoryDeleteArgs<ExtArgs>>): Prisma__KYCStatusHistoryClient<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KYCStatusHistory.
     * @param {KYCStatusHistoryUpdateArgs} args - Arguments to update one KYCStatusHistory.
     * @example
     * // Update one KYCStatusHistory
     * const kYCStatusHistory = await prisma.kYCStatusHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KYCStatusHistoryUpdateArgs>(args: SelectSubset<T, KYCStatusHistoryUpdateArgs<ExtArgs>>): Prisma__KYCStatusHistoryClient<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KYCStatusHistories.
     * @param {KYCStatusHistoryDeleteManyArgs} args - Arguments to filter KYCStatusHistories to delete.
     * @example
     * // Delete a few KYCStatusHistories
     * const { count } = await prisma.kYCStatusHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KYCStatusHistoryDeleteManyArgs>(args?: SelectSubset<T, KYCStatusHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KYCStatusHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCStatusHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KYCStatusHistories
     * const kYCStatusHistory = await prisma.kYCStatusHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KYCStatusHistoryUpdateManyArgs>(args: SelectSubset<T, KYCStatusHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KYCStatusHistories and returns the data updated in the database.
     * @param {KYCStatusHistoryUpdateManyAndReturnArgs} args - Arguments to update many KYCStatusHistories.
     * @example
     * // Update many KYCStatusHistories
     * const kYCStatusHistory = await prisma.kYCStatusHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KYCStatusHistories and only return the `id`
     * const kYCStatusHistoryWithIdOnly = await prisma.kYCStatusHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KYCStatusHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, KYCStatusHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KYCStatusHistory.
     * @param {KYCStatusHistoryUpsertArgs} args - Arguments to update or create a KYCStatusHistory.
     * @example
     * // Update or create a KYCStatusHistory
     * const kYCStatusHistory = await prisma.kYCStatusHistory.upsert({
     *   create: {
     *     // ... data to create a KYCStatusHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KYCStatusHistory we want to update
     *   }
     * })
     */
    upsert<T extends KYCStatusHistoryUpsertArgs>(args: SelectSubset<T, KYCStatusHistoryUpsertArgs<ExtArgs>>): Prisma__KYCStatusHistoryClient<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KYCStatusHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCStatusHistoryCountArgs} args - Arguments to filter KYCStatusHistories to count.
     * @example
     * // Count the number of KYCStatusHistories
     * const count = await prisma.kYCStatusHistory.count({
     *   where: {
     *     // ... the filter for the KYCStatusHistories we want to count
     *   }
     * })
    **/
    count<T extends KYCStatusHistoryCountArgs>(
      args?: Subset<T, KYCStatusHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KYCStatusHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KYCStatusHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCStatusHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KYCStatusHistoryAggregateArgs>(args: Subset<T, KYCStatusHistoryAggregateArgs>): Prisma.PrismaPromise<GetKYCStatusHistoryAggregateType<T>>

    /**
     * Group by KYCStatusHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCStatusHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KYCStatusHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KYCStatusHistoryGroupByArgs['orderBy'] }
        : { orderBy?: KYCStatusHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KYCStatusHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKYCStatusHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KYCStatusHistory model
   */
  readonly fields: KYCStatusHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KYCStatusHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KYCStatusHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kyc<T extends KYCDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KYCDefaultArgs<ExtArgs>>): Prisma__KYCClient<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KYCStatusHistory model
   */
  interface KYCStatusHistoryFieldRefs {
    readonly id: FieldRef<"KYCStatusHistory", 'Int'>
    readonly kycId: FieldRef<"KYCStatusHistory", 'Int'>
    readonly oldStatus: FieldRef<"KYCStatusHistory", 'String'>
    readonly newStatus: FieldRef<"KYCStatusHistory", 'String'>
    readonly changedAt: FieldRef<"KYCStatusHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KYCStatusHistory findUnique
   */
  export type KYCStatusHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which KYCStatusHistory to fetch.
     */
    where: KYCStatusHistoryWhereUniqueInput
  }

  /**
   * KYCStatusHistory findUniqueOrThrow
   */
  export type KYCStatusHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which KYCStatusHistory to fetch.
     */
    where: KYCStatusHistoryWhereUniqueInput
  }

  /**
   * KYCStatusHistory findFirst
   */
  export type KYCStatusHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which KYCStatusHistory to fetch.
     */
    where?: KYCStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KYCStatusHistories to fetch.
     */
    orderBy?: KYCStatusHistoryOrderByWithRelationInput | KYCStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KYCStatusHistories.
     */
    cursor?: KYCStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KYCStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KYCStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KYCStatusHistories.
     */
    distinct?: KYCStatusHistoryScalarFieldEnum | KYCStatusHistoryScalarFieldEnum[]
  }

  /**
   * KYCStatusHistory findFirstOrThrow
   */
  export type KYCStatusHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which KYCStatusHistory to fetch.
     */
    where?: KYCStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KYCStatusHistories to fetch.
     */
    orderBy?: KYCStatusHistoryOrderByWithRelationInput | KYCStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KYCStatusHistories.
     */
    cursor?: KYCStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KYCStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KYCStatusHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KYCStatusHistories.
     */
    distinct?: KYCStatusHistoryScalarFieldEnum | KYCStatusHistoryScalarFieldEnum[]
  }

  /**
   * KYCStatusHistory findMany
   */
  export type KYCStatusHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter, which KYCStatusHistories to fetch.
     */
    where?: KYCStatusHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KYCStatusHistories to fetch.
     */
    orderBy?: KYCStatusHistoryOrderByWithRelationInput | KYCStatusHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KYCStatusHistories.
     */
    cursor?: KYCStatusHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KYCStatusHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KYCStatusHistories.
     */
    skip?: number
    distinct?: KYCStatusHistoryScalarFieldEnum | KYCStatusHistoryScalarFieldEnum[]
  }

  /**
   * KYCStatusHistory create
   */
  export type KYCStatusHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a KYCStatusHistory.
     */
    data: XOR<KYCStatusHistoryCreateInput, KYCStatusHistoryUncheckedCreateInput>
  }

  /**
   * KYCStatusHistory createMany
   */
  export type KYCStatusHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KYCStatusHistories.
     */
    data: KYCStatusHistoryCreateManyInput | KYCStatusHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KYCStatusHistory createManyAndReturn
   */
  export type KYCStatusHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many KYCStatusHistories.
     */
    data: KYCStatusHistoryCreateManyInput | KYCStatusHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KYCStatusHistory update
   */
  export type KYCStatusHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a KYCStatusHistory.
     */
    data: XOR<KYCStatusHistoryUpdateInput, KYCStatusHistoryUncheckedUpdateInput>
    /**
     * Choose, which KYCStatusHistory to update.
     */
    where: KYCStatusHistoryWhereUniqueInput
  }

  /**
   * KYCStatusHistory updateMany
   */
  export type KYCStatusHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KYCStatusHistories.
     */
    data: XOR<KYCStatusHistoryUpdateManyMutationInput, KYCStatusHistoryUncheckedUpdateManyInput>
    /**
     * Filter which KYCStatusHistories to update
     */
    where?: KYCStatusHistoryWhereInput
    /**
     * Limit how many KYCStatusHistories to update.
     */
    limit?: number
  }

  /**
   * KYCStatusHistory updateManyAndReturn
   */
  export type KYCStatusHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * The data used to update KYCStatusHistories.
     */
    data: XOR<KYCStatusHistoryUpdateManyMutationInput, KYCStatusHistoryUncheckedUpdateManyInput>
    /**
     * Filter which KYCStatusHistories to update
     */
    where?: KYCStatusHistoryWhereInput
    /**
     * Limit how many KYCStatusHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KYCStatusHistory upsert
   */
  export type KYCStatusHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the KYCStatusHistory to update in case it exists.
     */
    where: KYCStatusHistoryWhereUniqueInput
    /**
     * In case the KYCStatusHistory found by the `where` argument doesn't exist, create a new KYCStatusHistory with this data.
     */
    create: XOR<KYCStatusHistoryCreateInput, KYCStatusHistoryUncheckedCreateInput>
    /**
     * In case the KYCStatusHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KYCStatusHistoryUpdateInput, KYCStatusHistoryUncheckedUpdateInput>
  }

  /**
   * KYCStatusHistory delete
   */
  export type KYCStatusHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
    /**
     * Filter which KYCStatusHistory to delete.
     */
    where: KYCStatusHistoryWhereUniqueInput
  }

  /**
   * KYCStatusHistory deleteMany
   */
  export type KYCStatusHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KYCStatusHistories to delete
     */
    where?: KYCStatusHistoryWhereInput
    /**
     * Limit how many KYCStatusHistories to delete.
     */
    limit?: number
  }

  /**
   * KYCStatusHistory without action
   */
  export type KYCStatusHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type NotificationSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type NotificationMinAggregateOutputType = {
    id: number | null
    userId: number | null
    message: string | null
    read: boolean | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    message: string | null
    read: boolean | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    message: number
    read: number
    createdAt: number
    _all: number
  }


  export type NotificationAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type NotificationSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    message?: true
    read?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    message?: true
    read?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    message?: true
    read?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _avg?: NotificationAvgAggregateInputType
    _sum?: NotificationSumAggregateInputType
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: number
    userId: number
    message: string
    read: boolean
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    message?: boolean
    read?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    message?: boolean
    read?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    message?: boolean
    read?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    message?: boolean
    read?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "message" | "read" | "createdAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      message: string
      read: boolean
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'Int'>
    readonly userId: FieldRef<"Notification", 'Int'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly read: FieldRef<"Notification", 'Boolean'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model CasbinRule
   */

  export type AggregateCasbinRule = {
    _count: CasbinRuleCountAggregateOutputType | null
    _avg: CasbinRuleAvgAggregateOutputType | null
    _sum: CasbinRuleSumAggregateOutputType | null
    _min: CasbinRuleMinAggregateOutputType | null
    _max: CasbinRuleMaxAggregateOutputType | null
  }

  export type CasbinRuleAvgAggregateOutputType = {
    id: number | null
  }

  export type CasbinRuleSumAggregateOutputType = {
    id: number | null
  }

  export type CasbinRuleMinAggregateOutputType = {
    id: number | null
    ptype: string | null
    v0: string | null
    v1: string | null
    v2: string | null
    v3: string | null
    v4: string | null
    v5: string | null
  }

  export type CasbinRuleMaxAggregateOutputType = {
    id: number | null
    ptype: string | null
    v0: string | null
    v1: string | null
    v2: string | null
    v3: string | null
    v4: string | null
    v5: string | null
  }

  export type CasbinRuleCountAggregateOutputType = {
    id: number
    ptype: number
    v0: number
    v1: number
    v2: number
    v3: number
    v4: number
    v5: number
    _all: number
  }


  export type CasbinRuleAvgAggregateInputType = {
    id?: true
  }

  export type CasbinRuleSumAggregateInputType = {
    id?: true
  }

  export type CasbinRuleMinAggregateInputType = {
    id?: true
    ptype?: true
    v0?: true
    v1?: true
    v2?: true
    v3?: true
    v4?: true
    v5?: true
  }

  export type CasbinRuleMaxAggregateInputType = {
    id?: true
    ptype?: true
    v0?: true
    v1?: true
    v2?: true
    v3?: true
    v4?: true
    v5?: true
  }

  export type CasbinRuleCountAggregateInputType = {
    id?: true
    ptype?: true
    v0?: true
    v1?: true
    v2?: true
    v3?: true
    v4?: true
    v5?: true
    _all?: true
  }

  export type CasbinRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CasbinRule to aggregate.
     */
    where?: CasbinRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CasbinRules to fetch.
     */
    orderBy?: CasbinRuleOrderByWithRelationInput | CasbinRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CasbinRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CasbinRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CasbinRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CasbinRules
    **/
    _count?: true | CasbinRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CasbinRuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CasbinRuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CasbinRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CasbinRuleMaxAggregateInputType
  }

  export type GetCasbinRuleAggregateType<T extends CasbinRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateCasbinRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCasbinRule[P]>
      : GetScalarType<T[P], AggregateCasbinRule[P]>
  }




  export type CasbinRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CasbinRuleWhereInput
    orderBy?: CasbinRuleOrderByWithAggregationInput | CasbinRuleOrderByWithAggregationInput[]
    by: CasbinRuleScalarFieldEnum[] | CasbinRuleScalarFieldEnum
    having?: CasbinRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CasbinRuleCountAggregateInputType | true
    _avg?: CasbinRuleAvgAggregateInputType
    _sum?: CasbinRuleSumAggregateInputType
    _min?: CasbinRuleMinAggregateInputType
    _max?: CasbinRuleMaxAggregateInputType
  }

  export type CasbinRuleGroupByOutputType = {
    id: number
    ptype: string
    v0: string | null
    v1: string | null
    v2: string | null
    v3: string | null
    v4: string | null
    v5: string | null
    _count: CasbinRuleCountAggregateOutputType | null
    _avg: CasbinRuleAvgAggregateOutputType | null
    _sum: CasbinRuleSumAggregateOutputType | null
    _min: CasbinRuleMinAggregateOutputType | null
    _max: CasbinRuleMaxAggregateOutputType | null
  }

  type GetCasbinRuleGroupByPayload<T extends CasbinRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CasbinRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CasbinRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CasbinRuleGroupByOutputType[P]>
            : GetScalarType<T[P], CasbinRuleGroupByOutputType[P]>
        }
      >
    >


  export type CasbinRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ptype?: boolean
    v0?: boolean
    v1?: boolean
    v2?: boolean
    v3?: boolean
    v4?: boolean
    v5?: boolean
  }, ExtArgs["result"]["casbinRule"]>

  export type CasbinRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ptype?: boolean
    v0?: boolean
    v1?: boolean
    v2?: boolean
    v3?: boolean
    v4?: boolean
    v5?: boolean
  }, ExtArgs["result"]["casbinRule"]>

  export type CasbinRuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ptype?: boolean
    v0?: boolean
    v1?: boolean
    v2?: boolean
    v3?: boolean
    v4?: boolean
    v5?: boolean
  }, ExtArgs["result"]["casbinRule"]>

  export type CasbinRuleSelectScalar = {
    id?: boolean
    ptype?: boolean
    v0?: boolean
    v1?: boolean
    v2?: boolean
    v3?: boolean
    v4?: boolean
    v5?: boolean
  }

  export type CasbinRuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ptype" | "v0" | "v1" | "v2" | "v3" | "v4" | "v5", ExtArgs["result"]["casbinRule"]>

  export type $CasbinRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CasbinRule"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      ptype: string
      v0: string | null
      v1: string | null
      v2: string | null
      v3: string | null
      v4: string | null
      v5: string | null
    }, ExtArgs["result"]["casbinRule"]>
    composites: {}
  }

  type CasbinRuleGetPayload<S extends boolean | null | undefined | CasbinRuleDefaultArgs> = $Result.GetResult<Prisma.$CasbinRulePayload, S>

  type CasbinRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CasbinRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CasbinRuleCountAggregateInputType | true
    }

  export interface CasbinRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CasbinRule'], meta: { name: 'CasbinRule' } }
    /**
     * Find zero or one CasbinRule that matches the filter.
     * @param {CasbinRuleFindUniqueArgs} args - Arguments to find a CasbinRule
     * @example
     * // Get one CasbinRule
     * const casbinRule = await prisma.casbinRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CasbinRuleFindUniqueArgs>(args: SelectSubset<T, CasbinRuleFindUniqueArgs<ExtArgs>>): Prisma__CasbinRuleClient<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CasbinRule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CasbinRuleFindUniqueOrThrowArgs} args - Arguments to find a CasbinRule
     * @example
     * // Get one CasbinRule
     * const casbinRule = await prisma.casbinRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CasbinRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, CasbinRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CasbinRuleClient<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CasbinRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasbinRuleFindFirstArgs} args - Arguments to find a CasbinRule
     * @example
     * // Get one CasbinRule
     * const casbinRule = await prisma.casbinRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CasbinRuleFindFirstArgs>(args?: SelectSubset<T, CasbinRuleFindFirstArgs<ExtArgs>>): Prisma__CasbinRuleClient<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CasbinRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasbinRuleFindFirstOrThrowArgs} args - Arguments to find a CasbinRule
     * @example
     * // Get one CasbinRule
     * const casbinRule = await prisma.casbinRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CasbinRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, CasbinRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__CasbinRuleClient<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CasbinRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasbinRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CasbinRules
     * const casbinRules = await prisma.casbinRule.findMany()
     * 
     * // Get first 10 CasbinRules
     * const casbinRules = await prisma.casbinRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const casbinRuleWithIdOnly = await prisma.casbinRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CasbinRuleFindManyArgs>(args?: SelectSubset<T, CasbinRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CasbinRule.
     * @param {CasbinRuleCreateArgs} args - Arguments to create a CasbinRule.
     * @example
     * // Create one CasbinRule
     * const CasbinRule = await prisma.casbinRule.create({
     *   data: {
     *     // ... data to create a CasbinRule
     *   }
     * })
     * 
     */
    create<T extends CasbinRuleCreateArgs>(args: SelectSubset<T, CasbinRuleCreateArgs<ExtArgs>>): Prisma__CasbinRuleClient<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CasbinRules.
     * @param {CasbinRuleCreateManyArgs} args - Arguments to create many CasbinRules.
     * @example
     * // Create many CasbinRules
     * const casbinRule = await prisma.casbinRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CasbinRuleCreateManyArgs>(args?: SelectSubset<T, CasbinRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CasbinRules and returns the data saved in the database.
     * @param {CasbinRuleCreateManyAndReturnArgs} args - Arguments to create many CasbinRules.
     * @example
     * // Create many CasbinRules
     * const casbinRule = await prisma.casbinRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CasbinRules and only return the `id`
     * const casbinRuleWithIdOnly = await prisma.casbinRule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CasbinRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, CasbinRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CasbinRule.
     * @param {CasbinRuleDeleteArgs} args - Arguments to delete one CasbinRule.
     * @example
     * // Delete one CasbinRule
     * const CasbinRule = await prisma.casbinRule.delete({
     *   where: {
     *     // ... filter to delete one CasbinRule
     *   }
     * })
     * 
     */
    delete<T extends CasbinRuleDeleteArgs>(args: SelectSubset<T, CasbinRuleDeleteArgs<ExtArgs>>): Prisma__CasbinRuleClient<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CasbinRule.
     * @param {CasbinRuleUpdateArgs} args - Arguments to update one CasbinRule.
     * @example
     * // Update one CasbinRule
     * const casbinRule = await prisma.casbinRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CasbinRuleUpdateArgs>(args: SelectSubset<T, CasbinRuleUpdateArgs<ExtArgs>>): Prisma__CasbinRuleClient<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CasbinRules.
     * @param {CasbinRuleDeleteManyArgs} args - Arguments to filter CasbinRules to delete.
     * @example
     * // Delete a few CasbinRules
     * const { count } = await prisma.casbinRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CasbinRuleDeleteManyArgs>(args?: SelectSubset<T, CasbinRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CasbinRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasbinRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CasbinRules
     * const casbinRule = await prisma.casbinRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CasbinRuleUpdateManyArgs>(args: SelectSubset<T, CasbinRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CasbinRules and returns the data updated in the database.
     * @param {CasbinRuleUpdateManyAndReturnArgs} args - Arguments to update many CasbinRules.
     * @example
     * // Update many CasbinRules
     * const casbinRule = await prisma.casbinRule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CasbinRules and only return the `id`
     * const casbinRuleWithIdOnly = await prisma.casbinRule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CasbinRuleUpdateManyAndReturnArgs>(args: SelectSubset<T, CasbinRuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CasbinRule.
     * @param {CasbinRuleUpsertArgs} args - Arguments to update or create a CasbinRule.
     * @example
     * // Update or create a CasbinRule
     * const casbinRule = await prisma.casbinRule.upsert({
     *   create: {
     *     // ... data to create a CasbinRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CasbinRule we want to update
     *   }
     * })
     */
    upsert<T extends CasbinRuleUpsertArgs>(args: SelectSubset<T, CasbinRuleUpsertArgs<ExtArgs>>): Prisma__CasbinRuleClient<$Result.GetResult<Prisma.$CasbinRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CasbinRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasbinRuleCountArgs} args - Arguments to filter CasbinRules to count.
     * @example
     * // Count the number of CasbinRules
     * const count = await prisma.casbinRule.count({
     *   where: {
     *     // ... the filter for the CasbinRules we want to count
     *   }
     * })
    **/
    count<T extends CasbinRuleCountArgs>(
      args?: Subset<T, CasbinRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CasbinRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CasbinRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasbinRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CasbinRuleAggregateArgs>(args: Subset<T, CasbinRuleAggregateArgs>): Prisma.PrismaPromise<GetCasbinRuleAggregateType<T>>

    /**
     * Group by CasbinRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CasbinRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CasbinRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CasbinRuleGroupByArgs['orderBy'] }
        : { orderBy?: CasbinRuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CasbinRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCasbinRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CasbinRule model
   */
  readonly fields: CasbinRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CasbinRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CasbinRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CasbinRule model
   */
  interface CasbinRuleFieldRefs {
    readonly id: FieldRef<"CasbinRule", 'Int'>
    readonly ptype: FieldRef<"CasbinRule", 'String'>
    readonly v0: FieldRef<"CasbinRule", 'String'>
    readonly v1: FieldRef<"CasbinRule", 'String'>
    readonly v2: FieldRef<"CasbinRule", 'String'>
    readonly v3: FieldRef<"CasbinRule", 'String'>
    readonly v4: FieldRef<"CasbinRule", 'String'>
    readonly v5: FieldRef<"CasbinRule", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CasbinRule findUnique
   */
  export type CasbinRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * Filter, which CasbinRule to fetch.
     */
    where: CasbinRuleWhereUniqueInput
  }

  /**
   * CasbinRule findUniqueOrThrow
   */
  export type CasbinRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * Filter, which CasbinRule to fetch.
     */
    where: CasbinRuleWhereUniqueInput
  }

  /**
   * CasbinRule findFirst
   */
  export type CasbinRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * Filter, which CasbinRule to fetch.
     */
    where?: CasbinRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CasbinRules to fetch.
     */
    orderBy?: CasbinRuleOrderByWithRelationInput | CasbinRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CasbinRules.
     */
    cursor?: CasbinRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CasbinRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CasbinRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CasbinRules.
     */
    distinct?: CasbinRuleScalarFieldEnum | CasbinRuleScalarFieldEnum[]
  }

  /**
   * CasbinRule findFirstOrThrow
   */
  export type CasbinRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * Filter, which CasbinRule to fetch.
     */
    where?: CasbinRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CasbinRules to fetch.
     */
    orderBy?: CasbinRuleOrderByWithRelationInput | CasbinRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CasbinRules.
     */
    cursor?: CasbinRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CasbinRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CasbinRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CasbinRules.
     */
    distinct?: CasbinRuleScalarFieldEnum | CasbinRuleScalarFieldEnum[]
  }

  /**
   * CasbinRule findMany
   */
  export type CasbinRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * Filter, which CasbinRules to fetch.
     */
    where?: CasbinRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CasbinRules to fetch.
     */
    orderBy?: CasbinRuleOrderByWithRelationInput | CasbinRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CasbinRules.
     */
    cursor?: CasbinRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CasbinRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CasbinRules.
     */
    skip?: number
    distinct?: CasbinRuleScalarFieldEnum | CasbinRuleScalarFieldEnum[]
  }

  /**
   * CasbinRule create
   */
  export type CasbinRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * The data needed to create a CasbinRule.
     */
    data: XOR<CasbinRuleCreateInput, CasbinRuleUncheckedCreateInput>
  }

  /**
   * CasbinRule createMany
   */
  export type CasbinRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CasbinRules.
     */
    data: CasbinRuleCreateManyInput | CasbinRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CasbinRule createManyAndReturn
   */
  export type CasbinRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * The data used to create many CasbinRules.
     */
    data: CasbinRuleCreateManyInput | CasbinRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CasbinRule update
   */
  export type CasbinRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * The data needed to update a CasbinRule.
     */
    data: XOR<CasbinRuleUpdateInput, CasbinRuleUncheckedUpdateInput>
    /**
     * Choose, which CasbinRule to update.
     */
    where: CasbinRuleWhereUniqueInput
  }

  /**
   * CasbinRule updateMany
   */
  export type CasbinRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CasbinRules.
     */
    data: XOR<CasbinRuleUpdateManyMutationInput, CasbinRuleUncheckedUpdateManyInput>
    /**
     * Filter which CasbinRules to update
     */
    where?: CasbinRuleWhereInput
    /**
     * Limit how many CasbinRules to update.
     */
    limit?: number
  }

  /**
   * CasbinRule updateManyAndReturn
   */
  export type CasbinRuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * The data used to update CasbinRules.
     */
    data: XOR<CasbinRuleUpdateManyMutationInput, CasbinRuleUncheckedUpdateManyInput>
    /**
     * Filter which CasbinRules to update
     */
    where?: CasbinRuleWhereInput
    /**
     * Limit how many CasbinRules to update.
     */
    limit?: number
  }

  /**
   * CasbinRule upsert
   */
  export type CasbinRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * The filter to search for the CasbinRule to update in case it exists.
     */
    where: CasbinRuleWhereUniqueInput
    /**
     * In case the CasbinRule found by the `where` argument doesn't exist, create a new CasbinRule with this data.
     */
    create: XOR<CasbinRuleCreateInput, CasbinRuleUncheckedCreateInput>
    /**
     * In case the CasbinRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CasbinRuleUpdateInput, CasbinRuleUncheckedUpdateInput>
  }

  /**
   * CasbinRule delete
   */
  export type CasbinRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
    /**
     * Filter which CasbinRule to delete.
     */
    where: CasbinRuleWhereUniqueInput
  }

  /**
   * CasbinRule deleteMany
   */
  export type CasbinRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CasbinRules to delete
     */
    where?: CasbinRuleWhereInput
    /**
     * Limit how many CasbinRules to delete.
     */
    limit?: number
  }

  /**
   * CasbinRule without action
   */
  export type CasbinRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CasbinRule
     */
    select?: CasbinRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CasbinRule
     */
    omit?: CasbinRuleOmit<ExtArgs> | null
  }


  /**
   * Model KYC
   */

  export type AggregateKYC = {
    _count: KYCCountAggregateOutputType | null
    _avg: KYCAvgAggregateOutputType | null
    _sum: KYCSumAggregateOutputType | null
    _min: KYCMinAggregateOutputType | null
    _max: KYCMaxAggregateOutputType | null
  }

  export type KYCAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type KYCSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type KYCMinAggregateOutputType = {
    id: number | null
    userId: number | null
    passportUrl: string | null
    nationalIdUrl: string | null
    proofOfAddressUrl: string | null
    photoUrl: string | null
    fingerprintScanUrl: string | null
    fingerprintImageUrl: string | null
    signatureUrl: string | null
    selfieUrl: string | null
    status: $Enums.KYCStatus | null
    submittedAt: Date | null
    verifiedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KYCMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    passportUrl: string | null
    nationalIdUrl: string | null
    proofOfAddressUrl: string | null
    photoUrl: string | null
    fingerprintScanUrl: string | null
    fingerprintImageUrl: string | null
    signatureUrl: string | null
    selfieUrl: string | null
    status: $Enums.KYCStatus | null
    submittedAt: Date | null
    verifiedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KYCCountAggregateOutputType = {
    id: number
    userId: number
    passportUrl: number
    nationalIdUrl: number
    proofOfAddressUrl: number
    photoUrl: number
    otherDocuments: number
    fingerprintScanUrl: number
    fingerprintImageUrl: number
    signatureUrl: number
    selfieUrl: number
    status: number
    submittedAt: number
    verifiedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KYCAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type KYCSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type KYCMinAggregateInputType = {
    id?: true
    userId?: true
    passportUrl?: true
    nationalIdUrl?: true
    proofOfAddressUrl?: true
    photoUrl?: true
    fingerprintScanUrl?: true
    fingerprintImageUrl?: true
    signatureUrl?: true
    selfieUrl?: true
    status?: true
    submittedAt?: true
    verifiedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KYCMaxAggregateInputType = {
    id?: true
    userId?: true
    passportUrl?: true
    nationalIdUrl?: true
    proofOfAddressUrl?: true
    photoUrl?: true
    fingerprintScanUrl?: true
    fingerprintImageUrl?: true
    signatureUrl?: true
    selfieUrl?: true
    status?: true
    submittedAt?: true
    verifiedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KYCCountAggregateInputType = {
    id?: true
    userId?: true
    passportUrl?: true
    nationalIdUrl?: true
    proofOfAddressUrl?: true
    photoUrl?: true
    otherDocuments?: true
    fingerprintScanUrl?: true
    fingerprintImageUrl?: true
    signatureUrl?: true
    selfieUrl?: true
    status?: true
    submittedAt?: true
    verifiedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KYCAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KYC to aggregate.
     */
    where?: KYCWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KYCS to fetch.
     */
    orderBy?: KYCOrderByWithRelationInput | KYCOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KYCWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KYCS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KYCS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KYCS
    **/
    _count?: true | KYCCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KYCAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KYCSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KYCMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KYCMaxAggregateInputType
  }

  export type GetKYCAggregateType<T extends KYCAggregateArgs> = {
        [P in keyof T & keyof AggregateKYC]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKYC[P]>
      : GetScalarType<T[P], AggregateKYC[P]>
  }




  export type KYCGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KYCWhereInput
    orderBy?: KYCOrderByWithAggregationInput | KYCOrderByWithAggregationInput[]
    by: KYCScalarFieldEnum[] | KYCScalarFieldEnum
    having?: KYCScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KYCCountAggregateInputType | true
    _avg?: KYCAvgAggregateInputType
    _sum?: KYCSumAggregateInputType
    _min?: KYCMinAggregateInputType
    _max?: KYCMaxAggregateInputType
  }

  export type KYCGroupByOutputType = {
    id: number
    userId: number
    passportUrl: string
    nationalIdUrl: string | null
    proofOfAddressUrl: string
    photoUrl: string
    otherDocuments: JsonValue | null
    fingerprintScanUrl: string | null
    fingerprintImageUrl: string | null
    signatureUrl: string | null
    selfieUrl: string
    status: $Enums.KYCStatus
    submittedAt: Date
    verifiedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: KYCCountAggregateOutputType | null
    _avg: KYCAvgAggregateOutputType | null
    _sum: KYCSumAggregateOutputType | null
    _min: KYCMinAggregateOutputType | null
    _max: KYCMaxAggregateOutputType | null
  }

  type GetKYCGroupByPayload<T extends KYCGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KYCGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KYCGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KYCGroupByOutputType[P]>
            : GetScalarType<T[P], KYCGroupByOutputType[P]>
        }
      >
    >


  export type KYCSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    passportUrl?: boolean
    nationalIdUrl?: boolean
    proofOfAddressUrl?: boolean
    photoUrl?: boolean
    otherDocuments?: boolean
    fingerprintScanUrl?: boolean
    fingerprintImageUrl?: boolean
    signatureUrl?: boolean
    selfieUrl?: boolean
    status?: boolean
    submittedAt?: boolean
    verifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    statusHistories?: boolean | KYC$statusHistoriesArgs<ExtArgs>
    _count?: boolean | KYCCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kYC"]>

  export type KYCSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    passportUrl?: boolean
    nationalIdUrl?: boolean
    proofOfAddressUrl?: boolean
    photoUrl?: boolean
    otherDocuments?: boolean
    fingerprintScanUrl?: boolean
    fingerprintImageUrl?: boolean
    signatureUrl?: boolean
    selfieUrl?: boolean
    status?: boolean
    submittedAt?: boolean
    verifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kYC"]>

  export type KYCSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    passportUrl?: boolean
    nationalIdUrl?: boolean
    proofOfAddressUrl?: boolean
    photoUrl?: boolean
    otherDocuments?: boolean
    fingerprintScanUrl?: boolean
    fingerprintImageUrl?: boolean
    signatureUrl?: boolean
    selfieUrl?: boolean
    status?: boolean
    submittedAt?: boolean
    verifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kYC"]>

  export type KYCSelectScalar = {
    id?: boolean
    userId?: boolean
    passportUrl?: boolean
    nationalIdUrl?: boolean
    proofOfAddressUrl?: boolean
    photoUrl?: boolean
    otherDocuments?: boolean
    fingerprintScanUrl?: boolean
    fingerprintImageUrl?: boolean
    signatureUrl?: boolean
    selfieUrl?: boolean
    status?: boolean
    submittedAt?: boolean
    verifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KYCOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "passportUrl" | "nationalIdUrl" | "proofOfAddressUrl" | "photoUrl" | "otherDocuments" | "fingerprintScanUrl" | "fingerprintImageUrl" | "signatureUrl" | "selfieUrl" | "status" | "submittedAt" | "verifiedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["kYC"]>
  export type KYCInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    statusHistories?: boolean | KYC$statusHistoriesArgs<ExtArgs>
    _count?: boolean | KYCCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type KYCIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type KYCIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $KYCPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KYC"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      statusHistories: Prisma.$KYCStatusHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      passportUrl: string
      nationalIdUrl: string | null
      proofOfAddressUrl: string
      photoUrl: string
      otherDocuments: Prisma.JsonValue | null
      fingerprintScanUrl: string | null
      fingerprintImageUrl: string | null
      signatureUrl: string | null
      selfieUrl: string
      status: $Enums.KYCStatus
      submittedAt: Date
      verifiedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kYC"]>
    composites: {}
  }

  type KYCGetPayload<S extends boolean | null | undefined | KYCDefaultArgs> = $Result.GetResult<Prisma.$KYCPayload, S>

  type KYCCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KYCFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KYCCountAggregateInputType | true
    }

  export interface KYCDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KYC'], meta: { name: 'KYC' } }
    /**
     * Find zero or one KYC that matches the filter.
     * @param {KYCFindUniqueArgs} args - Arguments to find a KYC
     * @example
     * // Get one KYC
     * const kYC = await prisma.kYC.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KYCFindUniqueArgs>(args: SelectSubset<T, KYCFindUniqueArgs<ExtArgs>>): Prisma__KYCClient<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KYC that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KYCFindUniqueOrThrowArgs} args - Arguments to find a KYC
     * @example
     * // Get one KYC
     * const kYC = await prisma.kYC.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KYCFindUniqueOrThrowArgs>(args: SelectSubset<T, KYCFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KYCClient<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KYC that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCFindFirstArgs} args - Arguments to find a KYC
     * @example
     * // Get one KYC
     * const kYC = await prisma.kYC.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KYCFindFirstArgs>(args?: SelectSubset<T, KYCFindFirstArgs<ExtArgs>>): Prisma__KYCClient<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KYC that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCFindFirstOrThrowArgs} args - Arguments to find a KYC
     * @example
     * // Get one KYC
     * const kYC = await prisma.kYC.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KYCFindFirstOrThrowArgs>(args?: SelectSubset<T, KYCFindFirstOrThrowArgs<ExtArgs>>): Prisma__KYCClient<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KYCS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KYCS
     * const kYCS = await prisma.kYC.findMany()
     * 
     * // Get first 10 KYCS
     * const kYCS = await prisma.kYC.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kYCWithIdOnly = await prisma.kYC.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KYCFindManyArgs>(args?: SelectSubset<T, KYCFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KYC.
     * @param {KYCCreateArgs} args - Arguments to create a KYC.
     * @example
     * // Create one KYC
     * const KYC = await prisma.kYC.create({
     *   data: {
     *     // ... data to create a KYC
     *   }
     * })
     * 
     */
    create<T extends KYCCreateArgs>(args: SelectSubset<T, KYCCreateArgs<ExtArgs>>): Prisma__KYCClient<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KYCS.
     * @param {KYCCreateManyArgs} args - Arguments to create many KYCS.
     * @example
     * // Create many KYCS
     * const kYC = await prisma.kYC.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KYCCreateManyArgs>(args?: SelectSubset<T, KYCCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KYCS and returns the data saved in the database.
     * @param {KYCCreateManyAndReturnArgs} args - Arguments to create many KYCS.
     * @example
     * // Create many KYCS
     * const kYC = await prisma.kYC.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KYCS and only return the `id`
     * const kYCWithIdOnly = await prisma.kYC.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KYCCreateManyAndReturnArgs>(args?: SelectSubset<T, KYCCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KYC.
     * @param {KYCDeleteArgs} args - Arguments to delete one KYC.
     * @example
     * // Delete one KYC
     * const KYC = await prisma.kYC.delete({
     *   where: {
     *     // ... filter to delete one KYC
     *   }
     * })
     * 
     */
    delete<T extends KYCDeleteArgs>(args: SelectSubset<T, KYCDeleteArgs<ExtArgs>>): Prisma__KYCClient<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KYC.
     * @param {KYCUpdateArgs} args - Arguments to update one KYC.
     * @example
     * // Update one KYC
     * const kYC = await prisma.kYC.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KYCUpdateArgs>(args: SelectSubset<T, KYCUpdateArgs<ExtArgs>>): Prisma__KYCClient<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KYCS.
     * @param {KYCDeleteManyArgs} args - Arguments to filter KYCS to delete.
     * @example
     * // Delete a few KYCS
     * const { count } = await prisma.kYC.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KYCDeleteManyArgs>(args?: SelectSubset<T, KYCDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KYCS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KYCS
     * const kYC = await prisma.kYC.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KYCUpdateManyArgs>(args: SelectSubset<T, KYCUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KYCS and returns the data updated in the database.
     * @param {KYCUpdateManyAndReturnArgs} args - Arguments to update many KYCS.
     * @example
     * // Update many KYCS
     * const kYC = await prisma.kYC.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KYCS and only return the `id`
     * const kYCWithIdOnly = await prisma.kYC.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KYCUpdateManyAndReturnArgs>(args: SelectSubset<T, KYCUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KYC.
     * @param {KYCUpsertArgs} args - Arguments to update or create a KYC.
     * @example
     * // Update or create a KYC
     * const kYC = await prisma.kYC.upsert({
     *   create: {
     *     // ... data to create a KYC
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KYC we want to update
     *   }
     * })
     */
    upsert<T extends KYCUpsertArgs>(args: SelectSubset<T, KYCUpsertArgs<ExtArgs>>): Prisma__KYCClient<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KYCS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCCountArgs} args - Arguments to filter KYCS to count.
     * @example
     * // Count the number of KYCS
     * const count = await prisma.kYC.count({
     *   where: {
     *     // ... the filter for the KYCS we want to count
     *   }
     * })
    **/
    count<T extends KYCCountArgs>(
      args?: Subset<T, KYCCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KYCCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KYC.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KYCAggregateArgs>(args: Subset<T, KYCAggregateArgs>): Prisma.PrismaPromise<GetKYCAggregateType<T>>

    /**
     * Group by KYC.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KYCGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KYCGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KYCGroupByArgs['orderBy'] }
        : { orderBy?: KYCGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KYCGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKYCGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KYC model
   */
  readonly fields: KYCFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KYC.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KYCClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    statusHistories<T extends KYC$statusHistoriesArgs<ExtArgs> = {}>(args?: Subset<T, KYC$statusHistoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KYCStatusHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KYC model
   */
  interface KYCFieldRefs {
    readonly id: FieldRef<"KYC", 'Int'>
    readonly userId: FieldRef<"KYC", 'Int'>
    readonly passportUrl: FieldRef<"KYC", 'String'>
    readonly nationalIdUrl: FieldRef<"KYC", 'String'>
    readonly proofOfAddressUrl: FieldRef<"KYC", 'String'>
    readonly photoUrl: FieldRef<"KYC", 'String'>
    readonly otherDocuments: FieldRef<"KYC", 'Json'>
    readonly fingerprintScanUrl: FieldRef<"KYC", 'String'>
    readonly fingerprintImageUrl: FieldRef<"KYC", 'String'>
    readonly signatureUrl: FieldRef<"KYC", 'String'>
    readonly selfieUrl: FieldRef<"KYC", 'String'>
    readonly status: FieldRef<"KYC", 'KYCStatus'>
    readonly submittedAt: FieldRef<"KYC", 'DateTime'>
    readonly verifiedAt: FieldRef<"KYC", 'DateTime'>
    readonly createdAt: FieldRef<"KYC", 'DateTime'>
    readonly updatedAt: FieldRef<"KYC", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KYC findUnique
   */
  export type KYCFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
    /**
     * Filter, which KYC to fetch.
     */
    where: KYCWhereUniqueInput
  }

  /**
   * KYC findUniqueOrThrow
   */
  export type KYCFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
    /**
     * Filter, which KYC to fetch.
     */
    where: KYCWhereUniqueInput
  }

  /**
   * KYC findFirst
   */
  export type KYCFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
    /**
     * Filter, which KYC to fetch.
     */
    where?: KYCWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KYCS to fetch.
     */
    orderBy?: KYCOrderByWithRelationInput | KYCOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KYCS.
     */
    cursor?: KYCWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KYCS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KYCS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KYCS.
     */
    distinct?: KYCScalarFieldEnum | KYCScalarFieldEnum[]
  }

  /**
   * KYC findFirstOrThrow
   */
  export type KYCFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
    /**
     * Filter, which KYC to fetch.
     */
    where?: KYCWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KYCS to fetch.
     */
    orderBy?: KYCOrderByWithRelationInput | KYCOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KYCS.
     */
    cursor?: KYCWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KYCS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KYCS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KYCS.
     */
    distinct?: KYCScalarFieldEnum | KYCScalarFieldEnum[]
  }

  /**
   * KYC findMany
   */
  export type KYCFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
    /**
     * Filter, which KYCS to fetch.
     */
    where?: KYCWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KYCS to fetch.
     */
    orderBy?: KYCOrderByWithRelationInput | KYCOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KYCS.
     */
    cursor?: KYCWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KYCS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KYCS.
     */
    skip?: number
    distinct?: KYCScalarFieldEnum | KYCScalarFieldEnum[]
  }

  /**
   * KYC create
   */
  export type KYCCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
    /**
     * The data needed to create a KYC.
     */
    data: XOR<KYCCreateInput, KYCUncheckedCreateInput>
  }

  /**
   * KYC createMany
   */
  export type KYCCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KYCS.
     */
    data: KYCCreateManyInput | KYCCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KYC createManyAndReturn
   */
  export type KYCCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * The data used to create many KYCS.
     */
    data: KYCCreateManyInput | KYCCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KYC update
   */
  export type KYCUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
    /**
     * The data needed to update a KYC.
     */
    data: XOR<KYCUpdateInput, KYCUncheckedUpdateInput>
    /**
     * Choose, which KYC to update.
     */
    where: KYCWhereUniqueInput
  }

  /**
   * KYC updateMany
   */
  export type KYCUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KYCS.
     */
    data: XOR<KYCUpdateManyMutationInput, KYCUncheckedUpdateManyInput>
    /**
     * Filter which KYCS to update
     */
    where?: KYCWhereInput
    /**
     * Limit how many KYCS to update.
     */
    limit?: number
  }

  /**
   * KYC updateManyAndReturn
   */
  export type KYCUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * The data used to update KYCS.
     */
    data: XOR<KYCUpdateManyMutationInput, KYCUncheckedUpdateManyInput>
    /**
     * Filter which KYCS to update
     */
    where?: KYCWhereInput
    /**
     * Limit how many KYCS to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KYC upsert
   */
  export type KYCUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
    /**
     * The filter to search for the KYC to update in case it exists.
     */
    where: KYCWhereUniqueInput
    /**
     * In case the KYC found by the `where` argument doesn't exist, create a new KYC with this data.
     */
    create: XOR<KYCCreateInput, KYCUncheckedCreateInput>
    /**
     * In case the KYC was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KYCUpdateInput, KYCUncheckedUpdateInput>
  }

  /**
   * KYC delete
   */
  export type KYCDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
    /**
     * Filter which KYC to delete.
     */
    where: KYCWhereUniqueInput
  }

  /**
   * KYC deleteMany
   */
  export type KYCDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KYCS to delete
     */
    where?: KYCWhereInput
    /**
     * Limit how many KYCS to delete.
     */
    limit?: number
  }

  /**
   * KYC.statusHistories
   */
  export type KYC$statusHistoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYCStatusHistory
     */
    select?: KYCStatusHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYCStatusHistory
     */
    omit?: KYCStatusHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCStatusHistoryInclude<ExtArgs> | null
    where?: KYCStatusHistoryWhereInput
    orderBy?: KYCStatusHistoryOrderByWithRelationInput | KYCStatusHistoryOrderByWithRelationInput[]
    cursor?: KYCStatusHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KYCStatusHistoryScalarFieldEnum | KYCStatusHistoryScalarFieldEnum[]
  }

  /**
   * KYC without action
   */
  export type KYCDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    uid: string | null
    name: string | null
    email: string | null
    password: string | null
    image: string | null
    dateOfBirth: string | null
    nationality: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    uid: string | null
    name: string | null
    email: string | null
    password: string | null
    image: string | null
    dateOfBirth: string | null
    nationality: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    uid: number
    name: number
    email: number
    password: number
    image: number
    dateOfBirth: number
    nationality: number
    phone: number
    address: number
    city: number
    state: number
    postalCode: number
    country: number
    mother: number
    father: number
    spouse: number
    children: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    uid?: true
    name?: true
    email?: true
    password?: true
    image?: true
    dateOfBirth?: true
    nationality?: true
    phone?: true
    address?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    uid?: true
    name?: true
    email?: true
    password?: true
    image?: true
    dateOfBirth?: true
    nationality?: true
    phone?: true
    address?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    uid?: true
    name?: true
    email?: true
    password?: true
    image?: true
    dateOfBirth?: true
    nationality?: true
    phone?: true
    address?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
    mother?: true
    father?: true
    spouse?: true
    children?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    uid: string
    name: string
    email: string
    password: string
    image: string | null
    dateOfBirth: string | null
    nationality: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    mother: JsonValue | null
    father: JsonValue | null
    spouse: JsonValue | null
    children: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    image?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    mother?: boolean
    father?: boolean
    spouse?: boolean
    children?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kycs?: boolean | User$kycsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    userRoles?: boolean | User$userRolesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    image?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    mother?: boolean
    father?: boolean
    spouse?: boolean
    children?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    image?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    mother?: boolean
    father?: boolean
    spouse?: boolean
    children?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    uid?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    image?: boolean
    dateOfBirth?: boolean
    nationality?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    mother?: boolean
    father?: boolean
    spouse?: boolean
    children?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uid" | "name" | "email" | "password" | "image" | "dateOfBirth" | "nationality" | "phone" | "address" | "city" | "state" | "postalCode" | "country" | "mother" | "father" | "spouse" | "children" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kycs?: boolean | User$kycsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    userRoles?: boolean | User$userRolesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      kycs: Prisma.$KYCPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      userRoles: Prisma.$UserRolePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      uid: string
      name: string
      email: string
      password: string
      image: string | null
      dateOfBirth: string | null
      nationality: string | null
      phone: string | null
      address: string | null
      city: string | null
      state: string | null
      postalCode: string | null
      country: string | null
      mother: Prisma.JsonValue | null
      father: Prisma.JsonValue | null
      spouse: Prisma.JsonValue | null
      children: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kycs<T extends User$kycsArgs<ExtArgs> = {}>(args?: Subset<T, User$kycsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KYCPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userRoles<T extends User$userRolesArgs<ExtArgs> = {}>(args?: Subset<T, User$userRolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly uid: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly image: FieldRef<"User", 'String'>
    readonly dateOfBirth: FieldRef<"User", 'String'>
    readonly nationality: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly city: FieldRef<"User", 'String'>
    readonly state: FieldRef<"User", 'String'>
    readonly postalCode: FieldRef<"User", 'String'>
    readonly country: FieldRef<"User", 'String'>
    readonly mother: FieldRef<"User", 'Json'>
    readonly father: FieldRef<"User", 'Json'>
    readonly spouse: FieldRef<"User", 'Json'>
    readonly children: FieldRef<"User", 'Json'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.kycs
   */
  export type User$kycsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KYC
     */
    select?: KYCSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KYC
     */
    omit?: KYCOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KYCInclude<ExtArgs> | null
    where?: KYCWhereInput
    orderBy?: KYCOrderByWithRelationInput | KYCOrderByWithRelationInput[]
    cursor?: KYCWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KYCScalarFieldEnum | KYCScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.userRoles
   */
  export type User$userRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    where?: UserRoleWhereInput
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    cursor?: UserRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleAvgAggregateOutputType = {
    id: number | null
  }

  export type RoleSumAggregateOutputType = {
    id: number | null
  }

  export type RoleMinAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type RoleMaxAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type RoleAvgAggregateInputType = {
    id?: true
  }

  export type RoleSumAggregateInputType = {
    id?: true
  }

  export type RoleMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _avg?: RoleAvgAggregateInputType
    _sum?: RoleSumAggregateInputType
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: number
    name: string
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    users?: boolean | Role$usersArgs<ExtArgs>
    scopes?: boolean | Role$scopesArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name", ExtArgs["result"]["role"]>
  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Role$usersArgs<ExtArgs>
    scopes?: boolean | Role$scopesArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      users: Prisma.$UserRolePayload<ExtArgs>[]
      scopes: Prisma.$RoleScopePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {RoleUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Role$usersArgs<ExtArgs> = {}>(args?: Subset<T, Role$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    scopes<T extends Role$scopesArgs<ExtArgs> = {}>(args?: Subset<T, Role$scopesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'Int'>
    readonly name: FieldRef<"Role", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role updateManyAndReturn
   */
  export type RoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role.users
   */
  export type Role$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    where?: UserRoleWhereInput
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    cursor?: UserRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * Role.scopes
   */
  export type Role$scopesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    where?: RoleScopeWhereInput
    orderBy?: RoleScopeOrderByWithRelationInput | RoleScopeOrderByWithRelationInput[]
    cursor?: RoleScopeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoleScopeScalarFieldEnum | RoleScopeScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model Scope
   */

  export type AggregateScope = {
    _count: ScopeCountAggregateOutputType | null
    _avg: ScopeAvgAggregateOutputType | null
    _sum: ScopeSumAggregateOutputType | null
    _min: ScopeMinAggregateOutputType | null
    _max: ScopeMaxAggregateOutputType | null
  }

  export type ScopeAvgAggregateOutputType = {
    id: number | null
  }

  export type ScopeSumAggregateOutputType = {
    id: number | null
  }

  export type ScopeMinAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type ScopeMaxAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type ScopeCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type ScopeAvgAggregateInputType = {
    id?: true
  }

  export type ScopeSumAggregateInputType = {
    id?: true
  }

  export type ScopeMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type ScopeMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type ScopeCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type ScopeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Scope to aggregate.
     */
    where?: ScopeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scopes to fetch.
     */
    orderBy?: ScopeOrderByWithRelationInput | ScopeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScopeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scopes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Scopes
    **/
    _count?: true | ScopeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScopeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScopeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScopeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScopeMaxAggregateInputType
  }

  export type GetScopeAggregateType<T extends ScopeAggregateArgs> = {
        [P in keyof T & keyof AggregateScope]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScope[P]>
      : GetScalarType<T[P], AggregateScope[P]>
  }




  export type ScopeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScopeWhereInput
    orderBy?: ScopeOrderByWithAggregationInput | ScopeOrderByWithAggregationInput[]
    by: ScopeScalarFieldEnum[] | ScopeScalarFieldEnum
    having?: ScopeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScopeCountAggregateInputType | true
    _avg?: ScopeAvgAggregateInputType
    _sum?: ScopeSumAggregateInputType
    _min?: ScopeMinAggregateInputType
    _max?: ScopeMaxAggregateInputType
  }

  export type ScopeGroupByOutputType = {
    id: number
    name: string
    _count: ScopeCountAggregateOutputType | null
    _avg: ScopeAvgAggregateOutputType | null
    _sum: ScopeSumAggregateOutputType | null
    _min: ScopeMinAggregateOutputType | null
    _max: ScopeMaxAggregateOutputType | null
  }

  type GetScopeGroupByPayload<T extends ScopeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScopeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScopeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScopeGroupByOutputType[P]>
            : GetScalarType<T[P], ScopeGroupByOutputType[P]>
        }
      >
    >


  export type ScopeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    roles?: boolean | Scope$rolesArgs<ExtArgs>
    _count?: boolean | ScopeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scope"]>

  export type ScopeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["scope"]>

  export type ScopeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["scope"]>

  export type ScopeSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type ScopeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name", ExtArgs["result"]["scope"]>
  export type ScopeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roles?: boolean | Scope$rolesArgs<ExtArgs>
    _count?: boolean | ScopeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ScopeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ScopeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ScopePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Scope"
    objects: {
      roles: Prisma.$RoleScopePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
    }, ExtArgs["result"]["scope"]>
    composites: {}
  }

  type ScopeGetPayload<S extends boolean | null | undefined | ScopeDefaultArgs> = $Result.GetResult<Prisma.$ScopePayload, S>

  type ScopeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScopeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScopeCountAggregateInputType | true
    }

  export interface ScopeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Scope'], meta: { name: 'Scope' } }
    /**
     * Find zero or one Scope that matches the filter.
     * @param {ScopeFindUniqueArgs} args - Arguments to find a Scope
     * @example
     * // Get one Scope
     * const scope = await prisma.scope.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScopeFindUniqueArgs>(args: SelectSubset<T, ScopeFindUniqueArgs<ExtArgs>>): Prisma__ScopeClient<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Scope that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScopeFindUniqueOrThrowArgs} args - Arguments to find a Scope
     * @example
     * // Get one Scope
     * const scope = await prisma.scope.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScopeFindUniqueOrThrowArgs>(args: SelectSubset<T, ScopeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScopeClient<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Scope that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScopeFindFirstArgs} args - Arguments to find a Scope
     * @example
     * // Get one Scope
     * const scope = await prisma.scope.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScopeFindFirstArgs>(args?: SelectSubset<T, ScopeFindFirstArgs<ExtArgs>>): Prisma__ScopeClient<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Scope that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScopeFindFirstOrThrowArgs} args - Arguments to find a Scope
     * @example
     * // Get one Scope
     * const scope = await prisma.scope.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScopeFindFirstOrThrowArgs>(args?: SelectSubset<T, ScopeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScopeClient<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Scopes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScopeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Scopes
     * const scopes = await prisma.scope.findMany()
     * 
     * // Get first 10 Scopes
     * const scopes = await prisma.scope.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scopeWithIdOnly = await prisma.scope.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScopeFindManyArgs>(args?: SelectSubset<T, ScopeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Scope.
     * @param {ScopeCreateArgs} args - Arguments to create a Scope.
     * @example
     * // Create one Scope
     * const Scope = await prisma.scope.create({
     *   data: {
     *     // ... data to create a Scope
     *   }
     * })
     * 
     */
    create<T extends ScopeCreateArgs>(args: SelectSubset<T, ScopeCreateArgs<ExtArgs>>): Prisma__ScopeClient<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Scopes.
     * @param {ScopeCreateManyArgs} args - Arguments to create many Scopes.
     * @example
     * // Create many Scopes
     * const scope = await prisma.scope.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScopeCreateManyArgs>(args?: SelectSubset<T, ScopeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Scopes and returns the data saved in the database.
     * @param {ScopeCreateManyAndReturnArgs} args - Arguments to create many Scopes.
     * @example
     * // Create many Scopes
     * const scope = await prisma.scope.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Scopes and only return the `id`
     * const scopeWithIdOnly = await prisma.scope.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScopeCreateManyAndReturnArgs>(args?: SelectSubset<T, ScopeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Scope.
     * @param {ScopeDeleteArgs} args - Arguments to delete one Scope.
     * @example
     * // Delete one Scope
     * const Scope = await prisma.scope.delete({
     *   where: {
     *     // ... filter to delete one Scope
     *   }
     * })
     * 
     */
    delete<T extends ScopeDeleteArgs>(args: SelectSubset<T, ScopeDeleteArgs<ExtArgs>>): Prisma__ScopeClient<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Scope.
     * @param {ScopeUpdateArgs} args - Arguments to update one Scope.
     * @example
     * // Update one Scope
     * const scope = await prisma.scope.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScopeUpdateArgs>(args: SelectSubset<T, ScopeUpdateArgs<ExtArgs>>): Prisma__ScopeClient<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Scopes.
     * @param {ScopeDeleteManyArgs} args - Arguments to filter Scopes to delete.
     * @example
     * // Delete a few Scopes
     * const { count } = await prisma.scope.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScopeDeleteManyArgs>(args?: SelectSubset<T, ScopeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Scopes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScopeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Scopes
     * const scope = await prisma.scope.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScopeUpdateManyArgs>(args: SelectSubset<T, ScopeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Scopes and returns the data updated in the database.
     * @param {ScopeUpdateManyAndReturnArgs} args - Arguments to update many Scopes.
     * @example
     * // Update many Scopes
     * const scope = await prisma.scope.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Scopes and only return the `id`
     * const scopeWithIdOnly = await prisma.scope.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ScopeUpdateManyAndReturnArgs>(args: SelectSubset<T, ScopeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Scope.
     * @param {ScopeUpsertArgs} args - Arguments to update or create a Scope.
     * @example
     * // Update or create a Scope
     * const scope = await prisma.scope.upsert({
     *   create: {
     *     // ... data to create a Scope
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Scope we want to update
     *   }
     * })
     */
    upsert<T extends ScopeUpsertArgs>(args: SelectSubset<T, ScopeUpsertArgs<ExtArgs>>): Prisma__ScopeClient<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Scopes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScopeCountArgs} args - Arguments to filter Scopes to count.
     * @example
     * // Count the number of Scopes
     * const count = await prisma.scope.count({
     *   where: {
     *     // ... the filter for the Scopes we want to count
     *   }
     * })
    **/
    count<T extends ScopeCountArgs>(
      args?: Subset<T, ScopeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScopeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Scope.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScopeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScopeAggregateArgs>(args: Subset<T, ScopeAggregateArgs>): Prisma.PrismaPromise<GetScopeAggregateType<T>>

    /**
     * Group by Scope.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScopeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScopeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScopeGroupByArgs['orderBy'] }
        : { orderBy?: ScopeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScopeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScopeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Scope model
   */
  readonly fields: ScopeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Scope.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScopeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roles<T extends Scope$rolesArgs<ExtArgs> = {}>(args?: Subset<T, Scope$rolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Scope model
   */
  interface ScopeFieldRefs {
    readonly id: FieldRef<"Scope", 'Int'>
    readonly name: FieldRef<"Scope", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Scope findUnique
   */
  export type ScopeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScopeInclude<ExtArgs> | null
    /**
     * Filter, which Scope to fetch.
     */
    where: ScopeWhereUniqueInput
  }

  /**
   * Scope findUniqueOrThrow
   */
  export type ScopeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScopeInclude<ExtArgs> | null
    /**
     * Filter, which Scope to fetch.
     */
    where: ScopeWhereUniqueInput
  }

  /**
   * Scope findFirst
   */
  export type ScopeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScopeInclude<ExtArgs> | null
    /**
     * Filter, which Scope to fetch.
     */
    where?: ScopeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scopes to fetch.
     */
    orderBy?: ScopeOrderByWithRelationInput | ScopeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Scopes.
     */
    cursor?: ScopeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scopes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Scopes.
     */
    distinct?: ScopeScalarFieldEnum | ScopeScalarFieldEnum[]
  }

  /**
   * Scope findFirstOrThrow
   */
  export type ScopeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScopeInclude<ExtArgs> | null
    /**
     * Filter, which Scope to fetch.
     */
    where?: ScopeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scopes to fetch.
     */
    orderBy?: ScopeOrderByWithRelationInput | ScopeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Scopes.
     */
    cursor?: ScopeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scopes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Scopes.
     */
    distinct?: ScopeScalarFieldEnum | ScopeScalarFieldEnum[]
  }

  /**
   * Scope findMany
   */
  export type ScopeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScopeInclude<ExtArgs> | null
    /**
     * Filter, which Scopes to fetch.
     */
    where?: ScopeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scopes to fetch.
     */
    orderBy?: ScopeOrderByWithRelationInput | ScopeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Scopes.
     */
    cursor?: ScopeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scopes.
     */
    skip?: number
    distinct?: ScopeScalarFieldEnum | ScopeScalarFieldEnum[]
  }

  /**
   * Scope create
   */
  export type ScopeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScopeInclude<ExtArgs> | null
    /**
     * The data needed to create a Scope.
     */
    data: XOR<ScopeCreateInput, ScopeUncheckedCreateInput>
  }

  /**
   * Scope createMany
   */
  export type ScopeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Scopes.
     */
    data: ScopeCreateManyInput | ScopeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Scope createManyAndReturn
   */
  export type ScopeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * The data used to create many Scopes.
     */
    data: ScopeCreateManyInput | ScopeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Scope update
   */
  export type ScopeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScopeInclude<ExtArgs> | null
    /**
     * The data needed to update a Scope.
     */
    data: XOR<ScopeUpdateInput, ScopeUncheckedUpdateInput>
    /**
     * Choose, which Scope to update.
     */
    where: ScopeWhereUniqueInput
  }

  /**
   * Scope updateMany
   */
  export type ScopeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Scopes.
     */
    data: XOR<ScopeUpdateManyMutationInput, ScopeUncheckedUpdateManyInput>
    /**
     * Filter which Scopes to update
     */
    where?: ScopeWhereInput
    /**
     * Limit how many Scopes to update.
     */
    limit?: number
  }

  /**
   * Scope updateManyAndReturn
   */
  export type ScopeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * The data used to update Scopes.
     */
    data: XOR<ScopeUpdateManyMutationInput, ScopeUncheckedUpdateManyInput>
    /**
     * Filter which Scopes to update
     */
    where?: ScopeWhereInput
    /**
     * Limit how many Scopes to update.
     */
    limit?: number
  }

  /**
   * Scope upsert
   */
  export type ScopeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScopeInclude<ExtArgs> | null
    /**
     * The filter to search for the Scope to update in case it exists.
     */
    where: ScopeWhereUniqueInput
    /**
     * In case the Scope found by the `where` argument doesn't exist, create a new Scope with this data.
     */
    create: XOR<ScopeCreateInput, ScopeUncheckedCreateInput>
    /**
     * In case the Scope was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScopeUpdateInput, ScopeUncheckedUpdateInput>
  }

  /**
   * Scope delete
   */
  export type ScopeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScopeInclude<ExtArgs> | null
    /**
     * Filter which Scope to delete.
     */
    where: ScopeWhereUniqueInput
  }

  /**
   * Scope deleteMany
   */
  export type ScopeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Scopes to delete
     */
    where?: ScopeWhereInput
    /**
     * Limit how many Scopes to delete.
     */
    limit?: number
  }

  /**
   * Scope.roles
   */
  export type Scope$rolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    where?: RoleScopeWhereInput
    orderBy?: RoleScopeOrderByWithRelationInput | RoleScopeOrderByWithRelationInput[]
    cursor?: RoleScopeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoleScopeScalarFieldEnum | RoleScopeScalarFieldEnum[]
  }

  /**
   * Scope without action
   */
  export type ScopeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scope
     */
    select?: ScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scope
     */
    omit?: ScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScopeInclude<ExtArgs> | null
  }


  /**
   * Model UserRole
   */

  export type AggregateUserRole = {
    _count: UserRoleCountAggregateOutputType | null
    _avg: UserRoleAvgAggregateOutputType | null
    _sum: UserRoleSumAggregateOutputType | null
    _min: UserRoleMinAggregateOutputType | null
    _max: UserRoleMaxAggregateOutputType | null
  }

  export type UserRoleAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    roleId: number | null
  }

  export type UserRoleSumAggregateOutputType = {
    id: number | null
    userId: number | null
    roleId: number | null
  }

  export type UserRoleMinAggregateOutputType = {
    id: number | null
    userId: number | null
    roleId: number | null
  }

  export type UserRoleMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    roleId: number | null
  }

  export type UserRoleCountAggregateOutputType = {
    id: number
    userId: number
    roleId: number
    _all: number
  }


  export type UserRoleAvgAggregateInputType = {
    id?: true
    userId?: true
    roleId?: true
  }

  export type UserRoleSumAggregateInputType = {
    id?: true
    userId?: true
    roleId?: true
  }

  export type UserRoleMinAggregateInputType = {
    id?: true
    userId?: true
    roleId?: true
  }

  export type UserRoleMaxAggregateInputType = {
    id?: true
    userId?: true
    roleId?: true
  }

  export type UserRoleCountAggregateInputType = {
    id?: true
    userId?: true
    roleId?: true
    _all?: true
  }

  export type UserRoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserRole to aggregate.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserRoles
    **/
    _count?: true | UserRoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserRoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserRoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserRoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserRoleMaxAggregateInputType
  }

  export type GetUserRoleAggregateType<T extends UserRoleAggregateArgs> = {
        [P in keyof T & keyof AggregateUserRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserRole[P]>
      : GetScalarType<T[P], AggregateUserRole[P]>
  }




  export type UserRoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserRoleWhereInput
    orderBy?: UserRoleOrderByWithAggregationInput | UserRoleOrderByWithAggregationInput[]
    by: UserRoleScalarFieldEnum[] | UserRoleScalarFieldEnum
    having?: UserRoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserRoleCountAggregateInputType | true
    _avg?: UserRoleAvgAggregateInputType
    _sum?: UserRoleSumAggregateInputType
    _min?: UserRoleMinAggregateInputType
    _max?: UserRoleMaxAggregateInputType
  }

  export type UserRoleGroupByOutputType = {
    id: number
    userId: number
    roleId: number
    _count: UserRoleCountAggregateOutputType | null
    _avg: UserRoleAvgAggregateOutputType | null
    _sum: UserRoleSumAggregateOutputType | null
    _min: UserRoleMinAggregateOutputType | null
    _max: UserRoleMaxAggregateOutputType | null
  }

  type GetUserRoleGroupByPayload<T extends UserRoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserRoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserRoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserRoleGroupByOutputType[P]>
            : GetScalarType<T[P], UserRoleGroupByOutputType[P]>
        }
      >
    >


  export type UserRoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    roleId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRole"]>

  export type UserRoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    roleId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRole"]>

  export type UserRoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    roleId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userRole"]>

  export type UserRoleSelectScalar = {
    id?: boolean
    userId?: boolean
    roleId?: boolean
  }

  export type UserRoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "roleId", ExtArgs["result"]["userRole"]>
  export type UserRoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type UserRoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type UserRoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }

  export type $UserRolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserRole"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      role: Prisma.$RolePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      roleId: number
    }, ExtArgs["result"]["userRole"]>
    composites: {}
  }

  type UserRoleGetPayload<S extends boolean | null | undefined | UserRoleDefaultArgs> = $Result.GetResult<Prisma.$UserRolePayload, S>

  type UserRoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserRoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserRoleCountAggregateInputType | true
    }

  export interface UserRoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserRole'], meta: { name: 'UserRole' } }
    /**
     * Find zero or one UserRole that matches the filter.
     * @param {UserRoleFindUniqueArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserRoleFindUniqueArgs>(args: SelectSubset<T, UserRoleFindUniqueArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserRole that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserRoleFindUniqueOrThrowArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserRoleFindUniqueOrThrowArgs>(args: SelectSubset<T, UserRoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserRole that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleFindFirstArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserRoleFindFirstArgs>(args?: SelectSubset<T, UserRoleFindFirstArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserRole that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleFindFirstOrThrowArgs} args - Arguments to find a UserRole
     * @example
     * // Get one UserRole
     * const userRole = await prisma.userRole.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserRoleFindFirstOrThrowArgs>(args?: SelectSubset<T, UserRoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserRoles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserRoles
     * const userRoles = await prisma.userRole.findMany()
     * 
     * // Get first 10 UserRoles
     * const userRoles = await prisma.userRole.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userRoleWithIdOnly = await prisma.userRole.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserRoleFindManyArgs>(args?: SelectSubset<T, UserRoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserRole.
     * @param {UserRoleCreateArgs} args - Arguments to create a UserRole.
     * @example
     * // Create one UserRole
     * const UserRole = await prisma.userRole.create({
     *   data: {
     *     // ... data to create a UserRole
     *   }
     * })
     * 
     */
    create<T extends UserRoleCreateArgs>(args: SelectSubset<T, UserRoleCreateArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserRoles.
     * @param {UserRoleCreateManyArgs} args - Arguments to create many UserRoles.
     * @example
     * // Create many UserRoles
     * const userRole = await prisma.userRole.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserRoleCreateManyArgs>(args?: SelectSubset<T, UserRoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserRoles and returns the data saved in the database.
     * @param {UserRoleCreateManyAndReturnArgs} args - Arguments to create many UserRoles.
     * @example
     * // Create many UserRoles
     * const userRole = await prisma.userRole.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserRoles and only return the `id`
     * const userRoleWithIdOnly = await prisma.userRole.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserRoleCreateManyAndReturnArgs>(args?: SelectSubset<T, UserRoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserRole.
     * @param {UserRoleDeleteArgs} args - Arguments to delete one UserRole.
     * @example
     * // Delete one UserRole
     * const UserRole = await prisma.userRole.delete({
     *   where: {
     *     // ... filter to delete one UserRole
     *   }
     * })
     * 
     */
    delete<T extends UserRoleDeleteArgs>(args: SelectSubset<T, UserRoleDeleteArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserRole.
     * @param {UserRoleUpdateArgs} args - Arguments to update one UserRole.
     * @example
     * // Update one UserRole
     * const userRole = await prisma.userRole.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserRoleUpdateArgs>(args: SelectSubset<T, UserRoleUpdateArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserRoles.
     * @param {UserRoleDeleteManyArgs} args - Arguments to filter UserRoles to delete.
     * @example
     * // Delete a few UserRoles
     * const { count } = await prisma.userRole.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserRoleDeleteManyArgs>(args?: SelectSubset<T, UserRoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserRoles
     * const userRole = await prisma.userRole.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserRoleUpdateManyArgs>(args: SelectSubset<T, UserRoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserRoles and returns the data updated in the database.
     * @param {UserRoleUpdateManyAndReturnArgs} args - Arguments to update many UserRoles.
     * @example
     * // Update many UserRoles
     * const userRole = await prisma.userRole.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserRoles and only return the `id`
     * const userRoleWithIdOnly = await prisma.userRole.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserRoleUpdateManyAndReturnArgs>(args: SelectSubset<T, UserRoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserRole.
     * @param {UserRoleUpsertArgs} args - Arguments to update or create a UserRole.
     * @example
     * // Update or create a UserRole
     * const userRole = await prisma.userRole.upsert({
     *   create: {
     *     // ... data to create a UserRole
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserRole we want to update
     *   }
     * })
     */
    upsert<T extends UserRoleUpsertArgs>(args: SelectSubset<T, UserRoleUpsertArgs<ExtArgs>>): Prisma__UserRoleClient<$Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleCountArgs} args - Arguments to filter UserRoles to count.
     * @example
     * // Count the number of UserRoles
     * const count = await prisma.userRole.count({
     *   where: {
     *     // ... the filter for the UserRoles we want to count
     *   }
     * })
    **/
    count<T extends UserRoleCountArgs>(
      args?: Subset<T, UserRoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserRoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserRoleAggregateArgs>(args: Subset<T, UserRoleAggregateArgs>): Prisma.PrismaPromise<GetUserRoleAggregateType<T>>

    /**
     * Group by UserRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserRoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserRoleGroupByArgs['orderBy'] }
        : { orderBy?: UserRoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserRole model
   */
  readonly fields: UserRoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserRole.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserRoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserRole model
   */
  interface UserRoleFieldRefs {
    readonly id: FieldRef<"UserRole", 'Int'>
    readonly userId: FieldRef<"UserRole", 'Int'>
    readonly roleId: FieldRef<"UserRole", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * UserRole findUnique
   */
  export type UserRoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole findUniqueOrThrow
   */
  export type UserRoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole findFirst
   */
  export type UserRoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserRoles.
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserRoles.
     */
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * UserRole findFirstOrThrow
   */
  export type UserRoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRole to fetch.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserRoles.
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserRoles.
     */
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * UserRole findMany
   */
  export type UserRoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter, which UserRoles to fetch.
     */
    where?: UserRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRoles to fetch.
     */
    orderBy?: UserRoleOrderByWithRelationInput | UserRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserRoles.
     */
    cursor?: UserRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRoles.
     */
    skip?: number
    distinct?: UserRoleScalarFieldEnum | UserRoleScalarFieldEnum[]
  }

  /**
   * UserRole create
   */
  export type UserRoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * The data needed to create a UserRole.
     */
    data: XOR<UserRoleCreateInput, UserRoleUncheckedCreateInput>
  }

  /**
   * UserRole createMany
   */
  export type UserRoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserRoles.
     */
    data: UserRoleCreateManyInput | UserRoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserRole createManyAndReturn
   */
  export type UserRoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * The data used to create many UserRoles.
     */
    data: UserRoleCreateManyInput | UserRoleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserRole update
   */
  export type UserRoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * The data needed to update a UserRole.
     */
    data: XOR<UserRoleUpdateInput, UserRoleUncheckedUpdateInput>
    /**
     * Choose, which UserRole to update.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole updateMany
   */
  export type UserRoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserRoles.
     */
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyInput>
    /**
     * Filter which UserRoles to update
     */
    where?: UserRoleWhereInput
    /**
     * Limit how many UserRoles to update.
     */
    limit?: number
  }

  /**
   * UserRole updateManyAndReturn
   */
  export type UserRoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * The data used to update UserRoles.
     */
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyInput>
    /**
     * Filter which UserRoles to update
     */
    where?: UserRoleWhereInput
    /**
     * Limit how many UserRoles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserRole upsert
   */
  export type UserRoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * The filter to search for the UserRole to update in case it exists.
     */
    where: UserRoleWhereUniqueInput
    /**
     * In case the UserRole found by the `where` argument doesn't exist, create a new UserRole with this data.
     */
    create: XOR<UserRoleCreateInput, UserRoleUncheckedCreateInput>
    /**
     * In case the UserRole was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserRoleUpdateInput, UserRoleUncheckedUpdateInput>
  }

  /**
   * UserRole delete
   */
  export type UserRoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
    /**
     * Filter which UserRole to delete.
     */
    where: UserRoleWhereUniqueInput
  }

  /**
   * UserRole deleteMany
   */
  export type UserRoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserRoles to delete
     */
    where?: UserRoleWhereInput
    /**
     * Limit how many UserRoles to delete.
     */
    limit?: number
  }

  /**
   * UserRole without action
   */
  export type UserRoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRole
     */
    select?: UserRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserRole
     */
    omit?: UserRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserRoleInclude<ExtArgs> | null
  }


  /**
   * Model RoleScope
   */

  export type AggregateRoleScope = {
    _count: RoleScopeCountAggregateOutputType | null
    _avg: RoleScopeAvgAggregateOutputType | null
    _sum: RoleScopeSumAggregateOutputType | null
    _min: RoleScopeMinAggregateOutputType | null
    _max: RoleScopeMaxAggregateOutputType | null
  }

  export type RoleScopeAvgAggregateOutputType = {
    id: number | null
    roleId: number | null
    scopeId: number | null
  }

  export type RoleScopeSumAggregateOutputType = {
    id: number | null
    roleId: number | null
    scopeId: number | null
  }

  export type RoleScopeMinAggregateOutputType = {
    id: number | null
    roleId: number | null
    scopeId: number | null
  }

  export type RoleScopeMaxAggregateOutputType = {
    id: number | null
    roleId: number | null
    scopeId: number | null
  }

  export type RoleScopeCountAggregateOutputType = {
    id: number
    roleId: number
    scopeId: number
    _all: number
  }


  export type RoleScopeAvgAggregateInputType = {
    id?: true
    roleId?: true
    scopeId?: true
  }

  export type RoleScopeSumAggregateInputType = {
    id?: true
    roleId?: true
    scopeId?: true
  }

  export type RoleScopeMinAggregateInputType = {
    id?: true
    roleId?: true
    scopeId?: true
  }

  export type RoleScopeMaxAggregateInputType = {
    id?: true
    roleId?: true
    scopeId?: true
  }

  export type RoleScopeCountAggregateInputType = {
    id?: true
    roleId?: true
    scopeId?: true
    _all?: true
  }

  export type RoleScopeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleScope to aggregate.
     */
    where?: RoleScopeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleScopes to fetch.
     */
    orderBy?: RoleScopeOrderByWithRelationInput | RoleScopeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleScopeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleScopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleScopes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoleScopes
    **/
    _count?: true | RoleScopeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoleScopeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoleScopeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleScopeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleScopeMaxAggregateInputType
  }

  export type GetRoleScopeAggregateType<T extends RoleScopeAggregateArgs> = {
        [P in keyof T & keyof AggregateRoleScope]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoleScope[P]>
      : GetScalarType<T[P], AggregateRoleScope[P]>
  }




  export type RoleScopeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleScopeWhereInput
    orderBy?: RoleScopeOrderByWithAggregationInput | RoleScopeOrderByWithAggregationInput[]
    by: RoleScopeScalarFieldEnum[] | RoleScopeScalarFieldEnum
    having?: RoleScopeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleScopeCountAggregateInputType | true
    _avg?: RoleScopeAvgAggregateInputType
    _sum?: RoleScopeSumAggregateInputType
    _min?: RoleScopeMinAggregateInputType
    _max?: RoleScopeMaxAggregateInputType
  }

  export type RoleScopeGroupByOutputType = {
    id: number
    roleId: number
    scopeId: number
    _count: RoleScopeCountAggregateOutputType | null
    _avg: RoleScopeAvgAggregateOutputType | null
    _sum: RoleScopeSumAggregateOutputType | null
    _min: RoleScopeMinAggregateOutputType | null
    _max: RoleScopeMaxAggregateOutputType | null
  }

  type GetRoleScopeGroupByPayload<T extends RoleScopeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleScopeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleScopeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleScopeGroupByOutputType[P]>
            : GetScalarType<T[P], RoleScopeGroupByOutputType[P]>
        }
      >
    >


  export type RoleScopeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    scopeId?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    scope?: boolean | ScopeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleScope"]>

  export type RoleScopeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    scopeId?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    scope?: boolean | ScopeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleScope"]>

  export type RoleScopeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    scopeId?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    scope?: boolean | ScopeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleScope"]>

  export type RoleScopeSelectScalar = {
    id?: boolean
    roleId?: boolean
    scopeId?: boolean
  }

  export type RoleScopeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roleId" | "scopeId", ExtArgs["result"]["roleScope"]>
  export type RoleScopeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    scope?: boolean | ScopeDefaultArgs<ExtArgs>
  }
  export type RoleScopeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    scope?: boolean | ScopeDefaultArgs<ExtArgs>
  }
  export type RoleScopeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    scope?: boolean | ScopeDefaultArgs<ExtArgs>
  }

  export type $RoleScopePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoleScope"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      scope: Prisma.$ScopePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      roleId: number
      scopeId: number
    }, ExtArgs["result"]["roleScope"]>
    composites: {}
  }

  type RoleScopeGetPayload<S extends boolean | null | undefined | RoleScopeDefaultArgs> = $Result.GetResult<Prisma.$RoleScopePayload, S>

  type RoleScopeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleScopeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleScopeCountAggregateInputType | true
    }

  export interface RoleScopeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoleScope'], meta: { name: 'RoleScope' } }
    /**
     * Find zero or one RoleScope that matches the filter.
     * @param {RoleScopeFindUniqueArgs} args - Arguments to find a RoleScope
     * @example
     * // Get one RoleScope
     * const roleScope = await prisma.roleScope.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleScopeFindUniqueArgs>(args: SelectSubset<T, RoleScopeFindUniqueArgs<ExtArgs>>): Prisma__RoleScopeClient<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoleScope that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleScopeFindUniqueOrThrowArgs} args - Arguments to find a RoleScope
     * @example
     * // Get one RoleScope
     * const roleScope = await prisma.roleScope.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleScopeFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleScopeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleScopeClient<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleScope that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleScopeFindFirstArgs} args - Arguments to find a RoleScope
     * @example
     * // Get one RoleScope
     * const roleScope = await prisma.roleScope.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleScopeFindFirstArgs>(args?: SelectSubset<T, RoleScopeFindFirstArgs<ExtArgs>>): Prisma__RoleScopeClient<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleScope that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleScopeFindFirstOrThrowArgs} args - Arguments to find a RoleScope
     * @example
     * // Get one RoleScope
     * const roleScope = await prisma.roleScope.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleScopeFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleScopeFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleScopeClient<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoleScopes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleScopeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoleScopes
     * const roleScopes = await prisma.roleScope.findMany()
     * 
     * // Get first 10 RoleScopes
     * const roleScopes = await prisma.roleScope.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleScopeWithIdOnly = await prisma.roleScope.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleScopeFindManyArgs>(args?: SelectSubset<T, RoleScopeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoleScope.
     * @param {RoleScopeCreateArgs} args - Arguments to create a RoleScope.
     * @example
     * // Create one RoleScope
     * const RoleScope = await prisma.roleScope.create({
     *   data: {
     *     // ... data to create a RoleScope
     *   }
     * })
     * 
     */
    create<T extends RoleScopeCreateArgs>(args: SelectSubset<T, RoleScopeCreateArgs<ExtArgs>>): Prisma__RoleScopeClient<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoleScopes.
     * @param {RoleScopeCreateManyArgs} args - Arguments to create many RoleScopes.
     * @example
     * // Create many RoleScopes
     * const roleScope = await prisma.roleScope.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleScopeCreateManyArgs>(args?: SelectSubset<T, RoleScopeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoleScopes and returns the data saved in the database.
     * @param {RoleScopeCreateManyAndReturnArgs} args - Arguments to create many RoleScopes.
     * @example
     * // Create many RoleScopes
     * const roleScope = await prisma.roleScope.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoleScopes and only return the `id`
     * const roleScopeWithIdOnly = await prisma.roleScope.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleScopeCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleScopeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoleScope.
     * @param {RoleScopeDeleteArgs} args - Arguments to delete one RoleScope.
     * @example
     * // Delete one RoleScope
     * const RoleScope = await prisma.roleScope.delete({
     *   where: {
     *     // ... filter to delete one RoleScope
     *   }
     * })
     * 
     */
    delete<T extends RoleScopeDeleteArgs>(args: SelectSubset<T, RoleScopeDeleteArgs<ExtArgs>>): Prisma__RoleScopeClient<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoleScope.
     * @param {RoleScopeUpdateArgs} args - Arguments to update one RoleScope.
     * @example
     * // Update one RoleScope
     * const roleScope = await prisma.roleScope.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleScopeUpdateArgs>(args: SelectSubset<T, RoleScopeUpdateArgs<ExtArgs>>): Prisma__RoleScopeClient<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoleScopes.
     * @param {RoleScopeDeleteManyArgs} args - Arguments to filter RoleScopes to delete.
     * @example
     * // Delete a few RoleScopes
     * const { count } = await prisma.roleScope.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleScopeDeleteManyArgs>(args?: SelectSubset<T, RoleScopeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleScopes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleScopeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoleScopes
     * const roleScope = await prisma.roleScope.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleScopeUpdateManyArgs>(args: SelectSubset<T, RoleScopeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleScopes and returns the data updated in the database.
     * @param {RoleScopeUpdateManyAndReturnArgs} args - Arguments to update many RoleScopes.
     * @example
     * // Update many RoleScopes
     * const roleScope = await prisma.roleScope.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoleScopes and only return the `id`
     * const roleScopeWithIdOnly = await prisma.roleScope.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleScopeUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleScopeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoleScope.
     * @param {RoleScopeUpsertArgs} args - Arguments to update or create a RoleScope.
     * @example
     * // Update or create a RoleScope
     * const roleScope = await prisma.roleScope.upsert({
     *   create: {
     *     // ... data to create a RoleScope
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoleScope we want to update
     *   }
     * })
     */
    upsert<T extends RoleScopeUpsertArgs>(args: SelectSubset<T, RoleScopeUpsertArgs<ExtArgs>>): Prisma__RoleScopeClient<$Result.GetResult<Prisma.$RoleScopePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoleScopes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleScopeCountArgs} args - Arguments to filter RoleScopes to count.
     * @example
     * // Count the number of RoleScopes
     * const count = await prisma.roleScope.count({
     *   where: {
     *     // ... the filter for the RoleScopes we want to count
     *   }
     * })
    **/
    count<T extends RoleScopeCountArgs>(
      args?: Subset<T, RoleScopeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleScopeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoleScope.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleScopeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleScopeAggregateArgs>(args: Subset<T, RoleScopeAggregateArgs>): Prisma.PrismaPromise<GetRoleScopeAggregateType<T>>

    /**
     * Group by RoleScope.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleScopeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleScopeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleScopeGroupByArgs['orderBy'] }
        : { orderBy?: RoleScopeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleScopeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleScopeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoleScope model
   */
  readonly fields: RoleScopeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoleScope.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleScopeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    scope<T extends ScopeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ScopeDefaultArgs<ExtArgs>>): Prisma__ScopeClient<$Result.GetResult<Prisma.$ScopePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoleScope model
   */
  interface RoleScopeFieldRefs {
    readonly id: FieldRef<"RoleScope", 'Int'>
    readonly roleId: FieldRef<"RoleScope", 'Int'>
    readonly scopeId: FieldRef<"RoleScope", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * RoleScope findUnique
   */
  export type RoleScopeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    /**
     * Filter, which RoleScope to fetch.
     */
    where: RoleScopeWhereUniqueInput
  }

  /**
   * RoleScope findUniqueOrThrow
   */
  export type RoleScopeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    /**
     * Filter, which RoleScope to fetch.
     */
    where: RoleScopeWhereUniqueInput
  }

  /**
   * RoleScope findFirst
   */
  export type RoleScopeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    /**
     * Filter, which RoleScope to fetch.
     */
    where?: RoleScopeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleScopes to fetch.
     */
    orderBy?: RoleScopeOrderByWithRelationInput | RoleScopeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleScopes.
     */
    cursor?: RoleScopeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleScopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleScopes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleScopes.
     */
    distinct?: RoleScopeScalarFieldEnum | RoleScopeScalarFieldEnum[]
  }

  /**
   * RoleScope findFirstOrThrow
   */
  export type RoleScopeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    /**
     * Filter, which RoleScope to fetch.
     */
    where?: RoleScopeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleScopes to fetch.
     */
    orderBy?: RoleScopeOrderByWithRelationInput | RoleScopeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleScopes.
     */
    cursor?: RoleScopeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleScopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleScopes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleScopes.
     */
    distinct?: RoleScopeScalarFieldEnum | RoleScopeScalarFieldEnum[]
  }

  /**
   * RoleScope findMany
   */
  export type RoleScopeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    /**
     * Filter, which RoleScopes to fetch.
     */
    where?: RoleScopeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleScopes to fetch.
     */
    orderBy?: RoleScopeOrderByWithRelationInput | RoleScopeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoleScopes.
     */
    cursor?: RoleScopeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleScopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleScopes.
     */
    skip?: number
    distinct?: RoleScopeScalarFieldEnum | RoleScopeScalarFieldEnum[]
  }

  /**
   * RoleScope create
   */
  export type RoleScopeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    /**
     * The data needed to create a RoleScope.
     */
    data: XOR<RoleScopeCreateInput, RoleScopeUncheckedCreateInput>
  }

  /**
   * RoleScope createMany
   */
  export type RoleScopeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoleScopes.
     */
    data: RoleScopeCreateManyInput | RoleScopeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoleScope createManyAndReturn
   */
  export type RoleScopeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * The data used to create many RoleScopes.
     */
    data: RoleScopeCreateManyInput | RoleScopeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoleScope update
   */
  export type RoleScopeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    /**
     * The data needed to update a RoleScope.
     */
    data: XOR<RoleScopeUpdateInput, RoleScopeUncheckedUpdateInput>
    /**
     * Choose, which RoleScope to update.
     */
    where: RoleScopeWhereUniqueInput
  }

  /**
   * RoleScope updateMany
   */
  export type RoleScopeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoleScopes.
     */
    data: XOR<RoleScopeUpdateManyMutationInput, RoleScopeUncheckedUpdateManyInput>
    /**
     * Filter which RoleScopes to update
     */
    where?: RoleScopeWhereInput
    /**
     * Limit how many RoleScopes to update.
     */
    limit?: number
  }

  /**
   * RoleScope updateManyAndReturn
   */
  export type RoleScopeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * The data used to update RoleScopes.
     */
    data: XOR<RoleScopeUpdateManyMutationInput, RoleScopeUncheckedUpdateManyInput>
    /**
     * Filter which RoleScopes to update
     */
    where?: RoleScopeWhereInput
    /**
     * Limit how many RoleScopes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoleScope upsert
   */
  export type RoleScopeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    /**
     * The filter to search for the RoleScope to update in case it exists.
     */
    where: RoleScopeWhereUniqueInput
    /**
     * In case the RoleScope found by the `where` argument doesn't exist, create a new RoleScope with this data.
     */
    create: XOR<RoleScopeCreateInput, RoleScopeUncheckedCreateInput>
    /**
     * In case the RoleScope was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleScopeUpdateInput, RoleScopeUncheckedUpdateInput>
  }

  /**
   * RoleScope delete
   */
  export type RoleScopeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
    /**
     * Filter which RoleScope to delete.
     */
    where: RoleScopeWhereUniqueInput
  }

  /**
   * RoleScope deleteMany
   */
  export type RoleScopeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleScopes to delete
     */
    where?: RoleScopeWhereInput
    /**
     * Limit how many RoleScopes to delete.
     */
    limit?: number
  }

  /**
   * RoleScope without action
   */
  export type RoleScopeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleScope
     */
    select?: RoleScopeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleScope
     */
    omit?: RoleScopeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleScopeInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const KYCStatusHistoryScalarFieldEnum: {
    id: 'id',
    kycId: 'kycId',
    oldStatus: 'oldStatus',
    newStatus: 'newStatus',
    changedAt: 'changedAt'
  };

  export type KYCStatusHistoryScalarFieldEnum = (typeof KYCStatusHistoryScalarFieldEnum)[keyof typeof KYCStatusHistoryScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    message: 'message',
    read: 'read',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const CasbinRuleScalarFieldEnum: {
    id: 'id',
    ptype: 'ptype',
    v0: 'v0',
    v1: 'v1',
    v2: 'v2',
    v3: 'v3',
    v4: 'v4',
    v5: 'v5'
  };

  export type CasbinRuleScalarFieldEnum = (typeof CasbinRuleScalarFieldEnum)[keyof typeof CasbinRuleScalarFieldEnum]


  export const KYCScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    passportUrl: 'passportUrl',
    nationalIdUrl: 'nationalIdUrl',
    proofOfAddressUrl: 'proofOfAddressUrl',
    photoUrl: 'photoUrl',
    otherDocuments: 'otherDocuments',
    fingerprintScanUrl: 'fingerprintScanUrl',
    fingerprintImageUrl: 'fingerprintImageUrl',
    signatureUrl: 'signatureUrl',
    selfieUrl: 'selfieUrl',
    status: 'status',
    submittedAt: 'submittedAt',
    verifiedAt: 'verifiedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KYCScalarFieldEnum = (typeof KYCScalarFieldEnum)[keyof typeof KYCScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    uid: 'uid',
    name: 'name',
    email: 'email',
    password: 'password',
    image: 'image',
    dateOfBirth: 'dateOfBirth',
    nationality: 'nationality',
    phone: 'phone',
    address: 'address',
    city: 'city',
    state: 'state',
    postalCode: 'postalCode',
    country: 'country',
    mother: 'mother',
    father: 'father',
    spouse: 'spouse',
    children: 'children',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const ScopeScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type ScopeScalarFieldEnum = (typeof ScopeScalarFieldEnum)[keyof typeof ScopeScalarFieldEnum]


  export const UserRoleScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    roleId: 'roleId'
  };

  export type UserRoleScalarFieldEnum = (typeof UserRoleScalarFieldEnum)[keyof typeof UserRoleScalarFieldEnum]


  export const RoleScopeScalarFieldEnum: {
    id: 'id',
    roleId: 'roleId',
    scopeId: 'scopeId'
  };

  export type RoleScopeScalarFieldEnum = (typeof RoleScopeScalarFieldEnum)[keyof typeof RoleScopeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'KYCStatus'
   */
  export type EnumKYCStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KYCStatus'>
    


  /**
   * Reference to a field of type 'KYCStatus[]'
   */
  export type ListEnumKYCStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KYCStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type KYCStatusHistoryWhereInput = {
    AND?: KYCStatusHistoryWhereInput | KYCStatusHistoryWhereInput[]
    OR?: KYCStatusHistoryWhereInput[]
    NOT?: KYCStatusHistoryWhereInput | KYCStatusHistoryWhereInput[]
    id?: IntFilter<"KYCStatusHistory"> | number
    kycId?: IntFilter<"KYCStatusHistory"> | number
    oldStatus?: StringFilter<"KYCStatusHistory"> | string
    newStatus?: StringFilter<"KYCStatusHistory"> | string
    changedAt?: DateTimeFilter<"KYCStatusHistory"> | Date | string
    kyc?: XOR<KYCScalarRelationFilter, KYCWhereInput>
  }

  export type KYCStatusHistoryOrderByWithRelationInput = {
    id?: SortOrder
    kycId?: SortOrder
    oldStatus?: SortOrder
    newStatus?: SortOrder
    changedAt?: SortOrder
    kyc?: KYCOrderByWithRelationInput
  }

  export type KYCStatusHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: KYCStatusHistoryWhereInput | KYCStatusHistoryWhereInput[]
    OR?: KYCStatusHistoryWhereInput[]
    NOT?: KYCStatusHistoryWhereInput | KYCStatusHistoryWhereInput[]
    kycId?: IntFilter<"KYCStatusHistory"> | number
    oldStatus?: StringFilter<"KYCStatusHistory"> | string
    newStatus?: StringFilter<"KYCStatusHistory"> | string
    changedAt?: DateTimeFilter<"KYCStatusHistory"> | Date | string
    kyc?: XOR<KYCScalarRelationFilter, KYCWhereInput>
  }, "id">

  export type KYCStatusHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    kycId?: SortOrder
    oldStatus?: SortOrder
    newStatus?: SortOrder
    changedAt?: SortOrder
    _count?: KYCStatusHistoryCountOrderByAggregateInput
    _avg?: KYCStatusHistoryAvgOrderByAggregateInput
    _max?: KYCStatusHistoryMaxOrderByAggregateInput
    _min?: KYCStatusHistoryMinOrderByAggregateInput
    _sum?: KYCStatusHistorySumOrderByAggregateInput
  }

  export type KYCStatusHistoryScalarWhereWithAggregatesInput = {
    AND?: KYCStatusHistoryScalarWhereWithAggregatesInput | KYCStatusHistoryScalarWhereWithAggregatesInput[]
    OR?: KYCStatusHistoryScalarWhereWithAggregatesInput[]
    NOT?: KYCStatusHistoryScalarWhereWithAggregatesInput | KYCStatusHistoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"KYCStatusHistory"> | number
    kycId?: IntWithAggregatesFilter<"KYCStatusHistory"> | number
    oldStatus?: StringWithAggregatesFilter<"KYCStatusHistory"> | string
    newStatus?: StringWithAggregatesFilter<"KYCStatusHistory"> | string
    changedAt?: DateTimeWithAggregatesFilter<"KYCStatusHistory"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: IntFilter<"Notification"> | number
    userId?: IntFilter<"Notification"> | number
    message?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: IntFilter<"Notification"> | number
    message?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _avg?: NotificationAvgOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
    _sum?: NotificationSumOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Notification"> | number
    userId?: IntWithAggregatesFilter<"Notification"> | number
    message?: StringWithAggregatesFilter<"Notification"> | string
    read?: BoolWithAggregatesFilter<"Notification"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type CasbinRuleWhereInput = {
    AND?: CasbinRuleWhereInput | CasbinRuleWhereInput[]
    OR?: CasbinRuleWhereInput[]
    NOT?: CasbinRuleWhereInput | CasbinRuleWhereInput[]
    id?: IntFilter<"CasbinRule"> | number
    ptype?: StringFilter<"CasbinRule"> | string
    v0?: StringNullableFilter<"CasbinRule"> | string | null
    v1?: StringNullableFilter<"CasbinRule"> | string | null
    v2?: StringNullableFilter<"CasbinRule"> | string | null
    v3?: StringNullableFilter<"CasbinRule"> | string | null
    v4?: StringNullableFilter<"CasbinRule"> | string | null
    v5?: StringNullableFilter<"CasbinRule"> | string | null
  }

  export type CasbinRuleOrderByWithRelationInput = {
    id?: SortOrder
    ptype?: SortOrder
    v0?: SortOrderInput | SortOrder
    v1?: SortOrderInput | SortOrder
    v2?: SortOrderInput | SortOrder
    v3?: SortOrderInput | SortOrder
    v4?: SortOrderInput | SortOrder
    v5?: SortOrderInput | SortOrder
  }

  export type CasbinRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CasbinRuleWhereInput | CasbinRuleWhereInput[]
    OR?: CasbinRuleWhereInput[]
    NOT?: CasbinRuleWhereInput | CasbinRuleWhereInput[]
    ptype?: StringFilter<"CasbinRule"> | string
    v0?: StringNullableFilter<"CasbinRule"> | string | null
    v1?: StringNullableFilter<"CasbinRule"> | string | null
    v2?: StringNullableFilter<"CasbinRule"> | string | null
    v3?: StringNullableFilter<"CasbinRule"> | string | null
    v4?: StringNullableFilter<"CasbinRule"> | string | null
    v5?: StringNullableFilter<"CasbinRule"> | string | null
  }, "id">

  export type CasbinRuleOrderByWithAggregationInput = {
    id?: SortOrder
    ptype?: SortOrder
    v0?: SortOrderInput | SortOrder
    v1?: SortOrderInput | SortOrder
    v2?: SortOrderInput | SortOrder
    v3?: SortOrderInput | SortOrder
    v4?: SortOrderInput | SortOrder
    v5?: SortOrderInput | SortOrder
    _count?: CasbinRuleCountOrderByAggregateInput
    _avg?: CasbinRuleAvgOrderByAggregateInput
    _max?: CasbinRuleMaxOrderByAggregateInput
    _min?: CasbinRuleMinOrderByAggregateInput
    _sum?: CasbinRuleSumOrderByAggregateInput
  }

  export type CasbinRuleScalarWhereWithAggregatesInput = {
    AND?: CasbinRuleScalarWhereWithAggregatesInput | CasbinRuleScalarWhereWithAggregatesInput[]
    OR?: CasbinRuleScalarWhereWithAggregatesInput[]
    NOT?: CasbinRuleScalarWhereWithAggregatesInput | CasbinRuleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CasbinRule"> | number
    ptype?: StringWithAggregatesFilter<"CasbinRule"> | string
    v0?: StringNullableWithAggregatesFilter<"CasbinRule"> | string | null
    v1?: StringNullableWithAggregatesFilter<"CasbinRule"> | string | null
    v2?: StringNullableWithAggregatesFilter<"CasbinRule"> | string | null
    v3?: StringNullableWithAggregatesFilter<"CasbinRule"> | string | null
    v4?: StringNullableWithAggregatesFilter<"CasbinRule"> | string | null
    v5?: StringNullableWithAggregatesFilter<"CasbinRule"> | string | null
  }

  export type KYCWhereInput = {
    AND?: KYCWhereInput | KYCWhereInput[]
    OR?: KYCWhereInput[]
    NOT?: KYCWhereInput | KYCWhereInput[]
    id?: IntFilter<"KYC"> | number
    userId?: IntFilter<"KYC"> | number
    passportUrl?: StringFilter<"KYC"> | string
    nationalIdUrl?: StringNullableFilter<"KYC"> | string | null
    proofOfAddressUrl?: StringFilter<"KYC"> | string
    photoUrl?: StringFilter<"KYC"> | string
    otherDocuments?: JsonNullableFilter<"KYC">
    fingerprintScanUrl?: StringNullableFilter<"KYC"> | string | null
    fingerprintImageUrl?: StringNullableFilter<"KYC"> | string | null
    signatureUrl?: StringNullableFilter<"KYC"> | string | null
    selfieUrl?: StringFilter<"KYC"> | string
    status?: EnumKYCStatusFilter<"KYC"> | $Enums.KYCStatus
    submittedAt?: DateTimeFilter<"KYC"> | Date | string
    verifiedAt?: DateTimeNullableFilter<"KYC"> | Date | string | null
    createdAt?: DateTimeFilter<"KYC"> | Date | string
    updatedAt?: DateTimeFilter<"KYC"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    statusHistories?: KYCStatusHistoryListRelationFilter
  }

  export type KYCOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    passportUrl?: SortOrder
    nationalIdUrl?: SortOrderInput | SortOrder
    proofOfAddressUrl?: SortOrder
    photoUrl?: SortOrder
    otherDocuments?: SortOrderInput | SortOrder
    fingerprintScanUrl?: SortOrderInput | SortOrder
    fingerprintImageUrl?: SortOrderInput | SortOrder
    signatureUrl?: SortOrderInput | SortOrder
    selfieUrl?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    statusHistories?: KYCStatusHistoryOrderByRelationAggregateInput
  }

  export type KYCWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: KYCWhereInput | KYCWhereInput[]
    OR?: KYCWhereInput[]
    NOT?: KYCWhereInput | KYCWhereInput[]
    userId?: IntFilter<"KYC"> | number
    passportUrl?: StringFilter<"KYC"> | string
    nationalIdUrl?: StringNullableFilter<"KYC"> | string | null
    proofOfAddressUrl?: StringFilter<"KYC"> | string
    photoUrl?: StringFilter<"KYC"> | string
    otherDocuments?: JsonNullableFilter<"KYC">
    fingerprintScanUrl?: StringNullableFilter<"KYC"> | string | null
    fingerprintImageUrl?: StringNullableFilter<"KYC"> | string | null
    signatureUrl?: StringNullableFilter<"KYC"> | string | null
    selfieUrl?: StringFilter<"KYC"> | string
    status?: EnumKYCStatusFilter<"KYC"> | $Enums.KYCStatus
    submittedAt?: DateTimeFilter<"KYC"> | Date | string
    verifiedAt?: DateTimeNullableFilter<"KYC"> | Date | string | null
    createdAt?: DateTimeFilter<"KYC"> | Date | string
    updatedAt?: DateTimeFilter<"KYC"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    statusHistories?: KYCStatusHistoryListRelationFilter
  }, "id">

  export type KYCOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    passportUrl?: SortOrder
    nationalIdUrl?: SortOrderInput | SortOrder
    proofOfAddressUrl?: SortOrder
    photoUrl?: SortOrder
    otherDocuments?: SortOrderInput | SortOrder
    fingerprintScanUrl?: SortOrderInput | SortOrder
    fingerprintImageUrl?: SortOrderInput | SortOrder
    signatureUrl?: SortOrderInput | SortOrder
    selfieUrl?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KYCCountOrderByAggregateInput
    _avg?: KYCAvgOrderByAggregateInput
    _max?: KYCMaxOrderByAggregateInput
    _min?: KYCMinOrderByAggregateInput
    _sum?: KYCSumOrderByAggregateInput
  }

  export type KYCScalarWhereWithAggregatesInput = {
    AND?: KYCScalarWhereWithAggregatesInput | KYCScalarWhereWithAggregatesInput[]
    OR?: KYCScalarWhereWithAggregatesInput[]
    NOT?: KYCScalarWhereWithAggregatesInput | KYCScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"KYC"> | number
    userId?: IntWithAggregatesFilter<"KYC"> | number
    passportUrl?: StringWithAggregatesFilter<"KYC"> | string
    nationalIdUrl?: StringNullableWithAggregatesFilter<"KYC"> | string | null
    proofOfAddressUrl?: StringWithAggregatesFilter<"KYC"> | string
    photoUrl?: StringWithAggregatesFilter<"KYC"> | string
    otherDocuments?: JsonNullableWithAggregatesFilter<"KYC">
    fingerprintScanUrl?: StringNullableWithAggregatesFilter<"KYC"> | string | null
    fingerprintImageUrl?: StringNullableWithAggregatesFilter<"KYC"> | string | null
    signatureUrl?: StringNullableWithAggregatesFilter<"KYC"> | string | null
    selfieUrl?: StringWithAggregatesFilter<"KYC"> | string
    status?: EnumKYCStatusWithAggregatesFilter<"KYC"> | $Enums.KYCStatus
    submittedAt?: DateTimeWithAggregatesFilter<"KYC"> | Date | string
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"KYC"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"KYC"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KYC"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    uid?: UuidFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    image?: StringNullableFilter<"User"> | string | null
    dateOfBirth?: StringNullableFilter<"User"> | string | null
    nationality?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    state?: StringNullableFilter<"User"> | string | null
    postalCode?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    mother?: JsonNullableFilter<"User">
    father?: JsonNullableFilter<"User">
    spouse?: JsonNullableFilter<"User">
    children?: JsonNullableFilter<"User">
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    kycs?: KYCListRelationFilter
    notifications?: NotificationListRelationFilter
    userRoles?: UserRoleListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    uid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    image?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    nationality?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    mother?: SortOrderInput | SortOrder
    father?: SortOrderInput | SortOrder
    spouse?: SortOrderInput | SortOrder
    children?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kycs?: KYCOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    userRoles?: UserRoleOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    uid?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    image?: StringNullableFilter<"User"> | string | null
    dateOfBirth?: StringNullableFilter<"User"> | string | null
    nationality?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    state?: StringNullableFilter<"User"> | string | null
    postalCode?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    mother?: JsonNullableFilter<"User">
    father?: JsonNullableFilter<"User">
    spouse?: JsonNullableFilter<"User">
    children?: JsonNullableFilter<"User">
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    kycs?: KYCListRelationFilter
    notifications?: NotificationListRelationFilter
    userRoles?: UserRoleListRelationFilter
  }, "id" | "uid" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    uid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    image?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    nationality?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    mother?: SortOrderInput | SortOrder
    father?: SortOrderInput | SortOrder
    spouse?: SortOrderInput | SortOrder
    children?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    uid?: UuidWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    dateOfBirth?: StringNullableWithAggregatesFilter<"User"> | string | null
    nationality?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    city?: StringNullableWithAggregatesFilter<"User"> | string | null
    state?: StringNullableWithAggregatesFilter<"User"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"User"> | string | null
    country?: StringNullableWithAggregatesFilter<"User"> | string | null
    mother?: JsonNullableWithAggregatesFilter<"User">
    father?: JsonNullableWithAggregatesFilter<"User">
    spouse?: JsonNullableWithAggregatesFilter<"User">
    children?: JsonNullableWithAggregatesFilter<"User">
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: IntFilter<"Role"> | number
    name?: StringFilter<"Role"> | string
    users?: UserRoleListRelationFilter
    scopes?: RoleScopeListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    users?: UserRoleOrderByRelationAggregateInput
    scopes?: RoleScopeOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    users?: UserRoleListRelationFilter
    scopes?: RoleScopeListRelationFilter
  }, "id" | "name">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _avg?: RoleAvgOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
    _sum?: RoleSumOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Role"> | number
    name?: StringWithAggregatesFilter<"Role"> | string
  }

  export type ScopeWhereInput = {
    AND?: ScopeWhereInput | ScopeWhereInput[]
    OR?: ScopeWhereInput[]
    NOT?: ScopeWhereInput | ScopeWhereInput[]
    id?: IntFilter<"Scope"> | number
    name?: StringFilter<"Scope"> | string
    roles?: RoleScopeListRelationFilter
  }

  export type ScopeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    roles?: RoleScopeOrderByRelationAggregateInput
  }

  export type ScopeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: ScopeWhereInput | ScopeWhereInput[]
    OR?: ScopeWhereInput[]
    NOT?: ScopeWhereInput | ScopeWhereInput[]
    roles?: RoleScopeListRelationFilter
  }, "id" | "name">

  export type ScopeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: ScopeCountOrderByAggregateInput
    _avg?: ScopeAvgOrderByAggregateInput
    _max?: ScopeMaxOrderByAggregateInput
    _min?: ScopeMinOrderByAggregateInput
    _sum?: ScopeSumOrderByAggregateInput
  }

  export type ScopeScalarWhereWithAggregatesInput = {
    AND?: ScopeScalarWhereWithAggregatesInput | ScopeScalarWhereWithAggregatesInput[]
    OR?: ScopeScalarWhereWithAggregatesInput[]
    NOT?: ScopeScalarWhereWithAggregatesInput | ScopeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Scope"> | number
    name?: StringWithAggregatesFilter<"Scope"> | string
  }

  export type UserRoleWhereInput = {
    AND?: UserRoleWhereInput | UserRoleWhereInput[]
    OR?: UserRoleWhereInput[]
    NOT?: UserRoleWhereInput | UserRoleWhereInput[]
    id?: IntFilter<"UserRole"> | number
    userId?: IntFilter<"UserRole"> | number
    roleId?: IntFilter<"UserRole"> | number
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
  }

  export type UserRoleOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
    user?: UserOrderByWithRelationInput
    role?: RoleOrderByWithRelationInput
  }

  export type UserRoleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UserRoleWhereInput | UserRoleWhereInput[]
    OR?: UserRoleWhereInput[]
    NOT?: UserRoleWhereInput | UserRoleWhereInput[]
    userId?: IntFilter<"UserRole"> | number
    roleId?: IntFilter<"UserRole"> | number
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
  }, "id">

  export type UserRoleOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
    _count?: UserRoleCountOrderByAggregateInput
    _avg?: UserRoleAvgOrderByAggregateInput
    _max?: UserRoleMaxOrderByAggregateInput
    _min?: UserRoleMinOrderByAggregateInput
    _sum?: UserRoleSumOrderByAggregateInput
  }

  export type UserRoleScalarWhereWithAggregatesInput = {
    AND?: UserRoleScalarWhereWithAggregatesInput | UserRoleScalarWhereWithAggregatesInput[]
    OR?: UserRoleScalarWhereWithAggregatesInput[]
    NOT?: UserRoleScalarWhereWithAggregatesInput | UserRoleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserRole"> | number
    userId?: IntWithAggregatesFilter<"UserRole"> | number
    roleId?: IntWithAggregatesFilter<"UserRole"> | number
  }

  export type RoleScopeWhereInput = {
    AND?: RoleScopeWhereInput | RoleScopeWhereInput[]
    OR?: RoleScopeWhereInput[]
    NOT?: RoleScopeWhereInput | RoleScopeWhereInput[]
    id?: IntFilter<"RoleScope"> | number
    roleId?: IntFilter<"RoleScope"> | number
    scopeId?: IntFilter<"RoleScope"> | number
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    scope?: XOR<ScopeScalarRelationFilter, ScopeWhereInput>
  }

  export type RoleScopeOrderByWithRelationInput = {
    id?: SortOrder
    roleId?: SortOrder
    scopeId?: SortOrder
    role?: RoleOrderByWithRelationInput
    scope?: ScopeOrderByWithRelationInput
  }

  export type RoleScopeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RoleScopeWhereInput | RoleScopeWhereInput[]
    OR?: RoleScopeWhereInput[]
    NOT?: RoleScopeWhereInput | RoleScopeWhereInput[]
    roleId?: IntFilter<"RoleScope"> | number
    scopeId?: IntFilter<"RoleScope"> | number
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    scope?: XOR<ScopeScalarRelationFilter, ScopeWhereInput>
  }, "id">

  export type RoleScopeOrderByWithAggregationInput = {
    id?: SortOrder
    roleId?: SortOrder
    scopeId?: SortOrder
    _count?: RoleScopeCountOrderByAggregateInput
    _avg?: RoleScopeAvgOrderByAggregateInput
    _max?: RoleScopeMaxOrderByAggregateInput
    _min?: RoleScopeMinOrderByAggregateInput
    _sum?: RoleScopeSumOrderByAggregateInput
  }

  export type RoleScopeScalarWhereWithAggregatesInput = {
    AND?: RoleScopeScalarWhereWithAggregatesInput | RoleScopeScalarWhereWithAggregatesInput[]
    OR?: RoleScopeScalarWhereWithAggregatesInput[]
    NOT?: RoleScopeScalarWhereWithAggregatesInput | RoleScopeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RoleScope"> | number
    roleId?: IntWithAggregatesFilter<"RoleScope"> | number
    scopeId?: IntWithAggregatesFilter<"RoleScope"> | number
  }

  export type KYCStatusHistoryCreateInput = {
    oldStatus: string
    newStatus: string
    changedAt?: Date | string
    kyc: KYCCreateNestedOneWithoutStatusHistoriesInput
  }

  export type KYCStatusHistoryUncheckedCreateInput = {
    id?: number
    kycId: number
    oldStatus: string
    newStatus: string
    changedAt?: Date | string
  }

  export type KYCStatusHistoryUpdateInput = {
    oldStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kyc?: KYCUpdateOneRequiredWithoutStatusHistoriesNestedInput
  }

  export type KYCStatusHistoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    kycId?: IntFieldUpdateOperationsInput | number
    oldStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KYCStatusHistoryCreateManyInput = {
    id?: number
    kycId: number
    oldStatus: string
    newStatus: string
    changedAt?: Date | string
  }

  export type KYCStatusHistoryUpdateManyMutationInput = {
    oldStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KYCStatusHistoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    kycId?: IntFieldUpdateOperationsInput | number
    oldStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    message: string
    read?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: number
    userId: number
    message: string
    read?: boolean
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: number
    userId: number
    message: string
    read?: boolean
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CasbinRuleCreateInput = {
    ptype: string
    v0?: string | null
    v1?: string | null
    v2?: string | null
    v3?: string | null
    v4?: string | null
    v5?: string | null
  }

  export type CasbinRuleUncheckedCreateInput = {
    id?: number
    ptype: string
    v0?: string | null
    v1?: string | null
    v2?: string | null
    v3?: string | null
    v4?: string | null
    v5?: string | null
  }

  export type CasbinRuleUpdateInput = {
    ptype?: StringFieldUpdateOperationsInput | string
    v0?: NullableStringFieldUpdateOperationsInput | string | null
    v1?: NullableStringFieldUpdateOperationsInput | string | null
    v2?: NullableStringFieldUpdateOperationsInput | string | null
    v3?: NullableStringFieldUpdateOperationsInput | string | null
    v4?: NullableStringFieldUpdateOperationsInput | string | null
    v5?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CasbinRuleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    ptype?: StringFieldUpdateOperationsInput | string
    v0?: NullableStringFieldUpdateOperationsInput | string | null
    v1?: NullableStringFieldUpdateOperationsInput | string | null
    v2?: NullableStringFieldUpdateOperationsInput | string | null
    v3?: NullableStringFieldUpdateOperationsInput | string | null
    v4?: NullableStringFieldUpdateOperationsInput | string | null
    v5?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CasbinRuleCreateManyInput = {
    id?: number
    ptype: string
    v0?: string | null
    v1?: string | null
    v2?: string | null
    v3?: string | null
    v4?: string | null
    v5?: string | null
  }

  export type CasbinRuleUpdateManyMutationInput = {
    ptype?: StringFieldUpdateOperationsInput | string
    v0?: NullableStringFieldUpdateOperationsInput | string | null
    v1?: NullableStringFieldUpdateOperationsInput | string | null
    v2?: NullableStringFieldUpdateOperationsInput | string | null
    v3?: NullableStringFieldUpdateOperationsInput | string | null
    v4?: NullableStringFieldUpdateOperationsInput | string | null
    v5?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CasbinRuleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    ptype?: StringFieldUpdateOperationsInput | string
    v0?: NullableStringFieldUpdateOperationsInput | string | null
    v1?: NullableStringFieldUpdateOperationsInput | string | null
    v2?: NullableStringFieldUpdateOperationsInput | string | null
    v3?: NullableStringFieldUpdateOperationsInput | string | null
    v4?: NullableStringFieldUpdateOperationsInput | string | null
    v5?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KYCCreateInput = {
    passportUrl: string
    nationalIdUrl?: string | null
    proofOfAddressUrl: string
    photoUrl: string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: string | null
    fingerprintImageUrl?: string | null
    signatureUrl?: string | null
    selfieUrl: string
    status?: $Enums.KYCStatus
    submittedAt?: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutKycsInput
    statusHistories?: KYCStatusHistoryCreateNestedManyWithoutKycInput
  }

  export type KYCUncheckedCreateInput = {
    id?: number
    userId: number
    passportUrl: string
    nationalIdUrl?: string | null
    proofOfAddressUrl: string
    photoUrl: string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: string | null
    fingerprintImageUrl?: string | null
    signatureUrl?: string | null
    selfieUrl: string
    status?: $Enums.KYCStatus
    submittedAt?: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    statusHistories?: KYCStatusHistoryUncheckedCreateNestedManyWithoutKycInput
  }

  export type KYCUpdateInput = {
    passportUrl?: StringFieldUpdateOperationsInput | string
    nationalIdUrl?: NullableStringFieldUpdateOperationsInput | string | null
    proofOfAddressUrl?: StringFieldUpdateOperationsInput | string
    photoUrl?: StringFieldUpdateOperationsInput | string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprintImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    selfieUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutKycsNestedInput
    statusHistories?: KYCStatusHistoryUpdateManyWithoutKycNestedInput
  }

  export type KYCUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    passportUrl?: StringFieldUpdateOperationsInput | string
    nationalIdUrl?: NullableStringFieldUpdateOperationsInput | string | null
    proofOfAddressUrl?: StringFieldUpdateOperationsInput | string
    photoUrl?: StringFieldUpdateOperationsInput | string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprintImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    selfieUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistories?: KYCStatusHistoryUncheckedUpdateManyWithoutKycNestedInput
  }

  export type KYCCreateManyInput = {
    id?: number
    userId: number
    passportUrl: string
    nationalIdUrl?: string | null
    proofOfAddressUrl: string
    photoUrl: string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: string | null
    fingerprintImageUrl?: string | null
    signatureUrl?: string | null
    selfieUrl: string
    status?: $Enums.KYCStatus
    submittedAt?: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KYCUpdateManyMutationInput = {
    passportUrl?: StringFieldUpdateOperationsInput | string
    nationalIdUrl?: NullableStringFieldUpdateOperationsInput | string | null
    proofOfAddressUrl?: StringFieldUpdateOperationsInput | string
    photoUrl?: StringFieldUpdateOperationsInput | string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprintImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    selfieUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KYCUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    passportUrl?: StringFieldUpdateOperationsInput | string
    nationalIdUrl?: NullableStringFieldUpdateOperationsInput | string | null
    proofOfAddressUrl?: StringFieldUpdateOperationsInput | string
    photoUrl?: StringFieldUpdateOperationsInput | string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprintImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    selfieUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    uid?: string
    name: string
    email: string
    password: string
    image?: string | null
    dateOfBirth?: string | null
    nationality?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    kycs?: KYCCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    userRoles?: UserRoleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    uid?: string
    name: string
    email: string
    password: string
    image?: string | null
    dateOfBirth?: string | null
    nationality?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    kycs?: KYCUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    userRoles?: UserRoleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    uid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycs?: KYCUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    userRoles?: UserRoleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycs?: KYCUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    userRoles?: UserRoleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    uid?: string
    name: string
    email: string
    password: string
    image?: string | null
    dateOfBirth?: string | null
    nationality?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    uid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleCreateInput = {
    name: string
    users?: UserRoleCreateNestedManyWithoutRoleInput
    scopes?: RoleScopeCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: number
    name: string
    users?: UserRoleUncheckedCreateNestedManyWithoutRoleInput
    scopes?: RoleScopeUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    users?: UserRoleUpdateManyWithoutRoleNestedInput
    scopes?: RoleScopeUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    users?: UserRoleUncheckedUpdateManyWithoutRoleNestedInput
    scopes?: RoleScopeUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: number
    name: string
  }

  export type RoleUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ScopeCreateInput = {
    name: string
    roles?: RoleScopeCreateNestedManyWithoutScopeInput
  }

  export type ScopeUncheckedCreateInput = {
    id?: number
    name: string
    roles?: RoleScopeUncheckedCreateNestedManyWithoutScopeInput
  }

  export type ScopeUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    roles?: RoleScopeUpdateManyWithoutScopeNestedInput
  }

  export type ScopeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    roles?: RoleScopeUncheckedUpdateManyWithoutScopeNestedInput
  }

  export type ScopeCreateManyInput = {
    id?: number
    name: string
  }

  export type ScopeUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ScopeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type UserRoleCreateInput = {
    user: UserCreateNestedOneWithoutUserRolesInput
    role: RoleCreateNestedOneWithoutUsersInput
  }

  export type UserRoleUncheckedCreateInput = {
    id?: number
    userId: number
    roleId: number
  }

  export type UserRoleUpdateInput = {
    user?: UserUpdateOneRequiredWithoutUserRolesNestedInput
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserRoleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
  }

  export type UserRoleCreateManyInput = {
    id?: number
    userId: number
    roleId: number
  }

  export type UserRoleUpdateManyMutationInput = {

  }

  export type UserRoleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
  }

  export type RoleScopeCreateInput = {
    role: RoleCreateNestedOneWithoutScopesInput
    scope: ScopeCreateNestedOneWithoutRolesInput
  }

  export type RoleScopeUncheckedCreateInput = {
    id?: number
    roleId: number
    scopeId: number
  }

  export type RoleScopeUpdateInput = {
    role?: RoleUpdateOneRequiredWithoutScopesNestedInput
    scope?: ScopeUpdateOneRequiredWithoutRolesNestedInput
  }

  export type RoleScopeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
    scopeId?: IntFieldUpdateOperationsInput | number
  }

  export type RoleScopeCreateManyInput = {
    id?: number
    roleId: number
    scopeId: number
  }

  export type RoleScopeUpdateManyMutationInput = {

  }

  export type RoleScopeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
    scopeId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type KYCScalarRelationFilter = {
    is?: KYCWhereInput
    isNot?: KYCWhereInput
  }

  export type KYCStatusHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    kycId?: SortOrder
    oldStatus?: SortOrder
    newStatus?: SortOrder
    changedAt?: SortOrder
  }

  export type KYCStatusHistoryAvgOrderByAggregateInput = {
    id?: SortOrder
    kycId?: SortOrder
  }

  export type KYCStatusHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    kycId?: SortOrder
    oldStatus?: SortOrder
    newStatus?: SortOrder
    changedAt?: SortOrder
  }

  export type KYCStatusHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    kycId?: SortOrder
    oldStatus?: SortOrder
    newStatus?: SortOrder
    changedAt?: SortOrder
  }

  export type KYCStatusHistorySumOrderByAggregateInput = {
    id?: SortOrder
    kycId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CasbinRuleCountOrderByAggregateInput = {
    id?: SortOrder
    ptype?: SortOrder
    v0?: SortOrder
    v1?: SortOrder
    v2?: SortOrder
    v3?: SortOrder
    v4?: SortOrder
    v5?: SortOrder
  }

  export type CasbinRuleAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CasbinRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    ptype?: SortOrder
    v0?: SortOrder
    v1?: SortOrder
    v2?: SortOrder
    v3?: SortOrder
    v4?: SortOrder
    v5?: SortOrder
  }

  export type CasbinRuleMinOrderByAggregateInput = {
    id?: SortOrder
    ptype?: SortOrder
    v0?: SortOrder
    v1?: SortOrder
    v2?: SortOrder
    v3?: SortOrder
    v4?: SortOrder
    v5?: SortOrder
  }

  export type CasbinRuleSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumKYCStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KYCStatus | EnumKYCStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKYCStatusFilter<$PrismaModel> | $Enums.KYCStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type KYCStatusHistoryListRelationFilter = {
    every?: KYCStatusHistoryWhereInput
    some?: KYCStatusHistoryWhereInput
    none?: KYCStatusHistoryWhereInput
  }

  export type KYCStatusHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KYCCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    passportUrl?: SortOrder
    nationalIdUrl?: SortOrder
    proofOfAddressUrl?: SortOrder
    photoUrl?: SortOrder
    otherDocuments?: SortOrder
    fingerprintScanUrl?: SortOrder
    fingerprintImageUrl?: SortOrder
    signatureUrl?: SortOrder
    selfieUrl?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
    verifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KYCAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type KYCMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    passportUrl?: SortOrder
    nationalIdUrl?: SortOrder
    proofOfAddressUrl?: SortOrder
    photoUrl?: SortOrder
    fingerprintScanUrl?: SortOrder
    fingerprintImageUrl?: SortOrder
    signatureUrl?: SortOrder
    selfieUrl?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
    verifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KYCMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    passportUrl?: SortOrder
    nationalIdUrl?: SortOrder
    proofOfAddressUrl?: SortOrder
    photoUrl?: SortOrder
    fingerprintScanUrl?: SortOrder
    fingerprintImageUrl?: SortOrder
    signatureUrl?: SortOrder
    selfieUrl?: SortOrder
    status?: SortOrder
    submittedAt?: SortOrder
    verifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KYCSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumKYCStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KYCStatus | EnumKYCStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKYCStatusWithAggregatesFilter<$PrismaModel> | $Enums.KYCStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKYCStatusFilter<$PrismaModel>
    _max?: NestedEnumKYCStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type KYCListRelationFilter = {
    every?: KYCWhereInput
    some?: KYCWhereInput
    none?: KYCWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type UserRoleListRelationFilter = {
    every?: UserRoleWhereInput
    some?: UserRoleWhereInput
    none?: UserRoleWhereInput
  }

  export type KYCOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserRoleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    image?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    mother?: SortOrder
    father?: SortOrder
    spouse?: SortOrder
    children?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    image?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    image?: SortOrder
    dateOfBirth?: SortOrder
    nationality?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type RoleScopeListRelationFilter = {
    every?: RoleScopeWhereInput
    some?: RoleScopeWhereInput
    none?: RoleScopeWhereInput
  }

  export type RoleScopeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type RoleAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type RoleSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ScopeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type ScopeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ScopeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type ScopeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type ScopeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RoleScalarRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type UserRoleCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
  }

  export type UserRoleAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
  }

  export type UserRoleMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
  }

  export type UserRoleMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
  }

  export type UserRoleSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roleId?: SortOrder
  }

  export type ScopeScalarRelationFilter = {
    is?: ScopeWhereInput
    isNot?: ScopeWhereInput
  }

  export type RoleScopeCountOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    scopeId?: SortOrder
  }

  export type RoleScopeAvgOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    scopeId?: SortOrder
  }

  export type RoleScopeMaxOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    scopeId?: SortOrder
  }

  export type RoleScopeMinOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    scopeId?: SortOrder
  }

  export type RoleScopeSumOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    scopeId?: SortOrder
  }

  export type KYCCreateNestedOneWithoutStatusHistoriesInput = {
    create?: XOR<KYCCreateWithoutStatusHistoriesInput, KYCUncheckedCreateWithoutStatusHistoriesInput>
    connectOrCreate?: KYCCreateOrConnectWithoutStatusHistoriesInput
    connect?: KYCWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type KYCUpdateOneRequiredWithoutStatusHistoriesNestedInput = {
    create?: XOR<KYCCreateWithoutStatusHistoriesInput, KYCUncheckedCreateWithoutStatusHistoriesInput>
    connectOrCreate?: KYCCreateOrConnectWithoutStatusHistoriesInput
    upsert?: KYCUpsertWithoutStatusHistoriesInput
    connect?: KYCWhereUniqueInput
    update?: XOR<XOR<KYCUpdateToOneWithWhereWithoutStatusHistoriesInput, KYCUpdateWithoutStatusHistoriesInput>, KYCUncheckedUpdateWithoutStatusHistoriesInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserCreateNestedOneWithoutKycsInput = {
    create?: XOR<UserCreateWithoutKycsInput, UserUncheckedCreateWithoutKycsInput>
    connectOrCreate?: UserCreateOrConnectWithoutKycsInput
    connect?: UserWhereUniqueInput
  }

  export type KYCStatusHistoryCreateNestedManyWithoutKycInput = {
    create?: XOR<KYCStatusHistoryCreateWithoutKycInput, KYCStatusHistoryUncheckedCreateWithoutKycInput> | KYCStatusHistoryCreateWithoutKycInput[] | KYCStatusHistoryUncheckedCreateWithoutKycInput[]
    connectOrCreate?: KYCStatusHistoryCreateOrConnectWithoutKycInput | KYCStatusHistoryCreateOrConnectWithoutKycInput[]
    createMany?: KYCStatusHistoryCreateManyKycInputEnvelope
    connect?: KYCStatusHistoryWhereUniqueInput | KYCStatusHistoryWhereUniqueInput[]
  }

  export type KYCStatusHistoryUncheckedCreateNestedManyWithoutKycInput = {
    create?: XOR<KYCStatusHistoryCreateWithoutKycInput, KYCStatusHistoryUncheckedCreateWithoutKycInput> | KYCStatusHistoryCreateWithoutKycInput[] | KYCStatusHistoryUncheckedCreateWithoutKycInput[]
    connectOrCreate?: KYCStatusHistoryCreateOrConnectWithoutKycInput | KYCStatusHistoryCreateOrConnectWithoutKycInput[]
    createMany?: KYCStatusHistoryCreateManyKycInputEnvelope
    connect?: KYCStatusHistoryWhereUniqueInput | KYCStatusHistoryWhereUniqueInput[]
  }

  export type EnumKYCStatusFieldUpdateOperationsInput = {
    set?: $Enums.KYCStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutKycsNestedInput = {
    create?: XOR<UserCreateWithoutKycsInput, UserUncheckedCreateWithoutKycsInput>
    connectOrCreate?: UserCreateOrConnectWithoutKycsInput
    upsert?: UserUpsertWithoutKycsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutKycsInput, UserUpdateWithoutKycsInput>, UserUncheckedUpdateWithoutKycsInput>
  }

  export type KYCStatusHistoryUpdateManyWithoutKycNestedInput = {
    create?: XOR<KYCStatusHistoryCreateWithoutKycInput, KYCStatusHistoryUncheckedCreateWithoutKycInput> | KYCStatusHistoryCreateWithoutKycInput[] | KYCStatusHistoryUncheckedCreateWithoutKycInput[]
    connectOrCreate?: KYCStatusHistoryCreateOrConnectWithoutKycInput | KYCStatusHistoryCreateOrConnectWithoutKycInput[]
    upsert?: KYCStatusHistoryUpsertWithWhereUniqueWithoutKycInput | KYCStatusHistoryUpsertWithWhereUniqueWithoutKycInput[]
    createMany?: KYCStatusHistoryCreateManyKycInputEnvelope
    set?: KYCStatusHistoryWhereUniqueInput | KYCStatusHistoryWhereUniqueInput[]
    disconnect?: KYCStatusHistoryWhereUniqueInput | KYCStatusHistoryWhereUniqueInput[]
    delete?: KYCStatusHistoryWhereUniqueInput | KYCStatusHistoryWhereUniqueInput[]
    connect?: KYCStatusHistoryWhereUniqueInput | KYCStatusHistoryWhereUniqueInput[]
    update?: KYCStatusHistoryUpdateWithWhereUniqueWithoutKycInput | KYCStatusHistoryUpdateWithWhereUniqueWithoutKycInput[]
    updateMany?: KYCStatusHistoryUpdateManyWithWhereWithoutKycInput | KYCStatusHistoryUpdateManyWithWhereWithoutKycInput[]
    deleteMany?: KYCStatusHistoryScalarWhereInput | KYCStatusHistoryScalarWhereInput[]
  }

  export type KYCStatusHistoryUncheckedUpdateManyWithoutKycNestedInput = {
    create?: XOR<KYCStatusHistoryCreateWithoutKycInput, KYCStatusHistoryUncheckedCreateWithoutKycInput> | KYCStatusHistoryCreateWithoutKycInput[] | KYCStatusHistoryUncheckedCreateWithoutKycInput[]
    connectOrCreate?: KYCStatusHistoryCreateOrConnectWithoutKycInput | KYCStatusHistoryCreateOrConnectWithoutKycInput[]
    upsert?: KYCStatusHistoryUpsertWithWhereUniqueWithoutKycInput | KYCStatusHistoryUpsertWithWhereUniqueWithoutKycInput[]
    createMany?: KYCStatusHistoryCreateManyKycInputEnvelope
    set?: KYCStatusHistoryWhereUniqueInput | KYCStatusHistoryWhereUniqueInput[]
    disconnect?: KYCStatusHistoryWhereUniqueInput | KYCStatusHistoryWhereUniqueInput[]
    delete?: KYCStatusHistoryWhereUniqueInput | KYCStatusHistoryWhereUniqueInput[]
    connect?: KYCStatusHistoryWhereUniqueInput | KYCStatusHistoryWhereUniqueInput[]
    update?: KYCStatusHistoryUpdateWithWhereUniqueWithoutKycInput | KYCStatusHistoryUpdateWithWhereUniqueWithoutKycInput[]
    updateMany?: KYCStatusHistoryUpdateManyWithWhereWithoutKycInput | KYCStatusHistoryUpdateManyWithWhereWithoutKycInput[]
    deleteMany?: KYCStatusHistoryScalarWhereInput | KYCStatusHistoryScalarWhereInput[]
  }

  export type KYCCreateNestedManyWithoutUserInput = {
    create?: XOR<KYCCreateWithoutUserInput, KYCUncheckedCreateWithoutUserInput> | KYCCreateWithoutUserInput[] | KYCUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KYCCreateOrConnectWithoutUserInput | KYCCreateOrConnectWithoutUserInput[]
    createMany?: KYCCreateManyUserInputEnvelope
    connect?: KYCWhereUniqueInput | KYCWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserRoleCreateNestedManyWithoutUserInput = {
    create?: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput> | UserRoleCreateWithoutUserInput[] | UserRoleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutUserInput | UserRoleCreateOrConnectWithoutUserInput[]
    createMany?: UserRoleCreateManyUserInputEnvelope
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
  }

  export type KYCUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<KYCCreateWithoutUserInput, KYCUncheckedCreateWithoutUserInput> | KYCCreateWithoutUserInput[] | KYCUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KYCCreateOrConnectWithoutUserInput | KYCCreateOrConnectWithoutUserInput[]
    createMany?: KYCCreateManyUserInputEnvelope
    connect?: KYCWhereUniqueInput | KYCWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserRoleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput> | UserRoleCreateWithoutUserInput[] | UserRoleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutUserInput | UserRoleCreateOrConnectWithoutUserInput[]
    createMany?: UserRoleCreateManyUserInputEnvelope
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
  }

  export type KYCUpdateManyWithoutUserNestedInput = {
    create?: XOR<KYCCreateWithoutUserInput, KYCUncheckedCreateWithoutUserInput> | KYCCreateWithoutUserInput[] | KYCUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KYCCreateOrConnectWithoutUserInput | KYCCreateOrConnectWithoutUserInput[]
    upsert?: KYCUpsertWithWhereUniqueWithoutUserInput | KYCUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: KYCCreateManyUserInputEnvelope
    set?: KYCWhereUniqueInput | KYCWhereUniqueInput[]
    disconnect?: KYCWhereUniqueInput | KYCWhereUniqueInput[]
    delete?: KYCWhereUniqueInput | KYCWhereUniqueInput[]
    connect?: KYCWhereUniqueInput | KYCWhereUniqueInput[]
    update?: KYCUpdateWithWhereUniqueWithoutUserInput | KYCUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: KYCUpdateManyWithWhereWithoutUserInput | KYCUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: KYCScalarWhereInput | KYCScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserRoleUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput> | UserRoleCreateWithoutUserInput[] | UserRoleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutUserInput | UserRoleCreateOrConnectWithoutUserInput[]
    upsert?: UserRoleUpsertWithWhereUniqueWithoutUserInput | UserRoleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserRoleCreateManyUserInputEnvelope
    set?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    disconnect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    delete?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    update?: UserRoleUpdateWithWhereUniqueWithoutUserInput | UserRoleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserRoleUpdateManyWithWhereWithoutUserInput | UserRoleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
  }

  export type KYCUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<KYCCreateWithoutUserInput, KYCUncheckedCreateWithoutUserInput> | KYCCreateWithoutUserInput[] | KYCUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KYCCreateOrConnectWithoutUserInput | KYCCreateOrConnectWithoutUserInput[]
    upsert?: KYCUpsertWithWhereUniqueWithoutUserInput | KYCUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: KYCCreateManyUserInputEnvelope
    set?: KYCWhereUniqueInput | KYCWhereUniqueInput[]
    disconnect?: KYCWhereUniqueInput | KYCWhereUniqueInput[]
    delete?: KYCWhereUniqueInput | KYCWhereUniqueInput[]
    connect?: KYCWhereUniqueInput | KYCWhereUniqueInput[]
    update?: KYCUpdateWithWhereUniqueWithoutUserInput | KYCUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: KYCUpdateManyWithWhereWithoutUserInput | KYCUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: KYCScalarWhereInput | KYCScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserRoleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput> | UserRoleCreateWithoutUserInput[] | UserRoleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutUserInput | UserRoleCreateOrConnectWithoutUserInput[]
    upsert?: UserRoleUpsertWithWhereUniqueWithoutUserInput | UserRoleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserRoleCreateManyUserInputEnvelope
    set?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    disconnect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    delete?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    update?: UserRoleUpdateWithWhereUniqueWithoutUserInput | UserRoleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserRoleUpdateManyWithWhereWithoutUserInput | UserRoleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
  }

  export type UserRoleCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
  }

  export type RoleScopeCreateNestedManyWithoutRoleInput = {
    create?: XOR<RoleScopeCreateWithoutRoleInput, RoleScopeUncheckedCreateWithoutRoleInput> | RoleScopeCreateWithoutRoleInput[] | RoleScopeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleScopeCreateOrConnectWithoutRoleInput | RoleScopeCreateOrConnectWithoutRoleInput[]
    createMany?: RoleScopeCreateManyRoleInputEnvelope
    connect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
  }

  export type UserRoleUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
  }

  export type RoleScopeUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<RoleScopeCreateWithoutRoleInput, RoleScopeUncheckedCreateWithoutRoleInput> | RoleScopeCreateWithoutRoleInput[] | RoleScopeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleScopeCreateOrConnectWithoutRoleInput | RoleScopeCreateOrConnectWithoutRoleInput[]
    createMany?: RoleScopeCreateManyRoleInputEnvelope
    connect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
  }

  export type UserRoleUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    upsert?: UserRoleUpsertWithWhereUniqueWithoutRoleInput | UserRoleUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    set?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    disconnect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    delete?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    update?: UserRoleUpdateWithWhereUniqueWithoutRoleInput | UserRoleUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserRoleUpdateManyWithWhereWithoutRoleInput | UserRoleUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
  }

  export type RoleScopeUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RoleScopeCreateWithoutRoleInput, RoleScopeUncheckedCreateWithoutRoleInput> | RoleScopeCreateWithoutRoleInput[] | RoleScopeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleScopeCreateOrConnectWithoutRoleInput | RoleScopeCreateOrConnectWithoutRoleInput[]
    upsert?: RoleScopeUpsertWithWhereUniqueWithoutRoleInput | RoleScopeUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RoleScopeCreateManyRoleInputEnvelope
    set?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    disconnect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    delete?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    connect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    update?: RoleScopeUpdateWithWhereUniqueWithoutRoleInput | RoleScopeUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RoleScopeUpdateManyWithWhereWithoutRoleInput | RoleScopeUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RoleScopeScalarWhereInput | RoleScopeScalarWhereInput[]
  }

  export type UserRoleUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput> | UserRoleCreateWithoutRoleInput[] | UserRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserRoleCreateOrConnectWithoutRoleInput | UserRoleCreateOrConnectWithoutRoleInput[]
    upsert?: UserRoleUpsertWithWhereUniqueWithoutRoleInput | UserRoleUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserRoleCreateManyRoleInputEnvelope
    set?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    disconnect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    delete?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    connect?: UserRoleWhereUniqueInput | UserRoleWhereUniqueInput[]
    update?: UserRoleUpdateWithWhereUniqueWithoutRoleInput | UserRoleUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserRoleUpdateManyWithWhereWithoutRoleInput | UserRoleUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
  }

  export type RoleScopeUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RoleScopeCreateWithoutRoleInput, RoleScopeUncheckedCreateWithoutRoleInput> | RoleScopeCreateWithoutRoleInput[] | RoleScopeUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RoleScopeCreateOrConnectWithoutRoleInput | RoleScopeCreateOrConnectWithoutRoleInput[]
    upsert?: RoleScopeUpsertWithWhereUniqueWithoutRoleInput | RoleScopeUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RoleScopeCreateManyRoleInputEnvelope
    set?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    disconnect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    delete?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    connect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    update?: RoleScopeUpdateWithWhereUniqueWithoutRoleInput | RoleScopeUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RoleScopeUpdateManyWithWhereWithoutRoleInput | RoleScopeUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RoleScopeScalarWhereInput | RoleScopeScalarWhereInput[]
  }

  export type RoleScopeCreateNestedManyWithoutScopeInput = {
    create?: XOR<RoleScopeCreateWithoutScopeInput, RoleScopeUncheckedCreateWithoutScopeInput> | RoleScopeCreateWithoutScopeInput[] | RoleScopeUncheckedCreateWithoutScopeInput[]
    connectOrCreate?: RoleScopeCreateOrConnectWithoutScopeInput | RoleScopeCreateOrConnectWithoutScopeInput[]
    createMany?: RoleScopeCreateManyScopeInputEnvelope
    connect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
  }

  export type RoleScopeUncheckedCreateNestedManyWithoutScopeInput = {
    create?: XOR<RoleScopeCreateWithoutScopeInput, RoleScopeUncheckedCreateWithoutScopeInput> | RoleScopeCreateWithoutScopeInput[] | RoleScopeUncheckedCreateWithoutScopeInput[]
    connectOrCreate?: RoleScopeCreateOrConnectWithoutScopeInput | RoleScopeCreateOrConnectWithoutScopeInput[]
    createMany?: RoleScopeCreateManyScopeInputEnvelope
    connect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
  }

  export type RoleScopeUpdateManyWithoutScopeNestedInput = {
    create?: XOR<RoleScopeCreateWithoutScopeInput, RoleScopeUncheckedCreateWithoutScopeInput> | RoleScopeCreateWithoutScopeInput[] | RoleScopeUncheckedCreateWithoutScopeInput[]
    connectOrCreate?: RoleScopeCreateOrConnectWithoutScopeInput | RoleScopeCreateOrConnectWithoutScopeInput[]
    upsert?: RoleScopeUpsertWithWhereUniqueWithoutScopeInput | RoleScopeUpsertWithWhereUniqueWithoutScopeInput[]
    createMany?: RoleScopeCreateManyScopeInputEnvelope
    set?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    disconnect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    delete?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    connect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    update?: RoleScopeUpdateWithWhereUniqueWithoutScopeInput | RoleScopeUpdateWithWhereUniqueWithoutScopeInput[]
    updateMany?: RoleScopeUpdateManyWithWhereWithoutScopeInput | RoleScopeUpdateManyWithWhereWithoutScopeInput[]
    deleteMany?: RoleScopeScalarWhereInput | RoleScopeScalarWhereInput[]
  }

  export type RoleScopeUncheckedUpdateManyWithoutScopeNestedInput = {
    create?: XOR<RoleScopeCreateWithoutScopeInput, RoleScopeUncheckedCreateWithoutScopeInput> | RoleScopeCreateWithoutScopeInput[] | RoleScopeUncheckedCreateWithoutScopeInput[]
    connectOrCreate?: RoleScopeCreateOrConnectWithoutScopeInput | RoleScopeCreateOrConnectWithoutScopeInput[]
    upsert?: RoleScopeUpsertWithWhereUniqueWithoutScopeInput | RoleScopeUpsertWithWhereUniqueWithoutScopeInput[]
    createMany?: RoleScopeCreateManyScopeInputEnvelope
    set?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    disconnect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    delete?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    connect?: RoleScopeWhereUniqueInput | RoleScopeWhereUniqueInput[]
    update?: RoleScopeUpdateWithWhereUniqueWithoutScopeInput | RoleScopeUpdateWithWhereUniqueWithoutScopeInput[]
    updateMany?: RoleScopeUpdateManyWithWhereWithoutScopeInput | RoleScopeUpdateManyWithWhereWithoutScopeInput[]
    deleteMany?: RoleScopeScalarWhereInput | RoleScopeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutUserRolesInput = {
    create?: XOR<UserCreateWithoutUserRolesInput, UserUncheckedCreateWithoutUserRolesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserRolesInput
    connect?: UserWhereUniqueInput
  }

  export type RoleCreateNestedOneWithoutUsersInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    connect?: RoleWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserRolesNestedInput = {
    create?: XOR<UserCreateWithoutUserRolesInput, UserUncheckedCreateWithoutUserRolesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserRolesInput
    upsert?: UserUpsertWithoutUserRolesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserRolesInput, UserUpdateWithoutUserRolesInput>, UserUncheckedUpdateWithoutUserRolesInput>
  }

  export type RoleUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    upsert?: RoleUpsertWithoutUsersInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutUsersInput, RoleUpdateWithoutUsersInput>, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type RoleCreateNestedOneWithoutScopesInput = {
    create?: XOR<RoleCreateWithoutScopesInput, RoleUncheckedCreateWithoutScopesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutScopesInput
    connect?: RoleWhereUniqueInput
  }

  export type ScopeCreateNestedOneWithoutRolesInput = {
    create?: XOR<ScopeCreateWithoutRolesInput, ScopeUncheckedCreateWithoutRolesInput>
    connectOrCreate?: ScopeCreateOrConnectWithoutRolesInput
    connect?: ScopeWhereUniqueInput
  }

  export type RoleUpdateOneRequiredWithoutScopesNestedInput = {
    create?: XOR<RoleCreateWithoutScopesInput, RoleUncheckedCreateWithoutScopesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutScopesInput
    upsert?: RoleUpsertWithoutScopesInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutScopesInput, RoleUpdateWithoutScopesInput>, RoleUncheckedUpdateWithoutScopesInput>
  }

  export type ScopeUpdateOneRequiredWithoutRolesNestedInput = {
    create?: XOR<ScopeCreateWithoutRolesInput, ScopeUncheckedCreateWithoutRolesInput>
    connectOrCreate?: ScopeCreateOrConnectWithoutRolesInput
    upsert?: ScopeUpsertWithoutRolesInput
    connect?: ScopeWhereUniqueInput
    update?: XOR<XOR<ScopeUpdateToOneWithWhereWithoutRolesInput, ScopeUpdateWithoutRolesInput>, ScopeUncheckedUpdateWithoutRolesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumKYCStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KYCStatus | EnumKYCStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKYCStatusFilter<$PrismaModel> | $Enums.KYCStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumKYCStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KYCStatus | EnumKYCStatusFieldRefInput<$PrismaModel>
    in?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.KYCStatus[] | ListEnumKYCStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumKYCStatusWithAggregatesFilter<$PrismaModel> | $Enums.KYCStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKYCStatusFilter<$PrismaModel>
    _max?: NestedEnumKYCStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type KYCCreateWithoutStatusHistoriesInput = {
    passportUrl: string
    nationalIdUrl?: string | null
    proofOfAddressUrl: string
    photoUrl: string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: string | null
    fingerprintImageUrl?: string | null
    signatureUrl?: string | null
    selfieUrl: string
    status?: $Enums.KYCStatus
    submittedAt?: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutKycsInput
  }

  export type KYCUncheckedCreateWithoutStatusHistoriesInput = {
    id?: number
    userId: number
    passportUrl: string
    nationalIdUrl?: string | null
    proofOfAddressUrl: string
    photoUrl: string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: string | null
    fingerprintImageUrl?: string | null
    signatureUrl?: string | null
    selfieUrl: string
    status?: $Enums.KYCStatus
    submittedAt?: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KYCCreateOrConnectWithoutStatusHistoriesInput = {
    where: KYCWhereUniqueInput
    create: XOR<KYCCreateWithoutStatusHistoriesInput, KYCUncheckedCreateWithoutStatusHistoriesInput>
  }

  export type KYCUpsertWithoutStatusHistoriesInput = {
    update: XOR<KYCUpdateWithoutStatusHistoriesInput, KYCUncheckedUpdateWithoutStatusHistoriesInput>
    create: XOR<KYCCreateWithoutStatusHistoriesInput, KYCUncheckedCreateWithoutStatusHistoriesInput>
    where?: KYCWhereInput
  }

  export type KYCUpdateToOneWithWhereWithoutStatusHistoriesInput = {
    where?: KYCWhereInput
    data: XOR<KYCUpdateWithoutStatusHistoriesInput, KYCUncheckedUpdateWithoutStatusHistoriesInput>
  }

  export type KYCUpdateWithoutStatusHistoriesInput = {
    passportUrl?: StringFieldUpdateOperationsInput | string
    nationalIdUrl?: NullableStringFieldUpdateOperationsInput | string | null
    proofOfAddressUrl?: StringFieldUpdateOperationsInput | string
    photoUrl?: StringFieldUpdateOperationsInput | string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprintImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    selfieUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutKycsNestedInput
  }

  export type KYCUncheckedUpdateWithoutStatusHistoriesInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    passportUrl?: StringFieldUpdateOperationsInput | string
    nationalIdUrl?: NullableStringFieldUpdateOperationsInput | string | null
    proofOfAddressUrl?: StringFieldUpdateOperationsInput | string
    photoUrl?: StringFieldUpdateOperationsInput | string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprintImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    selfieUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutNotificationsInput = {
    uid?: string
    name: string
    email: string
    password: string
    image?: string | null
    dateOfBirth?: string | null
    nationality?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    kycs?: KYCCreateNestedManyWithoutUserInput
    userRoles?: UserRoleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: number
    uid?: string
    name: string
    email: string
    password: string
    image?: string | null
    dateOfBirth?: string | null
    nationality?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    kycs?: KYCUncheckedCreateNestedManyWithoutUserInput
    userRoles?: UserRoleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    uid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycs?: KYCUpdateManyWithoutUserNestedInput
    userRoles?: UserRoleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycs?: KYCUncheckedUpdateManyWithoutUserNestedInput
    userRoles?: UserRoleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutKycsInput = {
    uid?: string
    name: string
    email: string
    password: string
    image?: string | null
    dateOfBirth?: string | null
    nationality?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationCreateNestedManyWithoutUserInput
    userRoles?: UserRoleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutKycsInput = {
    id?: number
    uid?: string
    name: string
    email: string
    password: string
    image?: string | null
    dateOfBirth?: string | null
    nationality?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    userRoles?: UserRoleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutKycsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutKycsInput, UserUncheckedCreateWithoutKycsInput>
  }

  export type KYCStatusHistoryCreateWithoutKycInput = {
    oldStatus: string
    newStatus: string
    changedAt?: Date | string
  }

  export type KYCStatusHistoryUncheckedCreateWithoutKycInput = {
    id?: number
    oldStatus: string
    newStatus: string
    changedAt?: Date | string
  }

  export type KYCStatusHistoryCreateOrConnectWithoutKycInput = {
    where: KYCStatusHistoryWhereUniqueInput
    create: XOR<KYCStatusHistoryCreateWithoutKycInput, KYCStatusHistoryUncheckedCreateWithoutKycInput>
  }

  export type KYCStatusHistoryCreateManyKycInputEnvelope = {
    data: KYCStatusHistoryCreateManyKycInput | KYCStatusHistoryCreateManyKycInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutKycsInput = {
    update: XOR<UserUpdateWithoutKycsInput, UserUncheckedUpdateWithoutKycsInput>
    create: XOR<UserCreateWithoutKycsInput, UserUncheckedCreateWithoutKycsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutKycsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutKycsInput, UserUncheckedUpdateWithoutKycsInput>
  }

  export type UserUpdateWithoutKycsInput = {
    uid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    userRoles?: UserRoleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutKycsInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    userRoles?: UserRoleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type KYCStatusHistoryUpsertWithWhereUniqueWithoutKycInput = {
    where: KYCStatusHistoryWhereUniqueInput
    update: XOR<KYCStatusHistoryUpdateWithoutKycInput, KYCStatusHistoryUncheckedUpdateWithoutKycInput>
    create: XOR<KYCStatusHistoryCreateWithoutKycInput, KYCStatusHistoryUncheckedCreateWithoutKycInput>
  }

  export type KYCStatusHistoryUpdateWithWhereUniqueWithoutKycInput = {
    where: KYCStatusHistoryWhereUniqueInput
    data: XOR<KYCStatusHistoryUpdateWithoutKycInput, KYCStatusHistoryUncheckedUpdateWithoutKycInput>
  }

  export type KYCStatusHistoryUpdateManyWithWhereWithoutKycInput = {
    where: KYCStatusHistoryScalarWhereInput
    data: XOR<KYCStatusHistoryUpdateManyMutationInput, KYCStatusHistoryUncheckedUpdateManyWithoutKycInput>
  }

  export type KYCStatusHistoryScalarWhereInput = {
    AND?: KYCStatusHistoryScalarWhereInput | KYCStatusHistoryScalarWhereInput[]
    OR?: KYCStatusHistoryScalarWhereInput[]
    NOT?: KYCStatusHistoryScalarWhereInput | KYCStatusHistoryScalarWhereInput[]
    id?: IntFilter<"KYCStatusHistory"> | number
    kycId?: IntFilter<"KYCStatusHistory"> | number
    oldStatus?: StringFilter<"KYCStatusHistory"> | string
    newStatus?: StringFilter<"KYCStatusHistory"> | string
    changedAt?: DateTimeFilter<"KYCStatusHistory"> | Date | string
  }

  export type KYCCreateWithoutUserInput = {
    passportUrl: string
    nationalIdUrl?: string | null
    proofOfAddressUrl: string
    photoUrl: string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: string | null
    fingerprintImageUrl?: string | null
    signatureUrl?: string | null
    selfieUrl: string
    status?: $Enums.KYCStatus
    submittedAt?: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    statusHistories?: KYCStatusHistoryCreateNestedManyWithoutKycInput
  }

  export type KYCUncheckedCreateWithoutUserInput = {
    id?: number
    passportUrl: string
    nationalIdUrl?: string | null
    proofOfAddressUrl: string
    photoUrl: string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: string | null
    fingerprintImageUrl?: string | null
    signatureUrl?: string | null
    selfieUrl: string
    status?: $Enums.KYCStatus
    submittedAt?: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    statusHistories?: KYCStatusHistoryUncheckedCreateNestedManyWithoutKycInput
  }

  export type KYCCreateOrConnectWithoutUserInput = {
    where: KYCWhereUniqueInput
    create: XOR<KYCCreateWithoutUserInput, KYCUncheckedCreateWithoutUserInput>
  }

  export type KYCCreateManyUserInputEnvelope = {
    data: KYCCreateManyUserInput | KYCCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    message: string
    read?: boolean
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: number
    message: string
    read?: boolean
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserRoleCreateWithoutUserInput = {
    role: RoleCreateNestedOneWithoutUsersInput
  }

  export type UserRoleUncheckedCreateWithoutUserInput = {
    id?: number
    roleId: number
  }

  export type UserRoleCreateOrConnectWithoutUserInput = {
    where: UserRoleWhereUniqueInput
    create: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput>
  }

  export type UserRoleCreateManyUserInputEnvelope = {
    data: UserRoleCreateManyUserInput | UserRoleCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type KYCUpsertWithWhereUniqueWithoutUserInput = {
    where: KYCWhereUniqueInput
    update: XOR<KYCUpdateWithoutUserInput, KYCUncheckedUpdateWithoutUserInput>
    create: XOR<KYCCreateWithoutUserInput, KYCUncheckedCreateWithoutUserInput>
  }

  export type KYCUpdateWithWhereUniqueWithoutUserInput = {
    where: KYCWhereUniqueInput
    data: XOR<KYCUpdateWithoutUserInput, KYCUncheckedUpdateWithoutUserInput>
  }

  export type KYCUpdateManyWithWhereWithoutUserInput = {
    where: KYCScalarWhereInput
    data: XOR<KYCUpdateManyMutationInput, KYCUncheckedUpdateManyWithoutUserInput>
  }

  export type KYCScalarWhereInput = {
    AND?: KYCScalarWhereInput | KYCScalarWhereInput[]
    OR?: KYCScalarWhereInput[]
    NOT?: KYCScalarWhereInput | KYCScalarWhereInput[]
    id?: IntFilter<"KYC"> | number
    userId?: IntFilter<"KYC"> | number
    passportUrl?: StringFilter<"KYC"> | string
    nationalIdUrl?: StringNullableFilter<"KYC"> | string | null
    proofOfAddressUrl?: StringFilter<"KYC"> | string
    photoUrl?: StringFilter<"KYC"> | string
    otherDocuments?: JsonNullableFilter<"KYC">
    fingerprintScanUrl?: StringNullableFilter<"KYC"> | string | null
    fingerprintImageUrl?: StringNullableFilter<"KYC"> | string | null
    signatureUrl?: StringNullableFilter<"KYC"> | string | null
    selfieUrl?: StringFilter<"KYC"> | string
    status?: EnumKYCStatusFilter<"KYC"> | $Enums.KYCStatus
    submittedAt?: DateTimeFilter<"KYC"> | Date | string
    verifiedAt?: DateTimeNullableFilter<"KYC"> | Date | string | null
    createdAt?: DateTimeFilter<"KYC"> | Date | string
    updatedAt?: DateTimeFilter<"KYC"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: IntFilter<"Notification"> | number
    userId?: IntFilter<"Notification"> | number
    message?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type UserRoleUpsertWithWhereUniqueWithoutUserInput = {
    where: UserRoleWhereUniqueInput
    update: XOR<UserRoleUpdateWithoutUserInput, UserRoleUncheckedUpdateWithoutUserInput>
    create: XOR<UserRoleCreateWithoutUserInput, UserRoleUncheckedCreateWithoutUserInput>
  }

  export type UserRoleUpdateWithWhereUniqueWithoutUserInput = {
    where: UserRoleWhereUniqueInput
    data: XOR<UserRoleUpdateWithoutUserInput, UserRoleUncheckedUpdateWithoutUserInput>
  }

  export type UserRoleUpdateManyWithWhereWithoutUserInput = {
    where: UserRoleScalarWhereInput
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyWithoutUserInput>
  }

  export type UserRoleScalarWhereInput = {
    AND?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
    OR?: UserRoleScalarWhereInput[]
    NOT?: UserRoleScalarWhereInput | UserRoleScalarWhereInput[]
    id?: IntFilter<"UserRole"> | number
    userId?: IntFilter<"UserRole"> | number
    roleId?: IntFilter<"UserRole"> | number
  }

  export type UserRoleCreateWithoutRoleInput = {
    user: UserCreateNestedOneWithoutUserRolesInput
  }

  export type UserRoleUncheckedCreateWithoutRoleInput = {
    id?: number
    userId: number
  }

  export type UserRoleCreateOrConnectWithoutRoleInput = {
    where: UserRoleWhereUniqueInput
    create: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput>
  }

  export type UserRoleCreateManyRoleInputEnvelope = {
    data: UserRoleCreateManyRoleInput | UserRoleCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type RoleScopeCreateWithoutRoleInput = {
    scope: ScopeCreateNestedOneWithoutRolesInput
  }

  export type RoleScopeUncheckedCreateWithoutRoleInput = {
    id?: number
    scopeId: number
  }

  export type RoleScopeCreateOrConnectWithoutRoleInput = {
    where: RoleScopeWhereUniqueInput
    create: XOR<RoleScopeCreateWithoutRoleInput, RoleScopeUncheckedCreateWithoutRoleInput>
  }

  export type RoleScopeCreateManyRoleInputEnvelope = {
    data: RoleScopeCreateManyRoleInput | RoleScopeCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type UserRoleUpsertWithWhereUniqueWithoutRoleInput = {
    where: UserRoleWhereUniqueInput
    update: XOR<UserRoleUpdateWithoutRoleInput, UserRoleUncheckedUpdateWithoutRoleInput>
    create: XOR<UserRoleCreateWithoutRoleInput, UserRoleUncheckedCreateWithoutRoleInput>
  }

  export type UserRoleUpdateWithWhereUniqueWithoutRoleInput = {
    where: UserRoleWhereUniqueInput
    data: XOR<UserRoleUpdateWithoutRoleInput, UserRoleUncheckedUpdateWithoutRoleInput>
  }

  export type UserRoleUpdateManyWithWhereWithoutRoleInput = {
    where: UserRoleScalarWhereInput
    data: XOR<UserRoleUpdateManyMutationInput, UserRoleUncheckedUpdateManyWithoutRoleInput>
  }

  export type RoleScopeUpsertWithWhereUniqueWithoutRoleInput = {
    where: RoleScopeWhereUniqueInput
    update: XOR<RoleScopeUpdateWithoutRoleInput, RoleScopeUncheckedUpdateWithoutRoleInput>
    create: XOR<RoleScopeCreateWithoutRoleInput, RoleScopeUncheckedCreateWithoutRoleInput>
  }

  export type RoleScopeUpdateWithWhereUniqueWithoutRoleInput = {
    where: RoleScopeWhereUniqueInput
    data: XOR<RoleScopeUpdateWithoutRoleInput, RoleScopeUncheckedUpdateWithoutRoleInput>
  }

  export type RoleScopeUpdateManyWithWhereWithoutRoleInput = {
    where: RoleScopeScalarWhereInput
    data: XOR<RoleScopeUpdateManyMutationInput, RoleScopeUncheckedUpdateManyWithoutRoleInput>
  }

  export type RoleScopeScalarWhereInput = {
    AND?: RoleScopeScalarWhereInput | RoleScopeScalarWhereInput[]
    OR?: RoleScopeScalarWhereInput[]
    NOT?: RoleScopeScalarWhereInput | RoleScopeScalarWhereInput[]
    id?: IntFilter<"RoleScope"> | number
    roleId?: IntFilter<"RoleScope"> | number
    scopeId?: IntFilter<"RoleScope"> | number
  }

  export type RoleScopeCreateWithoutScopeInput = {
    role: RoleCreateNestedOneWithoutScopesInput
  }

  export type RoleScopeUncheckedCreateWithoutScopeInput = {
    id?: number
    roleId: number
  }

  export type RoleScopeCreateOrConnectWithoutScopeInput = {
    where: RoleScopeWhereUniqueInput
    create: XOR<RoleScopeCreateWithoutScopeInput, RoleScopeUncheckedCreateWithoutScopeInput>
  }

  export type RoleScopeCreateManyScopeInputEnvelope = {
    data: RoleScopeCreateManyScopeInput | RoleScopeCreateManyScopeInput[]
    skipDuplicates?: boolean
  }

  export type RoleScopeUpsertWithWhereUniqueWithoutScopeInput = {
    where: RoleScopeWhereUniqueInput
    update: XOR<RoleScopeUpdateWithoutScopeInput, RoleScopeUncheckedUpdateWithoutScopeInput>
    create: XOR<RoleScopeCreateWithoutScopeInput, RoleScopeUncheckedCreateWithoutScopeInput>
  }

  export type RoleScopeUpdateWithWhereUniqueWithoutScopeInput = {
    where: RoleScopeWhereUniqueInput
    data: XOR<RoleScopeUpdateWithoutScopeInput, RoleScopeUncheckedUpdateWithoutScopeInput>
  }

  export type RoleScopeUpdateManyWithWhereWithoutScopeInput = {
    where: RoleScopeScalarWhereInput
    data: XOR<RoleScopeUpdateManyMutationInput, RoleScopeUncheckedUpdateManyWithoutScopeInput>
  }

  export type UserCreateWithoutUserRolesInput = {
    uid?: string
    name: string
    email: string
    password: string
    image?: string | null
    dateOfBirth?: string | null
    nationality?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    kycs?: KYCCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserRolesInput = {
    id?: number
    uid?: string
    name: string
    email: string
    password: string
    image?: string | null
    dateOfBirth?: string | null
    nationality?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    kycs?: KYCUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserRolesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserRolesInput, UserUncheckedCreateWithoutUserRolesInput>
  }

  export type RoleCreateWithoutUsersInput = {
    name: string
    scopes?: RoleScopeCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutUsersInput = {
    id?: number
    name: string
    scopes?: RoleScopeUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutUsersInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
  }

  export type UserUpsertWithoutUserRolesInput = {
    update: XOR<UserUpdateWithoutUserRolesInput, UserUncheckedUpdateWithoutUserRolesInput>
    create: XOR<UserCreateWithoutUserRolesInput, UserUncheckedCreateWithoutUserRolesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserRolesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserRolesInput, UserUncheckedUpdateWithoutUserRolesInput>
  }

  export type UserUpdateWithoutUserRolesInput = {
    uid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycs?: KYCUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    uid?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    mother?: NullableJsonNullValueInput | InputJsonValue
    father?: NullableJsonNullValueInput | InputJsonValue
    spouse?: NullableJsonNullValueInput | InputJsonValue
    children?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kycs?: KYCUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RoleUpsertWithoutUsersInput = {
    update: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutUsersInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type RoleUpdateWithoutUsersInput = {
    name?: StringFieldUpdateOperationsInput | string
    scopes?: RoleScopeUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    scopes?: RoleScopeUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateWithoutScopesInput = {
    name: string
    users?: UserRoleCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutScopesInput = {
    id?: number
    name: string
    users?: UserRoleUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutScopesInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutScopesInput, RoleUncheckedCreateWithoutScopesInput>
  }

  export type ScopeCreateWithoutRolesInput = {
    name: string
  }

  export type ScopeUncheckedCreateWithoutRolesInput = {
    id?: number
    name: string
  }

  export type ScopeCreateOrConnectWithoutRolesInput = {
    where: ScopeWhereUniqueInput
    create: XOR<ScopeCreateWithoutRolesInput, ScopeUncheckedCreateWithoutRolesInput>
  }

  export type RoleUpsertWithoutScopesInput = {
    update: XOR<RoleUpdateWithoutScopesInput, RoleUncheckedUpdateWithoutScopesInput>
    create: XOR<RoleCreateWithoutScopesInput, RoleUncheckedCreateWithoutScopesInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutScopesInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutScopesInput, RoleUncheckedUpdateWithoutScopesInput>
  }

  export type RoleUpdateWithoutScopesInput = {
    name?: StringFieldUpdateOperationsInput | string
    users?: UserRoleUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutScopesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    users?: UserRoleUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type ScopeUpsertWithoutRolesInput = {
    update: XOR<ScopeUpdateWithoutRolesInput, ScopeUncheckedUpdateWithoutRolesInput>
    create: XOR<ScopeCreateWithoutRolesInput, ScopeUncheckedCreateWithoutRolesInput>
    where?: ScopeWhereInput
  }

  export type ScopeUpdateToOneWithWhereWithoutRolesInput = {
    where?: ScopeWhereInput
    data: XOR<ScopeUpdateWithoutRolesInput, ScopeUncheckedUpdateWithoutRolesInput>
  }

  export type ScopeUpdateWithoutRolesInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ScopeUncheckedUpdateWithoutRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type KYCStatusHistoryCreateManyKycInput = {
    id?: number
    oldStatus: string
    newStatus: string
    changedAt?: Date | string
  }

  export type KYCStatusHistoryUpdateWithoutKycInput = {
    oldStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KYCStatusHistoryUncheckedUpdateWithoutKycInput = {
    id?: IntFieldUpdateOperationsInput | number
    oldStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KYCStatusHistoryUncheckedUpdateManyWithoutKycInput = {
    id?: IntFieldUpdateOperationsInput | number
    oldStatus?: StringFieldUpdateOperationsInput | string
    newStatus?: StringFieldUpdateOperationsInput | string
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KYCCreateManyUserInput = {
    id?: number
    passportUrl: string
    nationalIdUrl?: string | null
    proofOfAddressUrl: string
    photoUrl: string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: string | null
    fingerprintImageUrl?: string | null
    signatureUrl?: string | null
    selfieUrl: string
    status?: $Enums.KYCStatus
    submittedAt?: Date | string
    verifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: number
    message: string
    read?: boolean
    createdAt?: Date | string
  }

  export type UserRoleCreateManyUserInput = {
    id?: number
    roleId: number
  }

  export type KYCUpdateWithoutUserInput = {
    passportUrl?: StringFieldUpdateOperationsInput | string
    nationalIdUrl?: NullableStringFieldUpdateOperationsInput | string | null
    proofOfAddressUrl?: StringFieldUpdateOperationsInput | string
    photoUrl?: StringFieldUpdateOperationsInput | string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprintImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    selfieUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistories?: KYCStatusHistoryUpdateManyWithoutKycNestedInput
  }

  export type KYCUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    passportUrl?: StringFieldUpdateOperationsInput | string
    nationalIdUrl?: NullableStringFieldUpdateOperationsInput | string | null
    proofOfAddressUrl?: StringFieldUpdateOperationsInput | string
    photoUrl?: StringFieldUpdateOperationsInput | string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprintImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    selfieUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    statusHistories?: KYCStatusHistoryUncheckedUpdateManyWithoutKycNestedInput
  }

  export type KYCUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    passportUrl?: StringFieldUpdateOperationsInput | string
    nationalIdUrl?: NullableStringFieldUpdateOperationsInput | string | null
    proofOfAddressUrl?: StringFieldUpdateOperationsInput | string
    photoUrl?: StringFieldUpdateOperationsInput | string
    otherDocuments?: NullableJsonNullValueInput | InputJsonValue
    fingerprintScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    fingerprintImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    selfieUrl?: StringFieldUpdateOperationsInput | string
    status?: EnumKYCStatusFieldUpdateOperationsInput | $Enums.KYCStatus
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserRoleUpdateWithoutUserInput = {
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserRoleUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
  }

  export type UserRoleUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
  }

  export type UserRoleCreateManyRoleInput = {
    id?: number
    userId: number
  }

  export type RoleScopeCreateManyRoleInput = {
    id?: number
    scopeId: number
  }

  export type UserRoleUpdateWithoutRoleInput = {
    user?: UserUpdateOneRequiredWithoutUserRolesNestedInput
  }

  export type UserRoleUncheckedUpdateWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type UserRoleUncheckedUpdateManyWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type RoleScopeUpdateWithoutRoleInput = {
    scope?: ScopeUpdateOneRequiredWithoutRolesNestedInput
  }

  export type RoleScopeUncheckedUpdateWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    scopeId?: IntFieldUpdateOperationsInput | number
  }

  export type RoleScopeUncheckedUpdateManyWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    scopeId?: IntFieldUpdateOperationsInput | number
  }

  export type RoleScopeCreateManyScopeInput = {
    id?: number
    roleId: number
  }

  export type RoleScopeUpdateWithoutScopeInput = {
    role?: RoleUpdateOneRequiredWithoutScopesNestedInput
  }

  export type RoleScopeUncheckedUpdateWithoutScopeInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
  }

  export type RoleScopeUncheckedUpdateManyWithoutScopeInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}