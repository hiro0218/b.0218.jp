import hljs from 'highlight.js';

export default (element) => {
  const elementCode = element.querySelectorAll('pre code');

  for (let i = 0; i < elementCode.length; i++) {
    const element = elementCode[i];
    const className = element.className.replace('language-', '');
    const result = hljs.highlightAuto(element.textContent, [className]);

    if (className) {
      element.dataset.language = className;
    }

    element.classList.add('hljs');
    element.innerHTML = result.value;
  }
};
