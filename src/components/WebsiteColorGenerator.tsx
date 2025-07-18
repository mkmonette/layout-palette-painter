import React, { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ColorPalette } from '@/utils/colorGenerator';
import ColorThief from 'colorthief';

interface WebsiteColorGeneratorProps {
  onPaletteGenerated: (palette: ColorPalette) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const WebsiteColorGenerator: React.FC<WebsiteColorGeneratorProps> = ({
  onPaletteGenerated,
  isGenerating,
  setIsGenerating
}) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
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

  // Handle website URL submission
  const handleWebsiteSubmit = async () => {
    if (!websiteUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(websiteUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Use Microlink API to get website preview
      const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(websiteUrl)}&screenshot=true&meta=false&insights=false`;
      
      const response = await fetch(microlinkUrl);
      const data = await response.json();
      
      if (data.status === 'success' && data.data?.screenshot?.url) {
        const screenshotUrl = data.data.screenshot.url;
        
        // Create image element for ColorThief
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            const palette = extractColorsFromImage(img);
            onPaletteGenerated(palette);
            
            toast({
              title: "🌐 Colors Extracted!",
              description: `Color palette generated from ${websiteUrl}`,
            });
          } catch (error) {
            toast({
              title: "Extraction Failed",
              description: "Could not extract colors from website. Try a different URL.",
              variant: "destructive",
            });
          } finally {
            setIsGenerating(false);
          }
        };
        
        img.onerror = () => {
          toast({
            title: "Image Load Error",
            description: "Could not load website preview. Try a different URL.",
            variant: "destructive",
          });
          setIsGenerating(false);
        };
        
        img.src = screenshotUrl;
      } else {
        throw new Error('Failed to get website preview');
      }
    } catch (error) {
      console.error('Website preview error:', error);
      toast({
        title: "Website Preview Failed",
        description: "Could not generate preview from this website. Try a different URL.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Enter a website URL to extract colors from its screenshot
      </p>
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://example.com"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleWebsiteSubmit()}
          disabled={isGenerating}
          className="h-8 text-xs"
        />
        <Button
          onClick={handleWebsiteSubmit}
          disabled={isGenerating || !websiteUrl.trim()}
          size="sm"
          className="h-8 px-3"
        >
          {isGenerating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Globe className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default WebsiteColorGenerator;