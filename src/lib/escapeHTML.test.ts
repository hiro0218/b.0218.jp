import escapeHTML from './escapeHTML';

describe('escapeHTML', () => {
  it('should replace "&" with "&amp;"', () => {
    const input = 'This & that';
    const expectedOutput = 'This &amp; that';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });

  it('should replace double quotes with "&quot;"', () => {
    const input = 'John said, "Hello"';
    const expectedOutput = 'John said, &quot;Hello&quot;';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });

  it('should replace "<" with "&lt;"', () => {
    const input = '<div>';
    const expectedOutput = '&lt;div&gt;';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });

  it('should replace ">" with "&gt;"', () => {
    const input = '</div>';
    const expectedOutput = '&lt;/div&gt;';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });

  it('should return an empty string if the input is an empty string', () => {
    const input = '';
    const expectedOutput = '';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });
});
