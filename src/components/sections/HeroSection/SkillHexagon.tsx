'use client';

import type { ReactNode } from 'react';

import { Text } from '@/components/ui';

type SkillHexagonProps = {
  name: string;
  icon: ReactNode;
  description: string;
};

export function SkillHexagon({ name, icon, description }: SkillHexagonProps) {
  return (
    <button
      type="button"
      aria-label={`${name}: ${description}`}
      className="group relative h-37.5 w-32.5 shrink-0 cursor-pointer perspective-[1000px]"
    >
      <div className="hex-tip h-full w-full transform-3d">
        <div className="hex-flip relative h-full w-full transform-3d">
          <div className="hex-face absolute inset-0 flex flex-col items-center justify-center gap-3 backface-hidden">
            <div className="text-4xl">{icon}</div>

            <Text as="span" size="sm" weight="semibold">
              {name}
            </Text>
          </div>

          <div className="hex-face absolute inset-0 flex flex-col items-center justify-center gap-2 p-5 backface-hidden rotate-y-180">
            <Text as="span" size="sm" weight="semibold">
              {name}
            </Text>

            <Text size="sm" color="muted" className="text-center">
              {description}
            </Text>
          </div>
        </div>
      </div>
    </button>
  );
}
