import TaperPayerAbout from './pages/TaperPayerAbout';
import TaperPayerHowItWorks from './pages/TaperPayerHowItWorks';
import TaperPayerHome from './pages/TaperPayerHome';
import __Layout from './Layout.jsx';


export const PAGES = {
    "TaperPayerAbout": TaperPayerAbout,
    "TaperPayerHowItWorks": TaperPayerHowItWorks,
    "TaperPayerHome": TaperPayerHome,
}

export const pagesConfig = {
    mainPage: "TaperPayerHome",
    Pages: PAGES,
    Layout: __Layout,
};