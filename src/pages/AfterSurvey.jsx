import { useState } from "react";
import { StarBackground } from "../components/StarBackground";
import { useNavigate } from "react-router-dom";

export const AfterSurvey = () => {
  const navigate = useNavigate();

  const songOptions = ["Classical Song", "Rock Song", "Lofi Song"];

  // Track whether each song is known + its familiarity
  const [selectedSongs, setSelectedSongs] = useState(
    songOptions.reduce((acc, song) => {
      acc[song] = { known: false, familiarity: 0 };
      return acc;
    }, {})
  );

  const handleCheckboxChange = (song) => {
    setSelectedSongs({
      ...selectedSongs,
      [song]: { ...selectedSongs[song], known: !selectedSongs[song].known },
    });
  };

  const handleSliderChange = (song, value) => {
    setSelectedSongs({
      ...selectedSongs,
      [song]: { ...selectedSongs[song], familiarity: Number(value) },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentEmail = localStorage.getItem("studentEmail");
    if (!studentEmail) {
      alert("No student email found. Please restart the study.");
      return;
    }

    const knownSongs = Object.entries(selectedSongs).map(([song, val]) => ({
      song,
      familiarity: val.known ? val.familiarity : null,
      known: val.known ? "yes" : "no",
    }));

    try {
      const res = await fetch("/api/postSurvey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentEmail, knownSongs }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Thank you for completing the post-survey!");
        navigate("/thank-you");
      } else {
        alert("Error saving your responses. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-black text-white px-4 pb-20 pt-20">
      <StarBackground />

      {/* Congratulatory text outside form */}
      <div className="z-10 w-full max-w-3xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Congratulations!</h1>
        <p className="text-gray-300 text-lg">
          You’ve completed all the tests. Lastly, please fill out this short post-survey.
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-xl bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-6"
      >
        {/* Instructions inside card */}
        <p className="text-gray-300 mb-4">
          For each song below, indicate which ones you know and how familiar you are with them (0 = not at all, 10 = very well).
        </p>

        {songOptions.map((song) => (
          <div key={song} className="bg-gray-700 p-4 rounded-md space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSongs[song].known}
                onChange={() => handleCheckboxChange(song)}
              />
              <span className="font-medium">{song}</span>
            </label>

            {selectedSongs[song].known && (
              <div className="mt-2">
                <label className="block mb-1 text-sm">
                  Familiarity with {song}:
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={selectedSongs[song].familiarity}
                  onChange={(e) => handleSliderChange(song, e.target.value)}
                  className="w-full"
                />
                <p className="text-gray-400 text-sm mt-1">
                  {selectedSongs[song].familiarity}/10
                </p>
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-3 rounded-md font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          Submit Post-Survey
        </button>
      </form>
    </div>
  );
};
