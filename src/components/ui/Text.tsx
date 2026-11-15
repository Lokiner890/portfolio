import { Slot } from 'radix-ui';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { cn } from '@/lib/cn';

const textSizeClass = {
  sm: 'text-sm leading-5',
  md: 'text-base leading-6',
  lg: 'text-lg leading-7',
  xl: 'text-xl leading-7',
  xxl: 'text-2xl leading-7',
  xxxl: 'text-5xl leading-8',
} as const;

const textWeightClass = {
  regular: 'font-normal',
  medium: 'font-medium',
  bold: 'font-bold',
  semibold: 'font-semibold',
} as const;

const textColorClass = {
  default: 'text-white',
  muted: 'text-white/70',
  accent: 'text-white/50',
} as const;

type TextSize = keyof typeof textSizeClass;
type TextWeight = keyof typeof textWeightClass;
type TextColor = keyof typeof textColorClass;

type TextOwnProps = {
  asChild?: boolean;
  as?: ElementType;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
};

type TextProps = TextOwnProps &
  Omit<ComponentPropsWithoutRef<'p'>, keyof TextOwnProps>;

function Text({
  asChild = false,
  as,
  size = 'md',
  weight = 'regular',
  color = 'default',
  className,
  ...props
}: TextProps) {
  const Comp = asChild ? Slot.Root : (as ?? 'p');

  return (
    <Comp
      data-slot="text"
      className={cn(
        textSizeClass[size],
        textWeightClass[weight],
        textColorClass[color],
        className,
      )}
      {...props}
    />
  );
}

export type { TextColor, TextProps, TextSize, TextWeight };
export default Text;
