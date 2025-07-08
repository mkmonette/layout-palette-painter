
import React from 'react';
import { TemplateType } from '@/types/template';
import { Button } from '@/components/ui/button';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const templates = [
  {
    id: 'modern-hero' as TemplateType,
    name: 'Modern Hero',
    description: 'Clean hero section with centered content',
    preview: 'bg-gradient-to-r from-blue-500 to-purple-600',
    thumbnail: (
      <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="text-white text-xs font-semibold text-center z-10">
          <div className="mb-1">Hero Title</div>
          <div className="text-[8px] opacity-80">Subtitle text</div>
        </div>
      </div>
    )
  },
  {
    id: 'minimal-header' as TemplateType,
    name: 'Minimal Header',
    description: 'Simple header with navigation',
    preview: 'bg-gradient-to-r from-gray-800 to-gray-600',
    thumbnail: (
      <div className="w-full h-20 bg-white border rounded-md flex flex-col">
        <div className="h-8 bg-gray-100 flex items-center justify-between px-3 border-b">
          <div className="w-12 h-2 bg-gray-400 rounded"></div>
          <div className="flex space-x-1">
            <div className="w-6 h-1 bg-gray-300 rounded"></div>
            <div className="w-6 h-1 bg-gray-300 rounded"></div>
            <div className="w-6 h-1 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-2 bg-gray-300 rounded mb-1 mx-auto"></div>
            <div className="w-12 h-1 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'bold-landing' as TemplateType,
    name: 'Bold Landing',
    description: 'Eye-catching landing page design',
    preview: 'bg-gradient-to-r from-red-500 to-orange-500',
    thumbnail: (
      <div className="w-full h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-md flex items-center justify-center relative">
        <div className="absolute top-2 left-2 w-8 h-1 bg-white/60 rounded"></div>
        <div className="text-white text-center">
          <div className="text-xs font-bold mb-1">BOLD</div>
          <div className="text-[8px] opacity-80">Impact Design</div>
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-3 bg-white/20 rounded"></div>
      </div>
    )
  },
  {
    id: 'creative-portfolio' as TemplateType,
    name: 'Creative Portfolio',
    description: 'Artistic portfolio layout',
    preview: 'bg-gradient-to-r from-green-500 to-teal-500',
    thumbnail: (
      <div className="w-full h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-md relative overflow-hidden">
        <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full"></div>
        <div className="absolute top-2 right-2 w-6 h-2 bg-white/40 rounded"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="grid grid-cols-3 gap-1">
            <div className="h-3 bg-white/30 rounded"></div>
            <div className="h-3 bg-white/20 rounded"></div>
            <div className="h-3 bg-white/40 rounded"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'gradient-hero' as TemplateType,
    name: 'Gradient Hero',
    description: 'Modern gradient background with floating elements',
    preview: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    thumbnail: (
      <div className="w-full h-20 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-md relative overflow-hidden">
        <div className="absolute top-1 right-3 w-3 h-3 bg-white/20 rounded-full"></div>
        <div className="absolute top-4 left-2 w-2 h-2 bg-white/30 rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-white/15 rounded-full"></div>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-center">
            <div className="text-xs font-semibold">Gradient</div>
            <div className="text-[8px] opacity-80">Floating Elements</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'split-screen' as TemplateType,
    name: 'Split Screen',
    description: 'Dynamic split layout with image showcase',
    preview: 'bg-gradient-to-r from-indigo-600 to-cyan-500',
    thumbnail: (
      <div className="w-full h-20 bg-white border rounded-md flex overflow-hidden">
        <div className="w-1/2 bg-indigo-600 flex items-center justify-center">
          <div className="text-white text-[8px] text-center">
            <div className="font-semibold">Content</div>
            <div className="opacity-80">Section</div>
          </div>
        </div>
        <div className="w-1/2 bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
          <div className="w-8 h-6 bg-white/30 rounded"></div>
        </div>
      </div>
    )
  },
  {
    id: 'magazine-style' as TemplateType,
    name: 'Magazine Style',
    description: 'Editorial design with typography focus',
    preview: 'bg-gradient-to-r from-slate-900 to-slate-700',
    thumbnail: (
      <div className="w-full h-20 bg-white border rounded-md p-2">
        <div className="h-3 bg-slate-800 mb-1"></div>
        <div className="grid grid-cols-2 gap-2 h-12">
          <div className="space-y-1">
            <div className="h-1 bg-gray-300 rounded"></div>
            <div className="h-1 bg-gray-300 rounded"></div>
            <div className="h-1 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  },
  {
    id: 'startup-landing' as TemplateType,
    name: 'Startup Landing',
    description: 'Tech startup focused design',
    preview: 'bg-gradient-to-r from-emerald-400 to-blue-500',
    thumbnail: (
      <div className="w-full h-20 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-md relative">
        <div className="absolute top-2 left-2 right-2 h-2 bg-white/20 rounded"></div>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-center">
            <div className="text-xs font-semibold">Startup</div>
            <div className="text-[8px] opacity-80">Tech Focus</div>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 h-3 bg-white/15 rounded flex items-center justify-center">
          <div className="w-4 h-1 bg-white/40 rounded"></div>
        </div>
      </div>
    )
  },
  {
    id: 'tech-startup' as TemplateType,
    name: 'Tech Startup',
    description: 'Modern tech company with glassmorphism',
    preview: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600',
    thumbnail: (
      <div className="w-full h-20 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-md relative overflow-hidden">
        <div className="absolute inset-2 bg-white/10 backdrop-blur rounded border border-white/20"></div>
        <div className="flex items-center justify-center h-full relative z-10">
          <div className="text-white text-center">
            <div className="text-xs font-semibold">Tech</div>
            <div className="text-[8px] opacity-80">Glassmorphism</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'creative-agency' as TemplateType,
    name: 'Creative Agency',
    description: 'Bold creative studio design',
    preview: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
    thumbnail: (
      <div className="w-full h-20 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-md relative overflow-hidden">
        <div className="absolute top-1 left-1 w-6 h-2 bg-white/40 rounded-full"></div>
        <div className="absolute top-1 right-1 w-4 h-4 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-1 left-1 w-4 h-4 bg-white/30 rounded"></div>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-center font-bold">
            <div className="text-xs">CREATIVE</div>
            <div className="text-[8px] opacity-80">AGENCY</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'saas-product' as TemplateType,
    name: 'SaaS Product',
    description: 'Clean SaaS landing with features',
    preview: 'bg-gradient-to-r from-violet-600 to-indigo-600',
    thumbnail: (
      <div className="w-full h-20 bg-white border rounded-md p-2">
        <div className="h-2 bg-violet-600 rounded mb-2"></div>
        <div className="grid grid-cols-3 gap-1 mb-1">
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-center">
          <div className="w-8 h-3 bg-violet-200 rounded"></div>
        </div>
      </div>
    )
  },
  {
    id: 'ecommerce-landing' as TemplateType,
    name: 'E-commerce Landing',
    description: 'Product-focused e-commerce design',
    preview: 'bg-gradient-to-r from-rose-400 to-pink-600',
    thumbnail: (
      <div className="w-full h-20 bg-white border rounded-md p-2">
        <div className="h-2 bg-rose-400 rounded mb-2"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-100 rounded p-1">
            <div className="h-6 bg-gray-200 rounded mb-1"></div>
            <div className="h-1 bg-gray-300 rounded"></div>
          </div>
          <div className="bg-gray-100 rounded p-1">
            <div className="h-6 bg-gray-200 rounded mb-1"></div>
            <div className="h-1 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <div className="space-y-3">
      {templates.map((template) => (
        <Button
          key={template.id}
          variant={selectedTemplate === template.id ? "default" : "outline"}
          className={`w-full p-4 h-auto justify-start transition-all duration-200 ${
            selectedTemplate === template.id 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-md' 
              : 'hover:border-blue-300 hover:bg-blue-50'
          }`}
          onClick={() => onTemplateChange(template.id)}
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="w-16 h-12 rounded overflow-hidden shadow-sm flex-shrink-0">
              {template.thumbnail}
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">{template.name}</div>
              <div className={`text-xs ${
                selectedTemplate === template.id ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {template.description}
              </div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default TemplateSelector;
