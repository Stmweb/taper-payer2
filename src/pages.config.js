import TaperPayerAbout from './pages/TaperPayerAbout';
import TaperPayerContact from './pages/TaperPayerContact';
import TaperPayerHome from './pages/TaperPayerHome';
import TaperPayerHowItWorks from './pages/TaperPayerHowItWorks';
import TaperPayerLogin from './pages/TaperPayerLogin';
import TaperPayerSignup from './pages/TaperPayerSignup';
import TaperPayerRates from './pages/TaperPayerRates';
import __Layout from './Layout.jsx';


export const PAGES = {
    "TaperPayerAbout": TaperPayerAbout,
    "TaperPayerContact": TaperPayerContact,
    "TaperPayerHome": TaperPayerHome,
    "TaperPayerHowItWorks": TaperPayerHowItWorks,
    "TaperPayerLogin": TaperPayerLogin,
    "TaperPayerSignup": TaperPayerSignup,
    "TaperPayerRates": TaperPayerRates,
}

export const pagesConfig = {
    mainPage: "TaperPayerHome",
    Pages: PAGES,
    Layout: __Layout,
};