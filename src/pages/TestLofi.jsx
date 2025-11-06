import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";

export const TestLofi = ({ studentEmail }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("reading");
  const [readingAnswers, setReadingAnswers] = useState({});
  const [currentMathIndex, setCurrentMathIndex] = useState(0);
  const [mathAnswers, setMathAnswers] = useState([]);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio("/audio/lofi.mp3"));
  const MAX_TIME_MS = 2 * 60 * 1000; // 2 minutes

  const paragraph = `Lofi beats are characterized by soft, relaxing rhythms often used for studying or relaxation. They feature mellow melodies, light percussion, and a generally calm atmosphere. Many people use lofi music as a background while reading, writing, or focusing on tasks. Listening to lofi can help reduce stress and improve concentration.`;

  const readingQuestions = [
    {
      id: 1,
      question: "What is lofi music commonly used for?",
      options: ["Studying, relaxing, or focusing", "Dancing at parties", "Live concerts", "Film soundtracks"],
    },
    {
      id: 2,
      question: "What are characteristics of lofi beats?",
      options: ["Mellow melodies and calm atmosphere", "Heavy metal guitar riffs", "Fast-paced electronic rhythms", "Orchestral arrangements"],
    },
  ];

  const mathProblems = [
    { id: 1, a: 5, b: 6 },
    { id: 2, a: 7, b: 4 },
    { id: 3, a: 8, b: 3 },
    { id: 4, a: 6, b: 7 },
    { id: 5, a: 9, b: 2 },
  ];

  // Start timer and audio
  useEffect(() => {
    startTimeRef.current = Date.now();

    const audio = audioRef.current;
    audio.loop = true;
    audio.play().catch(() => console.log("Autoplay blocked"));

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= MAX_TIME_MS) {
        clearInterval(timerRef.current);
        setStage("closing");
      }
    }, 500);

    return () => {
      clearInterval(timerRef.current);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleQuestionChange = (id, value) =>
    setReadingAnswers({ ...readingAnswers, [id]: value });

  const handleMathAnswer = (e) => {
    if (e.key === "Enter") {
      const problem = mathProblems[currentMathIndex];
      setMathAnswers([...mathAnswers, { ...problem, answer: Number(e.target.value) }]);
      e.target.value = "";
      if (currentMathIndex + 1 < mathProblems.length) {
        setCurrentMathIndex(currentMathIndex + 1);
      } else {
        setStage("closing");
      }
    }
  };

  const handleFinishTest = async () => {
    clearInterval(timerRef.current);
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;

    const totalTimeMs = Math.min(Date.now() - startTimeRef.current, MAX_TIME_MS);

    const readingResults = readingQuestions.map(q => ({
      studentEmail,
      testName: "Lofi",
      questionType: "reading",
      questionId: q.id,
      isCorrect: readingAnswers[q.id] === q.options[0],
      totalTimeMs
    }));

    const mathResults = mathAnswers.map(a => ({
      studentEmail,
      testName: "Lofi",
      questionType: "math",
      questionId: a.id,
      isCorrect: a.answer === a.a * a.b,
      totalTimeMs
    }));

    const allResults = [...readingResults, ...mathResults];

    await fetch("/api/saveTestResults", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(allResults)
    });

    navigate("/studyhome"); // back to main
  };

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center">
      <StarBackground />
      <div className="relative z-10 w-full max-w-3xl space-y-8">

        {/* Reading Stage */}
        {stage === "reading" && (
          <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-4">
            <h1 className="text-3xl font-bold text-center">Reading Comprehension</h1>
            <p className="text-center">Read the paragraph carefully. Questions will follow.</p>
            <p className="bg-gray-700/60 p-4 rounded text-left mt-2 mb-2">{paragraph}</p>
            <div className="text-center">
              <button onClick={() => setStage("questions")} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                Proceed to Questions
              </button>
            </div>
          </div>
        )}

        {/* Questions Stage */}
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
              <button onClick={() => setStage("math")} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                Proceed to Math
              </button>
            </div>
          </div>
        )}

        {/* Math Stage */}
        {stage === "math" && (
          <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-4 text-center">
            <h1 className="text-3xl font-bold mb-2">Math Problems</h1>
            <p>Solve the multiplication problems below. Press Enter after each answer.</p>
            <p className="mt-2">
              Problem {currentMathIndex + 1} of {mathProblems.length}: {mathProblems[currentMathIndex].a} × {mathProblems[currentMathIndex].b} =
            </p>
            <input
              type="number"
              className="bg-gray-700/60 border border-gray-600 px-2 py-1 rounded w-full"
              onKeyDown={handleMathAnswer}
              placeholder="Type answer and press Enter"
            />
          </div>
        )}

        {/* Closing Stage */}
        {stage === "closing" && (
          <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-4 text-center">
            <h1 className="text-3xl font-bold">Test Complete</h1>
            <p>Great job! You have finished this test. Return to the main study page.</p>
            <button onClick={handleFinishTest} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
              Proceed to Study Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
