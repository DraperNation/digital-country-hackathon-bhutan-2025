import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const HeroCarousel: React.FC = () => {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/hero/c1.png',
      quote: "Happiness is a place – and a policy.",
      author: "Kingdom of Bhutan"
    },
    {
      image: '/hero/c2.png',
      quote: "Bhutan invites global citizens to build responsibly.",
      author: "Digital Residency Program"
    },
    {
      image: '/hero/c3.png',
      quote: "Incorporate where values and vision align.",
      author: "Business Formation"
    },
    {
      image: '/hero/c4.png',
      quote: "Where ancient wisdom meets digital innovation.",
      author: "Thunder Dragon Kingdom"
    },
    {
      image: '/hero/c5.png',
      quote: "Carbon negative, digitally positive.",
      author: "Sustainable Future"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrevious = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div className="carousel-container mb-12 sm:mb-16 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.quote}
              className="w-full h-[400px] sm:h-[550px] object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center px-4 sm:px-8 text-center">
              <blockquote className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-white mb-2 sm:mb-4 text-shadow-strong leading-tight">
                "{slide.quote}"
              </blockquote>
              {slide.author && (
                <cite className="text-sm sm:text-lg text-white/90 font-medium text-shadow">
                  — {slide.author}
                </cite>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="carousel-nav prev"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </button>

        <button
          onClick={goToNext}
          className="carousel-nav next"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
