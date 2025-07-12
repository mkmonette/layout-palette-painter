import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useColorRoles } from '@/utils/colorRoleMapper';
import { Badge } from '@/components/ui/badge';
import { ColorPalette } from '@/types/template';

// Default palette for preview
const defaultPalette: ColorPalette = {
  brand: '#3366FF',
  accent: '#FF6B35',
  'button-primary': '#3366FF',
  'button-text': '#FFFFFF',
  'button-secondary': '#6C757D',
  'button-secondary-text': '#FFFFFF',
  'text-primary': '#1F2937',
  'text-secondary': '#6B7280',
  'section-bg-1': '#FFFFFF',
  'section-bg-2': '#F9FAFB',
  'section-bg-3': '#F3F4F6',
  border: '#D1D5DB',
  highlight: '#FEF3C7',
  'input-bg': '#FFFFFF',
  'input-text': '#1F2937'
};

const MiniTemplatePreview = () => {
  const colorRoles = useColorRoles(defaultPalette);

  const getSectionStyle = (bgRole: string, textRole: string) => ({
    backgroundColor: colorRoles[bgRole] || '#FFFFFF',
    color: colorRoles[textRole] || '#000000',
  });

  const getButtonStyle = (bgRole: string, textRole: string) => ({
    backgroundColor: colorRoles[bgRole] || '#3366FF',
    color: colorRoles[textRole] || '#FFFFFF',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  });

  const getInputStyle = () => ({
    backgroundColor: colorRoles['input-bg'] || '#FFFFFF',
    color: colorRoles['input-text'] || '#000000',
    border: `1px solid ${colorRoles.border || '#D1D5DB'}`,
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '14px'
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mini Template Preview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Live preview using current color roles
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Section */}
        <div 
          className="p-6 rounded-lg"
          style={getSectionStyle('section-bg-1', 'text-primary')}
        >
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className="text-xs">
              Header - section-bg-1
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Our Platform</h1>
          <p className="mb-4 opacity-80">
            This is a sample header section showcasing the primary background and text colors.
          </p>
          <button style={getButtonStyle('button-primary', 'button-text')}>
            Get Started
          </button>
        </div>

        {/* Card/Content Section */}
        <div 
          className="p-6 rounded-lg"
          style={getSectionStyle('section-bg-2', 'text-primary')}
        >
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className="text-xs">
              Content - section-bg-2
            </Badge>
          </div>
          <h2 className="text-xl font-semibold mb-3">Featured Content</h2>
          <p 
            className="mb-4"
            style={{ color: colorRoles['text-secondary'] || colorRoles['text-primary'] }}
          >
            This content block demonstrates secondary backgrounds with appropriate text contrast.
            The text adapts automatically for optimal readability.
          </p>
          <button style={getButtonStyle('button-secondary', 'button-secondary-text')}>
            Learn More
          </button>
        </div>

        {/* Form Section */}
        <div 
          className="p-6 rounded-lg"
          style={getSectionStyle('section-bg-3', 'text-primary')}
        >
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className="text-xs">
              Form - section-bg-3
            </Badge>
          </div>
          <h3 className="text-lg font-medium mb-4">Contact Form</h3>
          <div className="space-y-4">
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: colorRoles['text-primary'] }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full"
                style={getInputStyle()}
              />
            </div>
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: colorRoles['text-primary'] }}
              >
                Message
              </label>
              <textarea
                placeholder="Your message here..."
                className="w-full h-20 resize-none"
                style={getInputStyle()}
              />
            </div>
          </div>
        </div>

        {/* Brand/Footer Section */}
        <div 
          className="p-6 rounded-lg"
          style={getSectionStyle('brand', 'onBrand')}
        >
          <div className="flex justify-between items-start mb-4">
            <Badge 
              variant="outline" 
              className="text-xs border-current"
              style={{ 
                backgroundColor: 'transparent',
                color: colorRoles['onBrand'] || '#FFFFFF',
                borderColor: colorRoles['onBrand'] || '#FFFFFF'
              }}
            >
              Brand - brand
            </Badge>
          </div>
          <h3 className="text-lg font-semibold mb-2">Your Brand</h3>
          <p className="mb-4 opacity-90">
            This section uses the brand color with automatically calculated readable text.
          </p>
          <div className="flex gap-3">
            <button 
              style={{
                ...getButtonStyle('accent', 'onAccent'),
                backgroundColor: colorRoles.accent,
                color: colorRoles.onAccent
              }}
            >
              Accent Action
            </button>
            <button 
              style={{
                backgroundColor: 'transparent',
                color: colorRoles['onBrand'] || '#FFFFFF',
                border: `1px solid ${colorRoles['onBrand'] || '#FFFFFF'}`,
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Secondary
            </button>
          </div>
        </div>

        {/* Color Role Summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Active Color Roles</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Brand: {colorRoles.brand}</div>
            <div>Accent: {colorRoles.accent}</div>
            <div>Button Primary: {colorRoles['button-primary']}</div>
            <div>Button Secondary: {colorRoles['button-secondary']}</div>
            <div>Section BG 1: {colorRoles['section-bg-1']}</div>
            <div>Section BG 2: {colorRoles['section-bg-2']}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniTemplatePreview;