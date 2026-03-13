/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AccountSettings from './pages/AccountSettings';
import TaperPayerAbout from './pages/TaperPayerAbout';
import TaperPayerBusiness from './pages/TaperPayerBusiness';
import TaperPayerContact from './pages/TaperPayerContact';
import TaperPayerCookies from './pages/TaperPayerCookies';
import TaperPayerFAQ from './pages/TaperPayerFAQ';
import TaperPayerHome from './pages/TaperPayerHome';
import TaperPayerHowItWorks from './pages/TaperPayerHowItWorks';
import TaperPayerLogin from './pages/TaperPayerLogin';
import TaperPayerMarketing from './pages/TaperPayerMarketing';
import TaperPayerPrivacy from './pages/TaperPayerPrivacy';
import TaperPayerRates from './pages/TaperPayerRates';
import TaperPayerSignup from './pages/TaperPayerSignup';
import TaperPayerTerms from './pages/TaperPayerTerms';
import TaperPayerTopUp from './pages/TaperPayerTopUp';
import TaperPayerWhiteLabel from './pages/TaperPayerWhiteLabel';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AccountSettings": AccountSettings,
    "TaperPayerAbout": TaperPayerAbout,
    "TaperPayerBusiness": TaperPayerBusiness,
    "TaperPayerContact": TaperPayerContact,
    "TaperPayerCookies": TaperPayerCookies,
    "TaperPayerFAQ": TaperPayerFAQ,
    "TaperPayerHome": TaperPayerHome,
    "TaperPayerHowItWorks": TaperPayerHowItWorks,
    "TaperPayerLogin": TaperPayerLogin,
    "TaperPayerMarketing": TaperPayerMarketing,
    "TaperPayerPrivacy": TaperPayerPrivacy,
    "TaperPayerRates": TaperPayerRates,
    "TaperPayerSignup": TaperPayerSignup,
    "TaperPayerTerms": TaperPayerTerms,
    "TaperPayerTopUp": TaperPayerTopUp,
    "TaperPayerWhiteLabel": TaperPayerWhiteLabel,
}

export const pagesConfig = {
    mainPage: "AccountSettings",
    Pages: PAGES,
    Layout: __Layout,
};