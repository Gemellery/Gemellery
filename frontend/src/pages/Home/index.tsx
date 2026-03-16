import Navbar from "../../components/Navbar";
import HeroCarousel from "../../components/HeroCarousel";
import HomePageCard from "../../components/HomePageCard";
import BlockchainSection from "../../components/BlockchainSection";
import PopularGemsCarousel from "../../components/PopularGemsCarousel";
import AIDesignerPromo from "../../components/AIDesignerPromo";
import StatsSection from "../../components/StatsSection";
import NewsLetter from "../../components/NewsLetter";
import AdvancedFooter from "../../components/AdvancedFooter";

function Home() {
    return (
        <>
            <Navbar />
            <HeroCarousel />
            <HomePageCard />
            <BlockchainSection />
            <PopularGemsCarousel />
            <AIDesignerPromo />
            <StatsSection />
            <NewsLetter />
            <AdvancedFooter />
        </>
    );
}

export default Home;
