
/**
 * Client
**/

import * as runtime from './runtime/library';
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends Prisma.PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};

export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = {
  userId: string
  username: string
  createTime: Date
  passwordHash: string
  displayName: string
  avatarPath: string | null
  status: UserStatus
}

/**
 * Model Room
 * 
 */
export type Room = {
  roomId: string
  roomType: RoomType
  roomDisplayName: string | null
  roomAvatar: string | null
}

/**
 * Model UserRoom
 * 
 */
export type UserRoom = {
  username: string
  roomId: string
  joinedAt: Date
  isAdmin: boolean
  isBlocked: boolean
  lastReadMessage: string | null
  isHidden: boolean
  isNotificationMuted: boolean
  isMarkedFavourite: boolean
  isPinned: boolean
}

/**
 * Model Message
 * 
 */
export type Message = {
  key: string
  senderUsername: string
  roomId: string
  content: string
  createdAt: Date
  editedAt: Date | null
  contentType: MessageContentType
}

/**
 * Model UserMessage
 * 
 */
export type UserMessage = {
  username: string
  roomId: string
  isHidden: boolean
  isNotificationMuted: boolean
  isMarkedFavourite: boolean
  isPinned: boolean
}

/**
 * Model Session
 * 
 */
export type Session = {
  id: string
  sid: string
  data: string
  expiresAt: Date
}


/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const MessageContentType: {
  audio: 'audio',
  video: 'video',
  text: 'text',
  image: 'image',
  file: 'file'
};

export type MessageContentType = (typeof MessageContentType)[keyof typeof MessageContentType]


export const RoomType: {
  private: 'private',
  group: 'group'
};

export type RoomType = (typeof RoomType)[keyof typeof RoomType]


