import type { IpadicFeatures, Tokenizer } from 'kuromoji';
import { describe, expect, it, vi } from 'vitest';
import { isMeaningfulToken, tokenizeMeaningfulText } from './morphology';

interface TokenOverrides {
  pos?: string;
  posDetail1?: string;
  basicForm?: string;
  surfaceForm?: string;
}

function createToken(overrides: TokenOverrides = {}): IpadicFeatures {
  const token = {} as IpadicFeatures;
  token.word_id = 0;
  token.word_type = 'KNOWN';
  token.word_position = 0;
  token.surface_form = overrides.surfaceForm ?? '';
  token.pos = overrides.pos ?? '名詞';
  token.pos_detail_1 = overrides.posDetail1 ?? '一般';
  token.pos_detail_2 = '*';
  token.pos_detail_3 = '*';
  token.conjugated_type = '*';
  token.conjugated_form = '*';
  token.basic_form = overrides.basicForm ?? '';
  token.reading = '';
  token.pronunciation = '';
  return token;
}

function createMockTokenizer(tokens: IpadicFeatures[]): Tokenizer<IpadicFeatures> {
  return { tokenize: vi.fn(() => tokens) } as unknown as Tokenizer<IpadicFeatures>;
}

describe('isMeaningfulToken', () => {
  it('名詞・動詞・形容詞・副詞を意味のあるトークンとして扱う', () => {
    expect(isMeaningfulToken(createToken({ pos: '名詞', basicForm: 'プログラミング' }))).toBe(true);
    expect(isMeaningfulToken(createToken({ pos: '動詞', basicForm: '書く' }))).toBe(true);
    expect(isMeaningfulToken(createToken({ pos: '形容詞', basicForm: '美しい' }))).toBe(true);
    expect(isMeaningfulToken(createToken({ pos: '副詞', basicForm: 'かなり' }))).toBe(true);
  });

  it('対象外の品詞・数詞・接尾語・stop word・1文字・数字のみを除外する', () => {
    expect(isMeaningfulToken(createToken({ pos: '助詞', posDetail1: '格助詞', basicForm: 'を' }))).toBe(false);
    expect(isMeaningfulToken(createToken({ pos: '名詞', posDetail1: '数', basicForm: '100' }))).toBe(false);
    expect(isMeaningfulToken(createToken({ pos: '名詞', posDetail1: '接尾', basicForm: '個' }))).toBe(false);
    expect(isMeaningfulToken(createToken({ pos: '名詞', posDetail1: '一般', basicForm: 'の' }))).toBe(false);
    expect(isMeaningfulToken(createToken({ pos: '名詞', posDetail1: '一般', basicForm: 'あ' }))).toBe(false);
    expect(isMeaningfulToken(createToken({ pos: '名詞', posDetail1: '一般', basicForm: '42' }))).toBe(false);
  });
});

describe('tokenizeMeaningfulText', () => {
  it('意味のあるトークンの基本形だけを返す', () => {
    const tokens = [
      createToken({ pos: '名詞', posDetail1: '一般', basicForm: 'プログラミング', surfaceForm: 'プログラミング' }),
      createToken({ pos: '動詞', posDetail1: '自立', basicForm: '書く', surfaceForm: '書い' }),
      createToken({ pos: '形容詞', posDetail1: '自立', basicForm: '美しい', surfaceForm: '美しく' }),
      createToken({ pos: '助詞', posDetail1: '格助詞', basicForm: 'を', surfaceForm: 'を' }),
    ];

    const result = tokenizeMeaningfulText('プログラミングを書い美しく', createMockTokenizer(tokens));

    expect(result).toEqual(['プログラミング', '書く', '美しい']);
  });

  it('空文字列の場合、空配列を返す', () => {
    const tokenizer = createMockTokenizer([]);

    expect(tokenizeMeaningfulText('', tokenizer)).toEqual([]);
  });

  it('tokenizer の例外を呼び出し側へ伝える', () => {
    const tokenizer = {
      tokenize: vi.fn(() => {
        throw new Error('tokenize failed');
      }),
    } as unknown as Tokenizer<IpadicFeatures>;

    expect(() => tokenizeMeaningfulText('test', tokenizer)).toThrow('tokenize failed');
  });
});
