import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/before-survey");
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="container max-w-4xl mx-auto text-center z-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white opacity-0 animate-fade-in">
            How Music Affects Cognitive Performance
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto opacity-0 animate-fade-in-delay-1">
            Participate in a short online study to help us understand how different types of music impact concentration, reading, and problem-solving skills. The study will take about 15–20 minutes.
          </p>

          <div className="pt-4 opacity-0 animate-fade-in-delay-2">
            <button
              onClick={handleStart}
              className="cosmic-button"
            >
              Start the Study
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
