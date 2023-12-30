import escapeHTML from './escapeHTML';

describe('escapeHTML', () => {
  it('should handle non-string inputs by returning them unchanged', () => {
    const input = 123;
    expect(escapeHTML(input as unknown as string)).toBe(input);
  });

  it('should replace "&" with "&amp;"', () => {
    const input = 'This & that';
    const expectedOutput = 'This &amp; that';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });

  it('should replace "<" with "&lt;"', () => {
    const input = '2 < 3';
    const expectedOutput = '2 &lt; 3';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });

  it('should replace ">" with "&gt;"', () => {
    const input = '3 > 2';
    const expectedOutput = '3 &gt; 2';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });

  it('should replace double quotes with "&quot;"', () => {
    const input = 'John said, "Hello"';
    const expectedOutput = 'John said, &quot;Hello&quot;';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });

  it('should replace single quotes with "&#x27;"', () => {
    const input = "It's a test";
    const expectedOutput = 'It&#x27;s a test';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });

  it('should replace backticks with "&#x60;"', () => {
    const input = '`code` example';
    const expectedOutput = '&#x60;code&#x60; example';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });

  it('should correctly replace multiple different characters in the same string', () => {
    const input = `5 < 6 & "seven" > 'eight'`;
    const expectedOutput = '5 &lt; 6 &amp; &quot;seven&quot; &gt; &#x27;eight&#x27;';
    expect(escapeHTML(input)).toBe(expectedOutput);
  });
});
