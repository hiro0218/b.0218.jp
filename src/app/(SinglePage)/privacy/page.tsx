import { createMetadataFromSlug } from '@/components/Page/SinglePage/metadata';
import Template from '@/components/Page/SinglePage/Template';

export const metadata = createMetadataFromSlug('privacy');

export default function Page() {
  return <Template slug="privacy" />;
}
