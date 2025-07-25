
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap } from 'lucide-react';
import SubscriptionModal from './SubscriptionModal';

interface ProUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
}

const ProUpsellModal: React.FC<ProUpsellModalProps> = ({ isOpen, onClose, templateName }) => {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleUpgradeClick = () => {
    onClose();
    setIsSubscriptionModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Upgrade to PRO
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">
                {templateName}
              </Badge>
              <p className="text-gray-600">
                This feature requires a PRO subscription. Upgrade now to unlock advanced tools and capabilities.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                PRO Features Include:
              </h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li className="flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Advanced template designs
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  AI-powered features
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Unlimited downloads
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Priority support
                </li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleUpgradeClick}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </>
  );
};

export default ProUpsellModal;
