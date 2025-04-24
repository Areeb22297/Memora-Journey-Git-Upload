
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Memory } from './MemoryCard';
import { X, Star, Video, Image, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MemoryDialogProps {
  memory: Memory | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MemoryDialog = ({ memory, onClose, onNext, onPrevious }: MemoryDialogProps) => {
  const { toast } = useToast();
  
  if (!memory) return null;
  
  const handleToggleFavorite = () => {
    toast({
      description: `${memory.title} ${memory.isFavorite ? 'removed from' : 'added to'} favorites`,
      duration: 1500,
    });
  };

  return (
    <Dialog open={!!memory} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">{memory.title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 mt-2">
          {/* Media */}
          <div className="relative aspect-video bg-black rounded-md overflow-hidden">
            <img 
              src={memory.thumbnail} 
              alt={memory.title}
              className="w-full h-full object-contain"
            />
            
            {/* Type indicator */}
            <div className="absolute top-3 left-3 bg-black/40 text-white p-1 rounded-md backdrop-blur-sm">
              {memory.type === 'video' ? (
                <Video size={18} />
              ) : (
                <Image size={18} />
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40 ml-2"
                onClick={onPrevious}
              >
                <ArrowLeft size={20} />
              </Button>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40 mr-2"
                onClick={onNext}
              >
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
          
          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{memory.date}</div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleToggleFavorite}
                  className={cn(
                    "gap-1",
                    memory.isFavorite && "text-yellow-500"
                  )}
                >
                  <Star size={16} fill={memory.isFavorite ? "currentColor" : "none"} />
                  <span>{memory.isFavorite ? "Favorited" : "Add to favorites"}</span>
                </Button>
              </div>
              
              {memory.location && (
                <div className="flex items-center gap-1 text-sm">
                  <MapPin size={14} />
                  <span>{memory.location}</span>
                </div>
              )}
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {memory.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="inline-block bg-secondary text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Related memories</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemoryDialog;
