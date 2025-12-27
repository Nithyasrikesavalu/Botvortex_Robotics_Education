import React from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  const courses = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "Introduction to Robotics",
      description:
        "Learn the fundamentals of robotics including mechanics, electronics, and basic programming.",
      level: "Beginner",
      levelClass: "bg-green-500",
      duration: "4 Weeks",
      coins: 500,
      learnings: [
        "Robot components and architecture",
        "Basic electronics for robotics",
        "Simple robot programming",
        "Sensor integration basics",
      ],
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "Arduino Robotics Projects",
      description:
        "Build functional robots using Arduino with hands-on projects and real-world applications.",
      level: "Intermediate",
      levelClass: "bg-blue-500",
      duration: "6 Weeks",
      coins: 800,
      learnings: [
        "Advanced Arduino programming",
        "Motor control systems",
        "Sensor integration techniques",
        "Wireless control implementation",
      ],
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "ROS Fundamentals",
      description:
        "Master the Robot Operating System (ROS) for advanced robotics development.",
      level: "Advanced",
      levelClass: "bg-yellow-500",
      duration: "8 Weeks",
      coins: 1200,
      learnings: [
        "ROS architecture and concepts",
        "Creating ROS packages",
        "ROS communication methods",
        "ROS tools and debugging",
      ],
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "Autonomous Mobile Robots",
      description:
        "Develop robots that can navigate and make decisions autonomously in complex environments.",
      level: "Advanced",
      levelClass: "bg-yellow-500",
      duration: "10 Weeks",
      coins: 1500,
      learnings: [
        "SLAM algorithms",
        "Path planning techniques",
        "Obstacle avoidance",
        "Sensor fusion methods",
      ],
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      title: "AI for Robotics",
      description:
        "Combine artificial intelligence with robotics to create intelligent, adaptive systems.",
      level: "Expert",
      levelClass: "bg-red-500",
      duration: "12 Weeks",
      coins: 2000,
      learnings: [
        "Machine learning for robotics",
        "Computer vision integration",
        "Neural networks in robotics",
        "Reinforcement learning",
      ],
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9",
      title: "Industrial Robotics",
      description:
        "Learn about robotics applications in manufacturing and industrial automation.",
      level: "Intermediate",
      levelClass: "bg-blue-500",
      duration: "6 Weeks",
      coins: 1000,
      learnings: [
        "Industrial robot programming",
        "Automation systems",
        "Safety protocols",
        "Production line integration",
      ],
    },
  ];

  return (
    <section id="courses" className="py-8 md:py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Featured Robotics Courses
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-4 sm:px-0">
            Choose from our comprehensive curriculum designed by industry experts and academic leaders.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {courses.map((course) => (
            <div key={course.id} className="group perspective-1000">
              {/* Flip Card Container */}
              <div className="relative w-full h-80 sm:h-96 transition-all duration-500 preserve-3d group-hover:rotate-y-180">
                {/* Front of Card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                  {/* Course Image */}
                  <div className="h-32 sm:h-40 overflow-hidden relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Coin Badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full flex items-center shadow-lg text-xs sm:text-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" />
                      </svg>
                      <span className="font-bold">{course.coins}</span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-white text-xs sm:text-sm font-medium ${course.levelClass}`}
                      >
                        {course.level}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">
                        {course.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl md:rounded-2xl shadow-xl rotate-y-180 p-4 sm:p-6 text-white overflow-hidden">
                  <div className="flex flex-col h-full">
                    <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-cyan-100">
                      What You'll Learn
                    </h4>

                    <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 flex-1">
                      {course.learnings.map((learning, index) => (
                        <li key={index} className="flex items-start text-gray-200">
                          <span className="text-cyan-400 mr-2 sm:mr-3 mt-0.5 sm:mt-1 text-xs sm:text-sm">▸</span>
                          <span className="text-xs sm:text-sm">{learning}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Enroll Button */}
                    <div className="mt-auto">
                      <Link
                        to="/enroll"
                        state={{ course }}
                        className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-center block transform hover:scale-105 transition-all shadow-lg text-sm sm:text-base"
                      >
                        Enroll Now
                      </Link>
                      <div className="w-full mt-2 py-1 px-3 bg-white/10 text-amber-400 rounded-lg font-semibold text-center flex items-center justify-center text-xs sm:text-sm">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                        <span>{course.coins} Coins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 md:mt-12">
          <Link
            to={"/Courses"}
            className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            View All Courses
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>

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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Disable flip on mobile for better UX */
        @media (max-width: 640px) {
          .group:hover .preserve-3d {
            transform: none;
          }
          
          /* Optional: Add a touch-friendly alternative */
          .group:active .preserve-3d {
            transform: rotateY(180deg);
          }
        }
      `}</style>
    </section>
  );
};

export default Courses;