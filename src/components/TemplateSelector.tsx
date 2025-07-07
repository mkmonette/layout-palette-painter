
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
    preview: 'bg-gradient-to-r from-blue-500 to-purple-600'
  },
  {
    id: 'minimal-header' as TemplateType,
    name: 'Minimal Header',
    description: 'Simple header with navigation',
    preview: 'bg-gradient-to-r from-gray-800 to-gray-600'
  },
  {
    id: 'bold-landing' as TemplateType,
    name: 'Bold Landing',
    description: 'Eye-catching landing page design',
    preview: 'bg-gradient-to-r from-red-500 to-orange-500'
  },
  {
    id: 'creative-portfolio' as TemplateType,
    name: 'Creative Portfolio',
    description: 'Artistic portfolio layout',
    preview: 'bg-gradient-to-r from-green-500 to-teal-500'
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
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-8 rounded ${template.preview} shadow-sm`} />
            <div className="text-left">
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
