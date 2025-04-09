import Info from "@/components/screens/Info";
import Faq from "@/components/screens/Faq";
import Hero from "@/components/screens/Hero";

const HomePage = () => {
  return (
    <div className="vipna flex min-h-screen w-full flex-col space-y-8">
      <Hero />
      <Info />
      <Faq />
    </div>
  );
};

export default HomePage;
