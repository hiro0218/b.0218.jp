import { Plugin } from '@nuxt/types';
// @ts-ignore
import Mokuji from 'mokuji.js';

const mokuji: Plugin = (_, inject) => {
  inject('Mokuji', Mokuji);
};

export default mokuji;
