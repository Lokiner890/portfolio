import { ImageResponse } from 'next/og';

// Preview image for links shared on social networks and messengers, used by every page that doesn't
// set its own (add `opengraph-image.tsx` to a route folder). Generated at build time.
// Replace it with the project design, or with a static `opengraph-image.png` (1200x630).
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

export const alt = 'PROJECT_NAME';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          color: '#111111',
          fontSize: 96,
        }}
      >
        PROJECT_NAME
      </div>
    ),
    size,
  );
}
