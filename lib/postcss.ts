import postcss from 'postcss';

export async function processPostCSS(css: string) {
  return postcss()
    .process(css)
    .then((result) => {
      return result.css;
    });
}
