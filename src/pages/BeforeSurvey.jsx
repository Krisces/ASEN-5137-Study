import { useState, useEffect } from "react";
import { StarBackground } from "../components/StarBackground";
import { useNavigate } from "react-router-dom";

// Simple cookie helpers
const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
};

// Exception emails (lowercase)
const EXCEPTION_EMAILS = [
  "kristin.boeckmann@colorado.edu",
  "alexander.cunningham@colorado.edu",
  "zackary.bacon@colorado.edu",
  "jonathan.hale@colorado.edu",
  "alcu9870@colorado.edu",
  "zaba6688@colorado.edu",
  "joha2087@colorado.edu",
].map(email => email.toLowerCase());

export const BeforeSurvey = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentEmail: "",
    age: "",
    gender: "",
    favoriteMusic: "",
    dailyMusicHours: "",
  });

  const [consentGiven, setConsentGiven] = useState(false);

  // Check cookie and prevent re-taking
  useEffect(() => {
    const completed = getCookie("completedStudy");
    if (completed && !EXCEPTION_EMAILS.includes(completed)) {
      alert("You’ve already completed this study. Thank you!");
      navigate("/thank-you");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.studentEmail.trim().toLowerCase();
    const emailIsException = EXCEPTION_EMAILS.includes(email);

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    if (!emailIsException && !consentGiven) {
      alert("You must agree to participate before continuing.");
      return;
    }

    // Only validate extra fields if NOT an exception
    if (!emailIsException) {
      if (
        !formData.age ||
        !formData.gender ||
        !formData.favoriteMusic ||
        formData.dailyMusicHours === ""
      ) {
        alert("Please fill out all fields.");
        return;
      }

      if (Number(formData.dailyMusicHours) < 0) {
        alert("Daily music hours cannot be negative.");
        return;
      }

      if (getCookie("completedStudy")) {
        alert("This email has already participated in the study.");
        return;
      }
    }

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isException: emailIsException })
      });
      const data = await res.json();

      if (data.success) {
        if (!emailIsException) setCookie("completedStudy", email, 30);
        // store email in localStorage for tests
        localStorage.setItem("studentEmail", email);
        navigate("/demo");
      } else {
        alert("Error saving your survey. Try again.");
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
          Welcome to the Cognitive Music Study
        </h1>
        <p className="text-gray-300">
          Before you start, please fill out this short survey. This will help us
          understand your background and music listening habits.
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

        {/* Only show other fields & consent if NOT an exception */}
        {!EXCEPTION_EMAILS.includes(formData.studentEmail.trim().toLowerCase()) && (
          <>
            <div>
              <label htmlFor="age" className="block mb-2 font-medium">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="18"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block mb-2 font-medium">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="nonbinary">Non-binary</option>
                <option value="preferNotToSay">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label htmlFor="favoriteMusic" className="block mb-2 font-medium">
                Favorite type of music
              </label>
              <input
                type="text"
                id="favoriteMusic"
                name="favoriteMusic"
                value={formData.favoriteMusic}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Classical, Rock, Lofi..."
              />
            </div>

            <div>
              <label htmlFor="dailyMusicHours" className="block mb-2 font-medium">
                Approximate hours of music you listen to daily
              </label>
              <input
                type="number"
                id="dailyMusicHours"
                name="dailyMusicHours"
                value={formData.dailyMusicHours}
                onChange={handleChange}
                required
                min={0}
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2"
              />
            </div>

            {/* Consent checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="consent"
                checked={consentGiven}
                onChange={() => setConsentGiven(!consentGiven)}
                className="h-4 w-4 text-blue-600 rounded border-gray-400 focus:ring-blue-500"
              />
              <label htmlFor="consent" className="text-gray-300 text-sm">
                I consent to participate in this study and understand that my responses will be recorded.
              </label>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={
            !EXCEPTION_EMAILS.includes(formData.studentEmail.trim().toLowerCase()) &&
            !consentGiven
          }
          className={`w-full py-3 rounded-md font-semibold transition-colors ${
            EXCEPTION_EMAILS.includes(formData.studentEmail.trim().toLowerCase()) || consentGiven
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          Familiarize Yourself With the Tests
        </button>
      </form>
    </div>
  );
};
