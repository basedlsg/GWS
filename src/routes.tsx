import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { LandingPage } from '@/features/landing/LandingPage';

// Lazy load feature pages for code splitting
const TransmutePage = lazy(() =>
  import('@/features/transmute/TransmutePage').then((m) => ({ default: m.TransmutePage }))
);

const DistillationPage = lazy(() =>
  import('@/features/distillation/DistillationPage').then((m) => ({ default: m.DistillationPage }))
);

const ProjectionPage = lazy(() =>
  import('@/features/projection/ProjectionPage').then((m) => ({ default: m.ProjectionPage }))
);

const CulminationPage = lazy(() =>
  import('@/features/culmination/CulminationPage').then((m) => ({ default: m.CulminationPage }))
);

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'transmute',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TransmutePage />
          </Suspense>
        ),
      },
      {
        path: 'distillation',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DistillationPage />
          </Suspense>
        ),
      },
      {
        path: 'projection',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectionPage />
          </Suspense>
        ),
      },
      {
        path: 'culmination',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CulminationPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
