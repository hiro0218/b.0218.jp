const DefaultKeyframeAnimationOptions: KeyframeAnimationOptions = {
  duration: 200,
  easing: 'ease-out',
} as const;

export class DetailsAccordion {
  detailsElement: HTMLDetailsElement;
  summary: HTMLElement;
  content: HTMLElement;
  animationQueue: Animation;
  isClosing: boolean;
  isExpanding: boolean;
  keyframeAnimationOption: KeyframeAnimationOptions;

  constructor(
    detailsElement: HTMLDetailsElement,
    contentElement: HTMLElement,
    keyframeAnimationOption = DefaultKeyframeAnimationOptions,
  ) {
    this.detailsElement = detailsElement;
    this.summary = detailsElement.querySelector('summary');
    this.content = contentElement;
    this.animationQueue = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.keyframeAnimationOption = keyframeAnimationOption;

    this.addEventListener();
  }

  addEventListener() {
    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  removeEventListener() {
    this.summary.removeEventListener('click', (e) => this.onClick(e));
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

    if (this.animationQueue) {
      this.animationQueue.cancel();
    }

    this.animationQueue = this.detailsElement.animate(
      {
        height: [startHeight, endHeight],
      },
      this.keyframeAnimationOption,
    );

    this.animationQueue.onfinish = () => this.onAnimationFinish(false);
    this.animationQueue.oncancel = () => (this.isClosing = false);
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

    if (this.animationQueue) {
      this.animationQueue.cancel();
    }

    this.animationQueue = this.detailsElement.animate(
      {
        height: [startHeight, endHeight],
      },
      this.keyframeAnimationOption,
    );

    this.animationQueue.onfinish = () => this.onAnimationFinish(true);
    this.animationQueue.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open: boolean) {
    this.detailsElement.open = open;
    this.animationQueue = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.detailsElement.style.height = '';
    this.detailsElement.style.overflow = '';
  }
}
