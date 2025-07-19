import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Palette, Zap, Eye, Settings, Crown, Star, ArrowRight, Check, 
  Sparkles, Users, Laptop, Paintbrush, Target, Clock, Shield,
  ChevronRight, PlayCircle, Download, Share2, Wand2, Layers,
  Heart, TrendingUp, MessageCircle, Mail, Send, Phone, MapPin,
  Shuffle, RefreshCw, MousePointer, Lightbulb, Monitor, Smartphone,
  Rocket, Globe, Building, Briefcase, Camera, Gamepad2
} from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useEnhancedSubscription } from '@/contexts/EnhancedSubscriptionContext';
import LivePreviewSection from '@/components/landing/LivePreviewSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Footer from '@/components/landing/Footer';

// Enhanced Color Orb Component
const ColorOrb = ({ color, size = "lg", delay = 0 }: { 
  color: string, 
  size?: "sm" | "md" | "lg" | "xl",
  delay?: number
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };
  
  return (
    <div 
      className={`${sizeClasses[size]} color-orb`}
      style={{ 
        backgroundColor: color,
        animationDelay: `${delay}ms`
      }}
    />
  );
};

// Floating Color Orbs Component
const FloatingColorOrbs = () => {
  const colors = [
    'hsl(263, 85%, 58%)', // Purple
    'hsl(337, 85%, 65%)', // Pink  
    'hsl(188, 94%, 50%)', // Turquoise
    'hsl(142, 76%, 36%)', // Green
    'hsl(45, 93%, 47%)',  // Orange
    'hsl(217, 91%, 60%)'  // Blue
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {colors.map((color, i) => (
        <div
          key={i}
          className={`absolute floating-palette ${
            i === 0 ? 'top-20 right-20' : 
            i === 1 ? 'top-1/3 left-16' : 
            i === 2 ? 'bottom-1/3 right-12' :
            i === 3 ? 'top-2/3 left-1/4' :
            i === 4 ? 'bottom-20 left-20' :
            'top-1/2 right-1/3'
          } hidden lg:block`}
          style={{ animationDelay: `${i * 1000}ms` }}
        >
          <ColorOrb color={color} size={i % 2 === 0 ? "lg" : "md"} />
        </div>
      ))}
    </div>
  );
};

