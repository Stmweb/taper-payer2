import TaperPayerHome from './pages/TaperPayerHome';
import TaperPayerAbout from './pages/TaperPayerAbout';
import TaperPayerHowItWorks from './pages/TaperPayerHowItWorks';
import __Layout from './Layout.jsx';


export const PAGES = {
    "TaperPayerHome": TaperPayerHome,
    "TaperPayerAbout": TaperPayerAbout,
    "TaperPayerHowItWorks": TaperPayerHowItWorks,
}

export const pagesConfig = {
    mainPage: "TaperPayerHome",
    Pages: PAGES,
    Layout: __Layout,
};