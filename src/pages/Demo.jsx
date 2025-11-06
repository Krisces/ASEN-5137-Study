import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";

export const Demo = () => {
    const navigate = useNavigate();
    const [stage, setStage] = useState("audio"); // audio, reading, questions, math, closing
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [readingAnswers, setReadingAnswers] = useState({});
    const [currentMathIndex, setCurrentMathIndex] = useState(0);
    const [mathAnswers, setMathAnswers] = useState([]);
    const audioRef = useRef(new Audio("/audio/bongos.mp3")); // useRef so audio persists across renders

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

    const handleAudioStart = () => {
        const audio = audioRef.current;
        audio.loop = true;
        audio.play();
        setAudioPlaying(true);
    };

    const handleAudioConfirm = () => {
        // DO NOT stop audio here; it should continue playing
        setStage("reading");
    };

    const handleReadingSubmit = () => setStage("questions");

    const handleQuestionChange = (id, value) =>
        setReadingAnswers({ ...readingAnswers, [id]: value });

    const handleMathAnswer = (e) => {
        if (e.key === "Enter") {
            const problem = mathProblems[currentMathIndex];
            setMathAnswers([...mathAnswers, { ...problem, answer: e.target.value }]);
            e.target.value = "";
            if (currentMathIndex + 1 < mathProblems.length) {
                setCurrentMathIndex(currentMathIndex + 1);
            } else {
                setStage("closing");
            }
        }
    };

    const handleProceedToStudy = () => {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
        navigate("/studyhome");
    };

    // Stop audio if component unmounts
    useEffect(() => {
        return () => {
            const audio = audioRef.current;
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center">
            <StarBackground />

            <div className="relative z-10 w-full max-w-3xl space-y-8">
                {/* Audio Stage */}
                {stage === "audio" && (
                    <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg text-center space-y-4">
                        <h1 className="text-3xl font-bold">Audio Test</h1>
                        <p>Click start to play the audio. Make sure you can hear it clearly.</p>
                        <div className="flex justify-center space-x-4">
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
                    <div className="bg-gray-800/80 p-8 rounded-lg shadow-lg space-y-4">
                        <h1 className="text-3xl font-bold text-center">Reading Comprehension</h1>
                        <p className="text-center">
                            Read the paragraph below carefully. You will answer questions afterward.
                        </p>
                        <p className="bg-gray-700/60 p-4 rounded text-left mt-2 mb-2">
                            {readingParagraph}
                        </p>
                        <div className="text-center">
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
                        <h1 className="text-3xl font-bold mb-4">Reading Questions</h1>
                        {readingQuestions.map((q) => (
                            <div key={q.id} className="space-y-2">
                                {/* Center the question */}
                                <p className="text-center">{q.question}</p>

                                {/* Left-align the options */}
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
                                onClick={() => setStage("math")}
                                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                            >
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
                            Problem {currentMathIndex + 1} of {mathProblems.length}:{" "}
                            {mathProblems[currentMathIndex].a} × {mathProblems[currentMathIndex].b} =
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
                        <h1 className="text-3xl font-bold">Demo Complete</h1>
                        <p>
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
