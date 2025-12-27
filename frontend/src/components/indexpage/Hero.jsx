import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [offsetY, setOffsetY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // High-quality robotics/tech background images
  const backgroundImages = [
    "/images/h1.jpg",
    "/images/h2.png",
    "/images/h3.jpg",
    "/images/h4.jpg",
    "/images/h5.jpg"
  ];

  // Scroll tracking for parallax
  const handleScroll = () => {
    setOffsetY(window.pageYOffset);
  };

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Manual navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Parallax effect on scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out transform-gpu ${index === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "brightness(0.6)",
              transform: `translateY(${offsetY * 0.3}px)`,
              willChange: "transform, opacity",
              width: "100%",
              height: "100%",
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-[1]" />

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-blue-400 transition-all duration-300 bg-black/40 hover:bg-black/60 rounded-full p-3 md:p-5 group backdrop-blur-sm border border-white/10"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8 transform group-hover:-translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-blue-400 transition-all duration-300 bg-black/40 hover:bg-black/60 rounded-full p-3 md:p-5 group backdrop-blur-sm border border-white/10"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8 transform group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? "bg-blue-500 scale-125 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              : "bg-white/50 hover:bg-white/80"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center text-white px-4 max-w-4xl z-20 mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl">
          Revolutionizing{" "}
          <span className="text-blue-400">Robotics Education</span>
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl mb-8 leading-relaxed max-w-3xl mx-auto text-gray-100 drop-shadow-lg">
          Master cutting-edge robotics and Arduino skills with our AI-powered platform,
          expert mentors, and hands-on projects that prepare you for the future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#courses"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-xl text-lg flex items-center justify-center"
          >
            Explore Courses <i className="fas fa-arrow-right ml-2"></i>
          </a>
          <Link to={"/Ab"}
            className="border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 text-lg flex items-center justify-center backdrop-blur-sm"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="text-white/80">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;