export const UserStatus: {
  available: 'available',
  dnd: 'dnd',
  hidden: 'hidden'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<this, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<GlobalReject>;

  /**
   * `prisma.room`: Exposes CRUD operations for the **Room** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rooms
    * const rooms = await prisma.room.findMany()
    * ```
    */
  get room(): Prisma.RoomDelegate<GlobalReject>;

  /**
   * `prisma.userRoom`: Exposes CRUD operations for the **UserRoom** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserRooms
    * const userRooms = await prisma.userRoom.findMany()
    * ```
    */
  get userRoom(): Prisma.UserRoomDelegate<GlobalReject>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<GlobalReject>;

  /**
   * `prisma.userMessage`: Exposes CRUD operations for the **UserMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserMessages
    * const userMessages = await prisma.userMessage.findMany()
    * ```
    */
  get userMessage(): Prisma.UserMessageDelegate<GlobalReject>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

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
   * Prisma Client JS version: 4.14.1
   * Query Engine version: d9a4c5988f480fa576d43970d5a23641aa77bc9c
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

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
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

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
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
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

  export function validator<V>(): <S>(select: runtime.Types.Utils.LegacyExact<S, V>) => S;

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
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Room: 'Room',
    UserRoom: 'UserRoom',
    Message: 'Message',
    UserMessage: 'UserMessage',
    Session: 'Session'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

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
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
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
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

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
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */


  export type UserCountOutputType = {
    message: number
    userRoom: number
    rooms: number
    UserMessage: number
  }

  export type UserCountOutputTypeSelect = {
    message?: boolean
    userRoom?: boolean
    rooms?: boolean
    UserMessage?: boolean
  }

  export type UserCountOutputTypeGetPayload<S extends boolean | null | undefined | UserCountOutputTypeArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? UserCountOutputType :
    S extends undefined ? never :
    S extends { include: any } & (UserCountOutputTypeArgs)
    ? UserCountOutputType 
    : S extends { select: any } & (UserCountOutputTypeArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof UserCountOutputType ? UserCountOutputType[P] : never
  } 
      : UserCountOutputType




  // Custom InputTypes

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect | null
  }



  /**
   * Count Type RoomCountOutputType
   */


  export type RoomCountOutputType = {
    message: number
    userRoom: number
    user: number
    UserMessage: number
  }

  export type RoomCountOutputTypeSelect = {
    message?: boolean
    userRoom?: boolean
    user?: boolean
    UserMessage?: boolean
  }

  export type RoomCountOutputTypeGetPayload<S extends boolean | null | undefined | RoomCountOutputTypeArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? RoomCountOutputType :
    S extends undefined ? never :
    S extends { include: any } & (RoomCountOutputTypeArgs)
    ? RoomCountOutputType 
    : S extends { select: any } & (RoomCountOutputTypeArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof RoomCountOutputType ? RoomCountOutputType[P] : never
  } 
      : RoomCountOutputType




  // Custom InputTypes

  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the RoomCountOutputType
     */
    select?: RoomCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model User
   */


  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    userId: string | null
    username: string | null
    createTime: Date | null
    passwordHash: string | null
    displayName: string | null
    avatarPath: string | null
    status: UserStatus | null
  }

  export type UserMaxAggregateOutputType = {
    userId: string | null
    username: string | null
    createTime: Date | null
    passwordHash: string | null
    displayName: string | null
    avatarPath: string | null
    status: UserStatus | null
  }

  export type UserCountAggregateOutputType = {
    userId: number
    username: number
    createTime: number
    passwordHash: number
    displayName: number
    avatarPath: number
    status: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    userId?: true
    username?: true
    createTime?: true
    passwordHash?: true
    displayName?: true
    avatarPath?: true
    status?: true
  }

  export type UserMaxAggregateInputType = {
    userId?: true
    username?: true
    createTime?: true
    passwordHash?: true
    displayName?: true
    avatarPath?: true
    status?: true
  }

  export type UserCountAggregateInputType = {
    userId?: true
    username?: true
    createTime?: true
    passwordHash?: true
    displayName?: true
    avatarPath?: true
    status?: true
    _all?: true
  }

  export type UserAggregateArgs = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
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




  export type UserGroupByArgs = {
    where?: UserWhereInput
    orderBy?: Enumerable<UserOrderByWithAggregationInput>
    by: UserScalarFieldEnum[]
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }


  export type UserGroupByOutputType = {
    userId: string
    username: string
    createTime: Date
    passwordHash: string
    displayName: string
    avatarPath: string | null
    status: UserStatus
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect = {
    userId?: boolean
    username?: boolean
    createTime?: boolean
    passwordHash?: boolean
    displayName?: boolean
    avatarPath?: boolean
    status?: boolean
    message?: boolean | User$messageArgs
    userRoom?: boolean | User$userRoomArgs
    rooms?: boolean | User$roomsArgs
    UserMessage?: boolean | User$UserMessageArgs
    _count?: boolean | UserCountOutputTypeArgs
  }


  export type UserInclude = {
    message?: boolean | User$messageArgs
    userRoom?: boolean | User$userRoomArgs
    rooms?: boolean | User$roomsArgs
    UserMessage?: boolean | User$UserMessageArgs
    _count?: boolean | UserCountOutputTypeArgs
  }

  export type UserGetPayload<S extends boolean | null | undefined | UserArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? User :
    S extends undefined ? never :
    S extends { include: any } & (UserArgs | UserFindManyArgs)
    ? User  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'message' ? Array < MessageGetPayload<S['include'][P]>>  :
        P extends 'userRoom' ? Array < UserRoomGetPayload<S['include'][P]>>  :
        P extends 'rooms' ? Array < RoomGetPayload<S['include'][P]>>  :
        P extends 'UserMessage' ? Array < UserMessageGetPayload<S['include'][P]>>  :
        P extends '_count' ? UserCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (UserArgs | UserFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'message' ? Array < MessageGetPayload<S['select'][P]>>  :
        P extends 'userRoom' ? Array < UserRoomGetPayload<S['select'][P]>>  :
        P extends 'rooms' ? Array < RoomGetPayload<S['select'][P]>>  :
        P extends 'UserMessage' ? Array < UserMessageGetPayload<S['select'][P]>>  :
        P extends '_count' ? UserCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof User ? User[P] : never
  } 
      : User


  type UserCountArgs = 
    Omit<UserFindManyArgs, 'select' | 'include'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

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
    **/
    findUnique<T extends UserFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'User'> extends True ? Prisma__UserClient<UserGetPayload<T>> : Prisma__UserClient<UserGetPayload<T> | null, null>

    /**
     * Find one User that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UserFindUniqueOrThrowArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

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
    **/
    findFirst<T extends UserFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'User'> extends True ? Prisma__UserClient<UserGetPayload<T>> : Prisma__UserClient<UserGetPayload<T> | null, null>

    /**
     * Find the first User that matches the filter or
     * throw `NotFoundError` if no matches were found.
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
    **/
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userWithUserIdOnly = await prisma.user.findMany({ select: { userId: true } })
     * 
    **/
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs>
    ): Prisma.PrismaPromise<Array<UserGetPayload<T>>>

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
    **/
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

    /**
     * Create many Users.
     *     @param {UserCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const user = await prisma.user.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

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
    **/
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

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
    **/
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

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
    **/
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

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
    **/
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

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
    **/
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

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
      T extends _Record<'select', any>
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
      ByFields extends TupleToUnion<T['by']>,
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

  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    message<T extends User$messageArgs= {}>(args?: Subset<T, User$messageArgs>): Prisma.PrismaPromise<Array<MessageGetPayload<T>>| Null>;

    userRoom<T extends User$userRoomArgs= {}>(args?: Subset<T, User$userRoomArgs>): Prisma.PrismaPromise<Array<UserRoomGetPayload<T>>| Null>;

    rooms<T extends User$roomsArgs= {}>(args?: Subset<T, User$roomsArgs>): Prisma.PrismaPromise<Array<RoomGetPayload<T>>| Null>;

    UserMessage<T extends User$UserMessageArgs= {}>(args?: Subset<T, User$UserMessageArgs>): Prisma.PrismaPromise<Array<UserMessageGetPayload<T>>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * User base type for findUnique actions
   */
  export type UserFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUnique
   */
  export interface UserFindUniqueArgs extends UserFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User base type for findFirst actions
   */
  export type UserFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
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
    distinct?: Enumerable<UserScalarFieldEnum>
  }

  /**
   * User findFirst
   */
  export interface UserFindFirstArgs extends UserFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
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
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User findMany
   */
  export type UserFindManyArgs = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: Enumerable<UserOrderByWithRelationInput>
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
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User create
   */
  export type UserCreateArgs = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }


  /**
   * User createMany
   */
  export type UserCreateManyArgs = {
    /**
     * The data used to create many Users.
     */
    data: Enumerable<UserCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * User update
   */
  export type UserUpdateArgs = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
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
  export type UserUpdateManyArgs = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }


  /**
   * User upsert
   */
  export type UserUpsertArgs = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
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
  export type UserDeleteArgs = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }


  /**
   * User.message
   */
  export type User$messageArgs = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    where?: MessageWhereInput
    orderBy?: Enumerable<MessageOrderByWithRelationInput>
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<MessageScalarFieldEnum>
  }


  /**
   * User.userRoom
   */
  export type User$userRoomArgs = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    where?: UserRoomWhereInput
    orderBy?: Enumerable<UserRoomOrderByWithRelationInput>
    cursor?: UserRoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<UserRoomScalarFieldEnum>
  }


  /**
   * User.rooms
   */
  export type User$roomsArgs = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
    where?: RoomWhereInput
    orderBy?: Enumerable<RoomOrderByWithRelationInput>
    cursor?: RoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<RoomScalarFieldEnum>
  }


  /**
   * User.UserMessage
   */
  export type User$UserMessageArgs = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    where?: UserMessageWhereInput
    orderBy?: Enumerable<UserMessageOrderByWithRelationInput>
    cursor?: UserMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<UserMessageScalarFieldEnum>
  }


  /**
   * User without action
   */
  export type UserArgs = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
  }



  /**
   * Model Room
   */


  export type AggregateRoom = {
    _count: RoomCountAggregateOutputType | null
    _min: RoomMinAggregateOutputType | null
    _max: RoomMaxAggregateOutputType | null
  }

  export type RoomMinAggregateOutputType = {
    roomId: string | null
    roomType: RoomType | null
    roomDisplayName: string | null
    roomAvatar: string | null
  }

  export type RoomMaxAggregateOutputType = {
    roomId: string | null
    roomType: RoomType | null
    roomDisplayName: string | null
    roomAvatar: string | null
  }

  export type RoomCountAggregateOutputType = {
    roomId: number
    roomType: number
    roomDisplayName: number
    roomAvatar: number
    _all: number
  }


  export type RoomMinAggregateInputType = {
    roomId?: true
    roomType?: true
    roomDisplayName?: true
    roomAvatar?: true
  }

  export type RoomMaxAggregateInputType = {
    roomId?: true
    roomType?: true
    roomDisplayName?: true
    roomAvatar?: true
  }

  export type RoomCountAggregateInputType = {
    roomId?: true
    roomType?: true
    roomDisplayName?: true
    roomAvatar?: true
    _all?: true
  }

  export type RoomAggregateArgs = {
    /**
     * Filter which Room to aggregate.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: Enumerable<RoomOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rooms
    **/
    _count?: true | RoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoomMaxAggregateInputType
  }

  export type GetRoomAggregateType<T extends RoomAggregateArgs> = {
        [P in keyof T & keyof AggregateRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoom[P]>
      : GetScalarType<T[P], AggregateRoom[P]>
  }




  export type RoomGroupByArgs = {
    where?: RoomWhereInput
    orderBy?: Enumerable<RoomOrderByWithAggregationInput>
    by: RoomScalarFieldEnum[]
    having?: RoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoomCountAggregateInputType | true
    _min?: RoomMinAggregateInputType
    _max?: RoomMaxAggregateInputType
  }


  export type RoomGroupByOutputType = {
    roomId: string
    roomType: RoomType
    roomDisplayName: string | null
    roomAvatar: string | null
    _count: RoomCountAggregateOutputType | null
    _min: RoomMinAggregateOutputType | null
    _max: RoomMaxAggregateOutputType | null
  }

  type GetRoomGroupByPayload<T extends RoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<RoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoomGroupByOutputType[P]>
            : GetScalarType<T[P], RoomGroupByOutputType[P]>
        }
      >
    >


  export type RoomSelect = {
    roomId?: boolean
    roomType?: boolean
    roomDisplayName?: boolean
    roomAvatar?: boolean
    message?: boolean | Room$messageArgs
    userRoom?: boolean | Room$userRoomArgs
    user?: boolean | Room$userArgs
    UserMessage?: boolean | Room$UserMessageArgs
    _count?: boolean | RoomCountOutputTypeArgs
  }


  export type RoomInclude = {
    message?: boolean | Room$messageArgs
    userRoom?: boolean | Room$userRoomArgs
    user?: boolean | Room$userArgs
    UserMessage?: boolean | Room$UserMessageArgs
    _count?: boolean | RoomCountOutputTypeArgs
  }

  export type RoomGetPayload<S extends boolean | null | undefined | RoomArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Room :
    S extends undefined ? never :
    S extends { include: any } & (RoomArgs | RoomFindManyArgs)
    ? Room  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'message' ? Array < MessageGetPayload<S['include'][P]>>  :
        P extends 'userRoom' ? Array < UserRoomGetPayload<S['include'][P]>>  :
        P extends 'user' ? Array < UserGetPayload<S['include'][P]>>  :
        P extends 'UserMessage' ? Array < UserMessageGetPayload<S['include'][P]>>  :
        P extends '_count' ? RoomCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (RoomArgs | RoomFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'message' ? Array < MessageGetPayload<S['select'][P]>>  :
        P extends 'userRoom' ? Array < UserRoomGetPayload<S['select'][P]>>  :
        P extends 'user' ? Array < UserGetPayload<S['select'][P]>>  :
        P extends 'UserMessage' ? Array < UserMessageGetPayload<S['select'][P]>>  :
        P extends '_count' ? RoomCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof Room ? Room[P] : never
  } 
      : Room


  type RoomCountArgs = 
    Omit<RoomFindManyArgs, 'select' | 'include'> & {
      select?: RoomCountAggregateInputType | true
    }

  export interface RoomDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Room that matches the filter.
     * @param {RoomFindUniqueArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends RoomFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, RoomFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Room'> extends True ? Prisma__RoomClient<RoomGetPayload<T>> : Prisma__RoomClient<RoomGetPayload<T> | null, null>

    /**
     * Find one Room that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {RoomFindUniqueOrThrowArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends RoomFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, RoomFindUniqueOrThrowArgs>
    ): Prisma__RoomClient<RoomGetPayload<T>>

    /**
     * Find the first Room that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindFirstArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends RoomFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, RoomFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Room'> extends True ? Prisma__RoomClient<RoomGetPayload<T>> : Prisma__RoomClient<RoomGetPayload<T> | null, null>

    /**
     * Find the first Room that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindFirstOrThrowArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends RoomFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RoomFindFirstOrThrowArgs>
    ): Prisma__RoomClient<RoomGetPayload<T>>

    /**
     * Find zero or more Rooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rooms
     * const rooms = await prisma.room.findMany()
     * 
     * // Get first 10 Rooms
     * const rooms = await prisma.room.findMany({ take: 10 })
     * 
     * // Only select the `roomId`
     * const roomWithRoomIdOnly = await prisma.room.findMany({ select: { roomId: true } })
     * 
    **/
    findMany<T extends RoomFindManyArgs>(
      args?: SelectSubset<T, RoomFindManyArgs>
    ): Prisma.PrismaPromise<Array<RoomGetPayload<T>>>

    /**
     * Create a Room.
     * @param {RoomCreateArgs} args - Arguments to create a Room.
     * @example
     * // Create one Room
     * const Room = await prisma.room.create({
     *   data: {
     *     // ... data to create a Room
     *   }
     * })
     * 
    **/
    create<T extends RoomCreateArgs>(
      args: SelectSubset<T, RoomCreateArgs>
    ): Prisma__RoomClient<RoomGetPayload<T>>

    /**
     * Create many Rooms.
     *     @param {RoomCreateManyArgs} args - Arguments to create many Rooms.
     *     @example
     *     // Create many Rooms
     *     const room = await prisma.room.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends RoomCreateManyArgs>(
      args?: SelectSubset<T, RoomCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Room.
     * @param {RoomDeleteArgs} args - Arguments to delete one Room.
     * @example
     * // Delete one Room
     * const Room = await prisma.room.delete({
     *   where: {
     *     // ... filter to delete one Room
     *   }
     * })
     * 
    **/
    delete<T extends RoomDeleteArgs>(
      args: SelectSubset<T, RoomDeleteArgs>
    ): Prisma__RoomClient<RoomGetPayload<T>>

    /**
     * Update one Room.
     * @param {RoomUpdateArgs} args - Arguments to update one Room.
     * @example
     * // Update one Room
     * const room = await prisma.room.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends RoomUpdateArgs>(
      args: SelectSubset<T, RoomUpdateArgs>
    ): Prisma__RoomClient<RoomGetPayload<T>>

    /**
     * Delete zero or more Rooms.
     * @param {RoomDeleteManyArgs} args - Arguments to filter Rooms to delete.
     * @example
     * // Delete a few Rooms
     * const { count } = await prisma.room.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends RoomDeleteManyArgs>(
      args?: SelectSubset<T, RoomDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rooms
     * const room = await prisma.room.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends RoomUpdateManyArgs>(
      args: SelectSubset<T, RoomUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Room.
     * @param {RoomUpsertArgs} args - Arguments to update or create a Room.
     * @example
     * // Update or create a Room
     * const room = await prisma.room.upsert({
     *   create: {
     *     // ... data to create a Room
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Room we want to update
     *   }
     * })
    **/
    upsert<T extends RoomUpsertArgs>(
      args: SelectSubset<T, RoomUpsertArgs>
    ): Prisma__RoomClient<RoomGetPayload<T>>

    /**
     * Count the number of Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomCountArgs} args - Arguments to filter Rooms to count.
     * @example
     * // Count the number of Rooms
     * const count = await prisma.room.count({
     *   where: {
     *     // ... the filter for the Rooms we want to count
     *   }
     * })
    **/
    count<T extends RoomCountArgs>(
      args?: Subset<T, RoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoomAggregateArgs>(args: Subset<T, RoomAggregateArgs>): Prisma.PrismaPromise<GetRoomAggregateType<T>>

    /**
     * Group by Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomGroupByArgs} args - Group by arguments.
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
      T extends RoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoomGroupByArgs['orderBy'] }
        : { orderBy?: RoomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, RoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Room.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__RoomClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    message<T extends Room$messageArgs= {}>(args?: Subset<T, Room$messageArgs>): Prisma.PrismaPromise<Array<MessageGetPayload<T>>| Null>;

    userRoom<T extends Room$userRoomArgs= {}>(args?: Subset<T, Room$userRoomArgs>): Prisma.PrismaPromise<Array<UserRoomGetPayload<T>>| Null>;

    user<T extends Room$userArgs= {}>(args?: Subset<T, Room$userArgs>): Prisma.PrismaPromise<Array<UserGetPayload<T>>| Null>;

    UserMessage<T extends Room$UserMessageArgs= {}>(args?: Subset<T, Room$UserMessageArgs>): Prisma.PrismaPromise<Array<UserMessageGetPayload<T>>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Room base type for findUnique actions
   */
  export type RoomFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
    /**
     * Filter, which Room to fetch.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room findUnique
   */
  export interface RoomFindUniqueArgs extends RoomFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Room findUniqueOrThrow
   */
  export type RoomFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
    /**
     * Filter, which Room to fetch.
     */
    where: RoomWhereUniqueInput
  }


  /**
   * Room base type for findFirst actions
   */
  export type RoomFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
    /**
     * Filter, which Room to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: Enumerable<RoomOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rooms.
     */
    distinct?: Enumerable<RoomScalarFieldEnum>
  }

  /**
   * Room findFirst
   */
  export interface RoomFindFirstArgs extends RoomFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Room findFirstOrThrow
   */
  export type RoomFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
    /**
     * Filter, which Room to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: Enumerable<RoomOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rooms.
     */
    distinct?: Enumerable<RoomScalarFieldEnum>
  }


  /**
   * Room findMany
   */
  export type RoomFindManyArgs = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
    /**
     * Filter, which Rooms to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: Enumerable<RoomOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    distinct?: Enumerable<RoomScalarFieldEnum>
  }


  /**
   * Room create
   */
  export type RoomCreateArgs = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
    /**
     * The data needed to create a Room.
     */
    data: XOR<RoomCreateInput, RoomUncheckedCreateInput>
  }


  /**
   * Room createMany
   */
  export type RoomCreateManyArgs = {
    /**
     * The data used to create many Rooms.
     */
    data: Enumerable<RoomCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Room update
   */
  export type RoomUpdateArgs = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
    /**
     * The data needed to update a Room.
     */
    data: XOR<RoomUpdateInput, RoomUncheckedUpdateInput>
    /**
     * Choose, which Room to update.
     */
    where: RoomWhereUniqueInput
  }


  /**
   * Room updateMany
   */
  export type RoomUpdateManyArgs = {
    /**
     * The data used to update Rooms.
     */
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyInput>
    /**
     * Filter which Rooms to update
     */
    where?: RoomWhereInput
  }


  /**
   * Room upsert
   */
  export type RoomUpsertArgs = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
    /**
     * The filter to search for the Room to update in case it exists.
     */
    where: RoomWhereUniqueInput
    /**
     * In case the Room found by the `where` argument doesn't exist, create a new Room with this data.
     */
    create: XOR<RoomCreateInput, RoomUncheckedCreateInput>
    /**
     * In case the Room was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoomUpdateInput, RoomUncheckedUpdateInput>
  }


  /**
   * Room delete
   */
  export type RoomDeleteArgs = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
    /**
     * Filter which Room to delete.
     */
    where: RoomWhereUniqueInput
  }


  /**
   * Room deleteMany
   */
  export type RoomDeleteManyArgs = {
    /**
     * Filter which Rooms to delete
     */
    where?: RoomWhereInput
  }


  /**
   * Room.message
   */
  export type Room$messageArgs = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    where?: MessageWhereInput
    orderBy?: Enumerable<MessageOrderByWithRelationInput>
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<MessageScalarFieldEnum>
  }


  /**
   * Room.userRoom
   */
  export type Room$userRoomArgs = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    where?: UserRoomWhereInput
    orderBy?: Enumerable<UserRoomOrderByWithRelationInput>
    cursor?: UserRoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<UserRoomScalarFieldEnum>
  }


  /**
   * Room.user
   */
  export type Room$userArgs = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude | null
    where?: UserWhereInput
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * Room.UserMessage
   */
  export type Room$UserMessageArgs = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    where?: UserMessageWhereInput
    orderBy?: Enumerable<UserMessageOrderByWithRelationInput>
    cursor?: UserMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<UserMessageScalarFieldEnum>
  }


  /**
   * Room without action
   */
  export type RoomArgs = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: RoomInclude | null
  }



  /**
   * Model UserRoom
   */


  export type AggregateUserRoom = {
    _count: UserRoomCountAggregateOutputType | null
    _min: UserRoomMinAggregateOutputType | null
    _max: UserRoomMaxAggregateOutputType | null
  }

  export type UserRoomMinAggregateOutputType = {
    username: string | null
    roomId: string | null
    joinedAt: Date | null
    isAdmin: boolean | null
    isBlocked: boolean | null
    lastReadMessage: string | null
    isHidden: boolean | null
    isNotificationMuted: boolean | null
    isMarkedFavourite: boolean | null
    isPinned: boolean | null
  }

  export type UserRoomMaxAggregateOutputType = {
    username: string | null
    roomId: string | null
    joinedAt: Date | null
    isAdmin: boolean | null
    isBlocked: boolean | null
    lastReadMessage: string | null
    isHidden: boolean | null
    isNotificationMuted: boolean | null
    isMarkedFavourite: boolean | null
    isPinned: boolean | null
  }

  export type UserRoomCountAggregateOutputType = {
    username: number
    roomId: number
    joinedAt: number
    isAdmin: number
    isBlocked: number
    lastReadMessage: number
    isHidden: number
    isNotificationMuted: number
    isMarkedFavourite: number
    isPinned: number
    _all: number
  }


  export type UserRoomMinAggregateInputType = {
    username?: true
    roomId?: true
    joinedAt?: true
    isAdmin?: true
    isBlocked?: true
    lastReadMessage?: true
    isHidden?: true
    isNotificationMuted?: true
    isMarkedFavourite?: true
    isPinned?: true
  }

  export type UserRoomMaxAggregateInputType = {
    username?: true
    roomId?: true
    joinedAt?: true
    isAdmin?: true
    isBlocked?: true
    lastReadMessage?: true
    isHidden?: true
    isNotificationMuted?: true
    isMarkedFavourite?: true
    isPinned?: true
  }

  export type UserRoomCountAggregateInputType = {
    username?: true
    roomId?: true
    joinedAt?: true
    isAdmin?: true
    isBlocked?: true
    lastReadMessage?: true
    isHidden?: true
    isNotificationMuted?: true
    isMarkedFavourite?: true
    isPinned?: true
    _all?: true
  }

  export type UserRoomAggregateArgs = {
    /**
     * Filter which UserRoom to aggregate.
     */
    where?: UserRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRooms to fetch.
     */
    orderBy?: Enumerable<UserRoomOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserRooms
    **/
    _count?: true | UserRoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserRoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserRoomMaxAggregateInputType
  }

  export type GetUserRoomAggregateType<T extends UserRoomAggregateArgs> = {
        [P in keyof T & keyof AggregateUserRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserRoom[P]>
      : GetScalarType<T[P], AggregateUserRoom[P]>
  }




  export type UserRoomGroupByArgs = {
    where?: UserRoomWhereInput
    orderBy?: Enumerable<UserRoomOrderByWithAggregationInput>
    by: UserRoomScalarFieldEnum[]
    having?: UserRoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserRoomCountAggregateInputType | true
    _min?: UserRoomMinAggregateInputType
    _max?: UserRoomMaxAggregateInputType
  }


  export type UserRoomGroupByOutputType = {
    username: string
    roomId: string
    joinedAt: Date
    isAdmin: boolean
    isBlocked: boolean
    lastReadMessage: string | null
    isHidden: boolean
    isNotificationMuted: boolean
    isMarkedFavourite: boolean
    isPinned: boolean
    _count: UserRoomCountAggregateOutputType | null
    _min: UserRoomMinAggregateOutputType | null
    _max: UserRoomMaxAggregateOutputType | null
  }

  type GetUserRoomGroupByPayload<T extends UserRoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<UserRoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserRoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserRoomGroupByOutputType[P]>
            : GetScalarType<T[P], UserRoomGroupByOutputType[P]>
        }
      >
    >


  export type UserRoomSelect = {
    username?: boolean
    roomId?: boolean
    joinedAt?: boolean
    isAdmin?: boolean
    isBlocked?: boolean
    lastReadMessage?: boolean
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
    user?: boolean | UserArgs
    room?: boolean | RoomArgs
  }


  export type UserRoomInclude = {
    user?: boolean | UserArgs
    room?: boolean | RoomArgs
  }

  export type UserRoomGetPayload<S extends boolean | null | undefined | UserRoomArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? UserRoom :
    S extends undefined ? never :
    S extends { include: any } & (UserRoomArgs | UserRoomFindManyArgs)
    ? UserRoom  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'user' ? UserGetPayload<S['include'][P]> :
        P extends 'room' ? RoomGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (UserRoomArgs | UserRoomFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'user' ? UserGetPayload<S['select'][P]> :
        P extends 'room' ? RoomGetPayload<S['select'][P]> :  P extends keyof UserRoom ? UserRoom[P] : never
  } 
      : UserRoom


  type UserRoomCountArgs = 
    Omit<UserRoomFindManyArgs, 'select' | 'include'> & {
      select?: UserRoomCountAggregateInputType | true
    }

  export interface UserRoomDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one UserRoom that matches the filter.
     * @param {UserRoomFindUniqueArgs} args - Arguments to find a UserRoom
     * @example
     * // Get one UserRoom
     * const userRoom = await prisma.userRoom.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserRoomFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserRoomFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UserRoom'> extends True ? Prisma__UserRoomClient<UserRoomGetPayload<T>> : Prisma__UserRoomClient<UserRoomGetPayload<T> | null, null>

    /**
     * Find one UserRoom that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserRoomFindUniqueOrThrowArgs} args - Arguments to find a UserRoom
     * @example
     * // Get one UserRoom
     * const userRoom = await prisma.userRoom.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserRoomFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UserRoomFindUniqueOrThrowArgs>
    ): Prisma__UserRoomClient<UserRoomGetPayload<T>>

    /**
     * Find the first UserRoom that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoomFindFirstArgs} args - Arguments to find a UserRoom
     * @example
     * // Get one UserRoom
     * const userRoom = await prisma.userRoom.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserRoomFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserRoomFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UserRoom'> extends True ? Prisma__UserRoomClient<UserRoomGetPayload<T>> : Prisma__UserRoomClient<UserRoomGetPayload<T> | null, null>

    /**
     * Find the first UserRoom that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoomFindFirstOrThrowArgs} args - Arguments to find a UserRoom
     * @example
     * // Get one UserRoom
     * const userRoom = await prisma.userRoom.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserRoomFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserRoomFindFirstOrThrowArgs>
    ): Prisma__UserRoomClient<UserRoomGetPayload<T>>

    /**
     * Find zero or more UserRooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoomFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserRooms
     * const userRooms = await prisma.userRoom.findMany()
     * 
     * // Get first 10 UserRooms
     * const userRooms = await prisma.userRoom.findMany({ take: 10 })
     * 
     * // Only select the `username`
     * const userRoomWithUsernameOnly = await prisma.userRoom.findMany({ select: { username: true } })
     * 
    **/
    findMany<T extends UserRoomFindManyArgs>(
      args?: SelectSubset<T, UserRoomFindManyArgs>
    ): Prisma.PrismaPromise<Array<UserRoomGetPayload<T>>>

    /**
     * Create a UserRoom.
     * @param {UserRoomCreateArgs} args - Arguments to create a UserRoom.
     * @example
     * // Create one UserRoom
     * const UserRoom = await prisma.userRoom.create({
     *   data: {
     *     // ... data to create a UserRoom
     *   }
     * })
     * 
    **/
    create<T extends UserRoomCreateArgs>(
      args: SelectSubset<T, UserRoomCreateArgs>
    ): Prisma__UserRoomClient<UserRoomGetPayload<T>>

    /**
     * Create many UserRooms.
     *     @param {UserRoomCreateManyArgs} args - Arguments to create many UserRooms.
     *     @example
     *     // Create many UserRooms
     *     const userRoom = await prisma.userRoom.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserRoomCreateManyArgs>(
      args?: SelectSubset<T, UserRoomCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserRoom.
     * @param {UserRoomDeleteArgs} args - Arguments to delete one UserRoom.
     * @example
     * // Delete one UserRoom
     * const UserRoom = await prisma.userRoom.delete({
     *   where: {
     *     // ... filter to delete one UserRoom
     *   }
     * })
     * 
    **/
    delete<T extends UserRoomDeleteArgs>(
      args: SelectSubset<T, UserRoomDeleteArgs>
    ): Prisma__UserRoomClient<UserRoomGetPayload<T>>

    /**
     * Update one UserRoom.
     * @param {UserRoomUpdateArgs} args - Arguments to update one UserRoom.
     * @example
     * // Update one UserRoom
     * const userRoom = await prisma.userRoom.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserRoomUpdateArgs>(
      args: SelectSubset<T, UserRoomUpdateArgs>
    ): Prisma__UserRoomClient<UserRoomGetPayload<T>>

    /**
     * Delete zero or more UserRooms.
     * @param {UserRoomDeleteManyArgs} args - Arguments to filter UserRooms to delete.
     * @example
     * // Delete a few UserRooms
     * const { count } = await prisma.userRoom.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserRoomDeleteManyArgs>(
      args?: SelectSubset<T, UserRoomDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserRooms
     * const userRoom = await prisma.userRoom.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserRoomUpdateManyArgs>(
      args: SelectSubset<T, UserRoomUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserRoom.
     * @param {UserRoomUpsertArgs} args - Arguments to update or create a UserRoom.
     * @example
     * // Update or create a UserRoom
     * const userRoom = await prisma.userRoom.upsert({
     *   create: {
     *     // ... data to create a UserRoom
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserRoom we want to update
     *   }
     * })
    **/
    upsert<T extends UserRoomUpsertArgs>(
      args: SelectSubset<T, UserRoomUpsertArgs>
    ): Prisma__UserRoomClient<UserRoomGetPayload<T>>

    /**
     * Count the number of UserRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoomCountArgs} args - Arguments to filter UserRooms to count.
     * @example
     * // Count the number of UserRooms
     * const count = await prisma.userRoom.count({
     *   where: {
     *     // ... the filter for the UserRooms we want to count
     *   }
     * })
    **/
    count<T extends UserRoomCountArgs>(
      args?: Subset<T, UserRoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserRoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserRoomAggregateArgs>(args: Subset<T, UserRoomAggregateArgs>): Prisma.PrismaPromise<GetUserRoomAggregateType<T>>

    /**
     * Group by UserRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRoomGroupByArgs} args - Group by arguments.
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
      T extends UserRoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserRoomGroupByArgs['orderBy'] }
        : { orderBy?: UserRoomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, UserRoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for UserRoom.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserRoomClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    user<T extends UserArgs= {}>(args?: Subset<T, UserArgs>): Prisma__UserClient<UserGetPayload<T> | Null>;

    room<T extends RoomArgs= {}>(args?: Subset<T, RoomArgs>): Prisma__RoomClient<RoomGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * UserRoom base type for findUnique actions
   */
  export type UserRoomFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    /**
     * Filter, which UserRoom to fetch.
     */
    where: UserRoomWhereUniqueInput
  }

  /**
   * UserRoom findUnique
   */
  export interface UserRoomFindUniqueArgs extends UserRoomFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UserRoom findUniqueOrThrow
   */
  export type UserRoomFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    /**
     * Filter, which UserRoom to fetch.
     */
    where: UserRoomWhereUniqueInput
  }


  /**
   * UserRoom base type for findFirst actions
   */
  export type UserRoomFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    /**
     * Filter, which UserRoom to fetch.
     */
    where?: UserRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRooms to fetch.
     */
    orderBy?: Enumerable<UserRoomOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserRooms.
     */
    cursor?: UserRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserRooms.
     */
    distinct?: Enumerable<UserRoomScalarFieldEnum>
  }

  /**
   * UserRoom findFirst
   */
  export interface UserRoomFindFirstArgs extends UserRoomFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UserRoom findFirstOrThrow
   */
  export type UserRoomFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    /**
     * Filter, which UserRoom to fetch.
     */
    where?: UserRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRooms to fetch.
     */
    orderBy?: Enumerable<UserRoomOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserRooms.
     */
    cursor?: UserRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserRooms.
     */
    distinct?: Enumerable<UserRoomScalarFieldEnum>
  }


  /**
   * UserRoom findMany
   */
  export type UserRoomFindManyArgs = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    /**
     * Filter, which UserRooms to fetch.
     */
    where?: UserRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserRooms to fetch.
     */
    orderBy?: Enumerable<UserRoomOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserRooms.
     */
    cursor?: UserRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserRooms.
     */
    skip?: number
    distinct?: Enumerable<UserRoomScalarFieldEnum>
  }


  /**
   * UserRoom create
   */
  export type UserRoomCreateArgs = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    /**
     * The data needed to create a UserRoom.
     */
    data: XOR<UserRoomCreateInput, UserRoomUncheckedCreateInput>
  }


  /**
   * UserRoom createMany
   */
  export type UserRoomCreateManyArgs = {
    /**
     * The data used to create many UserRooms.
     */
    data: Enumerable<UserRoomCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * UserRoom update
   */
  export type UserRoomUpdateArgs = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    /**
     * The data needed to update a UserRoom.
     */
    data: XOR<UserRoomUpdateInput, UserRoomUncheckedUpdateInput>
    /**
     * Choose, which UserRoom to update.
     */
    where: UserRoomWhereUniqueInput
  }


  /**
   * UserRoom updateMany
   */
  export type UserRoomUpdateManyArgs = {
    /**
     * The data used to update UserRooms.
     */
    data: XOR<UserRoomUpdateManyMutationInput, UserRoomUncheckedUpdateManyInput>
    /**
     * Filter which UserRooms to update
     */
    where?: UserRoomWhereInput
  }


  /**
   * UserRoom upsert
   */
  export type UserRoomUpsertArgs = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    /**
     * The filter to search for the UserRoom to update in case it exists.
     */
    where: UserRoomWhereUniqueInput
    /**
     * In case the UserRoom found by the `where` argument doesn't exist, create a new UserRoom with this data.
     */
    create: XOR<UserRoomCreateInput, UserRoomUncheckedCreateInput>
    /**
     * In case the UserRoom was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserRoomUpdateInput, UserRoomUncheckedUpdateInput>
  }


  /**
   * UserRoom delete
   */
  export type UserRoomDeleteArgs = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
    /**
     * Filter which UserRoom to delete.
     */
    where: UserRoomWhereUniqueInput
  }


  /**
   * UserRoom deleteMany
   */
  export type UserRoomDeleteManyArgs = {
    /**
     * Filter which UserRooms to delete
     */
    where?: UserRoomWhereInput
  }


  /**
   * UserRoom without action
   */
  export type UserRoomArgs = {
    /**
     * Select specific fields to fetch from the UserRoom
     */
    select?: UserRoomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserRoomInclude | null
  }



  /**
   * Model Message
   */


  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    key: string | null
    senderUsername: string | null
    roomId: string | null
    content: string | null
    createdAt: Date | null
    editedAt: Date | null
    contentType: MessageContentType | null
  }

  export type MessageMaxAggregateOutputType = {
    key: string | null
    senderUsername: string | null
    roomId: string | null
    content: string | null
    createdAt: Date | null
    editedAt: Date | null
    contentType: MessageContentType | null
  }

  export type MessageCountAggregateOutputType = {
    key: number
    senderUsername: number
    roomId: number
    content: number
    createdAt: number
    editedAt: number
    contentType: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    key?: true
    senderUsername?: true
    roomId?: true
    content?: true
    createdAt?: true
    editedAt?: true
    contentType?: true
  }

  export type MessageMaxAggregateInputType = {
    key?: true
    senderUsername?: true
    roomId?: true
    content?: true
    createdAt?: true
    editedAt?: true
    contentType?: true
  }

  export type MessageCountAggregateInputType = {
    key?: true
    senderUsername?: true
    roomId?: true
    content?: true
    createdAt?: true
    editedAt?: true
    contentType?: true
    _all?: true
  }

  export type MessageAggregateArgs = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: Enumerable<MessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs = {
    where?: MessageWhereInput
    orderBy?: Enumerable<MessageOrderByWithAggregationInput>
    by: MessageScalarFieldEnum[]
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }


  export type MessageGroupByOutputType = {
    key: string
    senderUsername: string
    roomId: string
    content: string
    createdAt: Date
    editedAt: Date | null
    contentType: MessageContentType
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect = {
    key?: boolean
    senderUsername?: boolean
    roomId?: boolean
    content?: boolean
    createdAt?: boolean
    editedAt?: boolean
    contentType?: boolean
    sender?: boolean | UserArgs
    room?: boolean | RoomArgs
  }


  export type MessageInclude = {
    sender?: boolean | UserArgs
    room?: boolean | RoomArgs
  }

  export type MessageGetPayload<S extends boolean | null | undefined | MessageArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Message :
    S extends undefined ? never :
    S extends { include: any } & (MessageArgs | MessageFindManyArgs)
    ? Message  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'sender' ? UserGetPayload<S['include'][P]> :
        P extends 'room' ? RoomGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (MessageArgs | MessageFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'sender' ? UserGetPayload<S['select'][P]> :
        P extends 'room' ? RoomGetPayload<S['select'][P]> :  P extends keyof Message ? Message[P] : never
  } 
      : Message


  type MessageCountArgs = 
    Omit<MessageFindManyArgs, 'select' | 'include'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends MessageFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, MessageFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Message'> extends True ? Prisma__MessageClient<MessageGetPayload<T>> : Prisma__MessageClient<MessageGetPayload<T> | null, null>

    /**
     * Find one Message that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, MessageFindUniqueOrThrowArgs>
    ): Prisma__MessageClient<MessageGetPayload<T>>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends MessageFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, MessageFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Message'> extends True ? Prisma__MessageClient<MessageGetPayload<T>> : Prisma__MessageClient<MessageGetPayload<T> | null, null>

    /**
     * Find the first Message that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(
      args?: SelectSubset<T, MessageFindFirstOrThrowArgs>
    ): Prisma__MessageClient<MessageGetPayload<T>>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `key`
     * const messageWithKeyOnly = await prisma.message.findMany({ select: { key: true } })
     * 
    **/
    findMany<T extends MessageFindManyArgs>(
      args?: SelectSubset<T, MessageFindManyArgs>
    ): Prisma.PrismaPromise<Array<MessageGetPayload<T>>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
    **/
    create<T extends MessageCreateArgs>(
      args: SelectSubset<T, MessageCreateArgs>
    ): Prisma__MessageClient<MessageGetPayload<T>>

    /**
     * Create many Messages.
     *     @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     *     @example
     *     // Create many Messages
     *     const message = await prisma.message.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends MessageCreateManyArgs>(
      args?: SelectSubset<T, MessageCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
    **/
    delete<T extends MessageDeleteArgs>(
      args: SelectSubset<T, MessageDeleteArgs>
    ): Prisma__MessageClient<MessageGetPayload<T>>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends MessageUpdateArgs>(
      args: SelectSubset<T, MessageUpdateArgs>
    ): Prisma__MessageClient<MessageGetPayload<T>>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends MessageDeleteManyArgs>(
      args?: SelectSubset<T, MessageDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends MessageUpdateManyArgs>(
      args: SelectSubset<T, MessageUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
    **/
    upsert<T extends MessageUpsertArgs>(
      args: SelectSubset<T, MessageUpsertArgs>
    ): Prisma__MessageClient<MessageGetPayload<T>>

    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
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
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__MessageClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    sender<T extends UserArgs= {}>(args?: Subset<T, UserArgs>): Prisma__UserClient<UserGetPayload<T> | Null>;

    room<T extends RoomArgs= {}>(args?: Subset<T, RoomArgs>): Prisma__RoomClient<RoomGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Message base type for findUnique actions
   */
  export type MessageFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUnique
   */
  export interface MessageFindUniqueArgs extends MessageFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }


  /**
   * Message base type for findFirst actions
   */
  export type MessageFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: Enumerable<MessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: Enumerable<MessageScalarFieldEnum>
  }

  /**
   * Message findFirst
   */
  export interface MessageFindFirstArgs extends MessageFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: Enumerable<MessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: Enumerable<MessageScalarFieldEnum>
  }


  /**
   * Message findMany
   */
  export type MessageFindManyArgs = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: Enumerable<MessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: Enumerable<MessageScalarFieldEnum>
  }


  /**
   * Message create
   */
  export type MessageCreateArgs = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }


  /**
   * Message createMany
   */
  export type MessageCreateManyArgs = {
    /**
     * The data used to create many Messages.
     */
    data: Enumerable<MessageCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Message update
   */
  export type MessageUpdateArgs = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }


  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
  }


  /**
   * Message upsert
   */
  export type MessageUpsertArgs = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }


  /**
   * Message delete
   */
  export type MessageDeleteArgs = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }


  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
  }


  /**
   * Message without action
   */
  export type MessageArgs = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MessageInclude | null
  }



  /**
   * Model UserMessage
   */


  export type AggregateUserMessage = {
    _count: UserMessageCountAggregateOutputType | null
    _min: UserMessageMinAggregateOutputType | null
    _max: UserMessageMaxAggregateOutputType | null
  }

  export type UserMessageMinAggregateOutputType = {
    username: string | null
    roomId: string | null
    isHidden: boolean | null
    isNotificationMuted: boolean | null
    isMarkedFavourite: boolean | null
    isPinned: boolean | null
  }

  export type UserMessageMaxAggregateOutputType = {
    username: string | null
    roomId: string | null
    isHidden: boolean | null
    isNotificationMuted: boolean | null
    isMarkedFavourite: boolean | null
    isPinned: boolean | null
  }

  export type UserMessageCountAggregateOutputType = {
    username: number
    roomId: number
    isHidden: number
    isNotificationMuted: number
    isMarkedFavourite: number
    isPinned: number
    _all: number
  }


  export type UserMessageMinAggregateInputType = {
    username?: true
    roomId?: true
    isHidden?: true
    isNotificationMuted?: true
    isMarkedFavourite?: true
    isPinned?: true
  }

  export type UserMessageMaxAggregateInputType = {
    username?: true
    roomId?: true
    isHidden?: true
    isNotificationMuted?: true
    isMarkedFavourite?: true
    isPinned?: true
  }

  export type UserMessageCountAggregateInputType = {
    username?: true
    roomId?: true
    isHidden?: true
    isNotificationMuted?: true
    isMarkedFavourite?: true
    isPinned?: true
    _all?: true
  }

  export type UserMessageAggregateArgs = {
    /**
     * Filter which UserMessage to aggregate.
     */
    where?: UserMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMessages to fetch.
     */
    orderBy?: Enumerable<UserMessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserMessages
    **/
    _count?: true | UserMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMessageMaxAggregateInputType
  }

  export type GetUserMessageAggregateType<T extends UserMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateUserMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserMessage[P]>
      : GetScalarType<T[P], AggregateUserMessage[P]>
  }




  export type UserMessageGroupByArgs = {
    where?: UserMessageWhereInput
    orderBy?: Enumerable<UserMessageOrderByWithAggregationInput>
    by: UserMessageScalarFieldEnum[]
    having?: UserMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserMessageCountAggregateInputType | true
    _min?: UserMessageMinAggregateInputType
    _max?: UserMessageMaxAggregateInputType
  }


  export type UserMessageGroupByOutputType = {
    username: string
    roomId: string
    isHidden: boolean
    isNotificationMuted: boolean
    isMarkedFavourite: boolean
    isPinned: boolean
    _count: UserMessageCountAggregateOutputType | null
    _min: UserMessageMinAggregateOutputType | null
    _max: UserMessageMaxAggregateOutputType | null
  }

  type GetUserMessageGroupByPayload<T extends UserMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<UserMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserMessageGroupByOutputType[P]>
            : GetScalarType<T[P], UserMessageGroupByOutputType[P]>
        }
      >
    >


  export type UserMessageSelect = {
    username?: boolean
    roomId?: boolean
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
    user?: boolean | UserArgs
    room?: boolean | RoomArgs
  }


  export type UserMessageInclude = {
    user?: boolean | UserArgs
    room?: boolean | RoomArgs
  }

  export type UserMessageGetPayload<S extends boolean | null | undefined | UserMessageArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? UserMessage :
    S extends undefined ? never :
    S extends { include: any } & (UserMessageArgs | UserMessageFindManyArgs)
    ? UserMessage  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'user' ? UserGetPayload<S['include'][P]> :
        P extends 'room' ? RoomGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (UserMessageArgs | UserMessageFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'user' ? UserGetPayload<S['select'][P]> :
        P extends 'room' ? RoomGetPayload<S['select'][P]> :  P extends keyof UserMessage ? UserMessage[P] : never
  } 
      : UserMessage


  type UserMessageCountArgs = 
    Omit<UserMessageFindManyArgs, 'select' | 'include'> & {
      select?: UserMessageCountAggregateInputType | true
    }

  export interface UserMessageDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one UserMessage that matches the filter.
     * @param {UserMessageFindUniqueArgs} args - Arguments to find a UserMessage
     * @example
     * // Get one UserMessage
     * const userMessage = await prisma.userMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserMessageFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserMessageFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UserMessage'> extends True ? Prisma__UserMessageClient<UserMessageGetPayload<T>> : Prisma__UserMessageClient<UserMessageGetPayload<T> | null, null>

    /**
     * Find one UserMessage that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserMessageFindUniqueOrThrowArgs} args - Arguments to find a UserMessage
     * @example
     * // Get one UserMessage
     * const userMessage = await prisma.userMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserMessageFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UserMessageFindUniqueOrThrowArgs>
    ): Prisma__UserMessageClient<UserMessageGetPayload<T>>

    /**
     * Find the first UserMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMessageFindFirstArgs} args - Arguments to find a UserMessage
     * @example
     * // Get one UserMessage
     * const userMessage = await prisma.userMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserMessageFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserMessageFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UserMessage'> extends True ? Prisma__UserMessageClient<UserMessageGetPayload<T>> : Prisma__UserMessageClient<UserMessageGetPayload<T> | null, null>

    /**
     * Find the first UserMessage that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMessageFindFirstOrThrowArgs} args - Arguments to find a UserMessage
     * @example
     * // Get one UserMessage
     * const userMessage = await prisma.userMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserMessageFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserMessageFindFirstOrThrowArgs>
    ): Prisma__UserMessageClient<UserMessageGetPayload<T>>

    /**
     * Find zero or more UserMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMessageFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserMessages
     * const userMessages = await prisma.userMessage.findMany()
     * 
     * // Get first 10 UserMessages
     * const userMessages = await prisma.userMessage.findMany({ take: 10 })
     * 
     * // Only select the `username`
     * const userMessageWithUsernameOnly = await prisma.userMessage.findMany({ select: { username: true } })
     * 
    **/
    findMany<T extends UserMessageFindManyArgs>(
      args?: SelectSubset<T, UserMessageFindManyArgs>
    ): Prisma.PrismaPromise<Array<UserMessageGetPayload<T>>>

    /**
     * Create a UserMessage.
     * @param {UserMessageCreateArgs} args - Arguments to create a UserMessage.
     * @example
     * // Create one UserMessage
     * const UserMessage = await prisma.userMessage.create({
     *   data: {
     *     // ... data to create a UserMessage
     *   }
     * })
     * 
    **/
    create<T extends UserMessageCreateArgs>(
      args: SelectSubset<T, UserMessageCreateArgs>
    ): Prisma__UserMessageClient<UserMessageGetPayload<T>>

    /**
     * Create many UserMessages.
     *     @param {UserMessageCreateManyArgs} args - Arguments to create many UserMessages.
     *     @example
     *     // Create many UserMessages
     *     const userMessage = await prisma.userMessage.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserMessageCreateManyArgs>(
      args?: SelectSubset<T, UserMessageCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserMessage.
     * @param {UserMessageDeleteArgs} args - Arguments to delete one UserMessage.
     * @example
     * // Delete one UserMessage
     * const UserMessage = await prisma.userMessage.delete({
     *   where: {
     *     // ... filter to delete one UserMessage
     *   }
     * })
     * 
    **/
    delete<T extends UserMessageDeleteArgs>(
      args: SelectSubset<T, UserMessageDeleteArgs>
    ): Prisma__UserMessageClient<UserMessageGetPayload<T>>

    /**
     * Update one UserMessage.
     * @param {UserMessageUpdateArgs} args - Arguments to update one UserMessage.
     * @example
     * // Update one UserMessage
     * const userMessage = await prisma.userMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserMessageUpdateArgs>(
      args: SelectSubset<T, UserMessageUpdateArgs>
    ): Prisma__UserMessageClient<UserMessageGetPayload<T>>

    /**
     * Delete zero or more UserMessages.
     * @param {UserMessageDeleteManyArgs} args - Arguments to filter UserMessages to delete.
     * @example
     * // Delete a few UserMessages
     * const { count } = await prisma.userMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserMessageDeleteManyArgs>(
      args?: SelectSubset<T, UserMessageDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserMessages
     * const userMessage = await prisma.userMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserMessageUpdateManyArgs>(
      args: SelectSubset<T, UserMessageUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserMessage.
     * @param {UserMessageUpsertArgs} args - Arguments to update or create a UserMessage.
     * @example
     * // Update or create a UserMessage
     * const userMessage = await prisma.userMessage.upsert({
     *   create: {
     *     // ... data to create a UserMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserMessage we want to update
     *   }
     * })
    **/
    upsert<T extends UserMessageUpsertArgs>(
      args: SelectSubset<T, UserMessageUpsertArgs>
    ): Prisma__UserMessageClient<UserMessageGetPayload<T>>

    /**
     * Count the number of UserMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMessageCountArgs} args - Arguments to filter UserMessages to count.
     * @example
     * // Count the number of UserMessages
     * const count = await prisma.userMessage.count({
     *   where: {
     *     // ... the filter for the UserMessages we want to count
     *   }
     * })
    **/
    count<T extends UserMessageCountArgs>(
      args?: Subset<T, UserMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserMessageAggregateArgs>(args: Subset<T, UserMessageAggregateArgs>): Prisma.PrismaPromise<GetUserMessageAggregateType<T>>

    /**
     * Group by UserMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMessageGroupByArgs} args - Group by arguments.
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
      T extends UserMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserMessageGroupByArgs['orderBy'] }
        : { orderBy?: UserMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, UserMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for UserMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserMessageClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    user<T extends UserArgs= {}>(args?: Subset<T, UserArgs>): Prisma__UserClient<UserGetPayload<T> | Null>;

    room<T extends RoomArgs= {}>(args?: Subset<T, RoomArgs>): Prisma__RoomClient<RoomGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * UserMessage base type for findUnique actions
   */
  export type UserMessageFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    /**
     * Filter, which UserMessage to fetch.
     */
    where: UserMessageWhereUniqueInput
  }

  /**
   * UserMessage findUnique
   */
  export interface UserMessageFindUniqueArgs extends UserMessageFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UserMessage findUniqueOrThrow
   */
  export type UserMessageFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    /**
     * Filter, which UserMessage to fetch.
     */
    where: UserMessageWhereUniqueInput
  }


  /**
   * UserMessage base type for findFirst actions
   */
  export type UserMessageFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    /**
     * Filter, which UserMessage to fetch.
     */
    where?: UserMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMessages to fetch.
     */
    orderBy?: Enumerable<UserMessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserMessages.
     */
    cursor?: UserMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserMessages.
     */
    distinct?: Enumerable<UserMessageScalarFieldEnum>
  }

  /**
   * UserMessage findFirst
   */
  export interface UserMessageFindFirstArgs extends UserMessageFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UserMessage findFirstOrThrow
   */
  export type UserMessageFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    /**
     * Filter, which UserMessage to fetch.
     */
    where?: UserMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMessages to fetch.
     */
    orderBy?: Enumerable<UserMessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserMessages.
     */
    cursor?: UserMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserMessages.
     */
    distinct?: Enumerable<UserMessageScalarFieldEnum>
  }


  /**
   * UserMessage findMany
   */
  export type UserMessageFindManyArgs = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    /**
     * Filter, which UserMessages to fetch.
     */
    where?: UserMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMessages to fetch.
     */
    orderBy?: Enumerable<UserMessageOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserMessages.
     */
    cursor?: UserMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMessages.
     */
    skip?: number
    distinct?: Enumerable<UserMessageScalarFieldEnum>
  }


  /**
   * UserMessage create
   */
  export type UserMessageCreateArgs = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    /**
     * The data needed to create a UserMessage.
     */
    data: XOR<UserMessageCreateInput, UserMessageUncheckedCreateInput>
  }


  /**
   * UserMessage createMany
   */
  export type UserMessageCreateManyArgs = {
    /**
     * The data used to create many UserMessages.
     */
    data: Enumerable<UserMessageCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * UserMessage update
   */
  export type UserMessageUpdateArgs = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    /**
     * The data needed to update a UserMessage.
     */
    data: XOR<UserMessageUpdateInput, UserMessageUncheckedUpdateInput>
    /**
     * Choose, which UserMessage to update.
     */
    where: UserMessageWhereUniqueInput
  }


  /**
   * UserMessage updateMany
   */
  export type UserMessageUpdateManyArgs = {
    /**
     * The data used to update UserMessages.
     */
    data: XOR<UserMessageUpdateManyMutationInput, UserMessageUncheckedUpdateManyInput>
    /**
     * Filter which UserMessages to update
     */
    where?: UserMessageWhereInput
  }


  /**
   * UserMessage upsert
   */
  export type UserMessageUpsertArgs = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    /**
     * The filter to search for the UserMessage to update in case it exists.
     */
    where: UserMessageWhereUniqueInput
    /**
     * In case the UserMessage found by the `where` argument doesn't exist, create a new UserMessage with this data.
     */
    create: XOR<UserMessageCreateInput, UserMessageUncheckedCreateInput>
    /**
     * In case the UserMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserMessageUpdateInput, UserMessageUncheckedUpdateInput>
  }


  /**
   * UserMessage delete
   */
  export type UserMessageDeleteArgs = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
    /**
     * Filter which UserMessage to delete.
     */
    where: UserMessageWhereUniqueInput
  }


  /**
   * UserMessage deleteMany
   */
  export type UserMessageDeleteManyArgs = {
    /**
     * Filter which UserMessages to delete
     */
    where?: UserMessageWhereInput
  }


  /**
   * UserMessage without action
   */
  export type UserMessageArgs = {
    /**
     * Select specific fields to fetch from the UserMessage
     */
    select?: UserMessageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserMessageInclude | null
  }



  /**
   * Model Session
   */


  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sid: string | null
    data: string | null
    expiresAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sid: string | null
    data: string | null
    expiresAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sid: number
    data: number
    expiresAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sid?: true
    data?: true
    expiresAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sid?: true
    data?: true
    expiresAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sid?: true
    data?: true
    expiresAt?: true
    _all?: true
  }

  export type SessionAggregateArgs = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: Enumerable<SessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs = {
    where?: SessionWhereInput
    orderBy?: Enumerable<SessionOrderByWithAggregationInput>
    by: SessionScalarFieldEnum[]
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }


  export type SessionGroupByOutputType = {
    id: string
    sid: string
    data: string
    expiresAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect = {
    id?: boolean
    sid?: boolean
    data?: boolean
    expiresAt?: boolean
  }


  export type SessionGetPayload<S extends boolean | null | undefined | SessionArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Session :
    S extends undefined ? never :
    S extends { include: any } & (SessionArgs | SessionFindManyArgs)
    ? Session 
    : S extends { select: any } & (SessionArgs | SessionFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof Session ? Session[P] : never
  } 
      : Session


  type SessionCountArgs = 
    Omit<SessionFindManyArgs, 'select' | 'include'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SessionFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, SessionFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Session'> extends True ? Prisma__SessionClient<SessionGetPayload<T>> : Prisma__SessionClient<SessionGetPayload<T> | null, null>

    /**
     * Find one Session that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, SessionFindUniqueOrThrowArgs>
    ): Prisma__SessionClient<SessionGetPayload<T>>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SessionFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, SessionFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Session'> extends True ? Prisma__SessionClient<SessionGetPayload<T>> : Prisma__SessionClient<SessionGetPayload<T> | null, null>

    /**
     * Find the first Session that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SessionFindFirstOrThrowArgs>
    ): Prisma__SessionClient<SessionGetPayload<T>>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SessionFindManyArgs>(
      args?: SelectSubset<T, SessionFindManyArgs>
    ): Prisma.PrismaPromise<Array<SessionGetPayload<T>>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
    **/
    create<T extends SessionCreateArgs>(
      args: SelectSubset<T, SessionCreateArgs>
    ): Prisma__SessionClient<SessionGetPayload<T>>

    /**
     * Create many Sessions.
     *     @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     *     @example
     *     // Create many Sessions
     *     const session = await prisma.session.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends SessionCreateManyArgs>(
      args?: SelectSubset<T, SessionCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
    **/
    delete<T extends SessionDeleteArgs>(
      args: SelectSubset<T, SessionDeleteArgs>
    ): Prisma__SessionClient<SessionGetPayload<T>>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SessionUpdateArgs>(
      args: SelectSubset<T, SessionUpdateArgs>
    ): Prisma__SessionClient<SessionGetPayload<T>>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SessionDeleteManyArgs>(
      args?: SelectSubset<T, SessionDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SessionUpdateManyArgs>(
      args: SelectSubset<T, SessionUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
    **/
    upsert<T extends SessionUpsertArgs>(
      args: SelectSubset<T, SessionUpsertArgs>
    ): Prisma__SessionClient<SessionGetPayload<T>>

    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
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
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__SessionClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Session base type for findUnique actions
   */
  export type SessionFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUnique
   */
  export interface SessionFindUniqueArgs extends SessionFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }


  /**
   * Session base type for findFirst actions
   */
  export type SessionFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: Enumerable<SessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: Enumerable<SessionScalarFieldEnum>
  }

  /**
   * Session findFirst
   */
  export interface SessionFindFirstArgs extends SessionFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: Enumerable<SessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: Enumerable<SessionScalarFieldEnum>
  }


  /**
   * Session findMany
   */
  export type SessionFindManyArgs = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: Enumerable<SessionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: Enumerable<SessionScalarFieldEnum>
  }


  /**
   * Session create
   */
  export type SessionCreateArgs = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }


  /**
   * Session createMany
   */
  export type SessionCreateManyArgs = {
    /**
     * The data used to create many Sessions.
     */
    data: Enumerable<SessionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Session update
   */
  export type SessionUpdateArgs = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }


  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
  }


  /**
   * Session upsert
   */
  export type SessionUpsertArgs = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }


  /**
   * Session delete
   */
  export type SessionDeleteArgs = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }


  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
  }


  /**
   * Session without action
   */
  export type SessionArgs = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const MessageScalarFieldEnum: {
    key: 'key',
    senderUsername: 'senderUsername',
    roomId: 'roomId',
    content: 'content',
    createdAt: 'createdAt',
    editedAt: 'editedAt',
    contentType: 'contentType'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const RoomScalarFieldEnum: {
    roomId: 'roomId',
    roomType: 'roomType',
    roomDisplayName: 'roomDisplayName',
    roomAvatar: 'roomAvatar'
  };

  export type RoomScalarFieldEnum = (typeof RoomScalarFieldEnum)[keyof typeof RoomScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sid: 'sid',
    data: 'data',
    expiresAt: 'expiresAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserMessageScalarFieldEnum: {
    username: 'username',
    roomId: 'roomId',
    isHidden: 'isHidden',
    isNotificationMuted: 'isNotificationMuted',
    isMarkedFavourite: 'isMarkedFavourite',
    isPinned: 'isPinned'
  };

  export type UserMessageScalarFieldEnum = (typeof UserMessageScalarFieldEnum)[keyof typeof UserMessageScalarFieldEnum]


  export const UserRoomScalarFieldEnum: {
    username: 'username',
    roomId: 'roomId',
    joinedAt: 'joinedAt',
    isAdmin: 'isAdmin',
    isBlocked: 'isBlocked',
    lastReadMessage: 'lastReadMessage',
    isHidden: 'isHidden',
    isNotificationMuted: 'isNotificationMuted',
    isMarkedFavourite: 'isMarkedFavourite',
    isPinned: 'isPinned'
  };

  export type UserRoomScalarFieldEnum = (typeof UserRoomScalarFieldEnum)[keyof typeof UserRoomScalarFieldEnum]


  export const UserScalarFieldEnum: {
    userId: 'userId',
    username: 'username',
    createTime: 'createTime',
    passwordHash: 'passwordHash',
    displayName: 'displayName',
    avatarPath: 'avatarPath',
    status: 'status'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: Enumerable<UserWhereInput>
    OR?: Enumerable<UserWhereInput>
    NOT?: Enumerable<UserWhereInput>
    userId?: StringFilter | string
    username?: StringFilter | string
    createTime?: DateTimeFilter | Date | string
    passwordHash?: StringFilter | string
    displayName?: StringFilter | string
    avatarPath?: StringNullableFilter | string | null
    status?: EnumUserStatusFilter | UserStatus
    message?: MessageListRelationFilter
    userRoom?: UserRoomListRelationFilter
    rooms?: RoomListRelationFilter
    UserMessage?: UserMessageListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    userId?: SortOrder
    username?: SortOrder
    createTime?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    avatarPath?: SortOrder
    status?: SortOrder
    message?: MessageOrderByRelationAggregateInput
    userRoom?: UserRoomOrderByRelationAggregateInput
    rooms?: RoomOrderByRelationAggregateInput
    UserMessage?: UserMessageOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = {
    userId?: string
    username?: string
  }

  export type UserOrderByWithAggregationInput = {
    userId?: SortOrder
    username?: SortOrder
    createTime?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    avatarPath?: SortOrder
    status?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserScalarWhereWithAggregatesInput>
    userId?: StringWithAggregatesFilter | string
    username?: StringWithAggregatesFilter | string
    createTime?: DateTimeWithAggregatesFilter | Date | string
    passwordHash?: StringWithAggregatesFilter | string
    displayName?: StringWithAggregatesFilter | string
    avatarPath?: StringNullableWithAggregatesFilter | string | null
    status?: EnumUserStatusWithAggregatesFilter | UserStatus
  }

  export type RoomWhereInput = {
    AND?: Enumerable<RoomWhereInput>
    OR?: Enumerable<RoomWhereInput>
    NOT?: Enumerable<RoomWhereInput>
    roomId?: StringFilter | string
    roomType?: EnumRoomTypeFilter | RoomType
    roomDisplayName?: StringNullableFilter | string | null
    roomAvatar?: StringNullableFilter | string | null
    message?: MessageListRelationFilter
    userRoom?: UserRoomListRelationFilter
    user?: UserListRelationFilter
    UserMessage?: UserMessageListRelationFilter
  }

  export type RoomOrderByWithRelationInput = {
    roomId?: SortOrder
    roomType?: SortOrder
    roomDisplayName?: SortOrder
    roomAvatar?: SortOrder
    message?: MessageOrderByRelationAggregateInput
    userRoom?: UserRoomOrderByRelationAggregateInput
    user?: UserOrderByRelationAggregateInput
    UserMessage?: UserMessageOrderByRelationAggregateInput
  }

  export type RoomWhereUniqueInput = {
    roomId?: string
  }

  export type RoomOrderByWithAggregationInput = {
    roomId?: SortOrder
    roomType?: SortOrder
    roomDisplayName?: SortOrder
    roomAvatar?: SortOrder
    _count?: RoomCountOrderByAggregateInput
    _max?: RoomMaxOrderByAggregateInput
    _min?: RoomMinOrderByAggregateInput
  }

  export type RoomScalarWhereWithAggregatesInput = {
    AND?: Enumerable<RoomScalarWhereWithAggregatesInput>
    OR?: Enumerable<RoomScalarWhereWithAggregatesInput>
    NOT?: Enumerable<RoomScalarWhereWithAggregatesInput>
    roomId?: StringWithAggregatesFilter | string
    roomType?: EnumRoomTypeWithAggregatesFilter | RoomType
    roomDisplayName?: StringNullableWithAggregatesFilter | string | null
    roomAvatar?: StringNullableWithAggregatesFilter | string | null
  }

  export type UserRoomWhereInput = {
    AND?: Enumerable<UserRoomWhereInput>
    OR?: Enumerable<UserRoomWhereInput>
    NOT?: Enumerable<UserRoomWhereInput>
    username?: StringFilter | string
    roomId?: StringFilter | string
    joinedAt?: DateTimeFilter | Date | string
    isAdmin?: BoolFilter | boolean
    isBlocked?: BoolFilter | boolean
    lastReadMessage?: StringNullableFilter | string | null
    isHidden?: BoolFilter | boolean
    isNotificationMuted?: BoolFilter | boolean
    isMarkedFavourite?: BoolFilter | boolean
    isPinned?: BoolFilter | boolean
    user?: XOR<UserRelationFilter, UserWhereInput>
    room?: XOR<RoomRelationFilter, RoomWhereInput>
  }

  export type UserRoomOrderByWithRelationInput = {
    username?: SortOrder
    roomId?: SortOrder
    joinedAt?: SortOrder
    isAdmin?: SortOrder
    isBlocked?: SortOrder
    lastReadMessage?: SortOrder
    isHidden?: SortOrder
    isNotificationMuted?: SortOrder
    isMarkedFavourite?: SortOrder
    isPinned?: SortOrder
    user?: UserOrderByWithRelationInput
    room?: RoomOrderByWithRelationInput
  }

  export type UserRoomWhereUniqueInput = {
    username_roomId?: UserRoomUsernameRoomIdCompoundUniqueInput
  }

  export type UserRoomOrderByWithAggregationInput = {
    username?: SortOrder
    roomId?: SortOrder
    joinedAt?: SortOrder
    isAdmin?: SortOrder
    isBlocked?: SortOrder
    lastReadMessage?: SortOrder
    isHidden?: SortOrder
    isNotificationMuted?: SortOrder
    isMarkedFavourite?: SortOrder
    isPinned?: SortOrder
    _count?: UserRoomCountOrderByAggregateInput
    _max?: UserRoomMaxOrderByAggregateInput
    _min?: UserRoomMinOrderByAggregateInput
  }

  export type UserRoomScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserRoomScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserRoomScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserRoomScalarWhereWithAggregatesInput>
    username?: StringWithAggregatesFilter | string
    roomId?: StringWithAggregatesFilter | string
    joinedAt?: DateTimeWithAggregatesFilter | Date | string
    isAdmin?: BoolWithAggregatesFilter | boolean
    isBlocked?: BoolWithAggregatesFilter | boolean
    lastReadMessage?: StringNullableWithAggregatesFilter | string | null
    isHidden?: BoolWithAggregatesFilter | boolean
    isNotificationMuted?: BoolWithAggregatesFilter | boolean
    isMarkedFavourite?: BoolWithAggregatesFilter | boolean
    isPinned?: BoolWithAggregatesFilter | boolean
  }

  export type MessageWhereInput = {
    AND?: Enumerable<MessageWhereInput>
    OR?: Enumerable<MessageWhereInput>
    NOT?: Enumerable<MessageWhereInput>
    key?: StringFilter | string
    senderUsername?: StringFilter | string
    roomId?: StringFilter | string
    content?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    editedAt?: DateTimeNullableFilter | Date | string | null
    contentType?: EnumMessageContentTypeFilter | MessageContentType
    sender?: XOR<UserRelationFilter, UserWhereInput>
    room?: XOR<RoomRelationFilter, RoomWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    key?: SortOrder
    senderUsername?: SortOrder
    roomId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    editedAt?: SortOrder
    contentType?: SortOrder
    sender?: UserOrderByWithRelationInput
    room?: RoomOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = {
    key?: string
  }

  export type MessageOrderByWithAggregationInput = {
    key?: SortOrder
    senderUsername?: SortOrder
    roomId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    editedAt?: SortOrder
    contentType?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: Enumerable<MessageScalarWhereWithAggregatesInput>
    OR?: Enumerable<MessageScalarWhereWithAggregatesInput>
    NOT?: Enumerable<MessageScalarWhereWithAggregatesInput>
    key?: StringWithAggregatesFilter | string
    senderUsername?: StringWithAggregatesFilter | string
    roomId?: StringWithAggregatesFilter | string
    content?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    editedAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    contentType?: EnumMessageContentTypeWithAggregatesFilter | MessageContentType
  }

  export type UserMessageWhereInput = {
    AND?: Enumerable<UserMessageWhereInput>
    OR?: Enumerable<UserMessageWhereInput>
    NOT?: Enumerable<UserMessageWhereInput>
    username?: StringFilter | string
    roomId?: StringFilter | string
    isHidden?: BoolFilter | boolean
    isNotificationMuted?: BoolFilter | boolean
    isMarkedFavourite?: BoolFilter | boolean
    isPinned?: BoolFilter | boolean
    user?: XOR<UserRelationFilter, UserWhereInput>
    room?: XOR<RoomRelationFilter, RoomWhereInput>
  }

  export type UserMessageOrderByWithRelationInput = {
    username?: SortOrder
    roomId?: SortOrder
    isHidden?: SortOrder
    isNotificationMuted?: SortOrder
    isMarkedFavourite?: SortOrder
    isPinned?: SortOrder
    user?: UserOrderByWithRelationInput
    room?: RoomOrderByWithRelationInput
  }

  export type UserMessageWhereUniqueInput = {
    username_roomId?: UserMessageUsernameRoomIdCompoundUniqueInput
  }

  export type UserMessageOrderByWithAggregationInput = {
    username?: SortOrder
    roomId?: SortOrder
    isHidden?: SortOrder
    isNotificationMuted?: SortOrder
    isMarkedFavourite?: SortOrder
    isPinned?: SortOrder
    _count?: UserMessageCountOrderByAggregateInput
    _max?: UserMessageMaxOrderByAggregateInput
    _min?: UserMessageMinOrderByAggregateInput
  }

  export type UserMessageScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserMessageScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserMessageScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserMessageScalarWhereWithAggregatesInput>
    username?: StringWithAggregatesFilter | string
    roomId?: StringWithAggregatesFilter | string
    isHidden?: BoolWithAggregatesFilter | boolean
    isNotificationMuted?: BoolWithAggregatesFilter | boolean
    isMarkedFavourite?: BoolWithAggregatesFilter | boolean
    isPinned?: BoolWithAggregatesFilter | boolean
  }

  export type SessionWhereInput = {
    AND?: Enumerable<SessionWhereInput>
    OR?: Enumerable<SessionWhereInput>
    NOT?: Enumerable<SessionWhereInput>
    id?: StringFilter | string
    sid?: StringFilter | string
    data?: StringFilter | string
    expiresAt?: DateTimeFilter | Date | string
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sid?: SortOrder
    data?: SortOrder
    expiresAt?: SortOrder
  }

  export type SessionWhereUniqueInput = {
    id?: string
    sid?: string
  }

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sid?: SortOrder
    data?: SortOrder
    expiresAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<SessionScalarWhereWithAggregatesInput>
    OR?: Enumerable<SessionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<SessionScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    sid?: StringWithAggregatesFilter | string
    data?: StringWithAggregatesFilter | string
    expiresAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type UserCreateInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
    message?: MessageCreateNestedManyWithoutSenderInput
    userRoom?: UserRoomCreateNestedManyWithoutUserInput
    rooms?: RoomCreateNestedManyWithoutUserInput
    UserMessage?: UserMessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
    message?: MessageUncheckedCreateNestedManyWithoutSenderInput
    userRoom?: UserRoomUncheckedCreateNestedManyWithoutUserInput
    rooms?: RoomUncheckedCreateNestedManyWithoutUserInput
    UserMessage?: UserMessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
    message?: MessageUpdateManyWithoutSenderNestedInput
    userRoom?: UserRoomUpdateManyWithoutUserNestedInput
    rooms?: RoomUpdateManyWithoutUserNestedInput
    UserMessage?: UserMessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
    message?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    userRoom?: UserRoomUncheckedUpdateManyWithoutUserNestedInput
    rooms?: RoomUncheckedUpdateManyWithoutUserNestedInput
    UserMessage?: UserMessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
  }

  export type UserUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
  }

  export type UserUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
  }

  export type RoomCreateInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
    message?: MessageCreateNestedManyWithoutRoomInput
    userRoom?: UserRoomCreateNestedManyWithoutRoomInput
    user?: UserCreateNestedManyWithoutRoomsInput
    UserMessage?: UserMessageCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
    message?: MessageUncheckedCreateNestedManyWithoutRoomInput
    userRoom?: UserRoomUncheckedCreateNestedManyWithoutRoomInput
    user?: UserUncheckedCreateNestedManyWithoutRoomsInput
    UserMessage?: UserMessageUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomUpdateInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    message?: MessageUpdateManyWithoutRoomNestedInput
    userRoom?: UserRoomUpdateManyWithoutRoomNestedInput
    user?: UserUpdateManyWithoutRoomsNestedInput
    UserMessage?: UserMessageUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    message?: MessageUncheckedUpdateManyWithoutRoomNestedInput
    userRoom?: UserRoomUncheckedUpdateManyWithoutRoomNestedInput
    user?: UserUncheckedUpdateManyWithoutRoomsNestedInput
    UserMessage?: UserMessageUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type RoomCreateManyInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
  }

  export type RoomUpdateManyMutationInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoomUncheckedUpdateManyInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserRoomCreateInput = {
    joinedAt?: Date | string
    isAdmin?: boolean
    isBlocked?: boolean
    lastReadMessage?: string | null
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
    user: UserCreateNestedOneWithoutUserRoomInput
    room: RoomCreateNestedOneWithoutUserRoomInput
  }

  export type UserRoomUncheckedCreateInput = {
    username: string
    roomId: string
    joinedAt?: Date | string
    isAdmin?: boolean
    isBlocked?: boolean
    lastReadMessage?: string | null
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type UserRoomUpdateInput = {
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    lastReadMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutUserRoomNestedInput
    room?: RoomUpdateOneRequiredWithoutUserRoomNestedInput
  }

  export type UserRoomUncheckedUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    lastReadMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserRoomCreateManyInput = {
    username: string
    roomId: string
    joinedAt?: Date | string
    isAdmin?: boolean
    isBlocked?: boolean
    lastReadMessage?: string | null
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type UserRoomUpdateManyMutationInput = {
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    lastReadMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserRoomUncheckedUpdateManyInput = {
    username?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    lastReadMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageCreateInput = {
    key?: string
    content: string
    createdAt?: Date | string
    editedAt?: Date | string | null
    contentType: MessageContentType
    sender: UserCreateNestedOneWithoutMessageInput
    room: RoomCreateNestedOneWithoutMessageInput
  }

  export type MessageUncheckedCreateInput = {
    key?: string
    senderUsername: string
    roomId: string
    content: string
    createdAt?: Date | string
    editedAt?: Date | string | null
    contentType: MessageContentType
  }

  export type MessageUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentType?: EnumMessageContentTypeFieldUpdateOperationsInput | MessageContentType
    sender?: UserUpdateOneRequiredWithoutMessageNestedInput
    room?: RoomUpdateOneRequiredWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    senderUsername?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentType?: EnumMessageContentTypeFieldUpdateOperationsInput | MessageContentType
  }

  export type MessageCreateManyInput = {
    key?: string
    senderUsername: string
    roomId: string
    content: string
    createdAt?: Date | string
    editedAt?: Date | string | null
    contentType: MessageContentType
  }

  export type MessageUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentType?: EnumMessageContentTypeFieldUpdateOperationsInput | MessageContentType
  }

  export type MessageUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    senderUsername?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentType?: EnumMessageContentTypeFieldUpdateOperationsInput | MessageContentType
  }

  export type UserMessageCreateInput = {
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
    user: UserCreateNestedOneWithoutUserMessageInput
    room: RoomCreateNestedOneWithoutUserMessageInput
  }

  export type UserMessageUncheckedCreateInput = {
    username: string
    roomId: string
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type UserMessageUpdateInput = {
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutUserMessageNestedInput
    room?: RoomUpdateOneRequiredWithoutUserMessageNestedInput
  }

  export type UserMessageUncheckedUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserMessageCreateManyInput = {
    username: string
    roomId: string
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type UserMessageUpdateManyMutationInput = {
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserMessageUncheckedUpdateManyInput = {
    username?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SessionCreateInput = {
    id: string
    sid: string
    data: string
    expiresAt: Date | string
  }

  export type SessionUncheckedCreateInput = {
    id: string
    sid: string
    data: string
    expiresAt: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sid?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sid?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id: string
    sid: string
    data: string
    expiresAt: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sid?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sid?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type EnumUserStatusFilter = {
    equals?: UserStatus
    in?: Enumerable<UserStatus>
    notIn?: Enumerable<UserStatus>
    not?: NestedEnumUserStatusFilter | UserStatus
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type UserRoomListRelationFilter = {
    every?: UserRoomWhereInput
    some?: UserRoomWhereInput
    none?: UserRoomWhereInput
  }

  export type RoomListRelationFilter = {
    every?: RoomWhereInput
    some?: RoomWhereInput
    none?: RoomWhereInput
  }

  export type UserMessageListRelationFilter = {
    every?: UserMessageWhereInput
    some?: UserMessageWhereInput
    none?: UserMessageWhereInput
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserRoomOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoomOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    userId?: SortOrder
    username?: SortOrder
    createTime?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    avatarPath?: SortOrder
    status?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    userId?: SortOrder
    username?: SortOrder
    createTime?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    avatarPath?: SortOrder
    status?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    userId?: SortOrder
    username?: SortOrder
    createTime?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    avatarPath?: SortOrder
    status?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type EnumUserStatusWithAggregatesFilter = {
    equals?: UserStatus
    in?: Enumerable<UserStatus>
    notIn?: Enumerable<UserStatus>
    not?: NestedEnumUserStatusWithAggregatesFilter | UserStatus
    _count?: NestedIntFilter
    _min?: NestedEnumUserStatusFilter
    _max?: NestedEnumUserStatusFilter
  }

  export type EnumRoomTypeFilter = {
    equals?: RoomType
    in?: Enumerable<RoomType>
    notIn?: Enumerable<RoomType>
    not?: NestedEnumRoomTypeFilter | RoomType
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoomCountOrderByAggregateInput = {
    roomId?: SortOrder
    roomType?: SortOrder
    roomDisplayName?: SortOrder
    roomAvatar?: SortOrder
  }

  export type RoomMaxOrderByAggregateInput = {
    roomId?: SortOrder
    roomType?: SortOrder
    roomDisplayName?: SortOrder
    roomAvatar?: SortOrder
  }

  export type RoomMinOrderByAggregateInput = {
    roomId?: SortOrder
    roomType?: SortOrder
    roomDisplayName?: SortOrder
    roomAvatar?: SortOrder
  }

  export type EnumRoomTypeWithAggregatesFilter = {
    equals?: RoomType
    in?: Enumerable<RoomType>
    notIn?: Enumerable<RoomType>
    not?: NestedEnumRoomTypeWithAggregatesFilter | RoomType
    _count?: NestedIntFilter
    _min?: NestedEnumRoomTypeFilter
    _max?: NestedEnumRoomTypeFilter
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RoomRelationFilter = {
    is?: RoomWhereInput
    isNot?: RoomWhereInput
  }

  export type UserRoomUsernameRoomIdCompoundUniqueInput = {
    username: string
    roomId: string
  }

  export type UserRoomCountOrderByAggregateInput = {
    username?: SortOrder
    roomId?: SortOrder
    joinedAt?: SortOrder
    isAdmin?: SortOrder
    isBlocked?: SortOrder
    lastReadMessage?: SortOrder
    isHidden?: SortOrder
    isNotificationMuted?: SortOrder
    isMarkedFavourite?: SortOrder
    isPinned?: SortOrder
  }

  export type UserRoomMaxOrderByAggregateInput = {
    username?: SortOrder
    roomId?: SortOrder
    joinedAt?: SortOrder
    isAdmin?: SortOrder
    isBlocked?: SortOrder
    lastReadMessage?: SortOrder
    isHidden?: SortOrder
    isNotificationMuted?: SortOrder
    isMarkedFavourite?: SortOrder
    isPinned?: SortOrder
  }

  export type UserRoomMinOrderByAggregateInput = {
    username?: SortOrder
    roomId?: SortOrder
    joinedAt?: SortOrder
    isAdmin?: SortOrder
    isBlocked?: SortOrder
    lastReadMessage?: SortOrder
    isHidden?: SortOrder
    isNotificationMuted?: SortOrder
    isMarkedFavourite?: SortOrder
    isPinned?: SortOrder
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type EnumMessageContentTypeFilter = {
    equals?: MessageContentType
    in?: Enumerable<MessageContentType>
    notIn?: Enumerable<MessageContentType>
    not?: NestedEnumMessageContentTypeFilter | MessageContentType
  }

  export type MessageCountOrderByAggregateInput = {
    key?: SortOrder
    senderUsername?: SortOrder
    roomId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    editedAt?: SortOrder
    contentType?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    key?: SortOrder
    senderUsername?: SortOrder
    roomId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    editedAt?: SortOrder
    contentType?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    key?: SortOrder
    senderUsername?: SortOrder
    roomId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    editedAt?: SortOrder
    contentType?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type EnumMessageContentTypeWithAggregatesFilter = {
    equals?: MessageContentType
    in?: Enumerable<MessageContentType>
    notIn?: Enumerable<MessageContentType>
    not?: NestedEnumMessageContentTypeWithAggregatesFilter | MessageContentType
    _count?: NestedIntFilter
    _min?: NestedEnumMessageContentTypeFilter
    _max?: NestedEnumMessageContentTypeFilter
  }

  export type UserMessageUsernameRoomIdCompoundUniqueInput = {
    username: string
    roomId: string
  }

  export type UserMessageCountOrderByAggregateInput = {
    username?: SortOrder
    roomId?: SortOrder
    isHidden?: SortOrder
    isNotificationMuted?: SortOrder
    isMarkedFavourite?: SortOrder
    isPinned?: SortOrder
  }

  export type UserMessageMaxOrderByAggregateInput = {
    username?: SortOrder
    roomId?: SortOrder
    isHidden?: SortOrder
    isNotificationMuted?: SortOrder
    isMarkedFavourite?: SortOrder
    isPinned?: SortOrder
  }

  export type UserMessageMinOrderByAggregateInput = {
    username?: SortOrder
    roomId?: SortOrder
    isHidden?: SortOrder
    isNotificationMuted?: SortOrder
    isMarkedFavourite?: SortOrder
    isPinned?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sid?: SortOrder
    data?: SortOrder
    expiresAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sid?: SortOrder
    data?: SortOrder
    expiresAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sid?: SortOrder
    data?: SortOrder
    expiresAt?: SortOrder
  }

  export type MessageCreateNestedManyWithoutSenderInput = {
    create?: XOR<Enumerable<MessageCreateWithoutSenderInput>, Enumerable<MessageUncheckedCreateWithoutSenderInput>>
    connectOrCreate?: Enumerable<MessageCreateOrConnectWithoutSenderInput>
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: Enumerable<MessageWhereUniqueInput>
  }

  export type UserRoomCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<UserRoomCreateWithoutUserInput>, Enumerable<UserRoomUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserRoomCreateOrConnectWithoutUserInput>
    createMany?: UserRoomCreateManyUserInputEnvelope
    connect?: Enumerable<UserRoomWhereUniqueInput>
  }

  export type RoomCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<RoomCreateWithoutUserInput>, Enumerable<RoomUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<RoomCreateOrConnectWithoutUserInput>
    connect?: Enumerable<RoomWhereUniqueInput>
  }

  export type UserMessageCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<UserMessageCreateWithoutUserInput>, Enumerable<UserMessageUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserMessageCreateOrConnectWithoutUserInput>
    createMany?: UserMessageCreateManyUserInputEnvelope
    connect?: Enumerable<UserMessageWhereUniqueInput>
  }

  export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<Enumerable<MessageCreateWithoutSenderInput>, Enumerable<MessageUncheckedCreateWithoutSenderInput>>
    connectOrCreate?: Enumerable<MessageCreateOrConnectWithoutSenderInput>
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: Enumerable<MessageWhereUniqueInput>
  }

  export type UserRoomUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<UserRoomCreateWithoutUserInput>, Enumerable<UserRoomUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserRoomCreateOrConnectWithoutUserInput>
    createMany?: UserRoomCreateManyUserInputEnvelope
    connect?: Enumerable<UserRoomWhereUniqueInput>
  }

  export type RoomUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<RoomCreateWithoutUserInput>, Enumerable<RoomUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<RoomCreateOrConnectWithoutUserInput>
    connect?: Enumerable<RoomWhereUniqueInput>
  }

  export type UserMessageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<UserMessageCreateWithoutUserInput>, Enumerable<UserMessageUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserMessageCreateOrConnectWithoutUserInput>
    createMany?: UserMessageCreateManyUserInputEnvelope
    connect?: Enumerable<UserMessageWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: UserStatus
  }

  export type MessageUpdateManyWithoutSenderNestedInput = {
    create?: XOR<Enumerable<MessageCreateWithoutSenderInput>, Enumerable<MessageUncheckedCreateWithoutSenderInput>>
    connectOrCreate?: Enumerable<MessageCreateOrConnectWithoutSenderInput>
    upsert?: Enumerable<MessageUpsertWithWhereUniqueWithoutSenderInput>
    createMany?: MessageCreateManySenderInputEnvelope
    set?: Enumerable<MessageWhereUniqueInput>
    disconnect?: Enumerable<MessageWhereUniqueInput>
    delete?: Enumerable<MessageWhereUniqueInput>
    connect?: Enumerable<MessageWhereUniqueInput>
    update?: Enumerable<MessageUpdateWithWhereUniqueWithoutSenderInput>
    updateMany?: Enumerable<MessageUpdateManyWithWhereWithoutSenderInput>
    deleteMany?: Enumerable<MessageScalarWhereInput>
  }

  export type UserRoomUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<UserRoomCreateWithoutUserInput>, Enumerable<UserRoomUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserRoomCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<UserRoomUpsertWithWhereUniqueWithoutUserInput>
    createMany?: UserRoomCreateManyUserInputEnvelope
    set?: Enumerable<UserRoomWhereUniqueInput>
    disconnect?: Enumerable<UserRoomWhereUniqueInput>
    delete?: Enumerable<UserRoomWhereUniqueInput>
    connect?: Enumerable<UserRoomWhereUniqueInput>
    update?: Enumerable<UserRoomUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<UserRoomUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<UserRoomScalarWhereInput>
  }

  export type RoomUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<RoomCreateWithoutUserInput>, Enumerable<RoomUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<RoomCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<RoomUpsertWithWhereUniqueWithoutUserInput>
    set?: Enumerable<RoomWhereUniqueInput>
    disconnect?: Enumerable<RoomWhereUniqueInput>
    delete?: Enumerable<RoomWhereUniqueInput>
    connect?: Enumerable<RoomWhereUniqueInput>
    update?: Enumerable<RoomUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<RoomUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<RoomScalarWhereInput>
  }

  export type UserMessageUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<UserMessageCreateWithoutUserInput>, Enumerable<UserMessageUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserMessageCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<UserMessageUpsertWithWhereUniqueWithoutUserInput>
    createMany?: UserMessageCreateManyUserInputEnvelope
    set?: Enumerable<UserMessageWhereUniqueInput>
    disconnect?: Enumerable<UserMessageWhereUniqueInput>
    delete?: Enumerable<UserMessageWhereUniqueInput>
    connect?: Enumerable<UserMessageWhereUniqueInput>
    update?: Enumerable<UserMessageUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<UserMessageUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<UserMessageScalarWhereInput>
  }

  export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<Enumerable<MessageCreateWithoutSenderInput>, Enumerable<MessageUncheckedCreateWithoutSenderInput>>
    connectOrCreate?: Enumerable<MessageCreateOrConnectWithoutSenderInput>
    upsert?: Enumerable<MessageUpsertWithWhereUniqueWithoutSenderInput>
    createMany?: MessageCreateManySenderInputEnvelope
    set?: Enumerable<MessageWhereUniqueInput>
    disconnect?: Enumerable<MessageWhereUniqueInput>
    delete?: Enumerable<MessageWhereUniqueInput>
    connect?: Enumerable<MessageWhereUniqueInput>
    update?: Enumerable<MessageUpdateWithWhereUniqueWithoutSenderInput>
    updateMany?: Enumerable<MessageUpdateManyWithWhereWithoutSenderInput>
    deleteMany?: Enumerable<MessageScalarWhereInput>
  }

  export type UserRoomUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<UserRoomCreateWithoutUserInput>, Enumerable<UserRoomUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserRoomCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<UserRoomUpsertWithWhereUniqueWithoutUserInput>
    createMany?: UserRoomCreateManyUserInputEnvelope
    set?: Enumerable<UserRoomWhereUniqueInput>
    disconnect?: Enumerable<UserRoomWhereUniqueInput>
    delete?: Enumerable<UserRoomWhereUniqueInput>
    connect?: Enumerable<UserRoomWhereUniqueInput>
    update?: Enumerable<UserRoomUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<UserRoomUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<UserRoomScalarWhereInput>
  }

  export type RoomUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<RoomCreateWithoutUserInput>, Enumerable<RoomUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<RoomCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<RoomUpsertWithWhereUniqueWithoutUserInput>
    set?: Enumerable<RoomWhereUniqueInput>
    disconnect?: Enumerable<RoomWhereUniqueInput>
    delete?: Enumerable<RoomWhereUniqueInput>
    connect?: Enumerable<RoomWhereUniqueInput>
    update?: Enumerable<RoomUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<RoomUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<RoomScalarWhereInput>
  }

  export type UserMessageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<Enumerable<UserMessageCreateWithoutUserInput>, Enumerable<UserMessageUncheckedCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<UserMessageCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<UserMessageUpsertWithWhereUniqueWithoutUserInput>
    createMany?: UserMessageCreateManyUserInputEnvelope
    set?: Enumerable<UserMessageWhereUniqueInput>
    disconnect?: Enumerable<UserMessageWhereUniqueInput>
    delete?: Enumerable<UserMessageWhereUniqueInput>
    connect?: Enumerable<UserMessageWhereUniqueInput>
    update?: Enumerable<UserMessageUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<UserMessageUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<UserMessageScalarWhereInput>
  }

  export type MessageCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<MessageCreateWithoutRoomInput>, Enumerable<MessageUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<MessageCreateOrConnectWithoutRoomInput>
    createMany?: MessageCreateManyRoomInputEnvelope
    connect?: Enumerable<MessageWhereUniqueInput>
  }

  export type UserRoomCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<UserRoomCreateWithoutRoomInput>, Enumerable<UserRoomUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<UserRoomCreateOrConnectWithoutRoomInput>
    createMany?: UserRoomCreateManyRoomInputEnvelope
    connect?: Enumerable<UserRoomWhereUniqueInput>
  }

  export type UserCreateNestedManyWithoutRoomsInput = {
    create?: XOR<Enumerable<UserCreateWithoutRoomsInput>, Enumerable<UserUncheckedCreateWithoutRoomsInput>>
    connectOrCreate?: Enumerable<UserCreateOrConnectWithoutRoomsInput>
    connect?: Enumerable<UserWhereUniqueInput>
  }

  export type UserMessageCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<UserMessageCreateWithoutRoomInput>, Enumerable<UserMessageUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<UserMessageCreateOrConnectWithoutRoomInput>
    createMany?: UserMessageCreateManyRoomInputEnvelope
    connect?: Enumerable<UserMessageWhereUniqueInput>
  }

  export type MessageUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<MessageCreateWithoutRoomInput>, Enumerable<MessageUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<MessageCreateOrConnectWithoutRoomInput>
    createMany?: MessageCreateManyRoomInputEnvelope
    connect?: Enumerable<MessageWhereUniqueInput>
  }

  export type UserRoomUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<UserRoomCreateWithoutRoomInput>, Enumerable<UserRoomUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<UserRoomCreateOrConnectWithoutRoomInput>
    createMany?: UserRoomCreateManyRoomInputEnvelope
    connect?: Enumerable<UserRoomWhereUniqueInput>
  }

  export type UserUncheckedCreateNestedManyWithoutRoomsInput = {
    create?: XOR<Enumerable<UserCreateWithoutRoomsInput>, Enumerable<UserUncheckedCreateWithoutRoomsInput>>
    connectOrCreate?: Enumerable<UserCreateOrConnectWithoutRoomsInput>
    connect?: Enumerable<UserWhereUniqueInput>
  }

  export type UserMessageUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<UserMessageCreateWithoutRoomInput>, Enumerable<UserMessageUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<UserMessageCreateOrConnectWithoutRoomInput>
    createMany?: UserMessageCreateManyRoomInputEnvelope
    connect?: Enumerable<UserMessageWhereUniqueInput>
  }

  export type EnumRoomTypeFieldUpdateOperationsInput = {
    set?: RoomType
  }

  export type MessageUpdateManyWithoutRoomNestedInput = {
    create?: XOR<Enumerable<MessageCreateWithoutRoomInput>, Enumerable<MessageUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<MessageCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<MessageUpsertWithWhereUniqueWithoutRoomInput>
    createMany?: MessageCreateManyRoomInputEnvelope
    set?: Enumerable<MessageWhereUniqueInput>
    disconnect?: Enumerable<MessageWhereUniqueInput>
    delete?: Enumerable<MessageWhereUniqueInput>
    connect?: Enumerable<MessageWhereUniqueInput>
    update?: Enumerable<MessageUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<MessageUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<MessageScalarWhereInput>
  }

  export type UserRoomUpdateManyWithoutRoomNestedInput = {
    create?: XOR<Enumerable<UserRoomCreateWithoutRoomInput>, Enumerable<UserRoomUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<UserRoomCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<UserRoomUpsertWithWhereUniqueWithoutRoomInput>
    createMany?: UserRoomCreateManyRoomInputEnvelope
    set?: Enumerable<UserRoomWhereUniqueInput>
    disconnect?: Enumerable<UserRoomWhereUniqueInput>
    delete?: Enumerable<UserRoomWhereUniqueInput>
    connect?: Enumerable<UserRoomWhereUniqueInput>
    update?: Enumerable<UserRoomUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<UserRoomUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<UserRoomScalarWhereInput>
  }

  export type UserUpdateManyWithoutRoomsNestedInput = {
    create?: XOR<Enumerable<UserCreateWithoutRoomsInput>, Enumerable<UserUncheckedCreateWithoutRoomsInput>>
    connectOrCreate?: Enumerable<UserCreateOrConnectWithoutRoomsInput>
    upsert?: Enumerable<UserUpsertWithWhereUniqueWithoutRoomsInput>
    set?: Enumerable<UserWhereUniqueInput>
    disconnect?: Enumerable<UserWhereUniqueInput>
    delete?: Enumerable<UserWhereUniqueInput>
    connect?: Enumerable<UserWhereUniqueInput>
    update?: Enumerable<UserUpdateWithWhereUniqueWithoutRoomsInput>
    updateMany?: Enumerable<UserUpdateManyWithWhereWithoutRoomsInput>
    deleteMany?: Enumerable<UserScalarWhereInput>
  }

  export type UserMessageUpdateManyWithoutRoomNestedInput = {
    create?: XOR<Enumerable<UserMessageCreateWithoutRoomInput>, Enumerable<UserMessageUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<UserMessageCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<UserMessageUpsertWithWhereUniqueWithoutRoomInput>
    createMany?: UserMessageCreateManyRoomInputEnvelope
    set?: Enumerable<UserMessageWhereUniqueInput>
    disconnect?: Enumerable<UserMessageWhereUniqueInput>
    delete?: Enumerable<UserMessageWhereUniqueInput>
    connect?: Enumerable<UserMessageWhereUniqueInput>
    update?: Enumerable<UserMessageUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<UserMessageUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<UserMessageScalarWhereInput>
  }

  export type MessageUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<Enumerable<MessageCreateWithoutRoomInput>, Enumerable<MessageUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<MessageCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<MessageUpsertWithWhereUniqueWithoutRoomInput>
    createMany?: MessageCreateManyRoomInputEnvelope
    set?: Enumerable<MessageWhereUniqueInput>
    disconnect?: Enumerable<MessageWhereUniqueInput>
    delete?: Enumerable<MessageWhereUniqueInput>
    connect?: Enumerable<MessageWhereUniqueInput>
    update?: Enumerable<MessageUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<MessageUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<MessageScalarWhereInput>
  }

  export type UserRoomUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<Enumerable<UserRoomCreateWithoutRoomInput>, Enumerable<UserRoomUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<UserRoomCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<UserRoomUpsertWithWhereUniqueWithoutRoomInput>
    createMany?: UserRoomCreateManyRoomInputEnvelope
    set?: Enumerable<UserRoomWhereUniqueInput>
    disconnect?: Enumerable<UserRoomWhereUniqueInput>
    delete?: Enumerable<UserRoomWhereUniqueInput>
    connect?: Enumerable<UserRoomWhereUniqueInput>
    update?: Enumerable<UserRoomUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<UserRoomUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<UserRoomScalarWhereInput>
  }

  export type UserUncheckedUpdateManyWithoutRoomsNestedInput = {
    create?: XOR<Enumerable<UserCreateWithoutRoomsInput>, Enumerable<UserUncheckedCreateWithoutRoomsInput>>
    connectOrCreate?: Enumerable<UserCreateOrConnectWithoutRoomsInput>
    upsert?: Enumerable<UserUpsertWithWhereUniqueWithoutRoomsInput>
    set?: Enumerable<UserWhereUniqueInput>
    disconnect?: Enumerable<UserWhereUniqueInput>
    delete?: Enumerable<UserWhereUniqueInput>
    connect?: Enumerable<UserWhereUniqueInput>
    update?: Enumerable<UserUpdateWithWhereUniqueWithoutRoomsInput>
    updateMany?: Enumerable<UserUpdateManyWithWhereWithoutRoomsInput>
    deleteMany?: Enumerable<UserScalarWhereInput>
  }

  export type UserMessageUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<Enumerable<UserMessageCreateWithoutRoomInput>, Enumerable<UserMessageUncheckedCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<UserMessageCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<UserMessageUpsertWithWhereUniqueWithoutRoomInput>
    createMany?: UserMessageCreateManyRoomInputEnvelope
    set?: Enumerable<UserMessageWhereUniqueInput>
    disconnect?: Enumerable<UserMessageWhereUniqueInput>
    delete?: Enumerable<UserMessageWhereUniqueInput>
    connect?: Enumerable<UserMessageWhereUniqueInput>
    update?: Enumerable<UserMessageUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<UserMessageUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<UserMessageScalarWhereInput>
  }

  export type UserCreateNestedOneWithoutUserRoomInput = {
    create?: XOR<UserCreateWithoutUserRoomInput, UserUncheckedCreateWithoutUserRoomInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserRoomInput
    connect?: UserWhereUniqueInput
  }

  export type RoomCreateNestedOneWithoutUserRoomInput = {
    create?: XOR<RoomCreateWithoutUserRoomInput, RoomUncheckedCreateWithoutUserRoomInput>
    connectOrCreate?: RoomCreateOrConnectWithoutUserRoomInput
    connect?: RoomWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutUserRoomNestedInput = {
    create?: XOR<UserCreateWithoutUserRoomInput, UserUncheckedCreateWithoutUserRoomInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserRoomInput
    upsert?: UserUpsertWithoutUserRoomInput
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutUserRoomInput, UserUncheckedUpdateWithoutUserRoomInput>
  }

  export type RoomUpdateOneRequiredWithoutUserRoomNestedInput = {
    create?: XOR<RoomCreateWithoutUserRoomInput, RoomUncheckedCreateWithoutUserRoomInput>
    connectOrCreate?: RoomCreateOrConnectWithoutUserRoomInput
    upsert?: RoomUpsertWithoutUserRoomInput
    connect?: RoomWhereUniqueInput
    update?: XOR<RoomUpdateWithoutUserRoomInput, RoomUncheckedUpdateWithoutUserRoomInput>
  }

  export type UserCreateNestedOneWithoutMessageInput = {
    create?: XOR<UserCreateWithoutMessageInput, UserUncheckedCreateWithoutMessageInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessageInput
    connect?: UserWhereUniqueInput
  }

  export type RoomCreateNestedOneWithoutMessageInput = {
    create?: XOR<RoomCreateWithoutMessageInput, RoomUncheckedCreateWithoutMessageInput>
    connectOrCreate?: RoomCreateOrConnectWithoutMessageInput
    connect?: RoomWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumMessageContentTypeFieldUpdateOperationsInput = {
    set?: MessageContentType
  }

  export type UserUpdateOneRequiredWithoutMessageNestedInput = {
    create?: XOR<UserCreateWithoutMessageInput, UserUncheckedCreateWithoutMessageInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessageInput
    upsert?: UserUpsertWithoutMessageInput
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutMessageInput, UserUncheckedUpdateWithoutMessageInput>
  }

  export type RoomUpdateOneRequiredWithoutMessageNestedInput = {
    create?: XOR<RoomCreateWithoutMessageInput, RoomUncheckedCreateWithoutMessageInput>
    connectOrCreate?: RoomCreateOrConnectWithoutMessageInput
    upsert?: RoomUpsertWithoutMessageInput
    connect?: RoomWhereUniqueInput
    update?: XOR<RoomUpdateWithoutMessageInput, RoomUncheckedUpdateWithoutMessageInput>
  }

  export type UserCreateNestedOneWithoutUserMessageInput = {
    create?: XOR<UserCreateWithoutUserMessageInput, UserUncheckedCreateWithoutUserMessageInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserMessageInput
    connect?: UserWhereUniqueInput
  }

  export type RoomCreateNestedOneWithoutUserMessageInput = {
    create?: XOR<RoomCreateWithoutUserMessageInput, RoomUncheckedCreateWithoutUserMessageInput>
    connectOrCreate?: RoomCreateOrConnectWithoutUserMessageInput
    connect?: RoomWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserMessageNestedInput = {
    create?: XOR<UserCreateWithoutUserMessageInput, UserUncheckedCreateWithoutUserMessageInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserMessageInput
    upsert?: UserUpsertWithoutUserMessageInput
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutUserMessageInput, UserUncheckedUpdateWithoutUserMessageInput>
  }

  export type RoomUpdateOneRequiredWithoutUserMessageNestedInput = {
    create?: XOR<RoomCreateWithoutUserMessageInput, RoomUncheckedCreateWithoutUserMessageInput>
    connectOrCreate?: RoomCreateOrConnectWithoutUserMessageInput
    upsert?: RoomUpsertWithoutUserMessageInput
    connect?: RoomWhereUniqueInput
    update?: XOR<RoomUpdateWithoutUserMessageInput, RoomUncheckedUpdateWithoutUserMessageInput>
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedEnumUserStatusFilter = {
    equals?: UserStatus
    in?: Enumerable<UserStatus>
    notIn?: Enumerable<UserStatus>
    not?: NestedEnumUserStatusFilter | UserStatus
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedEnumUserStatusWithAggregatesFilter = {
    equals?: UserStatus
    in?: Enumerable<UserStatus>
    notIn?: Enumerable<UserStatus>
    not?: NestedEnumUserStatusWithAggregatesFilter | UserStatus
    _count?: NestedIntFilter
    _min?: NestedEnumUserStatusFilter
    _max?: NestedEnumUserStatusFilter
  }

  export type NestedEnumRoomTypeFilter = {
    equals?: RoomType
    in?: Enumerable<RoomType>
    notIn?: Enumerable<RoomType>
    not?: NestedEnumRoomTypeFilter | RoomType
  }

  export type NestedEnumRoomTypeWithAggregatesFilter = {
    equals?: RoomType
    in?: Enumerable<RoomType>
    notIn?: Enumerable<RoomType>
    not?: NestedEnumRoomTypeWithAggregatesFilter | RoomType
    _count?: NestedIntFilter
    _min?: NestedEnumRoomTypeFilter
    _max?: NestedEnumRoomTypeFilter
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedEnumMessageContentTypeFilter = {
    equals?: MessageContentType
    in?: Enumerable<MessageContentType>
    notIn?: Enumerable<MessageContentType>
    not?: NestedEnumMessageContentTypeFilter | MessageContentType
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type NestedEnumMessageContentTypeWithAggregatesFilter = {
    equals?: MessageContentType
    in?: Enumerable<MessageContentType>
    notIn?: Enumerable<MessageContentType>
    not?: NestedEnumMessageContentTypeWithAggregatesFilter | MessageContentType
    _count?: NestedIntFilter
    _min?: NestedEnumMessageContentTypeFilter
    _max?: NestedEnumMessageContentTypeFilter
  }

  export type MessageCreateWithoutSenderInput = {
    key?: string
    content: string
    createdAt?: Date | string
    editedAt?: Date | string | null
    contentType: MessageContentType
    room: RoomCreateNestedOneWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutSenderInput = {
    key?: string
    roomId: string
    content: string
    createdAt?: Date | string
    editedAt?: Date | string | null
    contentType: MessageContentType
  }

  export type MessageCreateOrConnectWithoutSenderInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageCreateManySenderInputEnvelope = {
    data: Enumerable<MessageCreateManySenderInput>
    skipDuplicates?: boolean
  }

  export type UserRoomCreateWithoutUserInput = {
    joinedAt?: Date | string
    isAdmin?: boolean
    isBlocked?: boolean
    lastReadMessage?: string | null
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
    room: RoomCreateNestedOneWithoutUserRoomInput
  }

  export type UserRoomUncheckedCreateWithoutUserInput = {
    roomId: string
    joinedAt?: Date | string
    isAdmin?: boolean
    isBlocked?: boolean
    lastReadMessage?: string | null
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type UserRoomCreateOrConnectWithoutUserInput = {
    where: UserRoomWhereUniqueInput
    create: XOR<UserRoomCreateWithoutUserInput, UserRoomUncheckedCreateWithoutUserInput>
  }

  export type UserRoomCreateManyUserInputEnvelope = {
    data: Enumerable<UserRoomCreateManyUserInput>
    skipDuplicates?: boolean
  }

  export type RoomCreateWithoutUserInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
    message?: MessageCreateNestedManyWithoutRoomInput
    userRoom?: UserRoomCreateNestedManyWithoutRoomInput
    UserMessage?: UserMessageCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutUserInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
    message?: MessageUncheckedCreateNestedManyWithoutRoomInput
    userRoom?: UserRoomUncheckedCreateNestedManyWithoutRoomInput
    UserMessage?: UserMessageUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutUserInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutUserInput, RoomUncheckedCreateWithoutUserInput>
  }

  export type UserMessageCreateWithoutUserInput = {
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
    room: RoomCreateNestedOneWithoutUserMessageInput
  }

  export type UserMessageUncheckedCreateWithoutUserInput = {
    roomId: string
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type UserMessageCreateOrConnectWithoutUserInput = {
    where: UserMessageWhereUniqueInput
    create: XOR<UserMessageCreateWithoutUserInput, UserMessageUncheckedCreateWithoutUserInput>
  }

  export type UserMessageCreateManyUserInputEnvelope = {
    data: Enumerable<UserMessageCreateManyUserInput>
    skipDuplicates?: boolean
  }

  export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
  }

  export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutMessageInput>
  }

  export type MessageScalarWhereInput = {
    AND?: Enumerable<MessageScalarWhereInput>
    OR?: Enumerable<MessageScalarWhereInput>
    NOT?: Enumerable<MessageScalarWhereInput>
    key?: StringFilter | string
    senderUsername?: StringFilter | string
    roomId?: StringFilter | string
    content?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    editedAt?: DateTimeNullableFilter | Date | string | null
    contentType?: EnumMessageContentTypeFilter | MessageContentType
  }

  export type UserRoomUpsertWithWhereUniqueWithoutUserInput = {
    where: UserRoomWhereUniqueInput
    update: XOR<UserRoomUpdateWithoutUserInput, UserRoomUncheckedUpdateWithoutUserInput>
    create: XOR<UserRoomCreateWithoutUserInput, UserRoomUncheckedCreateWithoutUserInput>
  }

  export type UserRoomUpdateWithWhereUniqueWithoutUserInput = {
    where: UserRoomWhereUniqueInput
    data: XOR<UserRoomUpdateWithoutUserInput, UserRoomUncheckedUpdateWithoutUserInput>
  }

  export type UserRoomUpdateManyWithWhereWithoutUserInput = {
    where: UserRoomScalarWhereInput
    data: XOR<UserRoomUpdateManyMutationInput, UserRoomUncheckedUpdateManyWithoutUserRoomInput>
  }

  export type UserRoomScalarWhereInput = {
    AND?: Enumerable<UserRoomScalarWhereInput>
    OR?: Enumerable<UserRoomScalarWhereInput>
    NOT?: Enumerable<UserRoomScalarWhereInput>
    username?: StringFilter | string
    roomId?: StringFilter | string
    joinedAt?: DateTimeFilter | Date | string
    isAdmin?: BoolFilter | boolean
    isBlocked?: BoolFilter | boolean
    lastReadMessage?: StringNullableFilter | string | null
    isHidden?: BoolFilter | boolean
    isNotificationMuted?: BoolFilter | boolean
    isMarkedFavourite?: BoolFilter | boolean
    isPinned?: BoolFilter | boolean
  }

  export type RoomUpsertWithWhereUniqueWithoutUserInput = {
    where: RoomWhereUniqueInput
    update: XOR<RoomUpdateWithoutUserInput, RoomUncheckedUpdateWithoutUserInput>
    create: XOR<RoomCreateWithoutUserInput, RoomUncheckedCreateWithoutUserInput>
  }

  export type RoomUpdateWithWhereUniqueWithoutUserInput = {
    where: RoomWhereUniqueInput
    data: XOR<RoomUpdateWithoutUserInput, RoomUncheckedUpdateWithoutUserInput>
  }

  export type RoomUpdateManyWithWhereWithoutUserInput = {
    where: RoomScalarWhereInput
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyWithoutRoomsInput>
  }

  export type RoomScalarWhereInput = {
    AND?: Enumerable<RoomScalarWhereInput>
    OR?: Enumerable<RoomScalarWhereInput>
    NOT?: Enumerable<RoomScalarWhereInput>
    roomId?: StringFilter | string
    roomType?: EnumRoomTypeFilter | RoomType
    roomDisplayName?: StringNullableFilter | string | null
    roomAvatar?: StringNullableFilter | string | null
  }

  export type UserMessageUpsertWithWhereUniqueWithoutUserInput = {
    where: UserMessageWhereUniqueInput
    update: XOR<UserMessageUpdateWithoutUserInput, UserMessageUncheckedUpdateWithoutUserInput>
    create: XOR<UserMessageCreateWithoutUserInput, UserMessageUncheckedCreateWithoutUserInput>
  }

  export type UserMessageUpdateWithWhereUniqueWithoutUserInput = {
    where: UserMessageWhereUniqueInput
    data: XOR<UserMessageUpdateWithoutUserInput, UserMessageUncheckedUpdateWithoutUserInput>
  }

  export type UserMessageUpdateManyWithWhereWithoutUserInput = {
    where: UserMessageScalarWhereInput
    data: XOR<UserMessageUpdateManyMutationInput, UserMessageUncheckedUpdateManyWithoutUserMessageInput>
  }

  export type UserMessageScalarWhereInput = {
    AND?: Enumerable<UserMessageScalarWhereInput>
    OR?: Enumerable<UserMessageScalarWhereInput>
    NOT?: Enumerable<UserMessageScalarWhereInput>
    username?: StringFilter | string
    roomId?: StringFilter | string
    isHidden?: BoolFilter | boolean
    isNotificationMuted?: BoolFilter | boolean
    isMarkedFavourite?: BoolFilter | boolean
    isPinned?: BoolFilter | boolean
  }

  export type MessageCreateWithoutRoomInput = {
    key?: string
    content: string
    createdAt?: Date | string
    editedAt?: Date | string | null
    contentType: MessageContentType
    sender: UserCreateNestedOneWithoutMessageInput
  }

  export type MessageUncheckedCreateWithoutRoomInput = {
    key?: string
    senderUsername: string
    content: string
    createdAt?: Date | string
    editedAt?: Date | string | null
    contentType: MessageContentType
  }

  export type MessageCreateOrConnectWithoutRoomInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutRoomInput, MessageUncheckedCreateWithoutRoomInput>
  }

  export type MessageCreateManyRoomInputEnvelope = {
    data: Enumerable<MessageCreateManyRoomInput>
    skipDuplicates?: boolean
  }

  export type UserRoomCreateWithoutRoomInput = {
    joinedAt?: Date | string
    isAdmin?: boolean
    isBlocked?: boolean
    lastReadMessage?: string | null
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
    user: UserCreateNestedOneWithoutUserRoomInput
  }

  export type UserRoomUncheckedCreateWithoutRoomInput = {
    username: string
    joinedAt?: Date | string
    isAdmin?: boolean
    isBlocked?: boolean
    lastReadMessage?: string | null
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type UserRoomCreateOrConnectWithoutRoomInput = {
    where: UserRoomWhereUniqueInput
    create: XOR<UserRoomCreateWithoutRoomInput, UserRoomUncheckedCreateWithoutRoomInput>
  }

  export type UserRoomCreateManyRoomInputEnvelope = {
    data: Enumerable<UserRoomCreateManyRoomInput>
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutRoomsInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
    message?: MessageCreateNestedManyWithoutSenderInput
    userRoom?: UserRoomCreateNestedManyWithoutUserInput
    UserMessage?: UserMessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRoomsInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
    message?: MessageUncheckedCreateNestedManyWithoutSenderInput
    userRoom?: UserRoomUncheckedCreateNestedManyWithoutUserInput
    UserMessage?: UserMessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRoomsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRoomsInput, UserUncheckedCreateWithoutRoomsInput>
  }

  export type UserMessageCreateWithoutRoomInput = {
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
    user: UserCreateNestedOneWithoutUserMessageInput
  }

  export type UserMessageUncheckedCreateWithoutRoomInput = {
    username: string
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type UserMessageCreateOrConnectWithoutRoomInput = {
    where: UserMessageWhereUniqueInput
    create: XOR<UserMessageCreateWithoutRoomInput, UserMessageUncheckedCreateWithoutRoomInput>
  }

  export type UserMessageCreateManyRoomInputEnvelope = {
    data: Enumerable<UserMessageCreateManyRoomInput>
    skipDuplicates?: boolean
  }

  export type MessageUpsertWithWhereUniqueWithoutRoomInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutRoomInput, MessageUncheckedUpdateWithoutRoomInput>
    create: XOR<MessageCreateWithoutRoomInput, MessageUncheckedCreateWithoutRoomInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutRoomInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutRoomInput, MessageUncheckedUpdateWithoutRoomInput>
  }

  export type MessageUpdateManyWithWhereWithoutRoomInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutMessageInput>
  }

  export type UserRoomUpsertWithWhereUniqueWithoutRoomInput = {
    where: UserRoomWhereUniqueInput
    update: XOR<UserRoomUpdateWithoutRoomInput, UserRoomUncheckedUpdateWithoutRoomInput>
    create: XOR<UserRoomCreateWithoutRoomInput, UserRoomUncheckedCreateWithoutRoomInput>
  }

  export type UserRoomUpdateWithWhereUniqueWithoutRoomInput = {
    where: UserRoomWhereUniqueInput
    data: XOR<UserRoomUpdateWithoutRoomInput, UserRoomUncheckedUpdateWithoutRoomInput>
  }

  export type UserRoomUpdateManyWithWhereWithoutRoomInput = {
    where: UserRoomScalarWhereInput
    data: XOR<UserRoomUpdateManyMutationInput, UserRoomUncheckedUpdateManyWithoutUserRoomInput>
  }

  export type UserUpsertWithWhereUniqueWithoutRoomsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutRoomsInput, UserUncheckedUpdateWithoutRoomsInput>
    create: XOR<UserCreateWithoutRoomsInput, UserUncheckedCreateWithoutRoomsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutRoomsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutRoomsInput, UserUncheckedUpdateWithoutRoomsInput>
  }

  export type UserUpdateManyWithWhereWithoutRoomsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutUserInput>
  }

  export type UserScalarWhereInput = {
    AND?: Enumerable<UserScalarWhereInput>
    OR?: Enumerable<UserScalarWhereInput>
    NOT?: Enumerable<UserScalarWhereInput>
    userId?: StringFilter | string
    username?: StringFilter | string
    createTime?: DateTimeFilter | Date | string
    passwordHash?: StringFilter | string
    displayName?: StringFilter | string
    avatarPath?: StringNullableFilter | string | null
    status?: EnumUserStatusFilter | UserStatus
  }

  export type UserMessageUpsertWithWhereUniqueWithoutRoomInput = {
    where: UserMessageWhereUniqueInput
    update: XOR<UserMessageUpdateWithoutRoomInput, UserMessageUncheckedUpdateWithoutRoomInput>
    create: XOR<UserMessageCreateWithoutRoomInput, UserMessageUncheckedCreateWithoutRoomInput>
  }

  export type UserMessageUpdateWithWhereUniqueWithoutRoomInput = {
    where: UserMessageWhereUniqueInput
    data: XOR<UserMessageUpdateWithoutRoomInput, UserMessageUncheckedUpdateWithoutRoomInput>
  }

  export type UserMessageUpdateManyWithWhereWithoutRoomInput = {
    where: UserMessageScalarWhereInput
    data: XOR<UserMessageUpdateManyMutationInput, UserMessageUncheckedUpdateManyWithoutUserMessageInput>
  }

  export type UserCreateWithoutUserRoomInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
    message?: MessageCreateNestedManyWithoutSenderInput
    rooms?: RoomCreateNestedManyWithoutUserInput
    UserMessage?: UserMessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserRoomInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
    message?: MessageUncheckedCreateNestedManyWithoutSenderInput
    rooms?: RoomUncheckedCreateNestedManyWithoutUserInput
    UserMessage?: UserMessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserRoomInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserRoomInput, UserUncheckedCreateWithoutUserRoomInput>
  }

  export type RoomCreateWithoutUserRoomInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
    message?: MessageCreateNestedManyWithoutRoomInput
    user?: UserCreateNestedManyWithoutRoomsInput
    UserMessage?: UserMessageCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutUserRoomInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
    message?: MessageUncheckedCreateNestedManyWithoutRoomInput
    user?: UserUncheckedCreateNestedManyWithoutRoomsInput
    UserMessage?: UserMessageUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutUserRoomInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutUserRoomInput, RoomUncheckedCreateWithoutUserRoomInput>
  }

  export type UserUpsertWithoutUserRoomInput = {
    update: XOR<UserUpdateWithoutUserRoomInput, UserUncheckedUpdateWithoutUserRoomInput>
    create: XOR<UserCreateWithoutUserRoomInput, UserUncheckedCreateWithoutUserRoomInput>
  }

  export type UserUpdateWithoutUserRoomInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
    message?: MessageUpdateManyWithoutSenderNestedInput
    rooms?: RoomUpdateManyWithoutUserNestedInput
    UserMessage?: UserMessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserRoomInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
    message?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    rooms?: RoomUncheckedUpdateManyWithoutUserNestedInput
    UserMessage?: UserMessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RoomUpsertWithoutUserRoomInput = {
    update: XOR<RoomUpdateWithoutUserRoomInput, RoomUncheckedUpdateWithoutUserRoomInput>
    create: XOR<RoomCreateWithoutUserRoomInput, RoomUncheckedCreateWithoutUserRoomInput>
  }

  export type RoomUpdateWithoutUserRoomInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    message?: MessageUpdateManyWithoutRoomNestedInput
    user?: UserUpdateManyWithoutRoomsNestedInput
    UserMessage?: UserMessageUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutUserRoomInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    message?: MessageUncheckedUpdateManyWithoutRoomNestedInput
    user?: UserUncheckedUpdateManyWithoutRoomsNestedInput
    UserMessage?: UserMessageUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type UserCreateWithoutMessageInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
    userRoom?: UserRoomCreateNestedManyWithoutUserInput
    rooms?: RoomCreateNestedManyWithoutUserInput
    UserMessage?: UserMessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMessageInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
    userRoom?: UserRoomUncheckedCreateNestedManyWithoutUserInput
    rooms?: RoomUncheckedCreateNestedManyWithoutUserInput
    UserMessage?: UserMessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMessageInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMessageInput, UserUncheckedCreateWithoutMessageInput>
  }

  export type RoomCreateWithoutMessageInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
    userRoom?: UserRoomCreateNestedManyWithoutRoomInput
    user?: UserCreateNestedManyWithoutRoomsInput
    UserMessage?: UserMessageCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutMessageInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
    userRoom?: UserRoomUncheckedCreateNestedManyWithoutRoomInput
    user?: UserUncheckedCreateNestedManyWithoutRoomsInput
    UserMessage?: UserMessageUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutMessageInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutMessageInput, RoomUncheckedCreateWithoutMessageInput>
  }

  export type UserUpsertWithoutMessageInput = {
    update: XOR<UserUpdateWithoutMessageInput, UserUncheckedUpdateWithoutMessageInput>
    create: XOR<UserCreateWithoutMessageInput, UserUncheckedCreateWithoutMessageInput>
  }

  export type UserUpdateWithoutMessageInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
    userRoom?: UserRoomUpdateManyWithoutUserNestedInput
    rooms?: RoomUpdateManyWithoutUserNestedInput
    UserMessage?: UserMessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMessageInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
    userRoom?: UserRoomUncheckedUpdateManyWithoutUserNestedInput
    rooms?: RoomUncheckedUpdateManyWithoutUserNestedInput
    UserMessage?: UserMessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RoomUpsertWithoutMessageInput = {
    update: XOR<RoomUpdateWithoutMessageInput, RoomUncheckedUpdateWithoutMessageInput>
    create: XOR<RoomCreateWithoutMessageInput, RoomUncheckedCreateWithoutMessageInput>
  }

  export type RoomUpdateWithoutMessageInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userRoom?: UserRoomUpdateManyWithoutRoomNestedInput
    user?: UserUpdateManyWithoutRoomsNestedInput
    UserMessage?: UserMessageUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutMessageInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userRoom?: UserRoomUncheckedUpdateManyWithoutRoomNestedInput
    user?: UserUncheckedUpdateManyWithoutRoomsNestedInput
    UserMessage?: UserMessageUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type UserCreateWithoutUserMessageInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
    message?: MessageCreateNestedManyWithoutSenderInput
    userRoom?: UserRoomCreateNestedManyWithoutUserInput
    rooms?: RoomCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserMessageInput = {
    userId?: string
    username: string
    createTime?: Date | string
    passwordHash: string
    displayName: string
    avatarPath?: string | null
    status?: UserStatus
    message?: MessageUncheckedCreateNestedManyWithoutSenderInput
    userRoom?: UserRoomUncheckedCreateNestedManyWithoutUserInput
    rooms?: RoomUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserMessageInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserMessageInput, UserUncheckedCreateWithoutUserMessageInput>
  }

  export type RoomCreateWithoutUserMessageInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
    message?: MessageCreateNestedManyWithoutRoomInput
    userRoom?: UserRoomCreateNestedManyWithoutRoomInput
    user?: UserCreateNestedManyWithoutRoomsInput
  }

  export type RoomUncheckedCreateWithoutUserMessageInput = {
    roomId?: string
    roomType: RoomType
    roomDisplayName?: string | null
    roomAvatar?: string | null
    message?: MessageUncheckedCreateNestedManyWithoutRoomInput
    userRoom?: UserRoomUncheckedCreateNestedManyWithoutRoomInput
    user?: UserUncheckedCreateNestedManyWithoutRoomsInput
  }

  export type RoomCreateOrConnectWithoutUserMessageInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutUserMessageInput, RoomUncheckedCreateWithoutUserMessageInput>
  }

  export type UserUpsertWithoutUserMessageInput = {
    update: XOR<UserUpdateWithoutUserMessageInput, UserUncheckedUpdateWithoutUserMessageInput>
    create: XOR<UserCreateWithoutUserMessageInput, UserUncheckedCreateWithoutUserMessageInput>
  }

  export type UserUpdateWithoutUserMessageInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
    message?: MessageUpdateManyWithoutSenderNestedInput
    userRoom?: UserRoomUpdateManyWithoutUserNestedInput
    rooms?: RoomUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserMessageInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
    message?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    userRoom?: UserRoomUncheckedUpdateManyWithoutUserNestedInput
    rooms?: RoomUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RoomUpsertWithoutUserMessageInput = {
    update: XOR<RoomUpdateWithoutUserMessageInput, RoomUncheckedUpdateWithoutUserMessageInput>
    create: XOR<RoomCreateWithoutUserMessageInput, RoomUncheckedCreateWithoutUserMessageInput>
  }

  export type RoomUpdateWithoutUserMessageInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    message?: MessageUpdateManyWithoutRoomNestedInput
    userRoom?: UserRoomUpdateManyWithoutRoomNestedInput
    user?: UserUpdateManyWithoutRoomsNestedInput
  }

  export type RoomUncheckedUpdateWithoutUserMessageInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    message?: MessageUncheckedUpdateManyWithoutRoomNestedInput
    userRoom?: UserRoomUncheckedUpdateManyWithoutRoomNestedInput
    user?: UserUncheckedUpdateManyWithoutRoomsNestedInput
  }

  export type MessageCreateManySenderInput = {
    key?: string
    roomId: string
    content: string
    createdAt?: Date | string
    editedAt?: Date | string | null
    contentType: MessageContentType
  }

  export type UserRoomCreateManyUserInput = {
    roomId: string
    joinedAt?: Date | string
    isAdmin?: boolean
    isBlocked?: boolean
    lastReadMessage?: string | null
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type UserMessageCreateManyUserInput = {
    roomId: string
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type MessageUpdateWithoutSenderInput = {
    key?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentType?: EnumMessageContentTypeFieldUpdateOperationsInput | MessageContentType
    room?: RoomUpdateOneRequiredWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutSenderInput = {
    key?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentType?: EnumMessageContentTypeFieldUpdateOperationsInput | MessageContentType
  }

  export type MessageUncheckedUpdateManyWithoutMessageInput = {
    key?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentType?: EnumMessageContentTypeFieldUpdateOperationsInput | MessageContentType
  }

  export type UserRoomUpdateWithoutUserInput = {
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    lastReadMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
    room?: RoomUpdateOneRequiredWithoutUserRoomNestedInput
  }

  export type UserRoomUncheckedUpdateWithoutUserInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    lastReadMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserRoomUncheckedUpdateManyWithoutUserRoomInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    lastReadMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RoomUpdateWithoutUserInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    message?: MessageUpdateManyWithoutRoomNestedInput
    userRoom?: UserRoomUpdateManyWithoutRoomNestedInput
    UserMessage?: UserMessageUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutUserInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    message?: MessageUncheckedUpdateManyWithoutRoomNestedInput
    userRoom?: UserRoomUncheckedUpdateManyWithoutRoomNestedInput
    UserMessage?: UserMessageUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateManyWithoutRoomsInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    roomType?: EnumRoomTypeFieldUpdateOperationsInput | RoomType
    roomDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    roomAvatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserMessageUpdateWithoutUserInput = {
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
    room?: RoomUpdateOneRequiredWithoutUserMessageNestedInput
  }

  export type UserMessageUncheckedUpdateWithoutUserInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserMessageUncheckedUpdateManyWithoutUserMessageInput = {
    roomId?: StringFieldUpdateOperationsInput | string
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageCreateManyRoomInput = {
    key?: string
    senderUsername: string
    content: string
    createdAt?: Date | string
    editedAt?: Date | string | null
    contentType: MessageContentType
  }

  export type UserRoomCreateManyRoomInput = {
    username: string
    joinedAt?: Date | string
    isAdmin?: boolean
    isBlocked?: boolean
    lastReadMessage?: string | null
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type UserMessageCreateManyRoomInput = {
    username: string
    isHidden?: boolean
    isNotificationMuted?: boolean
    isMarkedFavourite?: boolean
    isPinned?: boolean
  }

  export type MessageUpdateWithoutRoomInput = {
    key?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentType?: EnumMessageContentTypeFieldUpdateOperationsInput | MessageContentType
    sender?: UserUpdateOneRequiredWithoutMessageNestedInput
  }

  export type MessageUncheckedUpdateWithoutRoomInput = {
    key?: StringFieldUpdateOperationsInput | string
    senderUsername?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contentType?: EnumMessageContentTypeFieldUpdateOperationsInput | MessageContentType
  }

  export type UserRoomUpdateWithoutRoomInput = {
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    lastReadMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutUserRoomNestedInput
  }

  export type UserRoomUncheckedUpdateWithoutRoomInput = {
    username?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isBlocked?: BoolFieldUpdateOperationsInput | boolean
    lastReadMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUpdateWithoutRoomsInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
    message?: MessageUpdateManyWithoutSenderNestedInput
    userRoom?: UserRoomUpdateManyWithoutUserNestedInput
    UserMessage?: UserMessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRoomsInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
    message?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    userRoom?: UserRoomUncheckedUpdateManyWithoutUserNestedInput
    UserMessage?: UserMessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutUserInput = {
    userId?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    avatarPath?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | UserStatus
  }

  export type UserMessageUpdateWithoutRoomInput = {
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutUserMessageNestedInput
  }

  export type UserMessageUncheckedUpdateWithoutRoomInput = {
    username?: StringFieldUpdateOperationsInput | string
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    isNotificationMuted?: BoolFieldUpdateOperationsInput | boolean
    isMarkedFavourite?: BoolFieldUpdateOperationsInput | boolean
    isPinned?: BoolFieldUpdateOperationsInput | boolean
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