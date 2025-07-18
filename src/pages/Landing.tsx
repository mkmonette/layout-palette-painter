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
  Shuffle, RefreshCw, MousePointer, Lightbulb, Monitor, Smartphone
} from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useEnhancedSubscription } from '@/contexts/EnhancedSubscriptionContext';
import LivePreviewSection from '@/components/landing/LivePreviewSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Footer from '@/components/landing/Footer';
import heroBackground from '@/assets/hero-background.jpg';

// Enhanced Color Palette Component
const ColorPalette = ({ colors, className = "", size = "sm" }: { 
  colors: string[], 
  className?: string,
  size?: "sm" | "md" | "lg"
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };
  
  return (
    <div className={`flex space-x-2 ${className}`}>
      {colors.map((color, i) => (
        <div 
          key={i} 
          className={`${sizeClasses[size]} rounded-xl shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

// Floating Color Palette Component
const FloatingPalette = ({ colors, className = "" }: { colors: string[], className?: string }) => (
  <div className={`floating-palette ${className}`}>
    <div className="glass-card p-3 rounded-2xl shadow-xl">
      <ColorPalette colors={colors} size="md" />
    </div>
  </div>
);

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

  const vibrantPalettes = [
    ['hsl(263, 85%, 58%)', 'hsl(337, 85%, 65%)', 'hsl(188, 94%, 50%)', 'hsl(142, 76%, 36%)'],
    ['hsl(45, 93%, 47%)', 'hsl(217, 91%, 60%)', 'hsl(340, 82%, 52%)', 'hsl(160, 84%, 39%)'],
    ['hsl(280, 95%, 60%)', 'hsl(320, 90%, 50%)', 'hsl(200, 100%, 45%)', 'hsl(120, 80%, 45%)'],
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Floating Palettes */}
      {vibrantPalettes.map((palette, i) => (
        <FloatingPalette 
          key={i}
          colors={palette} 
          className={`absolute z-10 ${
            i === 0 ? 'top-32 right-10 lg:right-20' : 
            i === 1 ? 'top-1/2 left-4 lg:left-10' : 
            'bottom-32 right-1/4'
          } hidden lg:block`} 
        />
      ))}

      {/* Header with Background */}
      <header className="relative">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/60" />
        </div>

        {/* Navigation */}
        <nav className="relative z-50 backdrop-blur-lg bg-white/10 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-xl blur-sm" />
                  <div className="relative p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Palette Painter
                  </h1>
                  <p className="text-xs text-white/80">AI Color Generator</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-white/90 hover:text-white transition-colors font-medium">Features</a>
                <a href="#how-it-works" className="text-white/90 hover:text-white transition-colors font-medium">How it Works</a>
                <a href="#pricing" className="text-white/90 hover:text-white transition-colors font-medium">Pricing</a>
                <a href="#testimonials" className="text-white/90 hover:text-white transition-colors font-medium">Reviews</a>
              </div>

              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/login')} 
                  className="hidden sm:flex border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-white text-primary hover:bg-white/90 shadow-xl font-semibold"
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
        <section className="relative py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center scroll-reveal">
              <Badge className="mb-8 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm px-6 py-3 backdrop-blur-sm">
                <Crown className="h-4 w-4 mr-2" />
                AI-Powered Color Generation
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-8 leading-tight text-white">
                Create Perfect
                <br />
                <span className="relative">
                  Color Palettes
                  <div className="absolute -bottom-4 left-0 right-0 h-1 bg-white/30 rounded-full" />
                </span>
                <br />
                Instantly
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
                Transform your designs with AI-generated color palettes. Choose from professional templates, 
                customize every shade, and see live previews in real-time.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-xl px-10 py-6 shadow-2xl font-semibold group"
                  onClick={() => navigate('/register')}
                >
                  <Zap className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                  Start Creating Free
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-xl px-10 py-6 border-2 border-white/50 text-white hover:bg-white/20 hover:border-white font-semibold"
                >
                  <PlayCircle className="h-6 w-6 mr-3" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Enhanced Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto">
                <div className="text-center scroll-reveal">
                  <div className="text-5xl font-bold text-white mb-3">50K+</div>
                  <p className="text-white/80 text-lg font-medium">Happy Designers</p>
                </div>
                <div className="text-center scroll-reveal">
                  <div className="text-5xl font-bold text-white mb-3">100+</div>
                  <p className="text-white/80 text-lg font-medium">AI Templates</p>
                </div>
                <div className="text-center scroll-reveal">
                  <div className="text-5xl font-bold text-white mb-3">1M+</div>
                  <p className="text-white/80 text-lg font-medium">Palettes Generated</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      {/* Live Preview Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="scroll-reveal">
            <LivePreviewSection />
          </div>
        </div>
      </section>

      {/* Color Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Endless <span className="gradient-text">Color Combinations</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover vibrant palettes that bring your designs to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Vibrant Sunset", colors: ['hsl(45, 93%, 47%)', 'hsl(15, 95%, 55%)', 'hsl(340, 82%, 52%)', 'hsl(280, 95%, 60%)'] },
              { name: "Ocean Breeze", colors: ['hsl(200, 100%, 45%)', 'hsl(188, 94%, 50%)', 'hsl(160, 84%, 39%)', 'hsl(142, 76%, 36%)'] },
              { name: "Modern Tech", colors: ['hsl(263, 85%, 58%)', 'hsl(217, 91%, 60%)', 'hsl(280, 95%, 60%)', 'hsl(320, 90%, 50%)'] },
              { name: "Fresh Garden", colors: ['hsl(120, 80%, 45%)', 'hsl(160, 84%, 39%)', 'hsl(80, 70%, 50%)', 'hsl(40, 85%, 55%)'] },
              { name: "Cosmic Purple", colors: ['hsl(280, 95%, 60%)', 'hsl(300, 90%, 55%)', 'hsl(320, 90%, 50%)', 'hsl(340, 82%, 52%)'] },
              { name: "Electric Blue", colors: ['hsl(200, 100%, 45%)', 'hsl(220, 95%, 55%)', 'hsl(240, 90%, 60%)', 'hsl(260, 85%, 65%)'] },
            ].map((palette, i) => (
              <Card key={i} className="group hover-lift scroll-reveal bg-card/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{palette.name}</CardTitle>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ColorPalette colors={palette.colors} size="lg" className="justify-center mb-4" />
                  <div className="flex justify-center space-x-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
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
                    className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-300"
                    style={{ backgroundColor: item.color }}
                  >
                    <item.icon className="h-12 w-12 text-white" />
                  </div>
                  <div 
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
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

      {/* Key Features / Benefits Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Key <span className="gradient-text">Features & Benefits</span>
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
                description: "Advanced AI creates harmonious color combinations based on color theory principles, saving you hours of manual work",
                color: "hsl(263, 85%, 58%)"
              },
              {
                icon: Eye,
                title: "Accessibility Built-In", 
                description: "Automatic WCAG compliance checking ensures your colors work for everyone, including users with visual impairments",
                color: "hsl(337, 85%, 65%)"
              },
              {
                icon: Layers,
                title: "100+ Professional Templates",
                description: "Ready-to-use templates for every industry and design style, from corporate to creative",
                color: "hsl(188, 94%, 50%)"
              },
              {
                icon: Download,
                title: "Universal Export Formats",
                description: "Export to CSS, Sass, Adobe Swatch, Sketch, Figma, and more - works with any design tool",
                color: "hsl(142, 76%, 36%)"
              },
              {
                icon: Share2,
                title: "Team Collaboration",
                description: "Share palettes with your team, collect feedback, and maintain brand consistency across projects",
                color: "hsl(45, 93%, 47%)"
              },
              {
                icon: Clock,
                title: "Save 80% Time",
                description: "Generate perfect palettes in seconds instead of spending hours tweaking colors manually",
                color: "hsl(217, 91%, 60%)"
              }
            ].map((item, i) => (
              <Card key={i} className="p-8 hover-lift scroll-reveal group bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: item.color }}
                >
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases / Who It's For Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Perfect for <span className="gradient-text">Every Creative</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're a seasoned professional or just starting out, our AI color generator adapts to your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Paintbrush,
                title: "Graphic Designers",
                description: "Create cohesive brand identities and stunning visual designs with perfect color harmony",
                users: "25K+",
                color: "hsl(263, 85%, 58%)"
              },
              {
                icon: Monitor,
                title: "Web Developers",
                description: "Build beautiful websites and apps with accessible color schemes that enhance user experience",
                users: "18K+",
                color: "hsl(337, 85%, 65%)"
              },
              {
                icon: Users,
                title: "Marketing Teams",
                description: "Maintain brand consistency across campaigns while exploring fresh, on-trend color combinations",
                users: "12K+",
                color: "hsl(188, 94%, 50%)"
              },
              {
                icon: Lightbulb,
                title: "Creative Students",
                description: "Learn color theory while creating professional-quality palettes for your design projects",
                users: "8K+",
                color: "hsl(142, 76%, 36%)"
              }
            ].map((item, i) => (
              <Card key={i} className="p-8 text-center hover-lift scroll-reveal group bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: item.color }}
                >
                  <item.icon className="h-10 w-10 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: item.color }}>{item.users}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="scroll-reveal">
            <PricingSection />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-secondary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="scroll-reveal">
            <TestimonialsSection />
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our AI color palette generator
            </p>
          </div>
          
          <div className="scroll-reveal">
            <div className="space-y-6">
              {[
                {
                  question: "How does the AI color generation work?",
                  answer: "Our AI analyzes millions of successful color combinations and applies color theory principles to generate harmonious palettes. It considers factors like contrast ratios, accessibility standards, and current design trends to create professional-quality results."
                },
                {
                  question: "Can I use the generated palettes commercially?",
                  answer: "Yes! All palettes generated with Palette Painter can be used for commercial projects without any restrictions. We provide full commercial licenses for all our Pro and Enterprise users."
                },
                {
                  question: "What export formats are supported?",
                  answer: "We support all major design formats including CSS, Sass, SCSS, Adobe Swatch Exchange (.ase), Sketch, Figma, PNG, SVG, and more. You can also copy hex codes, RGB values, or HSL values directly."
                },
                {
                  question: "Is there a limit to how many palettes I can create?",
                  answer: "Free users get 10 AI generations per month. Pro users get unlimited generations, advanced features, and priority support. Enterprise users get everything plus team collaboration tools and custom integrations."
                },
                {
                  question: "How accurate is the accessibility checking?",
                  answer: "Our accessibility checker follows WCAG 2.1 guidelines and automatically calculates contrast ratios for text readability. It ensures your colors meet AA and AAA compliance standards for web accessibility."
                },
                {
                  question: "Can I customize the generated palettes?",
                  answer: "Absolutely! Every generated palette can be fine-tuned. Adjust individual colors, change saturation and brightness, add or remove colors, and see real-time previews of how your changes affect the overall harmony."
                }
              ].map((faq, i) => (
                <Card key={i} className="p-8 bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-foreground">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="scroll-reveal">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Ready to Transform Your Designs?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Join thousands of designers who create stunning color palettes with AI
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-xl px-12 py-6 shadow-2xl font-bold"
                onClick={() => navigate('/register')}
              >
                <Sparkles className="h-6 w-6 mr-3" />
                Start Creating Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/20 text-xl px-12 py-6 font-bold"
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