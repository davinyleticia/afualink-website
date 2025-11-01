import OurClients from "@/app/components/organisms/OurClients/OurClients";
import Hero from "./components/organisms/Hero/Hero";
import AboutSection from "./components/organisms/AboutSection/AboutSection";
import Solutions from "./components/organisms/Solutions/Solutions";
import CallToAction from "./components/organisms/CallToAction/CallToAction";
import TeamSection from "./components/organisms/TeamSection/TeamSection";

export default function HomePage() {
  return (
    <>

      <Hero />
      <AboutSection />
      <Solutions />
      <CallToAction />
      <TeamSection />
      <OurClients />
    </>
  );
}