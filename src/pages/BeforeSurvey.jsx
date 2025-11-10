import { useState, useEffect } from "react";
import { StarBackground } from "../components/StarBackground";
import { useNavigate } from "react-router-dom";

// Cookie helpers
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

// Exception emails
const EXCEPTION_EMAILS = [

].map((email) => email.toLowerCase());

export const BeforeSurvey = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentEmail: "",
    age: "",
    gender: "",
    major: "",
    isMusician: "",
    musicalExperience: "",
    favoriteMusic: "",
    dailyMusicHours: "",
  });

  const [consentGiven, setConsentGiven] = useState(false);

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

    if (!emailIsException) {
      if (
        !formData.age ||
        !formData.gender ||
        !formData.major ||
        !formData.isMusician ||
        (formData.isMusician === "yes" && !formData.musicalExperience) ||
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
      localStorage.removeItem("completedTests");
      localStorage.setItem("completedTests", "0");
      localStorage.removeItem("studentEmail");

      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isException: emailIsException }),
      });

      const data = await res.json();
      if (data.success) {
        if (!emailIsException) setCookie("completedStudy", email, 30);
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
        className="z-10 w-full max-w-xl bg-gray-800/80 border border-purple-600/50 p-8 rounded-2xl shadow-xl space-y-6"
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
            placeholder="yourname@university.edu"
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

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
                placeholder="18"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="nonbinary">Non-binary</option>
                <option value="preferNotToSay">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label htmlFor="major" className="block mb-2 font-medium">
                Major
              </label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="Aerospace Engineering, Psychology, etc."
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="isMusician" className="block mb-2 font-medium">
                Are you a musician?
              </label>
              <select
                id="isMusician"
                name="isMusician"
                value={formData.isMusician}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {formData.isMusician === "yes" && (
              <div>
                <label htmlFor="musicalExperience" className="block mb-2 font-medium">
                  How much musical experience do you have?
                </label>
                <input
                  type="text"
                  id="musicalExperience"
                  name="musicalExperience"
                  value={formData.musicalExperience}
                  onChange={handleChange}
                  placeholder="e.g., 5 years of piano, music major, etc."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

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
                placeholder="Classical, Rock, Lofi..."
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                min={0}
                placeholder="2"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id="consent"
                checked={consentGiven}
                onChange={() => setConsentGiven(!consentGiven)}
                className="h-5 w-5 text-purple-500 rounded border-gray-400 focus:ring-purple-500"
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
          className={`w-full py-3 rounded-2xl font-semibold transition-colors cosmic-button ${
            EXCEPTION_EMAILS.includes(formData.studentEmail.trim().toLowerCase()) || consentGiven
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          Familiarize Yourself With the Tests
        </button>
      </form>
    </div>
  );
};
