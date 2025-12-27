
import React, { useState, useEffect, useRef } from 'react';

const Reviews = () => {
  const reviews = [
    {
      stars: 5,
      text: "\"BotVortex completely transformed my approach to robotics. The hands-on projects gave me the confidence to build my own autonomous robot from scratch. The community support is incredible!\"",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      name: "Sarah Chen",
      role: "Robotics Engineer"
    },
    {
      stars: 4.5,
      text: "\"The AI for Robotics course was challenging but incredibly rewarding. The instructors provided clear explanations of complex concepts and the virtual lab was a game-changer.\"",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      name: "David Kim",
      role: "AI Researcher"
    },
    {
      stars: 4,
      text: "\"As a complete beginner, I found the Introduction to Robotics course perfectly paced. The interactive simulations helped me grasp concepts I struggled with in textbooks.\"",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Maria Garcia",
      role: "Engineering Student"
    },
    {
      stars: 5,
      text: "\"The Industrial Robotics course directly contributed to me getting promoted at work. The practical skills I learned are exactly what employers are looking for.\"",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      name: "James Wilson",
      role: "Automation Technician"
    },
    {
      stars: 4.5,
      text: "\"The ROS Fundamentals course is the most comprehensive I've found. The instructors break down complex topics into manageable chunks with excellent practical examples.\"",
      avatar: "https://randomuser.me/api/portraits/women/54.jpg",
      name: "Priya Patel",
      role: "Robotics PhD Candidate"
    },
    {
      stars: 5,
      text: "\"What sets BotVortex apart is their focus on real-world applications. The capstone project I completed became the centerpiece of my portfolio and helped me land my dream job.\"",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      name: "Thomas Müller",
      role: "Robotics Software Engineer"
    },
    {
      stars: 5,
      text: "\"The curriculum is perfectly structured for real-world applications. I implemented what I learned immediately in my workplace.\"",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Lisa Wang",
      role: "Automation Engineer"
    },
    {
      stars: 4,
      text: "\"Excellent course material with practical examples. The instructors are industry experts who know what skills are needed today.\"",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      name: "Alex Rodriguez",
      role: "Systems Engineer"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef(null);

  const cardsPerSlide = 4;
  const totalSlides = Math.ceil(reviews.length / cardsPerSlide);

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-blue-600' : star - 0.5 === rating ? 'text-blue-600' : 'text-gray-300'} fill-current`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (isPaused) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 3000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused, totalSlides]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentSlideCards = () => {
    const startIndex = currentIndex * cardsPerSlide;
    return reviews.slice(startIndex, startIndex + cardsPerSlide);
  };

  return (
    <section 
      id="reviews" 
      className="py-20 bg-white relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-sm mb-6">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
            <span className="text-sm font-semibold text-blue-800">STUDENT TESTIMONIALS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-blue-600">Students</span> Say
          </h2>
          <p className="text-xl text-gray-600">Hear from robotics enthusiasts who transformed their skills with BotVortex.</p>
        </div>

        {/* 4 Cards Per Slide Container */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl"></div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm border border-white/50 rounded-full flex items-center justify-center text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm border border-white/50 rounded-full flex items-center justify-center text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="relative py-8 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-500">
              {getCurrentSlideCards().map((review, index) => (
                <div 
                  key={index} 
                  className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col relative"
                >
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 text-lg font-bold border border-white/50 shadow-lg">"</div>
                  
                  <div className="flex items-center mb-4">
                    {renderStars(review.stars)}
                    <span className="ml-2 text-sm font-medium text-gray-600">{review.stars}/5</span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 flex-1 italic text-sm">{review.text}</p>

                  <div className="flex items-center space-x-4 pt-4 border-t border-white/50">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full p-0.5 border border-white/50">
                        <img src={review.avatar} alt={review.name} className="w-full h-full rounded-full object-cover"/>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                      <p className="text-xs text-gray-600">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-3 mb-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Auto-scroll Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3 text-sm text-gray-500 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-gray-400' : 'bg-green-500 animate-pulse'}`}></div>
            <span className="text-gray-600 font-medium">
              {isPaused ? 'Paused' : 'Auto-scrolling'} • Slide {currentIndex + 1} of {totalSlides}
            </span>
          </div>
        </div>

        <div className="mt-16 bg-white/80 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">10K+</div><div className="text-sm text-blue-700">Students Enrolled</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">4.8/5</div><div className="text-sm text-blue-700">Average Rating</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">95%</div><div className="text-sm text-blue-700">Completion Rate</div></div>
            <div><div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">2K+</div><div className="text-sm text-blue-700">Projects Built</div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;