import { createMetadataFromSlug } from '@/components/Page/Single/metadata';
import Template from '@/components/Page/Single/Template';

export const metadata = createMetadataFromSlug('about');

export default function Page() {
  return <Template slug="about" />;
}
