import { writeJSONSync } from 'fs-extra';

import { run as getHatena } from '@/build/popular/hatena';
import { FILENAME_POSTS_POPULAR } from '@/constant';
import * as Log from '@/lib/Log';

const PATH_DIST = `${process.cwd()}/dist`;

(async () => {
  const hatenaData = await getHatena();

  writeJSONSync(`${PATH_DIST}/${FILENAME_POSTS_POPULAR}.json`, hatenaData);
  Log.info(`Write dist/${FILENAME_POSTS_POPULAR}.json`);
})();
