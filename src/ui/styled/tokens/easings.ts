import { easeInOutQuint, easeOutExpo } from 'css-in-js-easing';
import type { TokenValues } from './types';

const easingValues: TokenValues<'easings'> = {
  easeOutExpo: { value: easeOutExpo },
  easeInOutQuint: { value: easeInOutQuint },
};

export default easingValues;
