export {
  ArrowUpIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cross2Icon,
  GitHubLogoIcon,
  InfoCircledIcon,
  Link2Icon,
  MagnifyingGlassIcon,
  Share1Icon,
} from '@radix-ui/react-icons';
export { ChatBubbleLeft } from './ChatBubbleLeft';
export { ExclamationCircle } from './ExclamationCircle';
export { ExclamationTriangle } from './ExclamationTriangle';
export { Hashtag } from './Hashtag';
export { Hatenabookmark } from './Hatenabookmark';
export { InformationCircle } from './InformationCircle';
export { LightBulb } from './LightBulb';
export { MagnifyingGlass } from './MagnifyingGlass';
export { X } from './X';

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
