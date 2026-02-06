import type { IpadicFeatures, Tokenizer } from 'kuromoji';
import { describe, expect, it, vi } from 'vitest';
import { tokenizeText } from './tokenizer';

interface TokenOverrides {
  pos?: string;
  posDetail1?: string;
  basicForm?: string;
  surfaceForm?: string;
}

/**
 * IpadicFeatures のモックトークンを生成する
 */
function createToken(overrides: TokenOverrides = {}): IpadicFeatures {
  const token = {} as IpadicFeatures;
  token['word_id'] = 0;
  token['word_type'] = 'KNOWN';
  token['word_position'] = 0;
  token['surface_form'] = overrides.surfaceForm ?? '';
  token.pos = overrides.pos ?? '名詞';
  token['pos_detail_1'] = overrides.posDetail1 ?? '一般';
  token['pos_detail_2'] = '*';
  token['pos_detail_3'] = '*';
  token['conjugated_type'] = '*';
  token['conjugated_form'] = '*';
  token['basic_form'] = overrides.basicForm ?? '';
  token.reading = '';
  token.pronunciation = '';
  return token;
}

function createMockTokenizer(tokens: IpadicFeatures[]): Tokenizer<IpadicFeatures> {
  return { tokenize: vi.fn(() => tokens) } as unknown as Tokenizer<IpadicFeatures>;
}

describe('tokenizeText', () => {
  it('名詞・動詞・形容詞・副詞の基本形を返すこと', async () => {
    const tokens = [
      createToken({ pos: '名詞', posDetail1: '一般', basicForm: 'プログラミング', surfaceForm: 'プログラミング' }),
      createToken({ pos: '動詞', posDetail1: '自立', basicForm: '書く', surfaceForm: '書い' }),
      createToken({ pos: '形容詞', posDetail1: '自立', basicForm: '美しい', surfaceForm: '美しく' }),
      createToken({ pos: '助詞', posDetail1: '格助詞', basicForm: 'を', surfaceForm: 'を' }),
    ];

    const result = await tokenizeText('プログラミングを書い美しく', createMockTokenizer(tokens));

    expect(result).toEqual(['プログラミング', '書く', '美しい']);
  });

  it('空文字列の場合、空配列を返すこと', async () => {
    const mockTokenizer = createMockTokenizer([]);

    const result = await tokenizeText('', mockTokenizer);

    expect(result).toEqual([]);
  });

  it('数詞・接尾語・1文字・数字のみのトークンを除外すること', async () => {
    const tokens = [
      createToken({ pos: '名詞', posDetail1: '数', basicForm: '100', surfaceForm: '100' }),
      createToken({ pos: '名詞', posDetail1: '接尾', basicForm: '個', surfaceForm: '個' }),
      createToken({ pos: '名詞', posDetail1: '一般', basicForm: 'あ', surfaceForm: 'あ' }),
      createToken({ pos: '名詞', posDetail1: '一般', basicForm: '42', surfaceForm: '42' }),
      createToken({ pos: '名詞', posDetail1: '一般', basicForm: 'テスト', surfaceForm: 'テスト' }),
    ];

    const result = await tokenizeText('100個あ42テスト', createMockTokenizer(tokens));

    expect(result).toEqual(['テスト']);
  });

  it('トークナイザがエラーを投げた場合、例外を再スローすること', async () => {
    const mockTokenizer = {
      tokenize: vi.fn(() => {
        throw new Error('tokenize failed');
      }),
    } as unknown as Tokenizer<IpadicFeatures>;
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(tokenizeText('test', mockTokenizer)).rejects.toThrow('tokenize failed');

    consoleSpy.mockRestore();
  });
});
