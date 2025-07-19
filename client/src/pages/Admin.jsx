import { useEffect, useState } from "react";
import axios from "../services/api";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";


const Admin = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    question: "",
    correctAnswer: ""
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSectionData, setNewSectionData] = useState({
    title: "",
    content: "", // ✅ Must not be undefined
    question: "",
    correctAnswer: ""
  });


  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await axios.get("/sections");
      console.log("Fetched sections:", res.data);

      setSections(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch sections");
    }
  };

  const handleSectionSelect = (id) => {
    axios.get(`/sections/${id}`).then((res) => {
      setSelectedSection(res.data);
      setFormData({
        title: res.data.title || "",
        content: res.data.content || "",  // Ensure it's never undefined
        question: res.data.questions?.[0]?.question || "",
        correctAnswer: res.data.questions?.[0]?.answer || ""
      });

      setShowAddForm(false); // Hide add form when editing
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewSectionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedSection = {
      ...selectedSection,
      title: formData.title,
      content: formData.content,
      questions: [{ question: formData.question, answer: formData.correctAnswer }]
    };

    try {
      await axios.put(`/sections/${selectedSection._id}`, updatedSection);
      toast.success("Section updated successfully");
      fetchSections();
      setSelectedSection(null);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update section");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This section will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/sections/${id}`);
        toast.success("🗑️ Section deleted");
        fetchSections();
        if (selectedSection?._id === id) setSelectedSection(null);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to delete section");
      }
    }
  };

  const handleAddNewSection = async (e) => {
    e.preventDefault();

    try {
      const newSection = {
        title: newSectionData.title,
        content: newSectionData.content,
        sectionNumber: sections.length + 1,
        questions: [
          {
            question: newSectionData.question,
            answer: newSectionData.correctAnswer
          }
        ]
      };

      await axios.post("/sections", newSection);
      toast.success("✅ New section added");
      fetchSections();
      setShowAddForm(false);
      setNewSectionData({
        title: "",
        content: "",
        question: "",
        correctAnswer: ""
      });
      console.log("Posting section:", newSection);

    } catch (err) {
      console.error("Failed to add section", err);
      toast.error("❌ Failed to add section");
    }
  };
  const formats = [
    "header",
    "bold", "italic", "underline",
    "list", "bullet",
    "link", "image"
  ];



  return (
    <div className="min-h-screen bg-gray-100 pt-12">
      <ToastContainer position="top-center" autoClose={2000} />
      <Navbar />
      <div className="flex">

        {/* Sidebar */}
        <aside className="w-1/4 p-6 bg-white/60 backdrop-blur-md border-r h-[calc(100vh-4rem)] overflow-y-auto shadow-lg fixed">

          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-xl font-bold text-orange-900">Sections</h2>
            <button
              onClick={() => {
                setShowAddForm((prev) => !prev);
                setSelectedSection(null); // <-- Reset Edit mode
              }}

              className="bg-orange-400 hover:bg-orange-700 text-white px-3 py-1 rounded-lg text-sm transition"
            >
              Add Section
            </button>
          </div>

          <ul className="space-y-3">
            {sections.map((sec) => (
              <li
                onClick={() => handleSectionSelect(sec._id)}
                key={sec._id}
                className="cursor-pointer hover:bg-orange-100 px-4 py-2 rounded-lg flex justify-between items-center text-gray-800 shadow"
              >
                <span >
                  Section {sec.sectionNumber}: {sec.title}
                </span>
                <button
                  onClick={() => handleDelete(sec._id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2m10 0H5"
                    />
                  </svg>

                </button>

              </li>
            ))}
          </ul>

        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-6 ml-96 h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Add New Section Form */}
          {showAddForm && !selectedSection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-md  p-6 rounded-2xl shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-orange-800">Add New Section</h2>
              <form onSubmit={handleAddNewSection} className="space-y-4">
                <div>
                  <label className="block text-lg font-bold text-orange-600 mb-1">
                    Add Section Title
                  </label>
                  <input
                    name="title"
                    placeholder="Title"
                    value={newSectionData.title}
                    onChange={handleNewChange}
                    required
                    className="w-full p-3 border rounded-xl shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-orange-600 mb-1">
                    Add Section Content
                  </label>
                  <textarea
                    name="content"
                    placeholder="Content"
                    value={newSectionData.content}
                    onChange={handleNewChange}
                    required
                    className="w-full p-3 border rounded-xl shadow-inner h-24"
                  />

                </div>

                <div>
                  <label className="block text-lg font-bold text-orange-600 mb-1">
                    Add Question
                  </label>
                  <textarea
                    name="question"
                    placeholder="Question (optional)"
                    value={newSectionData.question}
                    onChange={handleNewChange}
                    className="w-full p-3 border rounded-xl shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-orange-600 mb-1">
                    Add Correct Answer
                  </label>
                  <input
                    name="correctAnswer"
                    placeholder="Correct Answer (optional)"
                    value={newSectionData.correctAnswer}
                    onChange={handleNewChange}
                    className="w-full p-3 border rounded-xl shadow-inner"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 shadow-md"
                  >
                    Add Section
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Edit Section Form */}
          {selectedSection && !showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-orange-800">Edit Section</h2>
              <form onSubmit={handleUpdate} className="space-y-4">

                {/* Section Title */}
                <div>
                  <label className="block text-lg font-bold text-orange-600 mb-1">
                    Section Title
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl shadow-inner"
                    required
                  />





                </div>

                {/* Section Content */}
                <div>
                  <label className="block text-lg font-bold text-orange-600 mb-1">
                    Section Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl shadow-inner h-48"
                    required
                  />

                 



                </div>

                {/* Question */}
                <div>
                  <label className="block text-lg font-bold text-orange-600 mb-1">
                    Question (optional)
                  </label>
                  <textarea
                    placeholder="Enter question here"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl shadow-inner h-24"
                  />
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-lg font-bold text-orange-600 mb-1">
                    Correct Answer (optional)
                  </label>
                  <input
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl shadow-inner"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 shadow-md"
                  >
                    Update Section
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          {/* Instruction message */}
          {!showAddForm && !selectedSection && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 text-lg"
            >
              👈 Select a section to edit
            </motion.p>
          )}

        </main>
      </div>
    
    </div>

  );
};

export default Admin;
