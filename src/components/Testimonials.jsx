import React, { useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = ({ onDownloadClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
      {
        name: "Sarah Chen",
        role: "Senior Backend Developer",
        company: "TechFlow Inc",
        content: "Switching from Studio 3T to Xquery.io was a game-changer. The AI query builder saves me hours every week, and being completely free meant we could roll it out to our entire team instantly.",
        rating: 5,
        avatar: "SC"
      },
    {
      name: "Miguel Rodriguez", 
      role: "DevOps Engineer",
      company: "DataStream Solutions",
      content: "The natural language query feature is incredible. I can just type 'find users created last month with more than 10 orders' and it generates the perfect MongoDB query. Pure magic!",
      rating: 5,
      avatar: "MR"
    },
      {
        name: "Alex Thompson",
        role: "Full Stack Developer",
        company: "StartupLabs",
        content: "As a startup, budget matters. Xquery.io gives us all the features we need completely free for commercial use, compared to Studio 3T's expensive licensing. We're using it in production without any restrictions!",
        rating: 5,
        avatar: "AT"
      },
    {
      name: "Dr. Jennifer Kim",
      role: "Data Scientist",
      company: "Research Dynamics",
      content: "The data visualization tools are outstanding. I can create complex aggregation pipelines visually and the AI suggestions actually understand our data patterns. Impressive!",
      rating: 5,
      avatar: "JK"
    },
      {
        name: "David Park",
        role: "Technical Lead",
        company: "CloudNative Corp",
        content: "Migration from Studio 3T was seamless. All our existing queries worked perfectly, and the new AI features have made our team more productive. Being free for commercial use means we can deploy it across all our client projects without licensing concerns!",
        rating: 5,
        avatar: "DP"
      },
      {
        name: "Lisa Wang",
        role: "Database Administrator",
        company: "FinTech Solutions",
        content: "The automated index suggestions saved us thousands in infrastructure costs. Xquery.io's performance insights are far superior to what we had with Studio 3T, and it's completely free! Highly recommend!",
        rating: 5,
        avatar: "LW"
      }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Loved by Developers Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of developers who've made the switch to Xquery.io
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-lg font-semibold ml-2">4.9/5</span>
            <span className="text-muted-foreground ml-1">from 2,500+ reviews</span>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                width: `${(testimonials.length * 100) / 3}%`
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="w-1/3 flex-shrink-0 px-4"
                >
                  <Card className="shadow-card hover:shadow-primary transition-all duration-300 hover-scale h-full">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="text-foreground mb-6 leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>
                      <div className="flex items-center">
                        <Avatar className="w-12 h-12 mr-4">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`} alt={testimonial.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </div>
                          <div className="text-sm text-primary font-medium">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index 
                    ? 'bg-primary' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-primary rounded-2xl p-8 text-center text-primary-foreground animate-fade-in">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Ready to Join Them?
          </h3>
          <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Download Xquery.io today and experience the future of MongoDB development tools, completely free.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={onDownloadClick}
              className="bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors shadow-primary"
            >
              Download Now!
            </button>
          </div>
          <p className="text-xs mt-4 text-primary-foreground/60 max-w-lg mx-auto">
            Xquery.io is currently free for 12 months of full commercial use. Renewals may be free or paid depending on future plans. No credit card required to start.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
