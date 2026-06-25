import { API_URL } from "../../config/api";
// import React, { useState } from "react";
// import { Link, Links, useNavigate } from "react-router-dom";
// import { 
//   Bot, ArrowLeft, Upload, X, Plus, Trash2,
//   Video, FileText, Image, Settings
// } from "lucide-react";

// const CreateCourse = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [courseData, setCourseData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     price: "",
//     level: "beginner",
//     thumbnail: null,
//     objectives: [""],
//     requirements: [""]
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCourseData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleArrayChange = (field, index, value) => {
//     setCourseData(prev => ({
//       ...prev,
//       [field]: prev[field].map((item, i) => i === index ? value : item)
//     }));
//   };

//   const addArrayItem = (field) => {
//     setCourseData(prev => ({
//       ...prev,
//       [field]: [...prev[field], ""]
//     }));
//   };

//   const removeArrayItem = (field, index) => {
//     setCourseData(prev => ({
//       ...prev,
//       [field]: prev[field].filter((_, i) => i !== index)
//     }));
//   };

//   const handleThumbnailUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setCourseData(prev => ({
//           ...prev,
//           thumbnail: e.target.result
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Here you would typically send the data to your backend
//     console.log("Course Data:", courseData);
//     alert("Course created successfully!");
//     navigate("/instructor-my-courses");
//   };

//   const nextStep = () => {
//     if (step < 3) setStep(step + 1);
//   };

//   const prevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center gap-3">
//               <Link to="/instructor-dashboard" className="flex items-center gap-2">
//                 <Bot className="text-purple-600 w-8 h-8" />
//                 <span className="text-xl font-bold text-gray-900">BotVortex</span>
//               </Link>
//               <span className="text-gray-400">/</span>
//               <button 
//                 onClick={() => navigate("/instructor-my-courses")}
//                 className="text-gray-600 hover:text-gray-900"
//               >
//                 My Courses
//               </button>
//               <span className="text-gray-400">/</span>
//               <span className="text-gray-900 font-medium">Create Course</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Progress Steps */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <div className="flex items-center justify-between">
//             {[1, 2, 3].map((stepNumber) => (
//               <div key={stepNumber} className="flex items-center">
//                 <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
//                   step >= stepNumber 
//                     ? "bg-blue-600 text-white" 
//                     : "bg-gray-200 text-gray-600"
//                 }`}>
//                   {stepNumber}
//                 </div>
//                 <span className={`ml-2 text-sm font-medium ${
//                   step >= stepNumber ? "text-blue-600" : "text-gray-500"
//                 }`}>
//                   {stepNumber === 1 && "Basic Info"}
//                   {stepNumber === 2 && "Curriculum"}
//                   {stepNumber === 3 && "Pricing"}
//                 </span>
//                 {stepNumber < 3 && (
//                   <div className={`w-16 h-0.5 mx-4 ${
//                     step > stepNumber ? "bg-blue-600" : "bg-gray-200"
//                   }`} />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* Step 1: Basic Information */}
//           {step === 1 && (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Information</h2>

//               <div className="space-y-6">
//                 {/* Course Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Course Title *
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={courseData.title}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Advanced React Development"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 {/* Course Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Course Description *
//                   </label>
//                   <textarea
//                     name="description"
//                     value={courseData.description}
//                     onChange={handleInputChange}
//                     rows="4"
//                     placeholder="Describe what students will learn in this course..."
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 {/* Category and Level */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Category *
//                     </label>
//                     <select
//                       name="category"
//                       value={courseData.category}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     >
//                       <option value="">Select Category</option>
//                       <option value="web-development">Web Development</option>
//                       <option value="mobile-development">Mobile Development</option>
//                       <option value="data-science">Data Science</option>
//                       <option value="design">Design</option>
//                       <option value="business">Business</option>
//                       <option value="marketing">Marketing</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Difficulty Level *
//                     </label>
//                     <select
//                       name="level"
//                       value={courseData.level}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="beginner">Beginner</option>
//                       <option value="intermediate">Intermediate</option>
//                       <option value="advanced">Advanced</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Course Thumbnail */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Course Thumbnail
//                   </label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                     {courseData.thumbnail ? (
//                       <div className="relative inline-block">
//                         <img
//                           src={courseData.thumbnail}
//                           alt="Course thumbnail"
//                           className="w-48 h-32 object-cover rounded-lg"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setCourseData(prev => ({ ...prev, thumbnail: null }))}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-sm text-gray-600 mb-2">
//                           Drag and drop an image, or click to browse
//                         </p>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleThumbnailUpload}
//                           className="hidden"
//                           id="thumbnail-upload"
//                         />
//                         <label
//                           htmlFor="thumbnail-upload"
//                           className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
//                         >
//                           <Upload className="w-4 h-4" />
//                           Choose Image
//                         </label>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Learning Objectives */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     What will students learn?
//                   </label>
//                   <div className="space-y-2">
//                     {courseData.objectives.map((objective, index) => (
//                       <div key={index} className="flex gap-2">
//                         <input
//                           type="text"
//                           value={objective}
//                           onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
//                           placeholder="e.g., Build real-world applications"
//                           className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         {courseData.objectives.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeArrayItem('objectives', index)}
//                             className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     <button
//                       type="button"
//                       onClick={() => addArrayItem('objectives')}
//                       className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Learning Objective
//                     </button>
//                   </div>
//                 </div>

//                 {/* Requirements */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Requirements
//                   </label>
//                   <div className="space-y-2">
//                     {courseData.requirements.map((requirement, index) => (
//                       <div key={index} className="flex gap-2">
//                         <input
//                           type="text"
//                           value={requirement}
//                           onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
//                           placeholder="e.g., Basic programming knowledge"
//                           className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         {courseData.requirements.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeArrayItem('requirements', index)}
//                             className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     <button
//                       type="button"
//                       onClick={() => addArrayItem('requirements')}
//                       className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Requirement
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end pt-6">
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Continue to Curriculum
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Curriculum */}
//           {step === 2 && (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>

//               <div className="space-y-6">
//                 <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
//                   <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                     Start building your course
//                   </h3>
//                   <p className="text-gray-600 mb-6">
//                     Add sections and lectures to create your course curriculum
//                   </p>
//                   <button
//                     type="button"
//                     className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Create Your First Lecture
//                   </button>
//                 </div>

//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <p className="text-yellow-800 text-sm">
//                     <strong>Note:</strong> You can add lectures and sections after creating the course.
//                     For now, focus on setting up the basic course structure.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex justify-between pt-6">
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   Back to Basic Info
//                 </button>
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Continue to Pricing
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Pricing */}
//           {step === 3 && (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h2>

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Course Price (USD) *
//                   </label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
//                     <input
//                       type="number"
//                       name="price"
//                       value={courseData.price}
//                       onChange={handleInputChange}
//                       placeholder="0.00"
//                       min="0"
//                       step="0.01"
//                       className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       required
//                     />
//                   </div>
//                   <p className="text-sm text-gray-600 mt-2">
//                     Set the price for your course. You can offer discounts and promotions later.
//                   </p>
//                 </div>

