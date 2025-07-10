
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'UI/UX Designer',
      company: 'TechCorp',
      content: 'Palette Painter has revolutionized my design workflow. The AI-generated palettes are always on point, and the live preview feature saves me hours of work.',
      rating: 5,
      avatar: '👩‍💻'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Frontend Developer',
      company: 'StartupXYZ',
      content: 'As a developer with limited design skills, this tool is a lifesaver. I can create professional-looking color schemes without any guesswork.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Watson',
      role: 'Creative Director',
      company: 'Design Studio',
      content: 'The PRO templates are incredible. My clients love the variety and quality of designs I can present to them now.',
      rating: 5,
      avatar: '👩‍🎨'
    },
    {
      name: 'David Kim',
      role: 'Product Manager',
      company: 'E-commerce Co',
      content: 'The color mood feature is genius. It helps us maintain brand consistency across all our product pages while keeping things fresh.',
      rating: 5,
      avatar: '👨‍💼'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of designers and developers who trust Palette Painter for their color needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
