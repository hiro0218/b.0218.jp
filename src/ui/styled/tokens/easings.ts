import { easeInOutCirc, easeOut, easeOutExpo } from 'css-in-js-easing';
import type { TokenValues } from './types';

const easingValues: TokenValues<'easings'> = {
  easeInOutCirc: { value: easeInOutCirc },
  easeOut: { value: easeOut },
  easeOutExpo: { value: easeOutExpo },
};

export default easingValues;
