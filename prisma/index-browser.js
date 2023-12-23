
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.14.1
 * Query Engine version: d9a4c5988f480fa576d43970d5a23641aa77bc9c
 */
Prisma.prismaVersion = {
  client: "4.14.1",
  engine: "d9a4c5988f480fa576d43970d5a23641aa77bc9c"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val


/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.MessageScalarFieldEnum = {
  key: 'key',
  senderUsername: 'senderUsername',
  roomId: 'roomId',
  content: 'content',
  createdAt: 'createdAt',
  editedAt: 'editedAt',
  contentType: 'contentType'
};

exports.Prisma.RoomScalarFieldEnum = {
  roomId: 'roomId',
  roomType: 'roomType',
  roomDisplayName: 'roomDisplayName',
  roomAvatar: 'roomAvatar'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sid: 'sid',
  data: 'data',
  expiresAt: 'expiresAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserMessageScalarFieldEnum = {
  username: 'username',
  roomId: 'roomId',
  isHidden: 'isHidden',
  isNotificationMuted: 'isNotificationMuted',
  isMarkedFavourite: 'isMarkedFavourite',
  isPinned: 'isPinned'
};

exports.Prisma.UserRoomScalarFieldEnum = {
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

exports.Prisma.UserScalarFieldEnum = {
  userId: 'userId',
  username: 'username',
  createTime: 'createTime',
  passwordHash: 'passwordHash',
  displayName: 'displayName',
  avatarPath: 'avatarPath',
  status: 'status'
};
exports.MessageContentType = {
  audio: 'audio',
  video: 'video',
  text: 'text',
  image: 'image',
  file: 'file'
};

exports.RoomType = {
  private: 'private',
  group: 'group'
};

exports.UserStatus = {
  available: 'available',
  dnd: 'dnd',
  hidden: 'hidden'
};

exports.Prisma.ModelName = {
  User: 'User',
  Room: 'Room',
  UserRoom: 'UserRoom',
  Message: 'Message',
  UserMessage: 'UserMessage',
  Session: 'Session'
};

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
