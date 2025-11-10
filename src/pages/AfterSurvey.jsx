import { useState } from "react";
import { StarBackground } from "../components/StarBackground";
import { useNavigate } from "react-router-dom";

export const AfterSurvey = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentEmail: "",
    knewSongs: "",
    knownSongsList: "",
    familiarityScore: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.studentEmail.trim().toLowerCase();
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    if (!formData.knewSongs) {
      alert("Please answer whether you knew any of the songs.");
      return;
    }

    // Validation depending on the answer
    if (formData.knewSongs === "yes") {
      if (!formData.knownSongsList.trim()) {
        alert("Please list the songs you knew, or write N/A.");
        return;
      }

      if (formData.familiarityScore === "" || formData.familiarityScore < 0 || formData.familiarityScore > 10) {
        alert("Please rate your familiarity between 0 and 10.");
        return;
      }
    } else {
      // No songs known: set values to null
      formData.knownSongsList = null;
      formData.familiarityScore = null;
    }

    try {
      const res = await fetch("/api/postSurvey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

      <div className="z-10 w-full max-w-3xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Congratulations!
        </h1>
        <p className="text-gray-300 text-lg">
          You’ve finished all four tests. Please complete this short post-survey to wrap up the study.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-xl bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-6"
      >
        <div>
          <label htmlFor="studentEmail" className="block mb-2 font-medium">
            Student Email
          </label>
          <input
            type="email"
            id="studentEmail"
            name="studentEmail"
            value={formData.studentEmail}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="yourname@university.edu"
          />
        </div>

        <div>
          <label htmlFor="knewSongs" className="block mb-2 font-medium">
            Did you know any of the songs?
          </label>
          <select
            id="knewSongs"
            name="knewSongs"
            value={formData.knewSongs}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {formData.knewSongs === "yes" && (
          <>
            <div>
              <label htmlFor="knownSongsList" className="block mb-2 font-medium">
                Which songs did you know? (If none, enter “N/A”)
              </label>
              <input
                type="text"
                id="knownSongsList"
                name="knownSongsList"
                value={formData.knownSongsList}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Song A, Song B, ..."
              />
            </div>

            <div>
              <label htmlFor="familiarityScore" className="block mb-2 font-medium">
                How well did you know the songs? (0 = not at all, 10 = very well)
              </label>
              <input
                type="range"
                id="familiarityScore"
                name="familiarityScore"
                min="0"
                max="10"
                step="1"
                value={formData.familiarityScore}
                onChange={handleChange}
                className="w-full"
              />
              <p className="text-gray-400 text-sm mt-1">
                Familiarity: {formData.familiarityScore || 0}/10
              </p>
            </div>
          </>
        )}

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
