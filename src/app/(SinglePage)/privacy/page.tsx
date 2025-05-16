import { createMetadataFromSlug } from '@/components/Page/Single/metadata';
import Template from '@/components/Page/Single/Template';

export const metadata = createMetadataFromSlug('privacy');

export default function Page() {
  return <Template slug="privacy" />;
}
