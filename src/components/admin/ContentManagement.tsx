import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Save, X, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentSettings {
  websiteName: string;
  logoUrl: string;
}

const ContentManagement = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ContentSettings>({
    websiteName: 'Palette Painter',
    logoUrl: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Load existing settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('contentSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      if (parsed.logoUrl) {
        setLogoPreview(parsed.logoUrl);
      }
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Logo file must be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive"
        });
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setSettings(prev => ({ ...prev, logoUrl: '' }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      let logoUrl = settings.logoUrl;
      
      // If a new logo file is selected, convert to base64 for storage
      if (logoFile) {
        logoUrl = logoPreview; // Use the preview as the URL (base64)
      }

      const newSettings = {
        websiteName: settings.websiteName,
        logoUrl
      };

      // Save to localStorage (in a real app, this would be saved to a database)
      localStorage.setItem('contentSettings', JSON.stringify(newSettings));
      
      setSettings(newSettings);
      setLogoFile(null);

      toast({
        title: "Settings Saved",
        description: "Website content has been updated successfully"
      });
    } catch (error) {
      console.error('Failed to save content settings:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save content settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Content Management</h2>
        <p className="text-muted-foreground">
          Manage your website's branding and content settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Website Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Website Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="websiteName">Website Name</Label>
              <Input
                id="websiteName"
                value={settings.websiteName}
                onChange={(e) => setSettings(prev => ({ ...prev, websiteName: e.target.value }))}
                placeholder="Enter website name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Logo Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Website Logo</Label>
              
              {/* Logo Preview */}
              {logoPreview && (
                <div className="relative inline-block">
                  <div className="w-32 h-32 border border-border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Upload Input */}
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Upload a logo image (max 5MB). Recommended size: 512x512px
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-muted/50">
            {logoPreview ? (
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-sm">
                <img 
                  src={logoPreview} 
                  alt="Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {settings.websiteName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold">{settings.websiteName}</h3>
              <p className="text-sm text-muted-foreground">Website Header Preview</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="px-8"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default ContentManagement;