import Hero from "@/components/hero";
import Main from "@/components/main";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="py-16 sm:py-24">
        <div className="text-center max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold tracking-tight text-lapang-dark">
            Community Picks
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find the spots currently trending in your area.
          </p>
        </div>

        <div className="mt-16">
          <Main />
        </div>
      </div>
    </div>
  );
}
