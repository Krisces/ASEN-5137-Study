import { useState, useEffect, useRef } from "react";
import { StarBackground } from "../components/StarBackground";
import { useNavigate } from "react-router-dom";

export const TestRock = ({ studentEmail }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("reading");
  const [readingAnswers, setReadingAnswers] = useState({});
  const [currentMathIndex, setCurrentMathIndex] = useState(0);
  const [mathAnswers, setMathAnswers] = useState([]);
  const startTimeRef = useRef(null);
  const readingStartTimeRef = useRef(null);
  const readingTimeRef = useRef(null);
  const mathQuestionStartTimeRef = useRef(null);
  const timerRef = useRef(null);
  const mathTimerRef = useRef(null);
  const audioRef = useRef(new Audio("/audio/highwaytohell.mp3"));

  const MAX_TIME_MS = 3 * 60 * 1000;
  const MATH_TIME_MS = 1 * 60 * 1000;

  const paragraph = `Rock music from the 70s and 80s has shaped popular culture and influenced generations of musicians. Bands like Queen, Led Zeppelin, and The Rolling Stones created iconic songs that remain popular today. Rock music often features strong guitar riffs, memorable melodies, and energetic rhythms. Listening to rock music can energize listeners and evoke feelings of excitement and nostalgia.`;

  const readingQuestions = [
    { 
      id: 1, 
      question: "Which bands are mentioned in the paragraph?", 
      options: [
        "Queen, Led Zeppelin, The Rolling Stones", 
        "Nirvana, Pearl Jam, Metallica", 
        "The Beatles, Oasis, Blur", 
        "Coldplay, U2, Radiohead"
      ],
      correctAnswer: "Queen, Led Zeppelin, The Rolling Stones"
    },
    { 
      id: 2, 
      question: "What are characteristics of 70s/80s rock music?", 
      options: [
        "Strong guitar riffs and energetic rhythms", 
        "Slow melodies and soft vocals", 
        "Electronic beats and synths", 
        "Jazz improvisation and swing"
      ],
      correctAnswer: "Strong guitar riffs and energetic rhythms"
    },
    { 
      id: 3, 
      question: "Listening to rock music can evoke what?", 
      options: ["Excitement and nostalgia", "Hunger", "Sleepiness", "Anxiety"],
      correctAnswer: "Excitement and nostalgia"
    },
    { 
      id: 4, 
      question: "Are songs from these bands still popular today?", 
      options: ["Yes", "No", "Only in movies", "Only on radio"],
      correctAnswer: "Yes"
    },
    { 
      id: 5, 
      question: "Which era of rock music is discussed?", 
      options: ["70s and 80s", "60s", "90s", "2000s"],
      correctAnswer: "70s and 80s"
    }
  ];

  const mathProblems = [
    { id: 1, a: 1, b: 3 }, { id: 2, a: 1, b: 12 }, { id: 3, a: 2, b: 5 }, { id: 4, a: 2, b: 11 },
    { id: 5, a: 3, b: 2 }, { id: 6, a: 3, b: 10 }, { id: 7, a: 4, b: 8 }, { id: 8, a: 4, b: 13 },
    { id: 9, a: 5, b: 1 }, { id: 10, a: 5, b: 10 }, { id: 11, a: 6, b: 2 }, { id: 12, a: 6, b: 11 },
    { id: 13, a: 7, b: 1 }, { id: 14, a: 7, b: 12 }, { id: 15, a: 8, b: 3 }, { id: 16, a: 8, b: 9 },
    { id: 17, a: 9, b: 3 }, { id: 18, a: 9, b: 7 }, { id: 19, a: 10, b: 1 }, { id: 20, a: 10, b: 11 },
    { id: 21, a: 11, b: 3 }, { id: 22, a: 11, b: 12 }, { id: 23, a: 12, b: 3 }, { id: 24, a: 12, b: 7 },
    { id: 25, a: 13, b: 1 }, { id: 26, a: 13, b: 8 }, { id: 27, a: 2, b: 8 }, { id: 28, a: 3, b: 6 },
    { id: 29, a: 4, b: 3 }, { id: 30, a: 5, b: 12 }, { id: 31, a: 6, b: 3 }, { id: 32, a: 7, b: 8 },
    { id: 33, a: 8, b: 6 }, { id: 34, a: 9, b: 9 }, { id: 35, a: 10, b: 4 }, { id: 36, a: 11, b: 8 },
    { id: 37, a: 12, b: 5 }, { id: 38, a: 13, b: 5 }, { id: 39, a: 3, b: 13 }, { id: 40, a: 7, b: 4 },
    { id: 41, a: 9, b: 4 }, { id: 42, a: 12, b: 12 }, { id: 43, a: 13, b: 2 },
  ];

  // TIMERS & AUDIO
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

  const handleQuestionChange = (id, value) =>
    setReadingAnswers({ ...readingAnswers, [id]: value });

  const handleProceedToMath = () => {
    readingTimeRef.current = Date.now() - readingStartTimeRef.current;
    setStage("math");
  };

  const handleMathAnswer = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();
      if (!value || isNaN(Number(value)))
        return alert("Please enter a valid number.");

      const problem = mathProblems[currentMathIndex];
      const answerTime = Date.now() - mathQuestionStartTimeRef.current;

      setMathAnswers((prev) => [
        ...prev,
        { ...problem, answer: Number(value), timeMs: answerTime },
      ]);

      e.target.value = "";
      mathQuestionStartTimeRef.current = Date.now();

      if (currentMathIndex + 1 < mathProblems.length)
        setCurrentMathIndex(currentMathIndex + 1);
      else setStage("closing");
    }
  };

  // Save results
  useEffect(() => {
    if (stage === "closing") {
      const saveResults = async () => {
        const email = studentEmail || localStorage.getItem("studentEmail");
        if (!email) return;

        const totalTimeMs = Math.min(
          Date.now() - startTimeRef.current,
          MAX_TIME_MS
        );
        const readingTimeMs = readingTimeRef.current || 0;

        const readingResults = readingQuestions.map((q) => ({
          studentEmail: email.toLowerCase(),
          testName: "Rock",
          questionType: "reading",
          questionId: q.id,
          status: readingAnswers[q.id]
            ? readingAnswers[q.id] === q.correctAnswer
              ? "right"
              : "wrong"
            : "no_time",
          totalTimeMs,
          readingTimeMs,
        }));

        const answeredIds = mathAnswers.map((m) => m.id);
        const unanswered = mathProblems
          .filter((p) => !answeredIds.includes(p.id))
          .map((p) => ({
            studentEmail: email.toLowerCase(),
            testName: "Rock",
            questionType: "math",
            questionId: p.id,
            status: "no_time",
            totalTimeMs,
            mathTimeMs: 0,
          }));

        const mathResults = mathAnswers.map((m) => ({
          studentEmail: email.toLowerCase(),
          testName: "Rock",
          questionType: "math",
          questionId: m.id,
          status: m.answer === m.a * m.b ? "right" : "wrong",
          totalTimeMs,
          mathTimeMs: m.timeMs,
        }));

        const allResults = [...readingResults, ...mathResults, ...unanswered];

        try {
          const res = await fetch("/api/saveTestResults", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentEmail: email,
              testName: "Rock",
              results: allResults,
            }),
          });

          const data = await res.json();
          if (!data.success)
            console.error("Error saving test results:", data);
        } catch (err) {
          console.error("Server error saving test results:", err);
        }

        const currentTestId = 3;
        const completed = parseInt(
          localStorage.getItem("completedTests") || "0",
          10
        );
        if (completed < currentTestId)
          localStorage.setItem("completedTests", currentTestId.toString());
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
          <div className="bg-gray-800/80 border border-purple-600/50 p-8 rounded-2xl shadow-xl space-y-4">
            <h1 className="text-3xl font-bold text-center">
              Reading Comprehension
            </h1>
            <p className="text-center">
              Read the paragraph below carefully. You will answer questions
              afterward.
            </p>
            <p className="bg-gray-700/60 p-4 rounded text-left mt-2 mb-2">
              {paragraph}
            </p>
            <div className="text-center">
              <button
                onClick={() => setStage("questions")}
                className="cosmic-button mt-4 px-4 py-2"
              >
                Proceed to Questions
              </button>
            </div>
          </div>
        )}

        {stage === "questions" && (
          <div className="bg-gray-800/80 border border-purple-600/50 p-8 rounded-2xl shadow-xl space-y-6 text-center">
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
                        className="accent-purple-500"
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
                disabled={readingQuestions.some(
                  (q) => !readingAnswers[q.id]
                )}
                className="cosmic-button mt-4 w-full px-4 py-2 disabled:opacity-50"
              >
                Proceed to Math
              </button>
            </div>
          </div>
        )}

        {stage === "math" && (
          <div className="bg-gray-800/80 border border-purple-600/50 p-8 rounded-2xl shadow-xl space-y-4 text-center">
            <h1 className="text-3xl font-bold mb-2">Math Problems</h1>
            <p>Answer each question. Press Enter after each answer.</p>

            <p className="mt-2">
              Problem {currentMathIndex + 1} of {mathProblems.length}:{" "}
              {mathProblems[currentMathIndex].a} ×{" "}
              {mathProblems[currentMathIndex].b} =
            </p>

            <input
              type="number"
              className="bg-gray-700/60 border border-purple-500 px-2 py-1 rounded w-full"
              onKeyDown={handleMathAnswer}
              placeholder="Type answer and press Enter"
              autoFocus
            />
          </div>
        )}

        {stage === "closing" && (
          <div className="bg-gray-800/80 border border-purple-600/50 p-8 rounded-2xl shadow-xl space-y-4 text-center">
            <h1 className="text-3xl font-bold">Test Complete</h1>
            <p>
              Great job! You have finished this test. Proceed to the next test
              when ready.
            </p>
            <button
              onClick={() => navigate("/studyhome")}
              className="cosmic-button mt-4 px-4 py-2"
            >
              Proceed to Next Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
