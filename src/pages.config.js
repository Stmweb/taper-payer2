import TaperPayerAbout from './pages/TaperPayerAbout';
import TaperPayerHome from './pages/TaperPayerHome';
import TaperPayerHowItWorks from './pages/TaperPayerHowItWorks';
import __Layout from './Layout.jsx';


export const PAGES = {
    "TaperPayerAbout": TaperPayerAbout,
    "TaperPayerHome": TaperPayerHome,
    "TaperPayerHowItWorks": TaperPayerHowItWorks,
}

export const pagesConfig = {
    mainPage: "TaperPayerHome",
    Pages: PAGES,
    Layout: __Layout,
};