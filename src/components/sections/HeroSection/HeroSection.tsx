import Image from 'next/image';

import aboutMe from '@/assets/images/aboutMe.png';
import { Text } from '@/components/ui';
import { SkillHexagon } from './SkillHexagon';
import { skills } from './skills';

export const HeroSection = () => {
  const rows = [skills.slice(0, 4), skills.slice(4, 9), skills.slice(9, 13)];

  return (
    <section className="flex flex-col items-center justify-center w-full pt-16 max-w-360">
      <Text as="h1" size="xxxl" weight="semibold">
        About Me
      </Text>
      <div className="w-full flex items-center justify-between mt-30">
        <div className="flex flex-col items-center">
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex justify-center gap-8"
              style={{
                marginTop: index === 0 ? 0 : -20,
              }}
            >
              {row.map(skill => (
                <SkillHexagon key={skill.name} {...skill} />
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-end text-right alight-right gap-16">
          <Image
            src={aboutMe}
            alt="About Me"
            width={250}
            height={250}
            className="self-center"
          />

          <Text size="xxl" className="max-w-100">
            Frontend Engineer with 4+ years of experience delivering React,
            Next.js and React Native applications. Strong in frontend
            architecture, data-heavy workflows and performance optimization,
            with experience building complex 2D/3D interfaces and improving
            responsiveness by up to 4×
          </Text>
        </div>
      </div>
    </section>
  );
};
