export type EagerSourceConfig<T> = {
  data: unknown;
  validate: (value: unknown) => value is T;
  label: string;
};

export type EagerSource<T> = {
  get(): T;
};

/**
 * bundle import された JSON を 1 度だけ検証してキャッシュする。
 * 検証失敗時は throw し、SSG ビルドを止めて build artifact の不整合を表面化させる。
 */
export function createEagerSource<T>(config: EagerSourceConfig<T>): EagerSource<T> {
  let cached: T | undefined;

  return {
    get() {
      if (cached !== undefined) return cached;

      if (!config.validate(config.data)) {
        throw new Error(`[source/${config.label}] Invalid data`);
      }

      cached = config.data;
      return cached;
    },
  };
}
