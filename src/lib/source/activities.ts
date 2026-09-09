import { createEagerSource } from '@/lib/distLoader/eagerSource';
import { isObject } from '@/lib/utils/isObject';
import type { Activities, ActivityCompany, ActivityWork, ActivityWorkType } from '@/types/source';
import activitiesData from '~/dist/activities.json';

const ACTIVITY_WORK_TYPES = ['slide', 'blog', 'event'] as const satisfies readonly ActivityWorkType[];

/** work.type が json-ld.ts の switch が網羅する3値のいずれかであることを検証する */
function isActivityWorkType(value: unknown): value is ActivityWorkType {
  return typeof value === 'string' && (ACTIVITY_WORK_TYPES as readonly string[]).includes(value);
}

function isActivityCompany(value: unknown): value is ActivityCompany {
  if (!isObject(value)) return false;
  return typeof value.id === 'string' && typeof value.name === 'string' && typeof value.url === 'string';
}

function isActivityWork(value: unknown): value is ActivityWork {
  if (!isObject(value)) return false;
  return (
    isActivityWorkType(value.type) &&
    typeof value.title === 'string' &&
    typeof value.url === 'string' &&
    (value.companyId === null || typeof value.companyId === 'string')
  );
}

function isActivities(value: unknown): value is Activities {
  if (!isObject(value)) return false;
  return (
    Array.isArray(value.companies) &&
    value.companies.every(isActivityCompany) &&
    Array.isArray(value.works) &&
    value.works.every(isActivityWork)
  );
}

const activitiesSource = createEagerSource<Activities>({
  data: activitiesData,
  validate: isActivities,
  label: 'activities',
});

/** 登壇・執筆などの活動実績（companies / works）を取得する。 */
export function getActivitiesJson(): Activities {
  return activitiesSource.get();
}
