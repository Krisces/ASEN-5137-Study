import { useNavigate } from "react-router-dom";
import { StarBackground } from "../components/StarBackground";

export const StudyHome = () => {
  const navigate = useNavigate();

  // Map test IDs to routes and labels
  const tests = [
    { id: 1, name: "No Music", route: "/testnomusic" },
    { id: 2, name: "Classical", route: "/testclassical" },
    { id: 3, name: "Rock", route: "/testrock" },
    { id: 4, name: "Lofi", route: "/testlofi" },
  ];

  // Compute completed and unlocked tests from localStorage
  const completed = parseInt(localStorage.getItem("completedTests") || "0", 10);
  const unlockedTests = completed + 1;

  const handleStartTest = (testId) => {
    if (testId <= unlockedTests) {
      const test = tests.find(t => t.id === testId);
      if (test) navigate(test.route);
    } else {
      alert("This test is locked. Complete previous tests first.");
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center">
      <StarBackground />
      <div className="relative z-10 w-full max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Study Home</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`p-6 rounded-lg shadow-lg text-center ${
                test.id <= unlockedTests
                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-700 cursor-not-allowed opacity-50"
              }`}
              onClick={() => handleStartTest(test.id)}
            >
              <h2 className="text-2xl font-semibold">{test.name}</h2>
              {test.id > unlockedTests && <p className="mt-2 text-sm">Locked</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
