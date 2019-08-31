import Vue from 'vue';

import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
  faImage,
  faSearch,
  faClock,
  faFolder,
  faTag,
  faArrowUp,
  faArrowRight,
  faArrowLeft,
  faArrowDown,
  faAngleRight,
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

config.autoAddCss = false;

library.add(
  faImage,
  faSearch,
  faClock,
  faFolder,
  faTag,
  faArrowUp,
  faArrowRight,
  faArrowLeft,
  faArrowDown,
  faAngleRight,
  faAngleLeft,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
