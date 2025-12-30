import { easeInOutQuint, easeOutExpo, easeOutQuint } from 'css-in-js-easing';
import type { TokenValues } from './types';

const easingValues: TokenValues<'easings'> = {
  easeOutExpo: { value: easeOutExpo },
  easeInOutQuint: { value: easeInOutQuint },
  easeOutQuint: { value: easeOutQuint },
};

export default easingValues;