// Enhanced scroll reveal hook
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
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <FloatingColorOrbs />

      {/* Header */}
      <header className="relative z-50">
        {/* Navigation */}
        <nav className="glass-morphism fixed top-0 w-full z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl hero-gradient flex items-center justify-center shadow-lg">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Palette Painter
                  </h1>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">Features</a>
                <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">How it Works</a>
                <a href="#pricing" className="text-foreground hover:text-primary transition-colors font-medium">Pricing</a>
                <a href="#testimonials" className="text-foreground hover:text-primary transition-colors font-medium">Reviews</a>
              </div>

              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/login')} 
                  className="hidden sm:flex"
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold"
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
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="absolute inset-0 hero-gradient opacity-10" />
          <div className="absolute inset-0 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
              <defs>
                <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'hsl(280, 100%, 65%)', stopOpacity: 0.2}} />
                  <stop offset="100%" style={{stopColor: 'hsl(340, 82%, 65%)', stopOpacity: 0.1}} />
                </linearGradient>
                <linearGradient id="heroGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: 'hsl(195, 100%, 70%)', stopOpacity: 0.15}} />
                  <stop offset="100%" style={{stopColor: 'hsl(160, 100%, 65%)', stopOpacity: 0.1}} />
                </linearGradient>
              </defs>
              <path d="M0,400 Q300,300 600,350 T1200,400 L1200,800 L0,800 Z" fill="url(#heroGrad1)"/>
              <path d="M0,500 Q400,420 800,460 T1200,500 L1200,800 L0,800 Z" fill="url(#heroGrad2)"/>
              <path d="M0,600 Q200,550 400,580 T800,600 T1200,620 L1200,800 L0,800 Z" fill="hsl(280, 100%, 65%)" opacity="0.1"/>
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center scroll-reveal">
              <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-sm px-6 py-3 backdrop-blur-sm">
                <Crown className="h-4 w-4 mr-2" />
                AI-Powered Color Generation
              </Badge>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                Create Perfect
                <br />
                <span className="gradient-text">
                  Color Palettes
                </span>
                <br />
                <span className="relative">
                  Instantly
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-primary/30 rounded-full blur-sm" />
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                Transform your designs with AI-generated color palettes. Choose from professional templates, 
                customize every shade, and see live previews in real-time.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                <Button 
                  size="lg" 
                  className="text-xl px-12 py-6 shadow-2xl font-semibold group hero-gradient border-0 text-white"
                  onClick={() => navigate('/register')}
                >
                  <Zap className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                  Start Creating Free
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-xl px-12 py-6 border-2 font-semibold group"
                >
                  <PlayCircle className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Enhanced Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                {[
                  { number: "50K+", label: "Happy Designers", icon: Users },
                  { number: "100+", label: "AI Templates", icon: Layers },
                  { number: "1M+", label: "Palettes Generated", icon: Palette }
                ].map((stat, i) => (
                  <div key={i} className="text-center scroll-reveal group">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-5xl font-bold gradient-text mb-3">{stat.number}</div>
                    <p className="text-muted-foreground text-lg font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </header>

      {/* Live Preview Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="scroll-reveal">
            <LivePreviewSection />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create stunning color palettes in just three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                icon: Wand2,
                title: "Choose Your Style",
                description: "Select from 100+ professional templates or describe your vision to our AI",
                color: "hsl(263, 85%, 58%)"
              },
              {
                step: "02", 
                icon: Palette,
                title: "Generate Instantly",
                description: "Our AI creates perfect color harmonies with accessibility built-in",
                color: "hsl(337, 85%, 65%)"
              },
              {
                step: "03",
                icon: Download,
                title: "Export & Use",
                description: "Download in any format, copy hex codes, or integrate with your design tools",
                color: "hsl(188, 94%, 50%)"
              }
            ].map((item, i) => (
              <div key={i} className="text-center scroll-reveal group">
                <div className="relative mb-8">
                  <div 
                    className="w-32 h-32 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-500"
                    style={{ backgroundColor: item.color }}
                  >
                    <item.icon className="h-16 w-16 text-white" />
                  </div>
                  <div 
                    className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-xl"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Key <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create, customize, and implement perfect color palettes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Generation",
                description: "Advanced AI creates harmonious color combinations based on color theory principles",
                color: "hsl(263, 85%, 58%)"
              },
              {
                icon: Eye,
                title: "Accessibility Built-In", 
                description: "Automatic WCAG compliance checking ensures your colors work for everyone",
                color: "hsl(337, 85%, 65%)"
              },
              {
                icon: Layers,
                title: "100+ Professional Templates",
                description: "Ready-to-use templates for every industry and design style",
                color: "hsl(188, 94%, 50%)"
              },
              {
                icon: Download,
                title: "Universal Export Formats",
                description: "Export to CSS, Sass, Adobe Swatch, Sketch, Figma, and more",
                color: "hsl(142, 76%, 36%)"
              },
              {
                icon: Share2,
                title: "Team Collaboration",
                description: "Share palettes with your team and maintain brand consistency",
                color: "hsl(45, 93%, 47%)"
              },
              {
                icon: Clock,
                title: "Save 80% Time",
                description: "Generate perfect palettes in seconds instead of hours",
                color: "hsl(217, 91%, 60%)"
              }
            ].map((item, i) => (
              <Card key={i} className="group hover-lift scroll-reveal border-0 shadow-lg overflow-hidden palette-showcase">
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: item.color }}
                />
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon className="h-6 w-6" style={{ color: item.color }} />
                    </div>
                    <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Who It's <span className="gradient-text">For</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Perfect for professionals and creators across industries
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Paintbrush,
                title: "Designers",
                description: "Create cohesive color schemes for web, print, and digital designs",
                color: "hsl(263, 85%, 58%)"
              },
              {
                icon: Building,
                title: "Agencies",
                description: "Streamline brand development with consistent, professional palettes",
                color: "hsl(337, 85%, 65%)"
              },
              {
                icon: Briefcase,
                title: "Marketers",
                description: "Develop brand-aligned campaigns with psychologically effective colors",
                color: "hsl(188, 94%, 50%)"
              },
              {
                icon: Camera,
                title: "Content Creators",
                description: "Stand out with unique, eye-catching color combinations",
                color: "hsl(142, 76%, 36%)"
              }
            ].map((item, i) => (
              <Card key={i} className="group hover-lift scroll-reveal text-center border-0 shadow-lg">
                <CardContent className="pt-8 pb-6">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <item.icon className="h-10 w-10" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="scroll-reveal">
            <PricingSection />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="scroll-reveal">
            <TestimonialsSection />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-20" />
        <FloatingColorOrbs />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="scroll-reveal">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Ready to Create Amazing 
              <br />
              <span className="gradient-text">Color Palettes?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of designers who trust our AI to create perfect color combinations
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                size="lg" 
                className="text-xl px-12 py-6 shadow-2xl font-semibold group hero-gradient border-0 text-white"
                onClick={() => navigate('/register')}
              >
                <Rocket className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                Start Creating Now
                <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-xl px-12 py-6 border-2 font-semibold"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;