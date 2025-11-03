export default function observeScrollbarWidth(): void {
  requestAnimationFrame(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`);
  });
}
