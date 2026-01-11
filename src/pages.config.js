import TaperPayerAbout from './pages/TaperPayerAbout';
import TaperPayerContact from './pages/TaperPayerContact';
import TaperPayerHowItWorks from './pages/TaperPayerHowItWorks';
import TaperPayerLogin from './pages/TaperPayerLogin';
import TaperPayerSignup from './pages/TaperPayerSignup';
import TaperPayerHome from './pages/TaperPayerHome';
import __Layout from './Layout.jsx';


export const PAGES = {
    "TaperPayerAbout": TaperPayerAbout,
    "TaperPayerContact": TaperPayerContact,
    "TaperPayerHowItWorks": TaperPayerHowItWorks,
    "TaperPayerLogin": TaperPayerLogin,
    "TaperPayerSignup": TaperPayerSignup,
    "TaperPayerHome": TaperPayerHome,
}

export const pagesConfig = {
    mainPage: "TaperPayerHome",
    Pages: PAGES,
    Layout: __Layout,
};