//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                   <h4 className="font-semibold text-blue-900 mb-2">Pricing Information</h4>
//                   <ul className="text-blue-800 text-sm space-y-1">
//                     <li>• Platform fee: 30% of course price</li>
//                     <li>• You earn: 70% of course price</li>
//                     <li>• Payments are processed monthly</li>
//                     <li>• Minimum payout: $50</li>
//                   </ul>
//                 </div>
//               </div>

//               <div className="flex justify-between pt-6">
//                 <button
//                   type="button"
//                   onClick={prevStep}
//                   className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   Back to Curriculum
//                 </button>
//                 <Link to={'/create-course'}
//                   type="submit"
//                   className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
//                 >
//                   Create Course
//                 </Link>
//               </div>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateCourse;

import React, { useState } from "react";
import { Link, Links, useNavigate } from "react-router-dom";
import {

  Bot, ArrowLeft, Upload, X, Plus, Trash2,
  Video, FileText, Image, Settings, DollarSign, Coins
} from "lucide-react";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Combined state for all forms
  const [courseData, setCourseData] = useState({
    // Form 1 Data
    title: "",
    description: "",
    duration: "",
    overview: "",
    learningObjectives: "",
    outcome: "",
    tools: "",
    languages: "",
    prerequisites: "",
    banner: null,
    syllabus: null,

    // Form 2 Data
    modules: [{
      name: "",
      description: "",
      lessonFile: null,
      quizzes: [{ question: "", answer: "" }]
    }],

    // Form 3 Data
    lessons: [{
      title: "",
      videoFile: null
    }],

    // Pricing Data
    price: "",
    priceInCoins: 0,
    category: "",
    level: "beginner"
  });

  // Coin conversion rate
  const COIN_RATE = 100; // 1 USD = 100 coins

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate coins when price changes
    if (name === "price") {
      setCourseData(prev => ({
        ...prev,
        priceInCoins: Math.round(value * COIN_RATE)
      }));
    }
  };

  // Handle file uploads
  const handleFileUpload = (field, file) => {
    setCourseData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  // Module management
  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, {
        name: "",
        description: "",
        lessonFile: null,
        quizzes: [{ question: "", answer: "" }]
      }]
    }));
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...courseData.modules];
    updatedModules[index][field] = value;
    setCourseData(prev => ({ ...prev, modules: updatedModules }));
  };

  const removeModule = (index) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  // Quiz management within modules
  const addQuiz = (moduleIndex) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].quizzes.push({ question: "", answer: "" });
    setCourseData(prev => ({ ...prev, modules: updatedModules }));
  };

  const updateQuiz = (moduleIndex, quizIndex, field, value) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].quizzes[quizIndex][field] = value;
    setCourseData(prev => ({ ...prev, modules: updatedModules }));
  };

  const removeQuiz = (moduleIndex, quizIndex) => {
    const updatedModules = [...courseData.modules];
    updatedModules[moduleIndex].quizzes = updatedModules[moduleIndex].quizzes.filter((_, i) => i !== quizIndex);
    setCourseData(prev => ({ ...prev, modules: updatedModules }));
  };

  // Lesson management
  const addLesson = () => {
    setCourseData(prev => ({
      ...prev,
      lessons: [...prev.lessons, { title: "", videoFile: null }]
    }));
  };

  const updateLesson = (index, field, value) => {
    const updatedLessons = [...courseData.lessons];
    updatedLessons[index][field] = value;
    setCourseData(prev => ({ ...prev, lessons: updatedLessons }));
  };

  const removeLesson = (index) => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index)
    }));
  };

  // Navigation
  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const [loading, setLoading] = useState(false);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("instructor_token");
    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    try {
      const payload = {
        title: courseData.title,
        description: courseData.description,
        level: courseData.level,
        price: courseData.priceInCoins,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop", // placeholder or handle upload
        learnings: courseData.learningObjectives ? courseData.learningObjectives.split("\n") : []
      };

      const response = await fetch(`${API_URL}/instructor/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Course created successfully!");
        navigate("/instructor-my-courses");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error("Error creating course:", err);
      alert("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link to="/instructor-dashboard" className="flex items-center gap-2">
                <Bot className="text-purple-600 w-8 h-8" />
                <span className="text-xl font-bold text-gray-900">BotVortex</span>
              </Link>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => navigate("/instructor-my-courses")}
                className="text-gray-600 hover:text-gray-900"
              >
                My Courses
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">Create Course</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= stepNumber
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600"
                  }`}>
                  {stepNumber}
                </div>
                <span className={`ml-2 text-sm font-medium ${step >= stepNumber ? "text-purple-600" : "text-gray-500"
                  }`}>
                  {stepNumber === 1 && "Basic Info"}
                  {stepNumber === 2 && "Curriculum"}
                  {stepNumber === 3 && "Content"}
                  {stepNumber === 4 && "Pricing"}
                </span>
                {stepNumber < 4 && (
                  <div className={`w-16 h-0.5 mx-4 ${step > stepNumber ? "bg-purple-600" : "bg-gray-200"
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information (Form 1) */}
          {step === 1 && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1 rounded-2xl shadow-2xl">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">
                  🚀 Add New Course – Basic Information
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course Name */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-semibold">Course Name</label>
                    <input
                      type="text"
                      name="title"
                      value={courseData.title}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      placeholder="Enter course name"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-semibold">Course Description</label>
                    <textarea
                      rows="3"
                      name="description"
                      value={courseData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      placeholder="Enter course description"
                    ></textarea>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block mb-1 font-semibold">Course Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={courseData.duration}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      placeholder="Eg: 3 Months, 40 Hours"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block mb-1 font-semibold">Category</label>
                    <select
                      name="category"
                      value={courseData.category}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                    >
                      <option value="">Select Category</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>

                  {/* Overview */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-semibold">Overview</label>
                    <textarea
                      rows="2"
                      name="overview"
                      value={courseData.overview}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      placeholder="Overview content"
                    ></textarea>
                  </div>

                  {/* Learning Objectives */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-semibold">Learning Objectives</label>
                    <textarea
                      rows="3"
                      name="learningObjectives"
                      value={courseData.learningObjectives}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      placeholder="What students will learn"
                    ></textarea>
                  </div>

                  {/* Outcome */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-semibold">Outcome</label>
                    <textarea
                      rows="2"
                      name="outcome"
                      value={courseData.outcome}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      placeholder="Expected outcomes"
                    ></textarea>
                  </div>

                  {/* Tools */}
                  <div>
                    <label className="block mb-1 font-semibold">Tools Required</label>
                    <input
                      type="text"
                      name="tools"
                      value={courseData.tools}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      placeholder="Eg: VS Code, Arduino IDE"
                    />
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block mb-1 font-semibold">Languages Used</label>
                    <input
                      type="text"
                      name="languages"
                      value={courseData.languages}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      placeholder="Eg: C++, Python, JavaScript"
                    />
                  </div>

                  {/* Pre-Requests */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-semibold">Pre-Requests</label>
                    <input
                      type="text"
                      name="prerequisites"
                      value={courseData.prerequisites}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      placeholder="Eg: Basic programming knowledge"
                    />
                  </div>

                  {/* Banner Upload */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-semibold">Banner Image</label>
                    <div className="border-2 border-dashed border-white/50 p-4 rounded-xl cursor-pointer text-center hover:bg-white/10 transition">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload("banner", e.target.files[0])}
                        id="bannerUpload"
                      />
                      <label htmlFor="bannerUpload" className="cursor-pointer">
                        {courseData.banner ? courseData.banner.name : "Click to upload banner"}
                      </label>
                    </div>
                  </div>

                  {/* Syllabus Upload */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-semibold">Syllabus (PDF/Word)</label>
                    <div className="border-2 border-dashed border-white/50 p-4 rounded-xl cursor-pointer text-center hover:bg-white/10 transition">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => handleFileUpload("syllabus", e.target.files[0])}
                        id="syllabusUpload"
                      />
                      <label htmlFor="syllabusUpload" className="cursor-pointer">
                        {courseData.syllabus ? courseData.syllabus.name : "Upload syllabus file"}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition"
                  >
                    Continue to Curriculum
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Curriculum (Form 2) */}
          {step === 2 && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1 rounded-2xl shadow-2xl">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">
                  ⚙️ Module Creator – Curriculum
                </h1>

                {/* Modules */}
                {courseData.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="mb-6 p-4 bg-white/10 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Module {moduleIndex + 1}</h3>
                      {courseData.modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeModule(moduleIndex)}
                          className="text-red-300 hover:text-red-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Module Name */}
                      <div>
                        <label className="block mb-1 font-semibold">Module Name</label>
                        <input
                          type="text"
                          value={module.name}
                          onChange={(e) => updateModule(moduleIndex, "name", e.target.value)}
                          className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                          placeholder="Enter module name"
                        />
                      </div>

                      {/* Module Description */}
                      <div>
                        <label className="block mb-1 font-semibold">Module Description</label>
                        <textarea
                          rows="3"
                          value={module.description}
                          onChange={(e) => updateModule(moduleIndex, "description", e.target.value)}
                          className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                          placeholder="Describe this module"
                        ></textarea>
                      </div>

                      {/* Lesson File Upload */}
                      <div>
                        <label className="block mb-1 font-semibold">Add Lesson File (PDF/Video/Docs)</label>
                        <div className="border-2 border-dashed border-white/50 p-4 rounded-xl text-center cursor-pointer hover:bg-white/10 transition">
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => updateModule(moduleIndex, "lessonFile", e.target.files[0])}
                            id={`lessonUpload-${moduleIndex}`}
                          />
                          <label htmlFor={`lessonUpload-${moduleIndex}`} className="cursor-pointer">
                            {module.lessonFile ? module.lessonFile.name : "Click to upload lesson file"}
                          </label>
                        </div>
                      </div>

                      {/* Quiz Section */}
                      <div className="mt-2">
                        <h4 className="text-lg font-bold mb-2">📝 Create Quiz</h4>
                        {module.quizzes.map((quiz, quizIndex) => (
                          <div key={quizIndex} className="p-4 mb-3 rounded-xl bg-white/10 border border-white/20">
                            <div className="flex justify-between items-center mb-2">
                              <label className="block font-semibold">
                                Question {quizIndex + 1}
                              </label>
                              {module.quizzes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeQuiz(moduleIndex, quizIndex)}
                                  className="text-red-300 hover:text-red-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              className="w-full p-3 mb-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                              placeholder="Enter quiz question"
                              value={quiz.question}
                              onChange={(e) => updateQuiz(moduleIndex, quizIndex, "question", e.target.value)}
                            />

                            <label className="block mb-1 font-semibold">Correct Answer</label>
                            <input
                              type="text"
                              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                              placeholder="Answer for this question"
                              value={quiz.answer}
                              onChange={(e) => updateQuiz(moduleIndex, quizIndex, "answer", e.target.value)}
                            />
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addQuiz(moduleIndex)}
                          className="w-full mt-2 p-3 bg-white text-purple-700 rounded-xl font-bold hover:bg-white/80 transition"
                        >
                          ➕ Add Another Quiz Question
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Module Button */}
                <button
                  type="button"
                  onClick={addModule}
                  className="w-full p-4 border-2 border-dashed border-white/50 rounded-xl hover:bg-white/10 transition mb-6"
                >
                  <Plus className="w-6 h-6 mx-auto" />
                  <span className="mt-2 block">Add Another Module</span>
                </button>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Basic Info
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition"
                  >
                    Continue to Content
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Content (Form 3) */}
          {step === 3 && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1 rounded-2xl shadow-2xl">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">
                  🎥 Upload Lessons – Content
                </h1>

                {/* Lessons */}
                {courseData.lessons.map((lesson, index) => (
                  <div key={index} className="mb-6 p-4 bg-white/10 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Lesson {index + 1}</h3>
                      {courseData.lessons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLesson(index)}
                          className="text-red-300 hover:text-red-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Lesson Title */}
                      <div>
                        <label className="block mb-1 font-semibold">Lesson Title</label>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLesson(index, "title", e.target.value)}
                          className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                          placeholder="Enter lesson title"
                        />
                      </div>

                      {/* Video Upload */}
                      <div>
                        <label className="block mb-2 font-semibold">
                          Upload Lesson Video (MP4 / MOV / MKV)
                        </label>
                        <div className="border-2 border-dashed border-white/50 p-5 rounded-xl text-center cursor-pointer hover:bg-white/10 transition">
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            id={`videoUpload-${index}`}
                            onChange={(e) => updateLesson(index, "videoFile", e.target.files[0])}
                          />
                          <label htmlFor={`videoUpload-${index}`} className="cursor-pointer">
                            {lesson.videoFile ? (
                              <span className="font-semibold">{lesson.videoFile.name}</span>
                            ) : (
                              <span className="text-white/80">Click to upload lesson video</span>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Lesson Button */}
                <button
                  type="button"
                  onClick={addLesson}
                  className="w-full p-4 border-2 border-dashed border-white/50 rounded-xl hover:bg-white/10 transition mb-6"
                >
                  <Plus className="w-6 h-6 mx-auto" />
                  <span className="mt-2 block">Add Another Lesson</span>
                </button>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Curriculum
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition"
                  >
                    Continue to Pricing
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {step === 4 && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1 rounded-2xl shadow-2xl">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">
                  💰 Pricing & Finalization
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Course Price in USD */}
                  <div>
                    <label className="block mb-2 font-semibold">Course Price (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                      <input
                        type="number"
                        name="price"
                        value={courseData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      />
                    </div>
                  </div>

                  {/* Course Price in Coins */}
                  <div>
                    <label className="block mb-2 font-semibold">Price in Coins</label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                      <input
                        type="number"
                        value={courseData.priceInCoins}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                      />
                    </div>
                    <p className="text-sm text-white/70 mt-2">
                      Conversion rate: 1 USD = {COIN_RATE} coins
                    </p>
                  </div>

                  {/* Difficulty Level */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold">Difficulty Level</label>
                    <select
                      name="level"
                      value={courseData.level}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
                  <h4 className="font-semibold mb-3">💰 Pricing Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="flex justify-between mb-2">
                        <span>Course Price:</span>
                        <span>${courseData.price || "0.00"}</span>
                      </p>
                      <p className="flex justify-between mb-2">
                        <span>Price in Coins:</span>
                        <span className="flex items-center gap-1">
                          <Coins className="w-4 h-4" />
                          {courseData.priceInCoins}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="flex justify-between mb-2">
                        <span>Platform Fee (30%):</span>
                        <span>${(courseData.price * 0.3).toFixed(2)}</span>
                      </p>
                      <p className="flex justify-between font-semibold">
                        <span>Your Earnings (70%):</span>
                        <span>${(courseData.price * 0.7).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Content
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Course"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
