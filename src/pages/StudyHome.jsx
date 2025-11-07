import { useState, useEffect } from "react";
import { StarBackground } from "../components/StarBackground";
import { useNavigate } from "react-router-dom";

export const StudyHome = () => {
  const navigate = useNavigate();
  const [unlockedTests, setUnlockedTests] = useState(1);
  const [completedTests, setCompletedTests] = useState([]);

  const tests = [
    { id: 1, title: "No Music Test", context: "Complete the test without any background music." },
    { id: 2, title: "Classical Music Test", context: "This test will play classical music while you complete it." },
    { id: 3, title: "70s/80s Rock Test", context: "Rock out! This test will feature 70s and 80s rock music." },
    { id: 4, title: "Lofi Beats Test", context: "Relax with lofi beats while completing this test." },
  ];

  useEffect(() => {
    const completed = parseInt(localStorage.getItem("completedTests") || "0", 10);
    setUnlockedTests(Math.min(completed + 1, tests.length));

    // Track completed individually to disable retakes
    const completedList = [];
    for (let i = 1; i <= completed; i++) {
      completedList.push(i);
    }
    setCompletedTests(completedList);
  }, []);

  const handleStartTest = (testId) => {
    if (testId > unlockedTests) return; // not unlocked yet
    if (completedTests.includes(testId)) return; // already done

    const routeMap = {
      1: "/testnomusic",
      2: "/testclassical",
      3: "/testrock",
      4: "/testlofi"
    };

    navigate(routeMap[testId]);
  };

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center">
      <StarBackground />

      <div className="relative z-10 w-full max-w-4xl space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Study Tests</h1>
          <p className="text-gray-300">
            Complete each test in order. Once you finish one, the next will unlock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test) => {
            const isUnlocked = test.id <= unlockedTests;
            const isCompleted = completedTests.includes(test.id);

            return (
              <div
                key={test.id}
                onClick={() => handleStartTest(test.id)}
                className={`bg-gray-800/80 p-6 rounded-lg shadow-lg flex flex-col justify-between h-full 
                  ${isUnlocked && !isCompleted
                    ? "hover:bg-blue-700 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                  }`}
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">{test.title}</h2>
                  <p className="text-gray-300">{test.context}</p>
                </div>

                {isCompleted ? (
                  <p className="mt-4 text-green-400 text-center font-semibold">Completed</p>
                ) : isUnlocked ? (
                  <button className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-950 w-full">
                    Start
                  </button>
                ) : (
                  <p className="mt-4 text-gray-500 text-center">Locked</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
