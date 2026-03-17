import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { AnimatePresence, motion } from 'framer-motion';
import TaperPayerFAQ from './pages/TaperPayerFAQ';
import TaperPayerTerms from './pages/TaperPayerTerms';
import TaperPayerPrivacy from './pages/TaperPayerPrivacy';
import TaperPayerCookies from './pages/TaperPayerCookies';
import TaperPayerMarketing from './pages/TaperPayerMarketing';
import TaperPayerBusiness from './pages/TaperPayerBusiness';
import TaperPayerWhiteLabel from './pages/TaperPayerWhiteLabel';
import TaperPayerTopUp from './pages/TaperPayerTopUp';
import TaperPayerAML from './pages/TaperPayerAML';
import TaperPayerCompliance from './pages/TaperPayerCompliance';
import AdminPageManager from './pages/AdminPageManager';
import AdminEmailMarketing from './pages/AdminEmailMarketing';
import AdminStripeDashboard from './pages/AdminStripeDashboard';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const TAB_PATHS = [
  '/TaperPayerHome',
  '/TaperPayerRates',
  '/TaperPayerHowItWorks',
  '/TaperPayerAbout',
];

const scrollPositions = {};

const pageVariants = {
  initial: { x: '100%', opacity: 0 },
  in:      { x: 0,      opacity: 1 },
  out:     { x: '-30%', opacity: 0 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25,
};

const AnimatedRoutes = ({ children }) => {
  const location = useLocation();
  const prevPath = React.useRef(location.pathname);

  React.useEffect(() => {
    const from = prevPath.current;
    const to = location.pathname;

    // Save scroll for the page we're leaving (only tab pages)
    if (TAB_PATHS.includes(from)) {
      scrollPositions[from] = window.scrollY;
    }

    // Restore scroll for tab pages, reset for others
    if (TAB_PATHS.includes(to)) {
      const saved = scrollPositions[to] ?? 0;
      requestAnimationFrame(() => window.scrollTo(0, saved));
    } else {
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }

    prevPath.current = to;
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
        style={{ position: 'relative', width: '100%', willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <AnimatedRoutes>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        } />
        {Object.entries(Pages).map(([path, Page]) => (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <LayoutWrapper currentPageName={path}>
                <Page />
              </LayoutWrapper>
            }
          />
        ))}
        <Route path="/TaperPayerFAQ" element={<LayoutWrapper currentPageName="TaperPayerFAQ"><TaperPayerFAQ /></LayoutWrapper>} />
        <Route path="/TaperPayerTerms" element={<LayoutWrapper currentPageName="TaperPayerTerms"><TaperPayerTerms /></LayoutWrapper>} />
        <Route path="/TaperPayerPrivacy" element={<LayoutWrapper currentPageName="TaperPayerPrivacy"><TaperPayerPrivacy /></LayoutWrapper>} />
        <Route path="/TaperPayerCookies" element={<LayoutWrapper currentPageName="TaperPayerCookies"><TaperPayerCookies /></LayoutWrapper>} />
        <Route path="/TaperPayerMarketing" element={<LayoutWrapper currentPageName="TaperPayerMarketing"><TaperPayerMarketing /></LayoutWrapper>} />
        <Route path="/TaperPayerBusiness" element={<LayoutWrapper currentPageName="TaperPayerBusiness"><TaperPayerBusiness /></LayoutWrapper>} />
        <Route path="/TaperPayerWhiteLabel" element={<LayoutWrapper currentPageName="TaperPayerWhiteLabel"><TaperPayerWhiteLabel /></LayoutWrapper>} />
        <Route path="/TaperPayerTopUp" element={<LayoutWrapper currentPageName="TaperPayerTopUp"><TaperPayerTopUp /></LayoutWrapper>} />
        <Route path="/TaperPayerAML" element={<LayoutWrapper currentPageName="TaperPayerAML"><TaperPayerAML /></LayoutWrapper>} />
        <Route path="/TaperPayerCompliance" element={<LayoutWrapper currentPageName="TaperPayerCompliance"><TaperPayerCompliance /></LayoutWrapper>} />
        <Route path="/AdminPageManager" element={<AdminPageManager />} />
        <Route path="/AdminEmailMarketing" element={<AdminEmailMarketing />} />
        <Route path="/AdminStripeDashboard" element={<AdminStripeDashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AnimatedRoutes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App