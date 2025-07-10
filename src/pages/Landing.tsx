
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Zap, Eye, Settings, Crown, Star, ArrowRight, Check } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useEnhancedSubscription } from '@/contexts/EnhancedSubscriptionContext';
import PlanSelector from '@/components/PlanSelector';
import LivePreviewSection from '@/components/landing/LivePreviewSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Footer from '@/components/landing/Footer';

const Landing = () => {
  const navigate = useNavigate();
  const { isPro } = useFeatureAccess();
  const { setCurrentPlan, plans } = useEnhancedSubscription();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Palette Painter
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant={isPro ? "default" : "outline"}
                onClick={() => {
                  const freePlan = plans.find(p => p.id === 'free');
                  const proPlan = plans.find(p => p.id === 'pro');
                  setCurrentPlan(isPro ? freePlan : proPlan);
                }}
                className={isPro ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
              >
                {isPro ? (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Pro Mode
                  </>
                ) : (
                  'Free Mode'
                )}
              </Button>
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Crown className="h-3 w-3 mr-1" />
            AI-Powered Color Generation
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create Perfect Color
            <br />
            Palettes Instantly
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your web designs with AI-generated color palettes. Choose from professional templates, 
            customize every shade, and see live previews in real-time.
          </p>
          <div className="flex items-center justify-center space-x-4 mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Creating
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Eye className="h-5 w-5 mr-2" />
              See Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>10k+ Happy Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>50+ Templates</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Instant Generation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Preview Section */}
      <LivePreviewSection />

        {/* Plan Selector for Testing */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <PlanSelector />
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
