import { describe, expect, it } from 'vitest';
import { isAnchorElement, isButtonElement, isHTMLElement, isInputElement } from './typeGuards';

describe('typeGuards', () => {
  describe('isHTMLElement', () => {
    it('HTMLDivElementに対してtrueを返す', () => {
      const element = document.createElement('div');
      expect(isHTMLElement(element)).toBe(true);
    });

    it('HTMLSpanElementに対してtrueを返す', () => {
      const element = document.createElement('span');
      expect(isHTMLElement(element)).toBe(true);
    });

    it('nullに対してfalseを返す', () => {
      expect(isHTMLElement(null)).toBe(false);
    });

    it('非HTML要素（Text）に対してfalseを返す', () => {
      const textNode = document.createTextNode('test');
      expect(isHTMLElement(textNode)).toBe(false);
    });
  });

  describe('isInputElement', () => {
    it('HTMLInputElementに対してtrueを返す', () => {
      const element = document.createElement('input');
      expect(isInputElement(element)).toBe(true);
    });

    it('HTMLDivElementに対してfalseを返す', () => {
      const element = document.createElement('div');
      expect(isInputElement(element)).toBe(false);
    });

    it('nullに対してfalseを返す', () => {
      expect(isInputElement(null)).toBe(false);
    });
  });

  describe('isButtonElement', () => {
    it('HTMLButtonElementに対してtrueを返す', () => {
      const element = document.createElement('button');
      expect(isButtonElement(element)).toBe(true);
    });

    it('HTMLInputElementに対してfalseを返す', () => {
      const element = document.createElement('input');
      expect(isButtonElement(element)).toBe(false);
    });

    it('nullに対してfalseを返す', () => {
      expect(isButtonElement(null)).toBe(false);
    });
  });

  describe('isAnchorElement', () => {
    it('HTMLAnchorElementに対してtrueを返す', () => {
      const element = document.createElement('a');
      expect(isAnchorElement(element)).toBe(true);
    });

    it('HTMLDivElementに対してfalseを返す', () => {
      const element = document.createElement('div');
      expect(isAnchorElement(element)).toBe(false);
    });

    it('nullに対してfalseを返す', () => {
      expect(isAnchorElement(null)).toBe(false);
    });
  });
});
