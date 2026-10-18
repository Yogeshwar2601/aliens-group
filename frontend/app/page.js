import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Projects from "@/components/projects/HomepageProjects";
import FeaturedCategories from "@/components/featured/FeaturedCategories";
import Awards from "@/components/awards/Awards";
import LatestFromAliens from "@/components/latest/LatestFromAliens";
import Testimonials from "@/components/testimonials/Testimonials";
import Footer from "@/components/footer/Footer";
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <FeaturedCategories />
      <Awards />
      <LatestFromAliens />
      <Testimonials />
      <Footer />
    </main>
  );
}