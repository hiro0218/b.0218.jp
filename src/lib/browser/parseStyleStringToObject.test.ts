import { parseStyleStringToObject } from './parseStyleStringToObject';

/**
 * parseStyleStringToObject関数のテスト
 * 文字列形式のCSSスタイルをReactのCSSPropertiesオブジェクトに変換する機能をテストする
 */
describe('parseStyleStringToObject', () => {
  /**
   * 空の文字列が渡された場合は空のオブジェクトを返すことを確認
   */
  it('空の文字列が渡された場合は空のオブジェクトを返す', () => {
    expect(parseStyleStringToObject('')).toEqual({});
  });

  /**
   * undefinedが渡された場合は空のオブジェクトを返すことを確認
   */
  it('undefinedが渡された場合は空のオブジェクトを返す', () => {
    expect(parseStyleStringToObject(undefined as unknown as string)).toEqual({});
  });

  /**
   * 単一のスタイルプロパティを持つ文字列を正しく変換することを確認
   */
  it('単一のスタイルプロパティを持つ文字列を正しく変換する', () => {
    const input = 'width: 100px;';
    const expectedOutput = { width: '100px' };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  /**
   * 複数のスタイルプロパティを持つ文字列を正しく変換することを確認
   */
  it('複数のスタイルプロパティを持つ文字列を正しく変換する', () => {
    const input = 'width: 100px; height: 200px; color: red;';
    const expectedOutput = {
      width: '100px',
      height: '200px',
      color: 'red',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  /**
   * ケバブケースのプロパティをキャメルケースに変換することを確認
   */
  it('ケバブケースのプロパティをキャメルケースに変換する', () => {
    const input = 'background-color: blue; font-size: 16px; margin-top: 10px;';
    const expectedOutput = {
      backgroundColor: 'blue',
      fontSize: '16px',
      marginTop: '10px',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  /**
   * 不正な形式のセグメントがある場合、それを無視することを確認
   */
  it('不正な形式のセグメントがある場合、それを無視する', () => {
    const input = 'width: 100px; invalid; height: 200px;';
    const expectedOutput = {
      width: '100px',
      height: '200px',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  /**
   * 末尾にセミコロンがない場合も正しく変換することを確認
   */
  it('末尾にセミコロンがない場合も正しく変換する', () => {
    const input = 'width: 100px; height: 200px';
    const expectedOutput = {
      width: '100px',
      height: '200px',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  /**
   * 余分なスペースがある場合も正しく変換することを確認
   */
  it('余分なスペースがある場合も正しく変換する', () => {
    const input = '  width:  100px ;  height: 200px  ; ';
    const expectedOutput = {
      width: '100px',
      height: '200px',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  /**
   * 値に特殊文字が含まれる場合も正しく変換することを確認
   */
  it('値に特殊文字が含まれる場合も正しく変換する', () => {
    const input = 'background: url("https://example.com/image.jpg"); content: "Hello, world!";';
    const expectedOutput = {
      background: 'url("https://example.com/image.jpg")',
      content: '"Hello, world!"',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  /**
   * 連続したセミコロンがある場合も正しく変換することを確認
   */
  it('連続したセミコロンがある場合も正しく変換する', () => {
    const input = 'width: 100px;; height: 200px;;;color: red;';
    const expectedOutput = {
      width: '100px',
      height: '200px',
      color: 'red',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  /**
   * CSSプロパティの値にコロンが含まれる場合も正しく変換することを確認
   * （例：filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))）
   */
  it('CSSプロパティの値にコロンが含まれる場合も正しく変換する', () => {
    const input = 'filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5)); color: red;';
    const expectedOutput = {
      filter: 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))',
      color: 'red',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  /**
   * nullが渡された場合は空のオブジェクトを返すことを確認
   */
  it('nullが渡された場合は空のオブジェクトを返す', () => {
    expect(parseStyleStringToObject(null as unknown as string)).toEqual({});
  });

  /**
   * CSSカスタムプロパティ（CSS変数）を正しく変換することを確認
   */
  it('CSSカスタムプロパティ（CSS変数）を正しく変換する', () => {
    const input = '--primary-color: #3366ff; --border-radius: 4px; color: var(--primary-color);';
    const expectedOutput = {
      '--primary-color': '#3366ff',
      '--border-radius': '4px',
      color: 'var(--primary-color)',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });
});
