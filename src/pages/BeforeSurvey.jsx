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

  // Check cookie and prevent re-taking
  useEffect(() => {
    const completed = getCookie("completedStudy");
    if (completed) {
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

    // Check if email has already participated (case-insensitive)
    if (getCookie("completedStudy") && !EXCEPTION_EMAILS.includes(email)) {
      alert("This email has already participated in the study.");
      return;
    }

    const isException = EXCEPTION_EMAILS.includes(email);

    // Validation
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    if (!isException) {
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
    }

    try {
      // Use relative path for Vercel deployment
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isException })
      });
      const data = await res.json();

      if (data.success) {
        if (!isException) setCookie("completedStudy", email, 30);
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
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
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl space-y-6"
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

        {/* Only show other fields if not an exception */}
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
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-colors"
        >
          Familiarize Yourself With the Tests
        </button>
      </form>
    </div>
  );
};
