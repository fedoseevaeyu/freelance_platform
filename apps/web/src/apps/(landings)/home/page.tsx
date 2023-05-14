import FeaturesBlocksSection from './sections/FeaturesBlocksSection';
import FeaturesSection from './sections/FeaturesSection';
import HeroSection from './sections/HeroSection';
import Newsletter from './sections/Newsletter';
import Testimonials from './sections/TestimonialsSection';

export default function HomePageContent() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeaturesBlocksSection />
      <Testimonials />
      <Newsletter />
    </>
  );
}
