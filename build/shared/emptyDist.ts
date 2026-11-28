import { EMPTY_DIST, writeDist } from './dist';

// 本物の dist/ を上書きする。dist を作らない環境(CI の Unit Tests)だけで実行する
async function main() {
  for (const [name, data] of Object.entries(EMPTY_DIST)) {
    await writeDist(name as keyof typeof EMPTY_DIST, data as never);
  }
}

void main();
