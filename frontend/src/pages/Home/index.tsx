import Navbar from "../../components/Navbar"
import HeroCarousel from "../../components/HeroCarousel";
import AdvancedFooter from "../../components/AdvancedFooter";
import Cards from "../../components/HomePageCard";


function Home() {

    return (
        <>
            <Navbar />
            <HeroCarousel />
            <Cards/>

            <AdvancedFooter />
        </>
    )
}

export default Home
