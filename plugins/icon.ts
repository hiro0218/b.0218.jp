import octicons from '@primer/octicons-v2';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (context, inject) => {
  inject('icon', {
    archive: octicons.archive.toSVG(),
    'arrow-left': octicons['arrow-left'].toSVG(),
    'arrow-right': octicons['arrow-right'].toSVG(),
    'arrow-up': octicons['arrow-up'].toSVG(),
    clock: octicons.clock.toSVG(),
    image: octicons.image.toSVG(),
    search: octicons.search.toSVG(),
    tag: octicons.tag.toSVG(),
  });
};
