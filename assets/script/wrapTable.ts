export default (element: HTMLElement) => {
  const tables = element.querySelectorAll('table');
  if (tables.length === 0) return;

  const div = document.createElement('div');
  div.classList.add('table-container', 'u-scroll-x');

  for (let i = 0; i < tables.length; i++) {
    const wrapper = div.cloneNode(false);
    tables[i].parentNode.insertBefore(wrapper, tables[i]);
    wrapper.appendChild(tables[i]);
  }
};
