import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { BeforeSurvey } from "./pages/BeforeSurvey";
import { Demo } from "./pages/Demo";
import { StudyHome } from "./pages/StudyHome";
import { NotFound } from "./pages/NotFound";
import { TestNoMusic } from "./pages/TestNoMusic";
import { TestClassical } from "./pages/TestClassical";
import { TestRock } from "./pages/TestRock";
import { TestLofi } from "./pages/TestLofi";
import { AfterSurvey } from "./pages/AfterSurvey"; // ✅ Added
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Main flow */}
          <Route index element={<Home />} />
          <Route path="/before-survey" element={<BeforeSurvey />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/studyhome" element={<StudyHome />} />

          {/* Test routes */}
          <Route path="/testnomusic" element={<TestNoMusic />} />
          <Route path="/testclassical" element={<TestClassical />} />
          <Route path="/testrock" element={<TestRock />} />
          <Route path="/testlofi" element={<TestLofi />} />

          {/* ✅ Post-survey route */}
          <Route path="/aftersurvey" element={<AfterSurvey />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Analytics />
      </BrowserRouter>
    </>
  );
}

export default App;
