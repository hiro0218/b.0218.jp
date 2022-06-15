type ModuleScaleProps = {
  scaleFactor?: number;
  baseFontSize?: string | number;
  degree?: number;
};

const trunc = (num: number): number => {
  return num < 0 ? Math.ceil(num) : Math.floor(num);
};

const getModularScale = ({ scaleFactor = 8, baseFontSize = '1rem', degree = 0 }: ModuleScaleProps) => {
  const deg = trunc(degree);
  const diff = scaleFactor - deg;

  if (deg === 0) {
    return baseFontSize;
  }

  return `calc(${baseFontSize} * ${scaleFactor} / ${diff})`;
};

export { getModularScale };
