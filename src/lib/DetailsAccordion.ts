export class DetailsAccordion {
  detailsElement: HTMLDetailsElement;
  summary: HTMLElement;
  content: HTMLElement;
  animation: Animation;
  isClosing: boolean;
  isExpanding: boolean;

  constructor(detailsElement: HTMLDetailsElement, contentElement: HTMLElement) {
    this.detailsElement = detailsElement;
    this.summary = detailsElement.querySelector('summary');
    this.content = contentElement;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(e: MouseEvent) {
    e.preventDefault();
    this.detailsElement.style.overflow = 'hidden';

    if (this.isClosing || !this.detailsElement.open) {
      this.open();
    } else if (this.isExpanding || this.detailsElement.open) {
      this.shrink();
    }
  }

  shrink() {
    this.isClosing = true;

    const startHeight = `${this.detailsElement.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.detailsElement.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 200,
        easing: 'ease-out',
      },
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => (this.isClosing = false);
  }

  open() {
    this.detailsElement.style.height = `${this.detailsElement.offsetHeight}px`;
    this.detailsElement.open = true;

    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;
    const startHeight = `${this.detailsElement.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.detailsElement.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 200,
        easing: 'ease-out',
      },
    );

    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open: boolean) {
    this.detailsElement.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.detailsElement.style.height = this.detailsElement.style.overflow = '';
  }
}
