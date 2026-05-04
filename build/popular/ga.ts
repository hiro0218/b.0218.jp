import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { loadEnvConfig } from '@next/env';
import * as Log from '~/tools/logger';

type GoogleAnalyticsConfig = {
  propertyId: string;
  clientEmail: string;
  privateKey: string;
};

loadEnvConfig(process.cwd());

const GA_DATE_RANGE = '183daysAgo';
const GA_RESULT_LIMIT = 50;

const getGoogleAnalyticsConfig = (): GoogleAnalyticsConfig => {
  const propertyId = process.env.GA_PROPERTY_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!propertyId || !clientEmail || !privateKey) {
    const missingEnvironmentVariables = [
      !propertyId && 'GA_PROPERTY_ID',
      !clientEmail && 'GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL',
      !privateKey && 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
    ].filter((key): key is string => Boolean(key));

    throw new Error(`Missing Google Analytics environment variables: ${missingEnvironmentVariables.join(', ')}`);
  }

  return {
    propertyId,
    clientEmail,
    privateKey: privateKey.split(String.raw`\n`).join('\n'),
  };
};

export const getPopularArticles = async (): Promise<Record<string, number>> => {
  if (process.env.SKIP_GA === 'true') {
    Log.info('Skip Google Analytics fetch');
    return {};
  }

  const googleAnalyticsConfig = getGoogleAnalyticsConfig();

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      // biome-ignore lint/style/useNamingConvention: Google APIの仕様に合わせたスネークケース
      client_email: googleAnalyticsConfig.clientEmail,
      // biome-ignore lint/style/useNamingConvention: Google APIの仕様に合わせたスネークケース
      private_key: googleAnalyticsConfig.privateKey,
    },
  });

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${googleAnalyticsConfig.propertyId}`,
    dateRanges: [
      {
        startDate: GA_DATE_RANGE,
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
    limit: GA_RESULT_LIMIT,
  });

  const result: Record<string, number> = {};

  response.rows?.forEach((row) => {
    const slug = row.dimensionValues?.[0].value.replace('/', '').replace('.html', '');
    const views = Number(row.metricValues?.[0].value);
    result[slug] = views;
  });

  Log.info('Get popular articles from Google Analytics');

  return result;
};
