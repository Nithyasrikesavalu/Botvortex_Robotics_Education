import { API_URL } from "../../config/api";
import React, { useState, useEffect } from "react";
import { Search, Filter, Star, Clock, Users, BookOpen, Zap, ArrowRight, Coins } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [flippedCard, setFlippedCard] = useState(null);
  const location = useLocation();

  // Hardcoded initial data for seeding or fallback
  const initialCourses = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "Introduction to Robotics",
      description: "Learn the fundamentals of robotics including mechanics, electronics, and basic programming.",
      level: "beginner",
      levelClass: "bg-green-500",
      duration: "4 Weeks",
      lectures: "20 Lectures",
      rating: 4.8,
      students: 1250,
      projects: 5,
      coins: 500,
      learnings: [
        "Robot components and architecture",
        "Basic electronics for robotics",
        "Simple robot programming",
        "Sensor integration basics",
        "Safety protocols in robotics"
      ],
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Basic Electronics for Robotics",
      description: "Master electronic components, circuits, and prototyping essential for robot building.",
      level: "beginner",
      levelClass: "bg-green-500",
      duration: "3 Weeks",
      lectures: "18 Lectures",
      rating: 4.7,
      students: 980,
      projects: 4,
      coins: 400,
      learnings: [
        "Electronic components and symbols",
        "Circuit design and analysis",
        "Breadboard prototyping",
        "Power supply systems",
        "Troubleshooting techniques"
      ],
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Arduino Fundamentals",
      description: "Get started with Arduino programming and build your first interactive projects.",
      level: "beginner",
      levelClass: "bg-green-500",
      duration: "4 Weeks",
      lectures: "22 Lectures",
      rating: 4.9,
      students: 2100,
      projects: 6,
      coins: 600,
      learnings: [
        "Arduino IDE and setup",
        "Digital and analog I/O",
        "Sensor interfacing",
        "Motor control basics",
        "Project development"
      ],
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "Robotics Programming Basics",
      description: "Learn programming concepts specifically tailored for robotics applications.",
      level: "beginner",
      levelClass: "bg-green-500",
      duration: "4 Weeks",
      lectures: "20 Lectures",
      rating: 4.6,
      students: 890,
      projects: 4,
      coins: 450,
      learnings: [
        "Programming fundamentals",
        "Control structures",
        "Functions and libraries",
        "Debugging techniques",
        "Code optimization"
      ],
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Sensors and Actuators",
      description: "Understand various sensors and actuators used in modern robotics systems.",
      level: "beginner",
      levelClass: "bg-green-500",
      duration: "3 Weeks",
      lectures: "16 Lectures",
      rating: 4.7,
      students: 1100,
      projects: 5,
      coins: 550,
      learnings: [
        "Sensor types and principles",
        "Actuator mechanisms",
        "Signal processing",
        "Calibration methods",
        "Real-world applications"
      ],
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Digital Electronics",
      description: "Explore digital circuits, logic gates, and microcontroller fundamentals.",
      level: "beginner",
      levelClass: "bg-green-500",
      duration: "4 Weeks",
      lectures: "20 Lectures",
      rating: 4.5,
      students: 720,
      projects: 4,
      coins: 480,
      learnings: [
        "Digital logic gates",
        "Binary systems",
        "Microcontroller basics",
        "Embedded systems intro",
        "Practical applications"
      ],
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "Robot Mechanics",
      description: "Learn mechanical design principles and fabrication techniques for robots.",
      level: "beginner",
      levelClass: "bg-green-500",
      duration: "4 Weeks",
      lectures: "18 Lectures",
      rating: 4.6,
      students: 850,
      projects: 5,
      coins: 520,
      learnings: [
        "Mechanical design principles",
        "Material selection",
        "Fabrication techniques",
        "Assembly methods",
        "Testing and validation"
      ],
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
      title: "Introduction to Coding for Robotics",
      description: "Learn basic coding concepts and logic to prepare for robot programming.",
      level: "beginner",
      levelClass: "bg-green-500",
      duration: "3 Weeks",
      lectures: "15 Lectures",
      rating: 4.8,
      students: 900,
      projects: 3,
      coins: 350,
      learnings: [
        "Programming logic",
        "Variables and loops",
        "Conditional statements",
        "Hands-on coding tasks",
        "Robotics code examples"
      ],
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Introduction to 3D Design for Robotics",
      description: "Get started with 3D modeling for designing robot components and frames.",
      level: "beginner",
      levelClass: "bg-green-500",
      duration: "4 Weeks",
      lectures: "18 Lectures",
      rating: 4.7,
      students: 750,
      projects: 4,
      coins: 580,
      learnings: [
        "3D modeling basics",
        "CAD software introduction",
        "Designing robotic arms",
        "Simulation techniques",
        "Exporting designs for fabrication"
      ],
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Arduino Robotics Projects",
      description: "Build functional robots using Arduino with hands-on projects and real-world applications.",
      level: "intermediate",
      levelClass: "bg-blue-500",
      duration: "6 Weeks",
      lectures: "28 Lectures",
      rating: 4.8,
      students: 950,
      projects: 6,
      coins: 800,
      learnings: [
        "Advanced Arduino programming",
        "Motor control systems",
        "Sensor integration techniques",
        "Wireless control implementation",
        "Project management"
      ],
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Embedded Systems",
      description: "Dive deep into embedded systems programming and real-time operating principles.",
      level: "intermediate",
      levelClass: "bg-blue-500",
      duration: "6 Weeks",
      lectures: "30 Lectures",
      rating: 4.9,
      students: 1300,
      projects: 7,
      coins: 950,
      learnings: [
        "Embedded C programming",
        "RTOS concepts",
        "Hardware interfacing",
        "Memory management",
        "System optimization"
      ],
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "IoT Robotics Integration",
      description: "Connect robots to the internet and create smart automation systems.",
      level: "intermediate",
      levelClass: "bg-blue-500",
      duration: "6 Weeks",
      lectures: "32 Lectures",
      rating: 4.8,
      students: 1200,
      projects: 6,
      coins: 850,
      learnings: [
        "IoT protocols and standards",
        "Cloud integration",
        "Remote monitoring",
        "Data analytics",
        "Security considerations"
      ],
    },
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Raspberry Pi Robotics",
      description: "Use Raspberry Pi for advanced robot control and computer vision applications.",
      level: "intermediate",
      levelClass: "bg-blue-500",
      duration: "6 Weeks",
      lectures: "30 Lectures",
      rating: 4.9,
      students: 1500,
      projects: 8,
      coins: 1100,
      learnings: [
        "Raspberry Pi setup",
        "Python for robotics",
        "Camera integration",
        "Network communication",
        "Advanced projects"
      ],
    },
    {
      id: 14,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Mobile Robot Navigation",
      description: "Design robots that can navigate autonomously in various environments.",
      level: "intermediate",
      levelClass: "bg-blue-500",
      duration: "5 Weeks",
      lectures: "28 Lectures",
      rating: 4.7,
      students: 1100,
      projects: 6,
      coins: 900,
      learnings: [
        "Navigation algorithms",
        "Path planning",
        "Obstacle detection",
        "Localization techniques",
        "Mapping fundamentals"
      ],
    },
    {
      id: 15,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "Wireless Control Systems",
      description: "Implement Bluetooth and WiFi control for remote robot operation.",
      level: "intermediate",
      levelClass: "bg-blue-500",
      duration: "5 Weeks",
      lectures: "26 Lectures",
      rating: 4.6,
      students: 890,
      projects: 5,
      coins: 750,
      learnings: [
        "Wireless protocols",
        "Mobile app integration",
        "Remote control systems",
        "Signal processing",
        "Range optimization"
      ],
    },
    {
      id: 16,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Power Systems & Motor Control",
      description: "Master advanced power management and motor control techniques.",
      level: "intermediate",
      levelClass: "bg-blue-500",
      duration: "5 Weeks",
      lectures: "25 Lectures",
      rating: 4.7,
      students: 780,
      projects: 5,
      coins: 820,
      learnings: [
        "Power supply design",
        "Motor drivers",
        "Battery management",
        "Efficiency optimization",
        "Safety systems"
      ],
    },
    {
      id: 17,
      image: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481",
      title: "Robotic Arm Design and Control",
      description: "Design and program robotic arms for pick-and-place and precision tasks.",
      level: "intermediate",
      levelClass: "bg-blue-500",
      duration: "6 Weeks",
      lectures: "28 Lectures",
      rating: 4.8,
      students: 1050,
      projects: 7,
      coins: 1200,
      learnings: [
        "Kinematics of robotic arms",
        "Servo control",
        "Inverse kinematics",
        "Motion planning",
        "Practical arm projects"
      ],
    },
    {
      id: 18,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Edge AI for Robotics",
      description: "Deploy AI models directly on edge devices for real-time robotics applications.",
      level: "intermediate",
      levelClass: "bg-blue-500",
      duration: "6 Weeks",
      lectures: "30 Lectures",
      rating: 4.9,
      students: 870,
      projects: 6,
      coins: 1300,
      learnings: [
        "Edge computing concepts",
        "Deploying TensorFlow Lite",
        "Optimizing ML models",
        "Edge device integration",
        "Real-time AI processing"
      ],
    },
    {
      id: 19,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "ROS Fundamentals",
      description: "Master the Robot Operating System (ROS) for advanced robotics development.",
      level: "advanced",
      levelClass: "bg-yellow-500",
      duration: "8 Weeks",
      lectures: "42 Lectures",
      rating: 4.9,
      students: 920,
      projects: 8,
      coins: 1500,
      learnings: [
        "ROS architecture and concepts",
        "Creating ROS packages",
        "ROS communication methods",
        "ROS tools and debugging",
        "Advanced ROS features"
      ],
    },
    {
      id: 20,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "Autonomous Mobile Robots",
      description: "Develop robots that can navigate and make decisions autonomously in complex environments.",
      level: "advanced",
      levelClass: "bg-yellow-500",
      duration: "10 Weeks",
      lectures: "45 Lectures",
      rating: 4.8,
      students: 850,
      projects: 9,
      coins: 1800,
      learnings: [
        "SLAM algorithms",
        "Path planning techniques",
        "Obstacle avoidance",
        "Sensor fusion methods",
        "Real-world deployment"
      ],
    },
    {
      id: 21,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "AI for Robotics",
      description: "Combine artificial intelligence with robotics to create intelligent, adaptive systems.",
      level: "advanced",
      levelClass: "bg-yellow-500",
      duration: "12 Weeks",
      lectures: "50 Lectures",
      rating: 4.9,
      students: 780,
      projects: 10,
      coins: 2000,
      learnings: [
        "Machine learning for robotics",
        "Computer vision integration",
        "Neural networks in robotics",
        "Reinforcement learning",
        "AI system design"
      ],
    },
    {
      id: 22,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Industrial Robotics",
      description: "Learn about robotics applications in manufacturing and industrial automation.",
      level: "advanced",
      levelClass: "bg-yellow-500",
      duration: "7 Weeks",
      lectures: "36 Lectures",
      rating: 4.8,
      students: 590,
      projects: 7,
      coins: 1600,
      learnings: [
        "Industrial robot programming",
        "Automation systems",
        "Safety protocols",
        "Production line integration",
        "Maintenance procedures"
      ],
    },
    {
      id: 23,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "Computer Vision for Robotics",
      description: "Implement advanced computer vision techniques for robot perception and interaction.",
      level: "advanced",
      levelClass: "bg-yellow-500",
      duration: "8 Weeks",
      lectures: "40 Lectures",
      rating: 4.8,
      students: 740,
      projects: 8,
      coins: 1700,
      learnings: [
        "Image processing",
        "Object detection",
        "Feature extraction",
        "Deep learning for vision",
        "Real-time processing"
      ],
    },
    {
      id: 24,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Robotics Capstone Project",
      description: "Complete a comprehensive robotics project integrating all learned concepts.",
      level: "advanced",
      levelClass: "bg-yellow-500",
      duration: "6 Weeks",
      lectures: "30 Lectures",
      rating: 4.9,
      students: 520,
      projects: 1,
      coins: 2200,
      learnings: [
        "Project planning and management",
        "System integration",
        "Testing and validation",
        "Documentation",
        "Presentation skills"
      ],
    },
    {
      id: 25,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Foundations of Robotics Program",
      description: "Master the fundamentals of electronics, mechanics, and basic programming for autonomous systems.",
      level: "program",
      levelClass: "bg-purple-600",
      duration: "12 Weeks",
      lectures: "40 Lectures",
      rating: 4.9,
      students: 850,
      projects: 8,
      coins: 2500,
      learnings: ["Introduction to Electronics", "Arduino Programming", "Basic Kinematics", "Sensor Integration"],
    },
    {
      id: 26,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "AI & Machine Learning Program",
      description: "Deep dive into neural networks, computer vision, and decision-making algorithms for smart robots.",
      level: "program",
      levelClass: "bg-purple-600",
      duration: "16 Weeks",
      lectures: "60 Lectures",
      rating: 4.8,
      students: 1200,
      projects: 12,
      coins: 3000,
      learnings: ["Neural Networks", "Computer Vision", "Reinforcement Learning", "NLP for Robotics"],
    },
    {
      id: 27,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Advanced Autonomous Systems Program",
      description: "Build industrial-grade autonomous vehicles and multi-robot coordination systems.",
      level: "program",
      levelClass: "bg-purple-600",
      duration: "20 Weeks",
      lectures: "80 Lectures",
      rating: 4.9,
      students: 500,
      projects: 15,
      coins: 3500,
      learnings: ["SLAM Algorithms", "ROS 2 Masterclass", "Path Planning", "Drone Technology"],
    },
  ];

  useEffect(() => {
    if (location.hash) {
      const h = location.hash.substring(1).toLowerCase();
      if (["beginner", "intermediate", "advanced", "program"].includes(h)) {
        setLevel(h);
      }
    } else {
      setLevel("all");
    }
  }, [location.hash]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setCourses(data);
          } else {
            // Seed if empty
            await fetch(`${API_URL}/courses/seed`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ courses: initialCourses })
            });
            setCourses(initialCourses);
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses(initialCourses); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  // Filter courses based on search and level
  useEffect(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = level === "all" || course.level === level;

      return matchesSearch && matchesLevel;
    });

    setFilteredCourses(filtered);
  }, [search, level, courses]);

  const getLevelText = (level) => {
    switch (level) {
      case "beginner": return "Beginner";
      case "intermediate": return "Intermediate";
      case "advanced": return "Advanced";
      case "program": return "Programs";
      default: return "All Levels";
    }
  };

  // Group courses by level for section display
  const coursesByLevel = {
    beginner: courses.filter(course => course.level === "beginner"),
    intermediate: courses.filter(course => course.level === "intermediate"),
    advanced: courses.filter(course => course.level === "advanced"),
    program: courses.filter(course => course.level === "program")
  };

  // Enhanced Flip Course Card Component
  const FlipCourseCard = ({ course }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
      setIsFlipped(!isFlipped);
      setFlippedCard(isFlipped ? null : course.id);
    };

    const handleCardMouseLeave = () => {
      setTimeout(() => {
        setIsFlipped(false);
        setFlippedCard(null);
      }, 1000);
    };

    // const handleBuyNow = (e) => {
    //   e.stopPropagation();
    //   console.log(`Buying course: ${course.title} for ${course.coins} coins`);
    //   alert(`Purchasing ${course.title} for ${course.coins} coins!`);
    // };

    return (
      <div
        className="group h-[380px] cursor-pointer perspective-1000"
        onMouseEnter={() => !isFlipped && setIsFlipped(true)}
        onMouseLeave={handleCardMouseLeave}
        onClick={handleFlip}
      >
        {/* Flip Card Container */}
        <div
          className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? "rotate-y-180" : ""
            }`}
        >
          {/* Front of Card - Exact Design from Image */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-200">
            {/* Course Image with Gradient Overlay */}
            <div className="h-40 overflow-hidden relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

              {/* Level Badge */}
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-bold ${course.levelClass} shadow-lg`}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </div>

              {/* Coin Badge */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full flex items-center shadow-lg">
                <Coins className="w-3 h-3 mr-1" />
                <span className="font-bold text-xs">{course.coins}</span>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-5 flex flex-col h-[calc(100%-10rem)]">
              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                {course.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                {course.description}
              </p>

              {/* Duration and Lectures - Horizontal Layout */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  <span>{course.lectures}</span>
                </div>
              </div>

              {/* Rating and Students - Horizontal Layout */}
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-700">{course.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600">
                      {course.students >= 1000 ? `${(course.students / 1000).toFixed(1)}k` : course.students}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buttons Container */}
            </div>
          </div>

          {/* Back of Card */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl rotate-y-180 p-5 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
            </div>

            <div className="relative flex flex-col h-full">
              <h4 className="text-lg font-bold mb-3 text-cyan-100 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                What You'll Learn
              </h4>

              <ul className="space-y-2 mb-4 flex-1">
                {course.learnings.slice(0, 4).map((learning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-0.5 flex-shrink-0 text-xs">▸</span>
                    <span className="text-xs text-gray-200 leading-relaxed">
                      {learning}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
                <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{course.projects} Projects</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-600/50 px-2 py-1 rounded-full">
                  <Coins className="w-3 h-3 text-amber-300" />
                  <span className="text-amber-300 font-medium">{course.coins} Coins</span>
                </div>
              </div>

              {/* Buttons Container on Back */}
              <div className="flex gap-2">
                <Link
                  to={'/enroll'}
                  state={{ course }}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Coins className="w-4 h-4" />
                  <span className="text-sm">Buy Now</span>
                </Link>
                <Link
                  to={'/C'}
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="w-full py-2 px-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </button>
                </Link>
              </div>

              <div className="text-center mt-2">
                <span className="text-gray-400 text-xs">Click to flip back</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">Scanning the vortex for courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* 🌟 Hero Banner */}
      <section className="relative py-20 px-4 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/h1.jpg")'
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 border border-white/30">
            <Zap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            BotVortex
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            "Online Learning Platform"
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            Master robotics through hands-on projects, expert guidance, and cutting-edge curriculum
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
              <div className="font-bold text-2xl">{courses.length} Courses</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
              <div className="font-bold text-2xl">10K+ Students</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
              <div className="font-bold text-2xl">4.8/5 Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔍 Search + Filter */}
      <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search robotics courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500 text-base shadow-sm"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative w-full max-w-xs">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 text-base appearance-none cursor-pointer shadow-sm"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="program">Programs</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {search && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Search: "{search}"
                <button
                  onClick={() => setSearch("")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            )}
            {level !== "all" && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Level: {getLevelText(level)}
                <button
                  onClick={() => setLevel("all")}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🎓 Courses Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Results Info */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {level === "all" ? "All Courses" : `${getLevelText(level)} Courses`}
              </h2>
              <p className="text-gray-600 text-lg">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>

            {/* Level Filters */}
            <div className="hidden md:flex gap-2">
              {["all", "beginner", "intermediate", "advanced", "program"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${level === lvl
                    ? `text-white ${lvl === "beginner" ? "bg-green-500" :
                      lvl === "intermediate" ? "bg-blue-500" :
                        lvl === "advanced" ? "bg-yellow-500" :
                          lvl === "program" ? "bg-purple-600" : "bg-gray-500"
                    } shadow-lg`
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {getLevelText(lvl)}
                </button>
              ))}
            </div>
          </div>

          {/* All Courses View */}
          {level === "all" ? (
            <div className="space-y-16">
              {/* Beginner Section */}
              <div id="beginner">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-12 rounded-full bg-gradient-to-b from-green-500 to-green-600"></div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Beginner Courses</h2>
                    <p className="text-gray-600 text-lg">Start your robotics journey with foundational concepts</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesByLevel.beginner
                    .filter(course =>
                      course.title.toLowerCase().includes(search.toLowerCase()) ||
                      course.description.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((course) => (
                      <FlipCourseCard key={course.id} course={course} />
                    ))}
                </div>
              </div>

              {/* Intermediate Section */}
              <div id="intermediate">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-12 rounded-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Intermediate Courses</h2>
                    <p className="text-gray-600 text-lg">Advance your skills with complex systems</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesByLevel.intermediate
                    .filter(course =>
                      course.title.toLowerCase().includes(search.toLowerCase()) ||
                      course.description.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((course) => (
                      <FlipCourseCard key={course.id} course={course} />
                    ))}
                </div>
              </div>

              {/* Advanced Section */}
              <div id="advanced" className="pb-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-12 rounded-full bg-gradient-to-b from-yellow-500 to-yellow-600"></div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Advanced Courses</h2>
                    <p className="text-gray-600 text-lg">Master cutting-edge robotics technologies</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesByLevel.advanced
                    .filter(course =>
                      course.title.toLowerCase().includes(search.toLowerCase()) ||
                      course.description.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((course) => (
                      <FlipCourseCard key={course.id} course={course} />
                    ))}
                </div>
              </div>

              {/* Programs Section */}
              <div id="program">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-12 rounded-full bg-gradient-to-b from-purple-500 to-purple-600"></div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Academic Programs</h2>
                    <p className="text-gray-600 text-lg">Comprehensive learning tracks for deep expertise</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesByLevel.program
                    .filter(course =>
                      course.title.toLowerCase().includes(search.toLowerCase()) ||
                      course.description.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((course) => (
                      <FlipCourseCard key={course.id} course={course} />
                    ))}
                </div>
              </div>
            </div>
          ) : (
            // Filtered View
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <FlipCourseCard key={course.id} course={course} />
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-3xl flex items-center justify-center">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-3">No courses found</h3>
                  <p className="text-gray-500 text-lg max-w-md mx-auto">
                    {search
                      ? `No courses found for "${search}". Try different search terms.`
                      : `No ${getLevelText(level).toLowerCase()} courses available.`
                    }
                  </p>
                  <div className="mt-6 flex gap-4 justify-center">
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                    <button
                      onClick={() => setLevel("all")}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Show All Courses
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 📞 Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Robotics Journey?
          </h2>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who have transformed their robotics skills with our comprehensive curriculum.
          </p>
        </div>
      </section>

      {/* Custom CSS for 3D Flip Effect */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AllCourses;