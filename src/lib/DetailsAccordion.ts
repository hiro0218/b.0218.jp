const DefaultKeyframeAnimationOptions: KeyframeAnimationOptions = {
  duration: 200,
  easing: 'ease-out',
} as const;

export class DetailsAccordion {
  detailsElement: HTMLDetailsElement;
  summary: HTMLElement;
  content: HTMLElement;
  animationQueue: Animation | null;
  isClosing: boolean;
  isExpanding: boolean;
  keyframeAnimationOption: KeyframeAnimationOptions;
  listener: (e: MouseEvent) => void;

  constructor(
    detailsElement: HTMLDetailsElement,
    contentElement: HTMLElement,
    keyframeAnimationOption = DefaultKeyframeAnimationOptions,
  ) {
    const summary = detailsElement.querySelector('summary');

    if (summary === null) {
      throw new Error('Summary element not found in details element.');
    }

    this.detailsElement = detailsElement;
    this.summary = summary;
    this.content = contentElement;
    this.animationQueue = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.keyframeAnimationOption = keyframeAnimationOption;
    this.listener = (e: MouseEvent) => this.onClick(e);
    this.addEventListener();
  }

  addEventListener() {
    this.summary.addEventListener('click', this.listener);
  }

  removeEventListener() {
    this.summary.removeEventListener('click', this.listener);
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

  animate(startHeight: string, endHeight: string, open: boolean) {
    if (this.animationQueue) {
      this.animationQueue.cancel();
    }

    this.animationQueue = this.detailsElement.animate(
      {
        height: [startHeight, endHeight],
      },
      this.keyframeAnimationOption,
    );

    this.animationQueue.onfinish = () => this.onAnimationFinish(open);
    this.animationQueue.oncancel = () => {
      this.isClosing = false;
      this.isExpanding = false;
    };
  }

  shrink() {
    this.isClosing = true;

    const startHeight = `${this.detailsElement.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    this.animate(startHeight, endHeight, false);
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

    this.animate(startHeight, endHeight, true);
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
