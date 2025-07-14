import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Palette, Zap, Eye, Settings, Crown, Star, ArrowRight, Check, 
  Sparkles, Users, Laptop, Paintbrush, Target, Clock, Shield,
  ChevronRight, PlayCircle, Download, Share2, Wand2, Layers,
  Heart, TrendingUp, MessageCircle, Mail, Send, Phone, MapPin
} from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useEnhancedSubscription } from '@/contexts/EnhancedSubscriptionContext';
import LivePreviewSection from '@/components/landing/LivePreviewSection';

// Floating Color Palette Component
const FloatingPalette = ({ colors, className = "" }: { colors: string[], className?: string }) => (
  <div className={`floating-palette ${className}`}>
    <div className="flex space-x-1 p-2 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg border border-white/30">
      {colors.map((color, i) => (
        <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
      ))}
    </div>
  </div>
);

// Scroll reveal hook
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

const Landing = () => {
  const navigate = useNavigate();
  const { isPro } = useFeatureAccess();
  const { setCurrentPlan, plans } = useEnhancedSubscription();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  useScrollReveal();

  const floatingPalettes = [
    ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'],
    ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
    ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ name, email, message });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient-shift" 
           style={{ backgroundSize: '400% 400%' }} />
      
      {/* Floating Palettes */}
      {floatingPalettes.map((palette, i) => (
        <FloatingPalette 
          key={i}
          colors={palette} 
          className={`absolute z-10 ${
            i === 0 ? 'top-20 right-20' : 
            i === 1 ? 'top-1/2 left-10' : 
            'bottom-20 right-1/3'
          } hidden lg:block`} 
        />
      ))}

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">
                  Palette Painter
                </h1>
                <p className="text-xs text-muted-foreground">AI Color Generator</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">How it Works</a>
              <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-foreground/80 hover:text-foreground transition-colors">Reviews</a>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => navigate('/login')} className="hidden sm:flex">
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                onClick={() => navigate('/register')}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center scroll-reveal">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-sm px-4 py-2">
              <Crown className="h-3 w-3 mr-2" />
              AI-Powered Color Generation
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Create <span className="gradient-text">Perfect Color</span>
              <br />
              Palettes <span className="gradient-text">Instantly</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your designs with AI-generated color palettes. Choose from professional templates, 
              customize every shade, and see live previews in real-time. Perfect for designers, developers, and brands.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6 shadow-lg hover-lift"
                onClick={() => navigate('/register')}
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Creating Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2 hover-lift"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">50K+</div>
                <p className="text-foreground/60">Happy Designers</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">100+</div>
                <p className="text-foreground/60">AI Templates</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">1M+</div>
                <p className="text-foreground/60">Palettes Generated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Preview Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="scroll-reveal">
            <LivePreviewSection />
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gradient-to-r from-muted/30 to-accent/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stop Struggling with <span className="gradient-text">Color Choices</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              We solve the most common design challenges that keep you stuck
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "Poor Color Harmony",
                description: "No more clashing colors or unbalanced palettes"
              },
              {
                icon: Eye,
                title: "Accessibility Issues",
                description: "Ensure perfect contrast ratios for all users"
              },
              {
                icon: Clock,
                title: "Time Wasted",
                description: "Stop spending hours tweaking colors manually"
              },
              {
                icon: Sparkles,
                title: "Lack of Inspiration",
                description: "Get fresh, trending color combinations instantly"
              }
            ].map((item, i) => (
              <Card key={i} className="p-6 hover-lift scroll-reveal border-0 bg-white/60 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Create stunning color palettes in just three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Wand2,
                title: "Choose Your Style",
                description: "Select from 100+ professional templates or describe your vision to our AI"
              },
              {
                step: "02",
                icon: Palette,
                title: "Generate Instantly",
                description: "Our AI creates perfect color harmonies with accessibility built-in"
              },
              {
                step: "03",
                icon: Download,
                title: "Export & Use",
                description: "Download in any format, copy hex codes, or integrate with your design tools"
              }
            ].map((item, i) => (
              <div key={i} className="text-center scroll-reveal">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 bg-gradient-to-l from-secondary/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Perfect for <span className="gradient-text">Every Creator</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Whether you're a professional or just starting out, we've got you covered
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Laptop,
                title: "Web Designers",
                description: "Create cohesive color schemes for websites and digital products",
                features: ["Brand consistency", "UI/UX optimization", "Accessibility compliance"]
              },
              {
                icon: Paintbrush,
                title: "Brand Strategists", 
                description: "Develop powerful brand identities with psychology-backed colors",
                features: ["Brand personality", "Market positioning", "Color psychology"]
              },
              {
                icon: Users,
                title: "Developers",
                description: "Implement beautiful color systems in your applications",
                features: ["CSS variables", "Design tokens", "Code export"]
              }
            ].map((item, i) => (
              <Card key={i} className="p-6 hover-lift scroll-reveal border-0 bg-white/60 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-foreground/70 mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-sm text-foreground/60">
                      <Check className="h-4 w-4 text-success mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Everything you need to create, customize, and implement perfect color palettes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI Generation",
                description: "Advanced AI creates harmonious color combinations based on color theory principles"
              },
              {
                icon: Eye,
                title: "Accessibility Checker", 
                description: "Built-in WCAG compliance ensures your colors work for everyone"
              },
              {
                icon: Layers,
                title: "100+ Templates",
                description: "Professional templates for every industry and design style"
              },
              {
                icon: Download,
                title: "Multiple Export Formats",
                description: "CSS, Sass, Adobe Swatch, Sketch, Figma, and more"
              },
              {
                icon: Share2,
                title: "Team Collaboration",
                description: "Share palettes with your team and collect feedback instantly"
              },
              {
                icon: TrendingUp,
                title: "Trending Colors",
                description: "Stay updated with the latest color trends and popular combinations"
              }
            ].map((item, i) => (
              <Card key={i} className="p-6 hover-lift scroll-reveal group border-0 bg-white/60 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-r from-muted/30 to-accent/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Start free, upgrade when you need more power
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 hover-lift scroll-reveal border-2 border-border bg-white/80 backdrop-blur-sm">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-4">$0<span className="text-lg text-foreground/60">/month</span></div>
                <p className="text-foreground/70">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  "10 AI-generated palettes/month",
                  "Basic templates",
                  "Standard export formats",
                  "Community support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-success mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full" variant="outline" onClick={() => navigate('/register')}>
                Get Started Free
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 hover-lift scroll-reveal border-2 border-primary bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-bl-lg">
                <span className="text-sm font-semibold">Most Popular</span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">$9<span className="text-lg text-foreground/60">/month</span></div>
                <p className="text-foreground/70">For professional designers</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited AI generations",
                  "100+ premium templates",
                  "Advanced export formats",
                  "Team collaboration",
                  "Priority support",
                  "Custom brand palettes"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-success mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                onClick={() => navigate('/register')}
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              See what our users are saying about their experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "UI/UX Designer",
                company: "TechCorp",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b593?w=150",
                rating: 5,
                text: "This tool has revolutionized my design workflow. I can create perfect color palettes in minutes instead of hours."
              },
              {
                name: "Marcus Rivera", 
                role: "Brand Strategist",
                company: "Creative Studio",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                rating: 5,
                text: "The AI understands color psychology better than most humans. It's become essential for all our brand projects."
              },
              {
                name: "Emily Watson",
                role: "Frontend Developer", 
                company: "StartupXYZ",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
                rating: 5,
                text: "Finally, a tool that generates accessible color schemes by default. The code export feature is a game-changer."
              }
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 hover-lift scroll-reveal border-0 bg-white/60 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-foreground/60">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                
                <p className="text-foreground/70 italic">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Amazing Colors?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of designers and developers who are already creating stunning palettes with our AI
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg"
                onClick={() => navigate('/register')}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Creating for Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Palette Painter</h3>
                  <p className="text-sm opacity-70">AI Color Generator</p>
                </div>
              </div>
              <p className="text-background/70 mb-6 max-w-md">
                Create perfect color palettes with AI. Trusted by designers, developers, and brands worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors cursor-pointer">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-background/20 transition-colors cursor-pointer">
                  <Share2 className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#features" className="hover:text-background transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-background transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-background transition-colors">How it Works</a></li>
                <li><a href="#testimonials" className="hover:text-background transition-colors">Reviews</a></li>
              </ul>
            </div>

            {/* Contact Form */}
            <div>
              <h4 className="font-semibold mb-4">Get in Touch</h4>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <Input 
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Input 
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Textarea 
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 h-20"
                />
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-background/60 text-sm">
              © 2024 Palette Painter. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-background/60 mt-4 md:mt-0">
              <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-background transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;