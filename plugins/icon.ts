import octicons from '@primer/octicons-v2';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (context, inject) => {
  inject('icon', {
    'arrow-left': octicons['arrow-left'].toSVG(),
    'arrow-right': octicons['arrow-right'].toSVG(),
    'arrow-up': octicons['arrow-up'].toSVG(),
    image: octicons.image.toSVG(),
    search: octicons.search.toSVG(),
  });
};
