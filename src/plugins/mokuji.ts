import { Plugin } from '@nuxt/types';
// @ts-ignore
import Mokuji from 'mokuji.js';

const mokuji: Plugin = (context) => {
  context.$Mokuji = Mokuji;
};

export default mokuji;
