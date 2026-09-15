import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedDishes from "@/components/FeaturedDishes";
import About from "@/components/About";
import TastingMenu from "@/components/TastingMenu";
import ImmersiveExperience from "@/components/ImmersiveExperience";
import Testimonials from "@/components/Testimonials";
import Reservations from "@/components/Reservations";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1280px]">
        <Hero />
        <FeaturedDishes />
        <About />
        <TastingMenu />
        <ImmersiveExperience />
        <Testimonials />
        <Reservations />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
