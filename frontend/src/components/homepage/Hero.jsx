import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bot, Zap, ArrowRight, Star, Users, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

const Banner = () => {
  const stats = [
    { icon: BookOpen, number: "24+", label: "Courses" },
    { icon: Users, number: "10K+", label: "Students" },
    { icon: Star, number: "4.8/5", label: "Rating" },
    { icon: Zap, number: "500+", label: "Projects" }
  ];

  const bannerImages = [
    "/images/img1.jpg",
    "/images/img2.png",
    "/images/h1.jpg"
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative mt-16 overflow-hidden bg-gradient-to-br from-[#0B1426] to-[#0F1B2E]">
      {/* Carousel Container */}
      <div className="relative w-full h-[600px] lg:h-[700px] overflow-hidden">
        {/* Slides */}
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannerImages.map((path, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={path}
                alt={`BotVortex Robotics Learning - ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.warn(`Failed to load image: ${path}`);
                }}
              />
              {/* Fallback gradient if image fails to load */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C3FF] to-[#8A5DFF] opacity-20"></div>
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-r from-[#0B1426]/70 via-[#0B1426]/50 to-[#0B1426]/70"></div> 

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-[#00C3FF] w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start text-white px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00C3FF] to-[#8A5DFF] rounded-xl flex items-center justify-center shadow-2xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-[#00C3FF]">Bot</span>
                <span className="text-[#8A5DFF]">Vortex</span>
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Master Robotics with
              <span className="block bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] bg-clip-text text-transparent">
                AI Guidance
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
              Learn robotics from basics to advanced AI systems with hands-on projects, 
              expert mentorship, and cutting-edge curriculum designed for the future.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-[#00C3FF] to-[#8A5DFF] text-white px-8 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-3 hover:shadow-2xl transition-all duration-300"
              >
                <Zap className="w-5 h-5" />
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-[#00C3FF]" />
                      <div className="text-2xl font-bold text-white">
                        {stat.number}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;