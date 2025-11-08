import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";

export const Demo = () => {
    const navigate = useNavigate();
    const [stage, setStage] = useState("audio"); // audio, reading, questions, mathInstructions, math, closing
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [readingAnswers, setReadingAnswers] = useState({});
    const [currentMathIndex, setCurrentMathIndex] = useState(0);
    const [mathAnswers, setMathAnswers] = useState([]);
    const audioRef = useRef(new Audio("/audio/bongos.mp3"));
    const mathTimerRef = useRef(null);

    const mathProblems = [
        { a: 3, b: 12 },
        { a: 10, b: 2 },
        { a: 11, b: 3 },
        { a: 5, b: 8 },
        { a: 6, b: 12 },
    ];

    const readingParagraph = `
Hummingbirds are tiny birds known for their rapid wing beats and ability to hover.
They primarily feed on nectar from flowers, making them essential pollinators in many ecosystems.
Hummingbirds have excellent memories and can recall which flowers they have visited and when.
`;

    const readingQuestions = [
        {
            id: 1,
            question: "What is the primary food source of hummingbirds?",
            options: ["Insects", "Nectar from flowers", "Seeds", "Fruits"],
        },
        {
            id: 2,
            question: "What unique ability do hummingbirds have?",
            options: ["Hovering in place", "Running fast", "Swimming", "Camouflaging"],
        },
    ];

    // --- Handlers ---
    const handleAudioStart = () => {
        const audio = audioRef.current;
        audio.loop = true;
        audio.play();
        setAudioPlaying(true);
    };

    const handleAudioConfirm = () => setStage("reading");

    const handleReadingSubmit = () => setStage("questions");

    const handleQuestionChange = (id, value) =>
        setReadingAnswers({ ...readingAnswers, [id]: value });

    const handleProceedToMathInstructions = () => {
        const allAnswered = readingQuestions.every((q) => readingAnswers[q.id]);
        if (!allAnswered) {
            alert("Please answer all reading questions before proceeding.");
            return;
        }
        setStage("mathInstructions");
    };

    const handleStartMathTest = () => {
        setStage("math");
        setCurrentMathIndex(0);
        setMathAnswers([]);
        mathTimerRef.current = setTimeout(() => setStage("closing"), 60 * 1000);
    };

    const handleMathAnswer = (e) => {
        if (e.key === "Enter") {
            const value = e.target.value.trim();
            if (value === "" || isNaN(Number(value))) {
                alert("Please enter a valid number before proceeding.");
                return; // prevent skipping
            }

            const problem = mathProblems[currentMathIndex];
            setMathAnswers([...mathAnswers, { ...problem, answer: Number(value) }]);
            e.target.value = "";

            if (currentMathIndex + 1 < mathProblems.length) {
                setCurrentMathIndex(currentMathIndex + 1);
            } else {
                clearTimeout(mathTimerRef.current);
                setStage("closing"); // go to closing when last problem answered
            }
        }
    };

    const handleProceedToStudy = () => {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
        navigate("/studyhome");
    };

    useEffect(() => {
        return () => {
            const audio = audioRef.current;
            audio.pause();
            audio.currentTime = 0;
            clearTimeout(mathTimerRef.current);
        };
    }, []);

    // --- Render ---
    return (
        <div className="relative min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center">
            <StarBackground />
            <div className="relative z-10 w-full max-w-3xl space-y-12">

                {/* Audio Stage */}
                {stage === "audio" && (
                    <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg text-center space-y-6">
                        <h1 className="text-3xl font-bold mb-4">Audio Test</h1>
                        <p>Click start to play the audio. Make sure you can hear it clearly.</p>
                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                                onClick={handleAudioStart}
                                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Start Audio
                            </button>
                            <button
                                onClick={handleAudioConfirm}
                                disabled={!audioPlaying}
                                className={`px-4 py-2 rounded ${audioPlaying
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-gray-600 cursor-not-allowed"
                                    }`}
                            >
                                I can hear it
                            </button>
                        </div>
                    </div>
                )}

                {/* Reading Stage */}
                {stage === "reading" && (
                    <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-6">
                        <h1 className="text-3xl font-bold text-center mb-4">Reading Comprehension</h1>
                        <p className="text-center mb-4">
                            You will be given a paragraph to read. After your reading is complete,
                            you will be asked questions about the paragraph.
                        </p>
                        <p className="bg-gray-700/60 p-4 rounded text-left">{readingParagraph}</p>
                        <div className="text-center mt-6">
                            <button
                                onClick={handleReadingSubmit}
                                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Proceed to Questions
                            </button>
                        </div>
                    </div>
                )}

                {/* Questions Stage */}
                {stage === "questions" && (
                    <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-6 text-center">
                        <h1 className="text-3xl font-bold mb-6">Reading Questions</h1>
                        {readingQuestions.map((q) => (
                            <div key={q.id} className="space-y-3">
                                <p className="text-center mb-2">{q.question}</p>
                                <div className="space-y-2 text-left mx-auto max-w-md">
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
                        <div className="text-center mt-6">
                            <button
                                onClick={handleProceedToMathInstructions}
                                className={`px-4 py-2 rounded ${readingQuestions.every(q => readingAnswers[q.id])
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-600 cursor-not-allowed"
                                    }`}
                                disabled={!readingQuestions.every(q => readingAnswers[q.id])}
                            >
                                Proceed to Math Instructions
                            </button>
                        </div>
                    </div>
                )}

                {/* Math Instructions Stage */}
                {stage === "mathInstructions" && (
                    <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-6 text-center">
                        <h1 className="text-3xl font-bold mb-4">Math Test Instructions</h1>
                        <p className="mb-4">
                            You will be given multiplication problems from 1×1 up to 13×13. 
                            You will have <strong>1 minute</strong> to answer as many problems as possible.
                        </p>
                        <p className="mb-6">
                            There are 42–43 problems in total per test, so it’s okay if you can’t answer all within the time limit.
                            After the timer is over, you will automatically proceed to the next page.
                        </p>
                        <button
                            onClick={handleStartMathTest}
                            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Start Math Test
                        </button>
                    </div>
                )}

                {/* Math Stage */}
                {stage === "math" && (
                    <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-6 text-center">
                        <h1 className="text-3xl font-bold mb-4">Math Problems</h1>
                        <p className="mb-4">Enter a number for each problem and press Enter. Skipping is not allowed.</p>
                        <p className="mb-4">
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

                {/* Closing Stage */}
                {stage === "closing" && (
                    <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-6 text-center">
                        <h1 className="text-3xl font-bold mb-4">Demo Complete</h1>
                        <p className="mb-6">
                            Great job! You have finished the demo. In the main study, you will go through the actual tests
                            with music, reading comprehension, and math problems.
                        </p>
                        <button
                            onClick={handleProceedToStudy}
                            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                        >
                            Proceed to Study
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
