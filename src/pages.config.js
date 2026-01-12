import TaperPayerLogin from './pages/TaperPayerLogin';
import TaperPayerSignup from './pages/TaperPayerSignup';
import TaperPayerContact from './pages/TaperPayerContact';
import TaperPayerAbout from './pages/TaperPayerAbout';
import TaperPayerHome from './pages/TaperPayerHome';
import TaperPayerHowItWorks from './pages/TaperPayerHowItWorks';
import __Layout from './Layout.jsx';


export const PAGES = {
    "TaperPayerLogin": TaperPayerLogin,
    "TaperPayerSignup": TaperPayerSignup,
    "TaperPayerContact": TaperPayerContact,
    "TaperPayerAbout": TaperPayerAbout,
    "TaperPayerHome": TaperPayerHome,
    "TaperPayerHowItWorks": TaperPayerHowItWorks,
}

export const pagesConfig = {
    mainPage: "TaperPayerHome",
    Pages: PAGES,
    Layout: __Layout,
};