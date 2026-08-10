export type TPartialRecord<K extends keyof any, T> = Partial<Record<K, T>>
export type TRequired<T> = Exclude<T, undefined | null>
export type TUndefined<T> = T | undefined
export type TNull<T> = T | null
