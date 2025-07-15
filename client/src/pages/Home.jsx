// pages/Home.jsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SectionContent from "../components/SectionContent";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Home = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [unlockedSections, setUnlockedSections] = useState([0]);

  // Fetch user's unlocked progress
  const fetchProgress = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const unlocked = Array.isArray(res.data)
        ? res.data
        : res.data.unlocked || [0];

      setUnlockedSections(unlocked.map(Number));
    } catch (err) {
      console.error("❌ Error fetching progress", err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  // Unlock next section and auto-select it
  const handleUnlockNext = async (newIndex) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api.post(
        "/progress/unlock",
        { sectionIndex: newIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchProgress(); // 🔁 Refresh unlocked sections

      // Load section data
      const sectionRes = await api.get("/sections");
      const sorted = [...sectionRes.data].sort(
        (a, b) => a.sectionNumber - b.sectionNumber
      );

      if (sorted[newIndex]) {
        setSelectedId(sorted[newIndex]._id);
        setSectionIndex(newIndex);
      }
    } catch (err) {
      console.error("❌ Unlock error:", err);
    }
  };

  // Handle selecting a section from sidebar
  const handleSelectSection = (id, index) => {
    setSelectedId(id);
    setSectionIndex(index);
  };

  return (
    <div className="home font-serif bg-[#f9f5ee] ">
      <Navbar />
      <div className="main-content flex flex-col md:flex-row mt-12 gap-4">

        <Sidebar
          unlockedSections={unlockedSections}
          selectedIndex={sectionIndex} // ✅ Pass selectedIndex for highlight
          onSelect={handleSelectSection}
        />
        {selectedId && (
          <SectionContent
            sectionId={selectedId}
            sectionIndex={sectionIndex}
            onUnlockNext={handleUnlockNext}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
