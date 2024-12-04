export { ChatBubbleLeft } from './ChatBubbleLeft';
export { ExclamationCircle } from './ExclamationCircle';
export { ExclamationTriangle } from './ExclamationTriangle';
export { Hatenabookmark } from './Hatenabookmark';
export { InformationCircle } from './InformationCircle';
export { LightBulb } from './LightBulb';
export { X } from './X';
export {
  ArrowUpIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  GitHubLogoIcon,
  InfoCircledIcon,
  Link2Icon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';

const BASE = 15;
const SCALE = 1.5;
const STEP = 5;

function generateIconSizes(initialSize: number, scale: number, steps: number): Record<string, number> {
  const sizes: Record<string, number> = {};
  let currentSize = initialSize;
  const step = ['XS', 'SM', 'MD', 'LG', 'XL'];

  for (let i = 0; i < steps; i++) {
    const key = `ICON_SIZE_${step[i] || `STEP${i + 1}`}`;
    sizes[key] = Math.round(currentSize);
    currentSize = Math.floor(currentSize * scale);
  }

  return sizes;
}

export const {
  /** 15 */
  ICON_SIZE_XS,
  /** 20 */
  ICON_SIZE_SM,
  /** 30 */
  ICON_SIZE_MD,
  /** 45 */
  ICON_SIZE_LG,
  /** 67 */
  ICON_SIZE_XL,
} = generateIconSizes(BASE, SCALE, STEP);
