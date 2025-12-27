import React from "react";
import { Link, useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate(); // initialize navigation hook

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          }}
        ></div>
        <div
          className="absolute inset-0 bg-cover bg-left opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          }}
        ></div>
        <div
          className="absolute inset-0 bg-cover bg-right opacity-25"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black/80"></div>
      </div>

      {/* Animated lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-pulse"></div>
        <div
          className="absolute top-10 left-0 w-full h-0.5 bg-green-400 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-20 left-0 w-full h-0.5 bg-purple-400 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Launch Your Robotics Journey?
          </h2>

          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join thousands of students worldwide who are mastering robotics<br />
            with our cutting-edge platform.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Explore Courses Link */}
           <a
            href="#courses"
              className="px-10 py-4 bg-white text-gray-900 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-500 no-underline"
            >
              Explore Courses
           </a>

            {/* Contact Us Button (navigate on click) */}
            <button
              onClick={() => navigate("/contact")}
              className="px-10 py-4 bg-white text-gray-900 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-500 no-underline"
            >
              Contact Us
            </button>
          </div>

          {/* Animated indicators */}
          <div className="mt-8 flex justify-center items-center space-x-4 text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">Live Platform</span>
            </div>
            <div className="flex items-center">
              <div
                className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"
                style={{ animationDelay: "1.5s" }}
              ></div>
              <span className="text-sm">Real-time Learning</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

