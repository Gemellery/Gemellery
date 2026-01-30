import Navbar from "../../components/Navbar"
import HeroCarousel from "../../components/HeroCarousel";
import AdvancedFooter from "../../components/AdvancedFooter";
import NewsLetter from "../../components/NewsLetter";
import Cards from "../../components/HomePageCard";


function Home() {

    return (
        <>
            <Navbar />
            <HeroCarousel />
            <Cards />

            <NewsLetter />
            <AdvancedFooter />
        </>
    )
}

export default Home
