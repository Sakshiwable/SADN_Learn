import { useEffect, useState } from "react";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";


const SectionContent = ({ sectionId, sectionIndex, onUnlockNext }) => {
  const [section, setSection] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (!sectionId) return;

    api
      .get(`/sections/${sectionId}`)
      .then((res) => setSection(res.data))
      .catch((err) => console.error("Error loading section", err));
  }, [sectionId]);

  const handleAnswerChange = (e) => {
    const input = e.target.value;
    setUserAnswer(input);

    if (
      section &&
      section.questions?.[0]?.answer &&
      input.trim().toLowerCase() === section.questions[0].answer.trim().toLowerCase()
    ) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleMarkComplete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to track progress.");
      return;
    }

    try {
      await api.post(
        "/progress/unlock",
        { sectionIndex: sectionIndex + 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Next section unlocked!");
      onUnlockNext(sectionIndex + 1);
    } catch (err) {
      console.error("Error updating progress", err);
      toast.error("Failed to update progress.");
    }
  };

  const renderLinkedContent = (text) => {
    const linked = text.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" class="text-blue-700 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return { __html: linked };
  };

  if (!section) return <div className="p-4">📚 Loading section...</div>;

  const hasQuestions =
    section.questions &&
    section.questions.length > 0 &&
    section.questions[0].question.trim() !== "";


  return (
    <div className="section-content p-6 md:ml-80 bg-gray-100 rounded shadow-md w-full">
      <ToastContainer position="top-center" autoClose={2000} />
      <h2 className="text-2xl font-bold mb-2 text-orange-800">
        Section {section.sectionNumber}: {section.title}
      </h2>

      {/* ✅ Render Content */}
      <div
        className="mb-6 p-3 rounded-md bg-orange-50 whitespace-pre-wrap border leading-relaxed text-gray-700"
        dangerouslySetInnerHTML={renderLinkedContent(section.content)}
      />

      {/* <div
        className="prose max-w-none [&_img]:max-w-full [&_img]:h-auto [&_table]:w-full [&_td]:border [&_td]:p-2"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />

 */}

      {/* ✅ If question is present, show input box */}
      {hasQuestions && (
        <div className="mb-4 p-3 bg-orange-50 rounded-md">
          <p className="font-semibold text-gray-800">Q1: {section.questions[0].question}</p>
          <input
            type="text"
            value={userAnswer}
            onChange={handleAnswerChange}
            placeholder="Your answer"
            className="mt-2 w-full p-2 border rounded"
          />
          {!isCorrect && userAnswer && (
            <p className="text-red-600 text-sm mt-1">❌ Incorrect answer. Try again.</p>
          )}
          {isCorrect && (
            <p className="text-green-600 text-sm mt-1">✅ Correct!</p>
          )}
        </div>
      )}

      {/* ✅ Enable button if either no question OR correct answer */}
      <button
        onClick={handleMarkComplete}
        disabled={hasQuestions && !isCorrect}
        className={`mt-6 px-4 py-2 rounded font-semibold text-white ${hasQuestions && !isCorrect
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-orange-500 hover:bg-orange-700"
          }`}
      >
        Mark Section as Completed
      </button>
    </div>
  );
};

export default SectionContent;

