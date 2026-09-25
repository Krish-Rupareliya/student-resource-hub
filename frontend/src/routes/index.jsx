import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, useParams, Navigate as RouterNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AdminLayout from '../layouts/AdminLayout';
import { PageLoadingFallback } from '../components/ui/LoadingSkeleton';

// ─── Helper to wrap lazy components in Suspense ───────────────
function withSuspense(Component) {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Component />
    </Suspense>
  );
}

// ─── Public pages (Dynamic Code-Splitting) ────────────────────
const Home = lazy(() => import('../pages/Home/Home'));
const Resources = lazy(() => import('../pages/Resources/Resources'));
const Semesters = lazy(() => import('../pages/Resources/Semesters'));
const SemesterDetails = lazy(() => import('../pages/ResourceDetails/ResourceDetails'));
const Opportunities = lazy(() => import('../pages/Opportunities/Opportunities'));
const Community = lazy(() => import('../pages/Community/Community'));
const About = lazy(() => import('../pages/About/About'));
const Contact = lazy(() => import('../pages/Contact/Contact'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
const SubjectDetails = lazy(() => import('../pages/Subject/SubjectDetails'));
const ComingSoon = lazy(() => import('../pages/ComingSoon/ComingSoon'));
const ResourceViewer = lazy(() => import('../pages/ResourceViewer/ResourceViewer'));

function DepartmentRouteHandler() {
  const { code } = useParams();
  const normalized = (code || '').toUpperCase();
  if (normalized === 'CE') {
    return <RouterNavigate to="/semesters" replace />;
  }
  return <RouterNavigate to={`/coming-soon?dept=${normalized}`} replace />;
}

// ─── Admin pages (Separated into isolated admin chunks) ───────
const AdminLogin = lazy(() => import('../pages/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const AdminHomepageSettingsView = lazy(() => import('../pages/Admin/AdminHomepageSettingsView'));
const AdminSubmissionsView = lazy(() => import('../pages/Admin/AdminSubmissionsView'));
const AdminResourcesView = lazy(() => import('../pages/Admin/AdminResourcesView'));
const AdminVivaView = lazy(() => import('../pages/Admin/AdminVivaView'));
const AdminOpportunitiesView = lazy(() => import('../pages/Admin/AdminOpportunitiesView'));
const AdminCatalogView = lazy(() => import('../pages/Admin/AdminCatalogView'));
const AdminSubscribersView = lazy(() => import('../pages/Admin/AdminSubscribersView'));
const AdminPollsView = lazy(() => import('../pages/Admin/AdminPollsView'));

const UniversalVivaPage = lazy(() => import('../pages/Viva/UniversalVivaPage'));

export const router = createBrowserRouter([
  // ── Public app ─────────────────────────────────────────────
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: 'resources', element: withSuspense(Resources) },
      { path: 'semesters', element: withSuspense(Semesters) },
      { path: 'semesters/:id', element: withSuspense(SemesterDetails) },
      { path: 'subject/:code', element: withSuspense(SubjectDetails) },
      { path: 'subject/:code/viva', element: withSuspense(UniversalVivaPage) },
      { path: 'opportunities', element: withSuspense(Opportunities) },
      { path: 'community', element: withSuspense(Community) },
      { path: 'contact', element: withSuspense(Contact) },
      { path: 'about', element: withSuspense(About) },
      { path: 'coming-soon', element: withSuspense(ComingSoon) },
      { path: 'department/:code', element: <DepartmentRouteHandler /> },
      { path: '*', element: withSuspense(NotFound) },
    ],
  },

  // ── Resource Viewer (full-screen, no navbar) ────────────────
  { path: '/resource/:id', element: withSuspense(ResourceViewer) },

  // ── Admin login (standalone — no sidebar) ──────────────────
  { path: '/admin/login', element: withSuspense(AdminLogin) },

  // ── Admin portal (protected — requires auth, shows sidebar) ─
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(AdminDashboard) },
      { path: 'homepage-settings', element: withSuspense(AdminHomepageSettingsView) },
      { path: 'settings/homepage', element: withSuspense(AdminHomepageSettingsView) },
      { path: 'submissions', element: withSuspense(AdminSubmissionsView) },
      { path: 'uploads', element: withSuspense(AdminSubmissionsView) },
      { path: 'resources', element: withSuspense(AdminResourcesView) },
      { path: 'viva', element: withSuspense(AdminVivaView) },
      { path: 'opportunities', element: withSuspense(AdminOpportunitiesView) },
      { path: 'polls', element: withSuspense(AdminPollsView) },
      { path: 'referendums', element: withSuspense(AdminPollsView) },
      { path: 'catalog', element: withSuspense(AdminCatalogView) },
      { path: 'subscribers', element: withSuspense(AdminSubscribersView) },
      { path: '*', element: withSuspense(NotFound) },
    ],
  },

  // ── Global catch-all for unmatched top-level routes ─────────
  { path: '*', element: withSuspense(NotFound) },
]);
