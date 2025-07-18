import React, { useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ColorPalette } from '@/utils/colorGenerator';
import ColorThief from 'colorthief';

interface ImageUploadGeneratorProps {
  onPaletteGenerated: (palette: ColorPalette) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const ImageUploadGenerator: React.FC<ImageUploadGeneratorProps> = ({
  onPaletteGenerated,
  isGenerating,
  setIsGenerating
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Convert RGB to hex
  const rgbToHex = (rgb: [number, number, number]): string => {
    const [r, g, b] = rgb;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Extract colors from image using ColorThief
  const extractColorsFromImage = (imageElement: HTMLImageElement): ColorPalette => {
    const colorThief = new ColorThief();
    
    try {
      // Get dominant color and palette
      const dominantColor = colorThief.getColor(imageElement);
      const palette = colorThief.getPalette(imageElement, 6);
      
      // Convert RGB arrays to hex colors
      const colors = [dominantColor, ...palette].map(rgbToHex);
      
      // Create a balanced color palette
      const [primary, secondary, accent, background, text, textLight] = colors;
      
      return {
        brand: primary || '#3B82F6',
        accent: accent || '#F59E0B',
        "button-primary": primary || '#3B82F6',
        "button-text": '#FFFFFF',
        "button-secondary": background || '#FFFFFF',
        "button-secondary-text": primary || '#3B82F6',
        "text-primary": text || '#1F2937',
        "text-secondary": textLight || '#6B7280',
        "section-bg-1": background || '#FFFFFF',
        "section-bg-2": '#F9FAFB',
        "section-bg-3": '#F3F4F6',
        border: '#E5E7EB',
        highlight: secondary || '#10B981',
        "input-bg": background || '#FFFFFF',
        "input-text": text || '#1F2937'
      };
    } catch (error) {
      console.error('Error extracting colors:', error);
      throw new Error('Failed to extract colors from image');
    }
  };

  // Handle image file upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      
      // Create image element for ColorThief
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const palette = extractColorsFromImage(img);
          onPaletteGenerated(palette);
          
          toast({
            title: "🎨 Colors Extracted!",
            description: "Color palette generated from your image.",
          });
        } catch (error) {
          toast({
            title: "Extraction Failed",
            description: "Could not extract colors from this image. Try a different one.",
            variant: "destructive",
          });
        } finally {
          setIsGenerating(false);
        }
      };
      
      img.onerror = () => {
        toast({
          title: "Image Load Error",
          description: "Could not load the image. Please try again.",
          variant: "destructive",
        });
        setIsGenerating(false);
      };
      
      img.src = imageDataUrl;
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Upload an image to extract its dominant colors
      </p>
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isGenerating}
        className="w-full h-8 text-xs"
        size="sm"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Extracting Colors...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-3 w-3" />
            Choose Image
          </>
        )}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploadGenerator;