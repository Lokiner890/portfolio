import { Slot } from 'radix-ui';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

const linkSizeClass = {
  sm: 'text-sm leading-5',
  md: 'text-base leading-6',
  lg: 'text-lg leading-7',
} as const;

const linkWeightClass = {
  regular: 'font-normal',
  medium: 'font-medium',
  bold: 'font-bold',
} as const;

const linkUnderlineClass = {
  auto: 'underline-offset-4 hover:underline',
  always: 'underline underline-offset-4',
  hover: 'no-underline underline-offset-4 hover:underline',
  none: 'no-underline',
} as const;

type LinkSize = keyof typeof linkSizeClass;
type LinkWeight = keyof typeof linkWeightClass;
type LinkUnderline = keyof typeof linkUnderlineClass;

type LinkOwnProps = {
  asChild?: boolean;
  size?: LinkSize;
  weight?: LinkWeight;
  underline?: LinkUnderline;
  muted?: boolean;
};

type LinkProps = LinkOwnProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof LinkOwnProps>;

function Link({
  asChild = false,
  size = 'md',
  weight = 'regular',
  underline = 'hover',
  muted = false,
  className,
  ...props
}: LinkProps) {
  const Comp = asChild ? Slot.Root : 'a';

  return (
    <Comp
      data-slot="link"
      className={cn(
        'inline-flex items-center transition-colors cursor-pointer',
        muted
          ? 'text-white/70 hover:text-white'
          : 'text-white hover:text-gray-300',
        linkSizeClass[size],
        linkWeightClass[weight],
        linkUnderlineClass[underline],
        className,
      )}
      {...props}
    />
  );
}

export type { LinkProps, LinkSize, LinkUnderline, LinkWeight };
export default Link;
