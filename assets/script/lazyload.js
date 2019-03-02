import lozad from 'lozad';

export default images => {
  if (images.length === 0) return;

  const observer = lozad(images);
  observer.observe();
};
