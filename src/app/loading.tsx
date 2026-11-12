import PageLoader from '@/components/ui/PageLoader';

// shown while a route segment loads (React Suspense boundary)
// https://nextjs.org/docs/app/api-reference/file-conventions/loading
export default function Loading() {
  return <PageLoader />;
}
