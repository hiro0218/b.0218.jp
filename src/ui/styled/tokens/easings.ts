import { easeInOutCirc, easeInOutQuint, easeOut, easeOutExpo } from 'css-in-js-easing';
import type { TokenValues } from './types';

const easingValues: TokenValues<'easings'> = {
  easeInOutQuint: { value: easeInOutQuint },
  easeInOutCirc: { value: easeInOutCirc },
  easeOut: { value: easeOut },
  easeOutExpo: { value: easeOutExpo },
};

export default easingValues;
