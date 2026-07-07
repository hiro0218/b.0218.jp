import { describe, expect, it } from 'vitest';
import {
  GFM_ALERT_CLASS_NAME,
  isAlertData,
  isLinkPreviewData,
  LINK_PREVIEW_CLASS_NAME,
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

  it('未知の種別の場合、不正な payload と判定する', () => {
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
