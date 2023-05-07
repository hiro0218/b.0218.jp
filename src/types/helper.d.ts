type UnpackedArray<T> = T extends Array<infer U> ? U : never;
