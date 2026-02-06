import { parseStyleStringToObject } from './parseStyleStringToObject';

/**
 * parseStyleStringToObject関数のテスト
 * 文字列形式のCSSスタイルをReactのCSSPropertiesオブジェクトに変換する機能をテストする
 */
describe('parseStyleStringToObject', () => {
  it('空の文字列が渡された場合は空のオブジェクトを返す', () => {
    expect(parseStyleStringToObject('')).toEqual({});
  });

  it('undefinedが渡された場合は空のオブジェクトを返す', () => {
    expect(parseStyleStringToObject(undefined as unknown as string)).toEqual({});
  });

  it('単一のスタイルプロパティを持つ文字列を正しく変換する', () => {
    const input = 'width: 100px;';
    const expectedOutput = { width: '100px' };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  it('複数のスタイルプロパティを持つ文字列を正しく変換する', () => {
    const input = 'width: 100px; height: 200px; color: red;';
    const expectedOutput = {
      width: '100px',
      height: '200px',
      color: 'red',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  it('ケバブケースのプロパティをキャメルケースに変換する', () => {
    const input = 'background-color: blue; font-size: 16px; margin-top: 10px;';
    const expectedOutput = {
      backgroundColor: 'blue',
      fontSize: '16px',
      marginTop: '10px',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  it('不正な形式のセグメントがある場合、それを無視する', () => {
    const input = 'width: 100px; invalid; height: 200px;';
    const expectedOutput = {
      width: '100px',
      height: '200px',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  it('末尾にセミコロンがない場合も正しく変換する', () => {
    const input = 'width: 100px; height: 200px';
    const expectedOutput = {
      width: '100px',
      height: '200px',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  it('余分なスペースがある場合も正しく変換する', () => {
    const input = '  width:  100px ;  height: 200px  ; ';
    const expectedOutput = {
      width: '100px',
      height: '200px',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  it('値に特殊文字が含まれる場合も正しく変換する', () => {
    const input = 'background: url("https://example.com/image.jpg"); content: "Hello, world!";';
    const expectedOutput = {
      background: 'url("https://example.com/image.jpg")',
      content: '"Hello, world!"',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

  it('CSSプロパティの値にコロンが含まれる場合も正しく変換する', () => {
    const input = 'filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5)); color: red;';
    const expectedOutput = {
      filter: 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))',
      color: 'red',
    };
    expect(parseStyleStringToObject(input)).toEqual(expectedOutput);
  });

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
