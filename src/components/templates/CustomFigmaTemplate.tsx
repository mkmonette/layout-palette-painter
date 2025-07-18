import React from 'react';
import { ColorPalette } from '@/utils/colorGenerator';
import { CustomTemplate } from '@/types/template';

interface CustomFigmaTemplateProps {
  colorPalette: ColorPalette;
  customTemplate: CustomTemplate;
}

const CustomFigmaTemplate: React.FC<CustomFigmaTemplateProps> = ({ 
  colorPalette, 
  customTemplate 
}) => {
  // Get parsed sections from layout data
  const sections = customTemplate.layoutData?.sections || [];
  const hasMultipleSections = sections.length > 0;

  // Render section based on its type
  const renderSection = (section: any, index: number) => {
    const sectionType = section.type.toLowerCase();
    
    switch (sectionType) {
      case 'header':
        return (
          <header key={section.id} className="border-b border-border/20 bg-section-bg-1/80 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: colorPalette.brand }}
                  >
                    F
                  </div>
                  <span className="font-semibold text-text-primary">{section.originalName}</span>
                </div>
                
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Home</a>
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">About</a>
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Services</a>
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Contact</a>
                </nav>
                
                <button 
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    backgroundColor: colorPalette['button-primary'], 
                    color: colorPalette['button-text'] 
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </header>
        );

      case 'hero':
        return (
          <section key={section.id} className="py-16 lg:py-24">
            <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                       style={{ 
                         borderColor: colorPalette.highlight + '40',
                         backgroundColor: colorPalette.highlight + '10',
                         color: colorPalette.highlight 
                       }}>
                    ✨ {section.originalName}
                  </div>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    <span className="text-text-primary">Your Design</span>
                    <br />
                    <span style={{ color: colorPalette.brand }}>Brought to Life</span>
                  </h1>
                  
                  <p className="text-lg text-text-secondary leading-relaxed max-w-md">
                    This section comes from your Figma design: "{section.originalName}". 
                    Enhanced with dynamic color generation.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                      style={{ 
                        backgroundColor: colorPalette['button-primary'], 
                        color: colorPalette['button-text'] 
                      }}
                    >
                      Explore Design
                    </button>
                    <button 
                      className="px-8 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:shadow-md"
                      style={{ 
                        borderColor: colorPalette['button-secondary'], 
                        backgroundColor: colorPalette['button-secondary'],
                        color: colorPalette['button-secondary-text']
                      }}
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src={customTemplate.thumbnail || customTemplate.preview}
                      alt={section.originalName}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop&crop=center";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={section.id} className="py-16 bg-section-bg-2/50">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-text-primary">{section.originalName}</h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    This section represents your "{section.originalName}" from Figma. 
                    The colors adapt dynamically while preserving your design structure.
                  </p>
                  <div className="flex gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: colorPalette.accent + '20' }}
                    >
                      <span className="text-xl">📖</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Story-driven Design</h3>
                      <p className="text-text-secondary text-sm">Your Figma narrative enhanced</p>
                    </div>
                  </div>
                </div>
                <div 
                  className="h-64 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: colorPalette.accent + '10' }}
                >
                  <span className="text-6xl opacity-50">📝</span>
                </div>
              </div>
            </div>
          </section>
        );

      case 'features':
      case 'services':
        return (
          <section key={section.id} className="py-16">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-text-primary mb-4">{section.originalName}</h2>
                <p className="text-text-secondary max-w-2xl mx-auto">
                  This section showcases your "{section.originalName}" from your Figma design
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: "🎯", title: "Feature One", description: "First key feature from your design" },
                  { icon: "⚡", title: "Feature Two", description: "Second important element" },
                  { icon: "🌟", title: "Feature Three", description: "Third standout feature" }
                ].map((feature, idx) => (
                  <div key={idx} className="text-center space-y-4">
                    <div 
                      className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: colorPalette.accent + '20' }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">{feature.title}</h3>
                    <p className="text-text-secondary">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section key={section.id} className="py-16 bg-section-bg-3/30">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-text-primary mb-4">{section.originalName}</h2>
                <p className="text-text-secondary">Social proof from your Figma design</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { name: "Alex Chen", role: "Design Lead", quote: "Amazing attention to detail in the original design" },
                  { name: "Sarah Kim", role: "Product Manager", quote: "The color adaptation brings the design to life" }
                ].map((testimonial, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 rounded-2xl border"
                    style={{ backgroundColor: colorPalette['section-bg-1'] }}
                  >
                    <p className="text-text-secondary italic mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: colorPalette.brand }}
                      >
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{testimonial.name}</div>
                        <div className="text-sm text-text-secondary">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'cta':
      case 'call-to-action':
        return (
          <section key={section.id} className="py-16 bg-gradient-to-r from-section-bg-2 to-section-bg-3">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                {section.originalName}
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                This call-to-action section maintains your Figma design intent with dynamic colors
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    backgroundColor: colorPalette['button-primary'], 
                    color: colorPalette['button-text'] 
                  }}
                >
                  Primary Action
                </button>
                <button 
                  className="px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-200"
                  style={{ 
                    borderColor: colorPalette['button-secondary'], 
                    backgroundColor: colorPalette['button-secondary'],
                    color: colorPalette['button-secondary-text']
                  }}
                >
                  Secondary Action
                </button>
              </div>
            </div>
          </section>
        );

      case 'footer':
        return (
          <footer key={section.id} className="py-8 border-t border-border/20 bg-section-bg-1/50">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: colorPalette.brand }}
                  >
                    F
                  </div>
                  <span className="text-text-secondary text-sm">
                    {section.originalName} • Imported from Figma • {new Date(customTemplate.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-text-secondary text-sm">
                  Custom Template • Version {customTemplate.version}
                </div>
              </div>
            </div>
          </footer>
        );

      default:
        // Generic section for unrecognized types
        return (
          <section key={section.id} className={`py-16 ${index % 2 === 0 ? 'bg-section-bg-2/30' : ''}`}>
            <div className="container mx-auto px-6">
              <div className="text-center space-y-6">
                <div 
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: colorPalette.accent + '20' }}
                >
                  📦
                </div>
                <h2 className="text-3xl font-bold text-text-primary">{section.originalName}</h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  This is a custom section from your Figma design. The frame contents have been preserved 
                  and enhanced with your color palette.
                </p>
                <div 
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: colorPalette.highlight + '10',
                    color: colorPalette.highlight 
                  }}
                >
                  Section Type: {section.type}
                </div>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-section-bg-1 to-section-bg-2">
      {hasMultipleSections ? (
        // Render all parsed sections dynamically
        <>
          {sections.map((section, index) => renderSection(section, index))}
        </>
      ) : (
        // Fallback: render default template if no sections found
        <>
          <header className="border-b border-border/20 bg-section-bg-1/80 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: colorPalette.brand }}
                  >
                    F
                  </div>
                  <span className="font-semibold text-text-primary">{customTemplate.name}</span>
                </div>
                
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Home</a>
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">About</a>
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Services</a>
                  <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Contact</a>
                </nav>
                
                <button 
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    backgroundColor: colorPalette['button-primary'], 
                    color: colorPalette['button-text'] 
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </header>

          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-6">
              <div className="text-center space-y-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                     style={{ 
                       borderColor: colorPalette.highlight + '40',
                       backgroundColor: colorPalette.highlight + '10',
                       color: colorPalette.highlight 
                     }}>
                  ⚠️ Limited Section Detection
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="text-text-primary">Your Figma Design</span>
                  <br />
                  <span style={{ color: colorPalette.brand }}>Needs Section Labels</span>
                </h1>
                
                <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
                  We couldn't find multiple sections in your design. Try labeling your frames clearly 
                  (e.g. "Header", "Hero", "About", "Footer") and re-importing for a better experience.
                </p>

                <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
                  <img 
                    src={customTemplate.thumbnail || customTemplate.preview}
                    alt={customTemplate.name}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop&crop=center";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </section>

          <footer className="py-8 border-t border-border/20 bg-section-bg-1/50">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: colorPalette.brand }}
                  >
                    F
                  </div>
                  <span className="text-text-secondary text-sm">
                    Imported from Figma • {new Date(customTemplate.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-text-secondary text-sm">
                  Custom Template • Version {customTemplate.version}
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default CustomFigmaTemplate;