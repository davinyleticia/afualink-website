import OurClients from "@/components/organisms/OurClients/OurClients";
import TeamSection from "../components/organisms/TeamSection/TeamSection";
import CallToActionV2 from "../components/organisms/CallToActionV2/CallToActionV2";
import { Hero } from "@/components/organisms/Hero/Hero";
import { AboutSection } from "@/components/organisms/AboutSection/AboutSection";
import { Solutions } from "@/components/organisms/Solutions/Solutions";

export default function HomePage() {
  return (
    <>

      <Hero />
      <AboutSection />
      <Solutions />
      <TeamSection />
      <OurClients />
      <CallToActionV2 />
    </>
  );
}