export default element => {
  const links = element.querySelectorAll('a');
  if (links.length === 0) return;

  Array.from(links, element => {
    var href = element.getAttribute('href');
    // exclude javascript and anchor
    if (href.substring(0, 10).toLowerCase() === 'javascript' || href.substring(0, 1) === '#') {
      return;
    }

    // check hostname
    if (element.hostname === location.hostname) {
      return;
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
  });
};
