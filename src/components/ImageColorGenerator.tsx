import React, { useState, useRef } from 'react';
import { Upload, Globe, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ColorPalette } from '@/utils/colorGenerator';
import ColorThief from 'colorthief';

interface ImageColorGeneratorProps {
  onPaletteGenerated: (palette: ColorPalette) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const ImageColorGenerator: React.FC<ImageColorGeneratorProps> = ({
  onPaletteGenerated,
  isGenerating,
  setIsGenerating
}) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
      setPreviewImage(imageDataUrl);
      
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
        setPreviewImage(screenshotUrl);
        
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Generate from Image or Website
          <Badge variant="secondary" className="ml-2">Pro</Badge>
        </CardTitle>
        <CardDescription>
          Extract color palettes from uploaded images or website screenshots
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="image" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload an image to extract its dominant colors
              </p>
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting Colors...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
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
            </div>
          </TabsContent>
          
          <TabsContent value="website" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
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
                />
                <Button
                  onClick={handleWebsiteSubmit}
                  disabled={isGenerating || !websiteUrl.trim()}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {previewImage && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Preview:</p>
            <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageColorGenerator;