
import { useEffect, useState } from "react";
import api from "../services/api";

const Sidebar = ({ onSelect, unlockedSections, selectedIndex }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionRes = await api.get("/sections");
        const sorted = [...sectionRes.data].sort(
          (a, b) => a.sectionNumber - b.sectionNumber
        );
        setSections(sorted);

        // Auto-select latest unlocked section
        if (unlockedSections?.length > 0) {
          const last = [...unlockedSections].sort((a, b) => a - b).slice(-1)[0];
          if (sorted[last]) onSelect(sorted[last]._id, last);
        } else if (sorted[0]) {
          onSelect(sorted[0]._id, 0);
        }
      } catch (err) {
        console.error("❌ Error loading sections", err);
      }
    };

    fetchSections();
  }, [unlockedSections]);

  const handleClick = (index, id) => {
    if (unlockedSections.includes(index)) {
      onSelect(id, index);
    } else {
      alert("🔒 Please complete the previous section first.");
    }
  };

  const total = sections.length;
  const completed = unlockedSections.length;
  // const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const progressPercent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;


  return (
    <aside className="h-auto md:h-[680px] md:fixed scroll-hidden overflow-y-auto bg-gray-100 border-r shadow-md p-4 w-full md:w-80 font-serif">
      {/* Horizontal scrollable section numbers */}
      <div className="mb-4 overflow-x-auto scroll-hidden md:hidden">
        <div className="flex gap-3 w-max px-2">
          {sections.map((sec, idx) => (
            <button
              key={sec._id}
              onClick={() => handleClick(idx, sec._id)}
              className={`min-w-[36px] h-8 rounded-full text-sm font-bold px-3 shadow-sm transition-colors duration-200 ${selectedIndex === idx
                  ? "bg-orange-500 text-white"
                  : unlockedSections.includes(idx)
                    ? "bg-gray-200 text-gray-700 hover:bg-orange-100"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              disabled={!unlockedSections.includes(idx)}
            >
              {sec.sectionNumber}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Progress Bar */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Progress: {progressPercent}%
        </p>
        <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-700 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* ✅ Section List */}
      <ul className="space-y-1 hidden md:block">
        {sections.map((sec, idx) => (
          <li key={sec._id}>
            <button
              onClick={() => handleClick(idx, sec._id)}
              disabled={!unlockedSections.includes(idx)}
              className={`w-full text-left px-4 py-2 rounded-lg transition hover:scale-105 duration-300 ease-out font-medium ${unlockedSections.includes(idx)
                ? selectedIndex === idx
                  ? "bg-orange-200 shadow"
                  : "bg-white hover:bg-orange-100 text-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
            >
              {sec.sectionNumber}. {sec.title}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
