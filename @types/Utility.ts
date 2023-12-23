export type Nullable<T> = { [U in keyof T]: null | T[U] }
