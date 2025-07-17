/**
 * Result型の定義 - 成功または失敗のいずれかの状態を表現する
 *
 * @template T 成功値の型
 * @template E エラー値の型
 */
export type Result<T, E> = Success<T, E> | Failure<T, E>;

/**
 * 成功状態を表すインターフェース
 */
export interface Success<T, E> {
  readonly type: 'success';
  readonly value: T;

  // メソッドチェーン用のユーティリティ
  isSuccess(): this is Success<T, E>;
  isFailure(): this is Failure<T, E>;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapError<F>(fn: (error: E) => F): Result<T, F>;
  match<U>(patterns: { success: (value: T) => U; failure: (error: E) => U }): U;
  unwrapOr(defaultValue: T): T;
  unwrap(): T;
  unwrapError(): never;
}

/**
 * 失敗状態を表すインターフェース
 */
export interface Failure<T, E> {
  readonly type: 'failure';
  readonly error: E;

  // メソッドチェーン用のユーティリティ
  isSuccess(): this is Success<T, E>;
  isFailure(): this is Failure<T, E>;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapError<F>(fn: (error: E) => F): Result<T, F>;
  match<U>(patterns: { success: (value: T) => U; failure: (error: E) => U }): U;
  unwrapOr(defaultValue: T): T;
  unwrap(): never;
  unwrapError(): E;
}

/**
 * 成功Result型のインスタンスを作成
 *
 * @param value 成功値
 * @returns 成功型のResultオブジェクト
 */
export function success<T, E>(value: T): Result<T, E> {
  return {
    type: 'success' as const,
    value,

    isSuccess(): this is Success<T, E> {
      return true;
    },

    isFailure(): this is Failure<T, E> {
      return false;
    },

    map<U>(fn: (value: T) => U): Result<U, E> {
      return success(fn(this.value));
    },

    mapError<F>(_fn: (error: E) => F): Result<T, F> {
      return success(this.value);
    },

    match<U>(patterns: { success: (value: T) => U; failure: (error: E) => U }): U {
      return patterns.success(this.value);
    },

    unwrapOr(_defaultValue: T): T {
      return this.value;
    },

    unwrap(): T {
      return this.value;
    },

    unwrapError(): never {
      throw new Error(`Cannot unwrapError on a Success containing ${String(this.value)}`);
    },
  };
}

/**
 * 失敗Result型のインスタンスを作成
 *
 * @param error エラー値
 * @returns 失敗型のResultオブジェクト
 */
export function failure<T, E>(error: E): Result<T, E> {
  return {
    type: 'failure' as const,
    error,

    isSuccess(): this is Success<T, E> {
      return false;
    },

    isFailure(): this is Failure<T, E> {
      return true;
    },

    map<U>(_fn: (value: T) => U): Result<U, E> {
      return failure(this.error);
    },

    mapError<F>(fn: (error: E) => F): Result<T, F> {
      return failure(fn(this.error));
    },

    match<U>(patterns: { success: (value: T) => U; failure: (error: E) => U }): U {
      return patterns.failure(this.error);
    },

    unwrapOr(defaultValue: T): T {
      return defaultValue;
    },

    unwrap(): never {
      throw new Error(`Cannot unwrap a Failure containing ${String(this.error)}`);
    },

    unwrapError(): E {
      return this.error;
    },
  };
}

/**
 * エラー種別を定義する列挙型
 */
export enum ErrorKind {
  // 入力エラー
  // biome-ignore lint/style/useNamingConvention: enum型の命名規則を維持
  INVALID_INPUT = 'INVALID_INPUT',

  // 処理エラー
  // biome-ignore lint/style/useNamingConvention: enum型の命名規則を維持
  PROCESSING_ERROR = 'PROCESSING_ERROR',

  // 初期化エラー
  // biome-ignore lint/style/useNamingConvention: enum型の命名規則を維持
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',
}

/**
 * 構造化されたエラー情報
 */
export interface ErrorInfo {
  kind: ErrorKind;
  message: string;
  cause?: unknown;
}

/**
 * 構造化されたエラー情報を作成するファクトリ関数
 */
export function createError(kind: ErrorKind, message: string, cause?: unknown): ErrorInfo {
  return { kind, message, cause };
}

/**
 * try/catchブロックをResult型にラップするユーティリティ関数
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMapper: (error: unknown) => ErrorInfo = defaultErrorMapper,
): Promise<Result<T, ErrorInfo>> {
  try {
    const value = await fn();
    return success(value);
  } catch (error) {
    return failure(errorMapper(error));
  }
}

/**
 * 未知のエラーをErrorInfoに変換するデフォルトのマッパー
 */
function defaultErrorMapper(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    return createError(ErrorKind.PROCESSING_ERROR, error.message, error);
  }

  return createError(ErrorKind.PROCESSING_ERROR, String(error), error);
}
