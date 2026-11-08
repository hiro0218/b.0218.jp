import { describe, expect, it, vi } from 'vitest';
import {
  ALERT_KINDS,
  GFM_ALERT_CLASS_NAME,
  isAlertData,
  isLinkPreviewData,
  LINK_PREVIEW_CLASS_NAME,
  parseAlertData,
  parseLinkPreviewData,
  serializeAlertData,
  serializeLinkPreviewData,
} from './embeddedContent';

describe('LINK_PREVIEW_CLASS_NAME / GFM_ALERT_CLASS_NAME', () => {
  it('build と runtime が参照する class 名を返す', () => {
    expect(LINK_PREVIEW_CLASS_NAME).toBe('link-preview');
    expect(GFM_ALERT_CLASS_NAME).toBe('gfm-alert');
  });
});

describe('serializeLinkPreviewData / isLinkPreviewData', () => {
  it('serialize した JSON を isLinkPreviewData でパースすると有効な payload と判定する', () => {
    const json = serializeLinkPreviewData({
      link: 'https://example.com',
      card: 'summary',
      thumbnail: 'https://example.com/thumb.png',
      title: 'Example',
      description: 'desc',
      domain: 'example.com',
    });

    expect(isLinkPreviewData(JSON.parse(json))).toBe(true);
  });

  it('thumbnail が undefined の場合、JSON からキーごと落ちて不正な payload と判定する', () => {
    const json = serializeLinkPreviewData({
      link: 'https://example.com',
      card: 'summary',
      thumbnail: undefined,
      title: 'Example',
      description: 'desc',
      domain: 'example.com',
    });

    expect(isLinkPreviewData(JSON.parse(json))).toBe(false);
  });

  it('type が link-preview 以外の場合、不正な payload と判定する', () => {
    expect(isLinkPreviewData({ type: 'alert', data: {} })).toBe(false);
  });

  it('object でない値は不正な payload と判定する', () => {
    expect(isLinkPreviewData(null)).toBe(false);
    expect(isLinkPreviewData('not-json')).toBe(false);
  });
});

describe('serializeAlertData / isAlertData', () => {
  it('serialize した JSON を isAlertData でパースすると有効な payload と判定する', () => {
    const json = serializeAlertData({ type: 'note', text: 'body' });

    expect(isAlertData(JSON.parse(json))).toBe(true);
  });

  it.each(ALERT_KINDS)('種別が %s の場合、有効な payload と判定する', (kind) => {
    const json = serializeAlertData({ type: kind, text: 'body' });

    expect(isAlertData(JSON.parse(json))).toBe(true);
  });

  it('未知の種別の場合、不正な payload と判定する', () => {
    // @ts-expect-error 型に合う値で書かない。HTML に残った古い JSON や改変された JSON が、runtime で弾かれることを確かめるため
    const json = serializeAlertData({ type: 'danger', text: 'body' });

    expect(isAlertData(JSON.parse(json))).toBe(false);
  });

  it('text が欠落している場合、不正な payload と判定する', () => {
    expect(isAlertData({ type: 'alert', data: { type: 'note' } })).toBe(false);
  });

  it('object でない値は不正な payload と判定する', () => {
    expect(isAlertData(null)).toBe(false);
  });
});

describe('parseLinkPreviewData', () => {
  const data = {
    link: 'https://example.com',
    card: 'summary',
    thumbnail: 'https://example.com/thumb.png',
    title: 'Example',
    description: 'desc',
    domain: 'example.com',
  };

  it('serialize した JSON の場合、元のデータを返す', () => {
    expect(parseLinkPreviewData(serializeLinkPreviewData(data))).toEqual({ type: 'link-preview', data });
  });

  it('thumbnail が欠落した JSON の場合、null を返す', () => {
    expect(parseLinkPreviewData(serializeLinkPreviewData({ ...data, thumbnail: undefined }))).toBeNull();
  });

  it('JSON として壊れている場合、失敗を記録して null を返す', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(parseLinkPreviewData('not-json')).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('Failed to parse JSON:', expect.any(SyntaxError));

    errorSpy.mockRestore();
  });

  it('空文字の場合、null を返す', () => {
    expect(parseLinkPreviewData('')).toBeNull();
  });
});

describe('parseAlertData', () => {
  it('serialize した JSON の場合、元のデータを返す', () => {
    expect(parseAlertData(serializeAlertData({ type: 'warning', text: 'body' }))).toEqual({
      type: 'alert',
      data: { type: 'warning', text: 'body' },
    });
  });

  it('未知の種別の JSON の場合、null を返す', () => {
    // @ts-expect-error
    expect(parseAlertData(serializeAlertData({ type: 'danger', text: 'body' }))).toBeNull();
  });

  it('JSON として壊れている場合、失敗を記録して null を返す', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(parseAlertData('not-json')).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('Failed to parse JSON:', expect.any(SyntaxError));

    errorSpy.mockRestore();
  });

  it('空文字の場合、null を返す', () => {
    expect(parseAlertData('')).toBeNull();
  });
});
