export default element => {
  const links = element.querySelectorAll('a');
  console.log(links);
  if (links.length === 0) return;

  for (let i = 0; i < links.length; i++) {
    const element = links[i];
    const href = element.getAttribute('href');

    // href属性がない場合
    if (!href) continue;

    // exclude javascript and anchor
    if ((href && href.substring(0, 10).toLowerCase() === 'javascript') || href.substring(0, 1) === '#') {
      continue;
    }

    // check hostname
    if (element.hostname === location.hostname) {
      continue;
    }

    // set target and rel
    element.setAttribute('target', '_blank');
    element.setAttribute('rel', 'nofollow');
    element.setAttribute('rel', 'noopener');

    // set icon when childNode is text
    if (element.hasChildNodes()) {
      if (element.childNodes[0].nodeType === 3) {
        // add icon class
        element.classList.add('is-external_link');
      }
    }
  }
};
