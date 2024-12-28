import * as Log from '@/shared/Log';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { loadEnvConfig } from '@next/env';
import type { Result } from './type';

loadEnvConfig(process.cwd());

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    // biome-ignore lint/style/useNamingConvention: <explanation>
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
  },
});

export const getPopularArticles = async () => {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${process.env.GA_PROPERTY_ID}`,
    dateRanges: [
      {
        startDate: '8daysAgo',
        endDate: '1daysAgo',
      },
    ],
    dimensions: [
      {
        name: 'pagePath',
      },
    ],
    metrics: [
      {
        name: 'screenPageViews',
      },
    ],
    // Exclude top page (/)
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'FULL_REGEXP',
          value: '^/[^/]+$',
        },
      },
    },
    limit: 20,
  });

  const result: Result = {};

  response.rows?.forEach((row) => {
    const slug = row.dimensionValues?.[0].value.replace('/', '').replace('.html', '');
    const views = Number(row.metricValues?.[0].value);
    result[slug] = views;
  });

  Log.info('Get popular articles from Google Analytics');

  return result;
};
