import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";

export const TestRock = ({ studentEmail }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("reading");
  const [readingAnswers, setReadingAnswers] = useState({});
  const [currentMathIndex, setCurrentMathIndex] = useState(0);
  const [mathAnswers, setMathAnswers] = useState([]);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio("/audio/rock.mp3"));
  const MAX_TIME_MS = 2 * 60 * 1000; // 2 minutes

  const paragraph = `Rock music from the 70s and 80s has shaped popular culture and influenced generations of musicians. Bands like Queen, Led Zeppelin, and The Rolling Stones created iconic songs that remain popular today. Rock music often features strong guitar riffs, memorable melodies, and energetic rhythms. Listening to rock music can energize listeners and evoke feelings of excitement and nostalgia.`;

  const readingQuestions = [
    {
      id: 1,
      question: "Which bands are mentioned in the paragraph?",
      options: ["Queen, Led Zeppelin, The Rolling Stones", "Nirvana, Pearl Jam, Metallica", "The Beatles, Oasis, Blur", "Coldplay, U2, Radiohead"],
    },
    {
      id: 2,
      question: "What are characteristics of 70s/80s rock music?",
      options: ["Strong guitar riffs and energetic rhythms", "Slow melodies and soft vocals", "Electronic beats and synths", "Jazz improvisation and swing"],
    },
  ];

  const mathProblems = [
    { id: 1, a: 4, b: 7 },
    { id: 2, a: 6, b: 5 },
    { id: 3, a: 3, b: 9 },
    { id: 4, a: 8, b: 6 },
    { id: 5, a: 7, b: 4 },
  ];

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
      testName: "Rock",
      questionType: "reading",
      questionId: q.id,
      isCorrect: readingAnswers[q.id] === q.options[0],
      totalTimeMs
    }));

    const mathResults = mathAnswers.map(a => ({
      studentEmail,
      testName: "Rock",
      questionType: "math",
      questionId: a.id,
      isCorrect: a.answer === a.a * a.b,
      totalTimeMs
    }));

    const allResults = [...readingResults, ...mathResults];

    // Save results
    await fetch("/api/saveTestResults", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(allResults)
    });

    // Unlock next test (Lofi)
    const completed = parseInt(localStorage.getItem("completedTests") || "0", 10);
    if (completed < 3) {
      localStorage.setItem("completedTests", "3");
    }

    navigate("/testlofi");
  };

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center">
      <StarBackground />
      <div className="relative z-10 w-full max-w-3xl space-y-8">

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

        {stage === "closing" && (
          <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-4 text-center">
            <h1 className="text-3xl font-bold">Test Complete</h1>
            <p>Great job! You have finished this test. Proceed to the next test when ready.</p>
            <button onClick={handleFinishTest} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
              Proceed to Next Test
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
