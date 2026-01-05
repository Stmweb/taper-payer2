import TaperPayerAbout from './pages/TaperPayerAbout';
import TaperPayerHowItWorks from './pages/TaperPayerHowItWorks';
import TaperPayerHome from './pages/TaperPayerHome';
import TaperPayerLogin from './pages/TaperPayerLogin';
import TaperPayerContact from './pages/TaperPayerContact';
import TaperPayerSignup from './pages/TaperPayerSignup';
import __Layout from './Layout.jsx';


export const PAGES = {
    "TaperPayerAbout": TaperPayerAbout,
    "TaperPayerHowItWorks": TaperPayerHowItWorks,
    "TaperPayerHome": TaperPayerHome,
    "TaperPayerLogin": TaperPayerLogin,
    "TaperPayerContact": TaperPayerContact,
    "TaperPayerSignup": TaperPayerSignup,
}

export const pagesConfig = {
    mainPage: "TaperPayerHome",
    Pages: PAGES,
    Layout: __Layout,
};