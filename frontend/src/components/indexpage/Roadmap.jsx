import React, { useEffect, useRef } from "react";

const Roadmap = () => {
  const roadmapItems = [
    {
      position: "left",
      title: "Foundation Level",
      items: [
        "Basic Electronics & Circuits",
        "Introduction to Microcontrollers",
        "Programming Fundamentals (Python/C++)",
        "Simple Robot Assembly",
        "Basic Sensor Integration",
      ],
      icon: "🔧",
    },
    {
      position: "right",
      title: "Intermediate Level",
      items: [
        "Advanced Motor Control",
        "Sensor Fusion Techniques",
        "Robot Kinematics",
        "Basic Computer Vision",
        "Wireless Communication",
      ],
      icon: "⚡",
    },
    {
      position: "left",
      title: "Advanced Level",
      items: [
        "Robot Operating System (ROS)",
        "Autonomous Navigation",
        "SLAM Algorithms",
        "Machine Learning for Robotics",
        "Advanced Control Systems",
      ],
      icon: "🚀",
    },
    {
      position: "right",
      title: "Expert Level",
      items: [
        "Multi-Robot Systems",
        "AI-Powered Robotics",
        "Human-Robot Interaction",
        "Robotics in Industry 4.0",
        "Capstone Project",
      ],
      icon: "🤖",
    },
  ];

  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  const addToRefs = (el, index) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current[index] = el;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="roadmap"
      className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Robotics Learning Path
          </h2>
          <p className="text-xl text-cyan-200">
            Master robotics step by step
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500 shadow-2xl shadow-cyan-500/25"></div>

          <div className="space-y-16">
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`relative flex ${item.position === "left" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`relative w-full max-w-lg ${item.position === "left" ? "pr-10 mx-30" : "pl-10 mx-30"}`}
                >
                  <div
                    ref={(el) => addToRefs(el, index)}
                    className={`bg-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-600 p-8 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10 ${item.position === "left" ? "roadmap-card-left" : "roadmap-card-right"}`}
                  >
                    <div className="flex items-center mb-6">
                      <div className="text-3xl mr-4">{item.icon}</div>
                      <h3 className="text-2xl font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {item.items.map((listItem, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-slate-300 group"
                        >
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mr-4 group-hover:bg-cyan-300 transition-colors duration-200"></div>
                          <span className="group-hover:text-white transition-colors duration-200">
                            {listItem}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-cyan-400 rounded-full border-4 border-slate-900 shadow-lg shadow-cyan-400/50 z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global CSS for animations */}
      <style>{`
        .roadmap-card-left,
        .roadmap-card-right {
          opacity: 0;
          transform: translateX(0) scale(0.95);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .roadmap-card-left.animate-visible {
          opacity: 1;
          transform: translateX(0) scale(1);
          animation: slideInFromRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .roadmap-card-right.animate-visible {
          opacity: 1;
          transform: translateX(0) scale(1);
          animation: slideInFromLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes pulseDot {
          0% { transform: translateX(-50%) scale(0); }
          50% { transform: translateX(-50%) scale(1.2); }
          100% { transform: translateX(-50%) scale(1); }
        }
      `}</style>
    </section>
  );
};

export default Roadmap;
