import React, { useState } from "react";
import { Star, MessageSquare, Filter, ThumbsUp, Flag, TrendingUp, Award, Heart, Sparkles, Calendar, BookOpen, Users } from "lucide-react";

const ReviewsContent = ({ data }) => {
  // Sample reviews data - 5 reviews
  const sampleReviews = [
    {
      id: 1,
      student: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      comment: "This course completely transformed my understanding of React! The instructor explains complex concepts in such a simple way. The projects were challenging but extremely rewarding.",
      course: "Advanced React Masterclass",
      date: "2024-01-15",
      helpful: 12
    },
    {
      id: 2,
      student: "Rahul Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      comment: "Great content and well structured. I particularly enjoyed the real-world examples. Would love to see more advanced topics covered in future updates.",
      course: "JavaScript Fundamentals",
      date: "2024-01-12",
      helpful: 8
    },
    {
      id: 3,
      student: "Ananya Patel",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      comment: "Absolutely brilliant! The way the instructor breaks down complex topics is amazing. The support in the community is fantastic too. Highly recommended!",
      course: "Full Stack Development",
      date: "2024-01-10",
      helpful: 15
    },
    {
      id: 4,
      student: "Vikram Singh",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 3,
      comment: "Good course overall, but some sections felt rushed. The exercises were helpful but I wish there were more practice projects. The instructor's teaching style is engaging though.",
      course: "Node.js Backend Development",
      date: "2024-01-08",
      helpful: 5
    },
    {
      id: 5,
      student: "Sneha Reddy",
      avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      comment: "This is exactly what I needed to level up my skills! The practical approach and real-world projects helped me land a new job. Thank you for this amazing course!",
      course: "React & Next.js Pro",
      date: "2024-01-05",
      helpful: 20
    }
  ];

  // Use sample reviews if no data provided, otherwise use provided data
  const reviews = data?.reviews || sampleReviews;
  
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [likedReviews, setLikedReviews] = useState(new Set());

  // REMOVED: No longer limiting to 5 reviews
  // const limitedReviews = reviews.slice(0, 5);

  // Filter and sort reviews (from ALL reviews)
  const filteredReviews = reviews
    .filter(review => {
      if (filter === "all") return true;
      if (filter === "5-stars") return review.rating === 5;
      if (filter === "4-stars") return review.rating === 4;
      if (filter === "1-3-stars") return review.rating <= 3;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });

  // Review statistics (based on ALL reviews)
  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1);
  const fiveStarReviews = reviews.filter(review => review.rating === 5).length;
  const positiveReviews = Math.round((reviews.filter(review => review.rating >= 4).length / totalReviews) * 100);
  
  // Rating distribution (based on ALL reviews)
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(review => review.rating === stars).length,
    percentage: Math.round((reviews.filter(review => review.rating === stars).length / totalReviews) * 100)
  }));

  // Recent activity
  const recentActivity = [
    { type: "new_review", text: "New 5-star review received", time: "2 hours ago", icon: Star },
    { type: "milestone", text: "Reached 100+ reviews", time: "1 day ago", icon: Award },
    { type: "trend", text: "Rating improved to 4.8", time: "2 days ago", icon: TrendingUp }
  ];

  const toggleLike = (reviewId) => {
    const newLikedReviews = new Set(likedReviews);
    if (newLikedReviews.has(reviewId)) {
      newLikedReviews.delete(reviewId);
    } else {
      newLikedReviews.add(reviewId);
    }
    setLikedReviews(newLikedReviews);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Feedback</h2>
          <p className="text-gray-600 mt-1">See what your students are saying about your courses</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <MessageSquare className="w-4 h-4" />
          <span className="font-semibold">{reviews.length}</span>
          <span>Total Reviews</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{averageRating}</p>
              <p className="text-purple-100 text-sm">Average Rating</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(averageRating) ? 'text-yellow-300 fill-current' : 'text-white/40'}`} 
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{fiveStarReviews}</p>
              <p className="text-gray-600 text-sm">5-Star Reviews</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600 text-sm font-medium">+12% this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{positiveReviews}%</p>
              <p className="text-gray-600 text-sm">Positive Reviews</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${positiveReviews}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
              <p className="text-gray-600 text-sm">Total Feedback</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{Math.round(totalReviews * 0.35)}% of students reviewed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Reviews Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters and Sorting */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "All Reviews" },
                    { key: "5-stars", label: "5 Stars" },
                    { key: "4-stars", label: "4 Stars" },
                    { key: "1-3-stars", label: "1-3 Stars" }
                  ].map((filterOption) => (
                    <button
                      key={filterOption.key}
                      onClick={() => setFilter(filterOption.key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filter === filterOption.key
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  ))}
                </div>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Reviews List - ALL REVIEWS */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Found</h3>
              <p className="text-gray-600">Try changing your filter criteria to see more reviews.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={review.avatar}
                        alt={review.student}
                        className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                      />
                      {review.rating === 5 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.student}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleLike(review.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              likedReviews.has(review.id) 
                                ? 'text-red-500 bg-red-50' 
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }`}
                          >
                            <Heart 
                              className={`w-4 h-4 ${likedReviews.has(review.id) ? 'fill-current' : ''}`} 
                            />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">{review.comment}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full text-sm">
                          {review.course}
                        </span>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {review.helpful && (
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {review.helpful} found helpful
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show message about filtered results */}
              {filteredReviews.length < reviews.length && (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-600">
                    Showing {filteredReviews.length} of {reviews.length} reviews
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rating Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-gray-600">{stars}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 w-12 text-right">
                    {count} ({percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <activity.icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Rate */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Response Rate</h3>
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-2">92%</div>
            <p className="text-green-100 text-sm">You're responding to reviews faster than 85% of instructors</p>
            <div className="w-full bg-white/20 rounded-full h-2 mt-3">
              <div className="bg-white h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsContent;