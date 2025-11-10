import { useState, useEffect, useRef } from "react";
import { StarBackground } from "../components/StarBackground";
import { useNavigate } from "react-router-dom";

export const TestClassical = ({ studentEmail }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("reading"); // reading, questions, math, closing
  const [readingAnswers, setReadingAnswers] = useState({});
  const [currentMathIndex, setCurrentMathIndex] = useState(0);
  const [mathAnswers, setMathAnswers] = useState([]);
  const startTimeRef = useRef(null);
  const readingStartTimeRef = useRef(null);
  const readingTimeRef = useRef(null);
  const mathQuestionStartTimeRef = useRef(null);
  const timerRef = useRef(null);
  const mathTimerRef = useRef(null);
  const audioRef = useRef(new Audio("/audio/classical.mp3"));

  const MAX_TIME_MS = 3 * 60 * 1000; // 3 minutes total
  const MATH_TIME_MS = 1 * 60 * 1000; // 1 minute for math section

  const paragraph = `Classical music has a long history and has influenced many forms of art and culture. Composers like Mozart and Beethoven created works that are still widely performed today. The structure of classical compositions often includes symphonies, concertos, and sonatas, and the music is known for its emotional depth and technical precision. Listening to classical music has been associated with relaxation, focus, and enhanced cognitive performance.`;

  const readingQuestions = [
    { id: 1, question: "Which composers are mentioned as examples of classical music?", options: ["Mozart and Beethoven", "Bach and Chopin", "Elvis and Sinatra", "John Williams and Hans Zimmer"] },
    { id: 2, question: "What is classical music known for?", options: ["Emotional depth and technical precision", "Loud beats and bass", "Improvised solos", "Random sound effects"] },
    { id: 3, question: "What types of compositions are commonly found in classical music?", options: ["Symphonies, concertos, sonatas", "Rock albums", "Jazz improvisations", "Electronic tracks"] },
    { id: 4, question: "What benefit is associated with listening to classical music?", options: ["Relaxation and focus", "Weight loss", "Faster running", "Improved vision"] },
    { id: 5, question: "Are classical works still performed today?", options: ["Yes", "No", "Rarely", "Only in schools"] },
  ];

  const mathProblems = [
    { id: 1, a: 1, b: 2 }, { id: 2, a: 1, b: 11 }, { id: 3, a: 2, b: 4 }, { id: 4, a: 2, b: 13 },
    { id: 5, a: 3, b: 5 }, { id: 6, a: 3, b: 11 }, { id: 7, a: 4, b: 7 }, { id: 8, a: 4, b: 12 },
    { id: 9, a: 5, b: 3 }, { id: 10, a: 5, b: 8 }, { id: 11, a: 6, b: 1 }, { id: 12, a: 6, b: 10 },
    { id: 13, a: 7, b: 2 }, { id: 14, a: 7, b: 11 }, { id: 15, a: 8, b: 5 }, { id: 16, a: 8, b: 13 },
    { id: 17, a: 9, b: 2 }, { id: 18, a: 9, b: 10 }, { id: 19, a: 10, b: 5 }, { id: 20, a: 10, b: 12 },
    { id: 21, a: 11, b: 1 }, { id: 22, a: 11, b: 10 }, { id: 23, a: 12, b: 2 }, { id: 24, a: 12, b: 11 },
    { id: 25, a: 13, b: 4 }, { id: 26, a: 13, b: 9 }, { id: 27, a: 2, b: 6 }, { id: 28, a: 3, b: 9 },
    { id: 29, a: 4, b: 2 }, { id: 30, a: 5, b: 13 }, { id: 31, a: 6, b: 5 }, { id: 32, a: 7, b: 9 },
    { id: 33, a: 8, b: 7 }, { id: 34, a: 9, b: 8 }, { id: 35, a: 10, b: 2 }, { id: 36, a: 11, b: 5 },
    { id: 37, a: 12, b: 6 }, { id: 38, a: 13, b: 11 }, { id: 39, a: 3, b: 12 }, { id: 40, a: 7, b: 5 },
    { id: 41, a: 9, b: 6 }, { id: 42, a: 12, b: 13 }, { id: 43, a: 13, b: 7 }
  ];

  // ---- TIMERS & AUDIO ----
  useEffect(() => {
    startTimeRef.current = Date.now();
    readingStartTimeRef.current = Date.now();
    const audio = audioRef.current;
    audio.loop = true;
    audio.play().catch(() => console.log("Autoplay blocked"));

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= MAX_TIME_MS) setStage("closing");
    }, 500);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(mathTimerRef.current);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (stage === "math") {
      mathQuestionStartTimeRef.current = Date.now();
      mathTimerRef.current = setTimeout(() => setStage("closing"), MATH_TIME_MS);
    } else {
      clearTimeout(mathTimerRef.current);
    }
  }, [stage]);

  // ---- Handlers ----
  const handleQuestionChange = (id, value) =>
    setReadingAnswers({ ...readingAnswers, [id]: value });

  const handleProceedToMath = () => {
    readingTimeRef.current = Date.now() - readingStartTimeRef.current;
    setStage("math");
  };

  const handleMathAnswer = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();
      if (value === "" || isNaN(Number(value))) {
        alert("Please enter a valid number before proceeding.");
        return;
      }

      const problem = mathProblems[currentMathIndex];
      const answerTime = Date.now() - mathQuestionStartTimeRef.current;

      setMathAnswers([
        ...mathAnswers,
        { ...problem, answer: Number(value), timeMs: answerTime },
      ]);

      e.target.value = "";
      mathQuestionStartTimeRef.current = Date.now();

      if (currentMathIndex + 1 < mathProblems.length) {
        setCurrentMathIndex(currentMathIndex + 1);
      } else {
        setStage("closing");
      }
    }
  };

  // ---- Save results ----
  useEffect(() => {
    if (stage === "closing") {
      const saveResults = async () => {
        const email = studentEmail || localStorage.getItem("studentEmail");
        if (!email) return;

        const totalTimeMs = Math.min(Date.now() - startTimeRef.current, MAX_TIME_MS);
        const readingTimeMs = readingTimeRef.current || 0;

        const readingResults = readingQuestions.map((q) => ({
          studentEmail: email.toLowerCase(),
          testName: "Classical",
          questionType: "reading",
          questionId: q.id,
          status: readingAnswers[q.id]
            ? readingAnswers[q.id] === q.options[0] ? "right" : "wrong"
            : "no_time",
          totalTimeMs,
          readingTimeMs,
        }));

        // Mark unanswered math problems as no_time
        const answeredIds = mathAnswers.map((m) => m.id);
        const unanswered = mathProblems.filter((m) => !answeredIds.includes(m.id));

        const mathResults = [
          ...mathAnswers.map((m) => ({
            studentEmail: email.toLowerCase(),
            testName: "Classical",
            questionType: "math",
            questionId: m.id,
            status: m.answer === m.a * m.b ? "right" : "wrong",
            totalTimeMs,
            mathTimeMs: m.timeMs,
          })),
          ...unanswered.map((m) => ({
            studentEmail: email.toLowerCase(),
            testName: "Classical",
            questionType: "math",
            questionId: m.id,
            status: "no_time",
            totalTimeMs,
            mathTimeMs: 0,
          })),
        ];

        const allResults = [...readingResults, ...mathResults];

        try {
          const res = await fetch("/api/saveTestResults", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentEmail: email,
              testName: "Classical",
              results: allResults,
            }),
          });
          const data = await res.json();
          if (!data.success) console.error("Error saving test results:", data);
        } catch (err) {
          console.error("Server error saving test results:", err);
        }

        const currentTestId = 2;
        const completed = parseInt(localStorage.getItem("completedTests") || "0", 10);
        if (completed < currentTestId) {
          localStorage.setItem("completedTests", currentTestId.toString());
        }
      };

      saveResults();
    }
  }, [stage]);

  // ---- Render ----
  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center">
      <StarBackground />
      <div className="relative z-10 w-full max-w-3xl space-y-8">

        {stage === "reading" && (
          <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-4">
            <h1 className="text-3xl font-bold text-center">Reading Comprehension</h1>
            <p className="text-center">Read the paragraph below carefully. You will answer questions afterward.</p>
            <p className="bg-gray-700/60 p-4 rounded text-left mt-2 mb-2">{paragraph}</p>
            <div className="text-center">
              <button
                onClick={() => setStage("questions")}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Proceed to Questions
              </button>
            </div>
          </div>
        )}

        {stage === "questions" && (
          <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Reading Questions</h1>
            {readingQuestions.map((q) => (
              <div key={q.id} className="space-y-2">
                <p className="text-center">{q.question}</p>
                <div className="space-y-1 text-left mx-auto max-w-md">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={readingAnswers[q.id] === opt}
                        onChange={() => handleQuestionChange(q.id, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center">
              <button
                onClick={handleProceedToMath}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={readingQuestions.some(q => !readingAnswers[q.id])}
              >
                Proceed to Math
              </button>
            </div>
          </div>
        )}

        {stage === "math" && (
          <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-4 text-center">
            <h1 className="text-3xl font-bold mb-2">Math Problems</h1>
            <p>Answer each question. Press Enter after each answer. You cannot skip.</p>
            <p className="mt-2">
              Problem {currentMathIndex + 1} of {mathProblems.length}:{" "}
              {mathProblems[currentMathIndex].a} × {mathProblems[currentMathIndex].b} =
            </p>
            <input
              type="number"
              className="bg-gray-700/60 border border-gray-600 px-2 py-1 rounded w-full"
              onKeyDown={handleMathAnswer}
              placeholder="Type answer and press Enter"
              autoFocus
            />
          </div>
        )}

        {stage === "closing" && (
          <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-4 text-center">
            <h1 className="text-3xl font-bold">Test Complete</h1>
            <p>Great job! You have finished this test. Proceed to the next test when ready.</p>
            <button
              onClick={() => navigate("/studyhome")}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Proceed to Next Test
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
