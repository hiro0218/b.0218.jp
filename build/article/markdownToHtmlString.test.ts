import { describe, expect, it } from 'vitest';
import { createMarkdownToNoteHtmlString, createMarkdownToPostHtmlString } from './markdownToHtmlString';

describe('createMarkdownToNoteHtmlString', () => {
  it('危険な HTML 要素と属性が含まれる場合、それらを取り除いた HTML を返す', async () => {
    const markdownToHtml = createMarkdownToNoteHtmlString();
    const html = await markdownToHtml(
      '<script>alert(1)</script><img src="/safe.png" onerror="alert(1)"><a href="javascript:alert(1)">x</a>',
    );

    expect(html).not.toContain('<script');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('javascript:');
    expect(html).toContain('<img src="/safe.png">');
    expect(html).toContain('<a>x</a>');
  });

  it('protocol-relative URL が href に含まれる場合、それを除去した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToNoteHtmlString();
    const html = await markdownToHtml('<a href="//evil.example/path">x</a>');

    expect(html).not.toContain('//evil.example');
    expect(html).toContain('<a>x</a>');
  });

  it('target="_blank" の a 要素が含まれる場合、rel="noreferrer" を付与した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToNoteHtmlString();
    const html = await markdownToHtml('<a href="/internal" target="_blank">x</a>');

    expect(html).toContain('href="/internal"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
  });

  it('checkbox 以外の input が含まれる場合、disabled な checkbox に矯正した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToNoteHtmlString();
    const html = await markdownToHtml('<input type="text" onfocus="alert(1)">');

    expect(html).not.toContain('type="text"');
    expect(html).not.toContain('onfocus');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('disabled');
  });

  it('GFM task list が含まれる場合、checkbox の input は残した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToNoteHtmlString();
    const html = await markdownToHtml('- [x] done\n- [ ] todo');

    expect(html).toContain('<input');
    expect(html).toContain('type="checkbox"');
  });

  it('HTML 標準外の独自属性が含まれる場合、それを除去した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToNoteHtmlString();
    const html = await markdownToHtml('<span foo="leak" data-keep="ok">x</span>');

    expect(html).not.toContain('foo=');
    expect(html).not.toContain('leak');
    // data-* 属性は CodePen / Twitter などの embed が依存するため許可する
    expect(html).toContain('data-keep="ok"');
  });

  it('iframe で https の src を持つ場合、それを保持した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToNoteHtmlString();
    const html = await markdownToHtml(
      '<iframe src="https://www.youtube.com/embed/abc" allow="autoplay" allowfullscreen></iframe>',
    );

    expect(html).toContain('<iframe');
    expect(html).toContain('src="https://www.youtube.com/embed/abc"');
    expect(html).toContain('allow="autoplay"');
  });

  it('iframe で protocol-relative の src を持つ場合、それを保持した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToNoteHtmlString();
    const html = await markdownToHtml('<iframe src="//codepen.io/user/embed/abc"></iframe>');

    expect(html).toContain('<iframe');
    expect(html).toContain('src="//codepen.io/user/embed/abc"');
  });

  it('iframe で javascript: の src を持つ場合、src を除去した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToNoteHtmlString();
    const html = await markdownToHtml('<iframe src="javascript:alert(1)"></iframe>');

    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('alert(1)');
  });
});

describe('createMarkdownToPostHtmlString', () => {
  it('生 HTML に script タグが含まれる場合、それを除去した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToPostHtmlString();
    const html = await markdownToHtml('テキスト<script>alert("xss-marker")</script>');

    expect(html).not.toContain('xss-marker');
  });

  it('img に onerror 属性が含まれる場合、それを除去した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToPostHtmlString();
    const html = await markdownToHtml('<img src="/safe.png" onerror="leakMarker()">');

    expect(html).toContain('src="/safe.png"');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('leakMarker');
  });

  it('a に javascript: URL が含まれる場合、それを除去した HTML を返す', async () => {
    const markdownToHtml = createMarkdownToPostHtmlString();
    const html = await markdownToHtml('<a href="javascript:badMarker()">クリック</a>');

    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('badMarker');
    expect(html).toContain('クリック');
  });

  it('コードブロックが含まれる場合、Shiki でハイライトした HTML を返す', async () => {
    const markdownToHtml = createMarkdownToPostHtmlString();
    const html = await markdownToHtml('```js\nconst x = 1;\n```');

    expect(html).toContain('data-language="js"');
    expect(html).toContain('<pre');
    expect(html).toContain('<code');
  });

  it('Shiki 未対応の言語IDが含まれる場合、プレーンテキストのコードブロックを返す', async () => {
    const markdownToHtml = createMarkdownToPostHtmlString();
    const html = await markdownToHtml('```jsp\n<% out.println("ok"); %>\n```');

    expect(html).toContain('<pre');
    expect(html).toContain('<code');
    expect(html).toContain('out.println');
    expect(html).not.toContain('data-language="jsp"');
  });

  it('段落内に img が含まれる場合、figure でラップした HTML を返す', async () => {
    const markdownToHtml = createMarkdownToPostHtmlString();
    const html = await markdownToHtml('![alt text](/image.png)');

    expect(html).toContain('<figure');
    expect(html).toContain('<img');
    expect(html).toContain('src="/image.png"');
  });

  it('GFM Alert 記法が含まれる場合、class と data 属性と JSON 埋め込み script を返す', async () => {
    const markdownToHtml = createMarkdownToPostHtmlString();
    const html = await markdownToHtml('> [!NOTE]\n> 注意事項テキスト');

    expect(html).toContain('class="gfm-alert"');
    expect(html).toContain('data-alert-type="note"');
    expect(html).toContain('type="application/json"');
    expect(html).toContain('注意事項テキスト');
  });
});
