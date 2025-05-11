import { createPageMetadata, createStructuredData, pageConfig } from '@/components/Page/SinglePage/privacy/config';
import Template from '@/components/Page/SinglePage/Template';

export const metadata = createPageMetadata();

export default function Page() {
  const pageStructuredData = createStructuredData();

  return <Template config={pageConfig} structuredData={pageStructuredData} />;
}
