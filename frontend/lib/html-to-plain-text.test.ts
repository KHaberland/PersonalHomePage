import { describe, expect, it } from 'vitest';
import { htmlToPlainText } from './html-to-plain-text';

describe('htmlToPlainText', () => {
  it('removes paragraph wrappers from CKEditor output', () => {
    expect(htmlToPlainText('<p>Hello world</p>')).toBe('Hello world');
  });

  it('removes trailing nbsp entities', () => {
    expect(
      htmlToPlainText('<p>I understand welding end to end&nbsp;</p>')
    ).toBe('I understand welding end to end');
  });

  it('collapses multiple paragraphs into one line', () => {
    expect(htmlToPlainText('<p>Line one</p><p>Line two</p>')).toBe(
      'Line one Line two'
    );
  });
});
