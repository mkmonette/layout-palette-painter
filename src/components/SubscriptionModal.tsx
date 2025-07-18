import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SubscriptionCheckout from './SubscriptionCheckout';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Choose Your Plan</DialogTitle>
        </DialogHeader>
        <SubscriptionCheckout />
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;