
import React, { useState, useEffect } from 'react';
import { Star, Video, Image, Calendar, Award, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useMemories } from '@/context/MemoryContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Memory = {
  id: string;
  title: string;
  date: string;
  type: 'photo' | 'video';
  thumbnail: string;
  isFavorite: boolean;
  isHighlighted?: boolean;
  tags: string[];
  location?: string;
  images?: string[]; // Additional images for carousel
};

interface MemoryCardProps {
  memory: Memory;
  onClick?: (memory: Memory) => void;
}

const MemoryCard = ({ memory, onClick }: MemoryCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { toggleFavorite, toggleHighlight, deleteMemory } = useMemories();
  const [currentImage, setCurrentImage] = useState(memory.thumbnail);
  const [isHovering, setIsHovering] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  
  // Create an array of images for the carousel (use thumbnail as fallback)
  const images = memory.images?.length ? memory.images : [memory.thumbnail];
  
  // Handle image rotation on hover
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isHovering && images.length > 1) {
      interval = setInterval(() => {
        const nextIndex = (imageIndex + 1) % images.length;
        setImageIndex(nextIndex);
        setCurrentImage(images[nextIndex]);
      }, 1500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovering, imageIndex, images]);
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(memory.id);
    toast({
      description: `${memory.title} ${memory.isFavorite ? 'removed from' : 'added to'} favorites`,
      duration: 1500,
    });
  };
  
  const handleToggleHighlight = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHighlight(memory.id);
    toast({
      description: `${memory.title} ${memory.isHighlighted ? 'removed from' : 'added to'} highlights`,
      duration: 1500,
    });
  };
  
  const handleDeleteMemory = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMemory(memory.id);
    toast({
      description: "Memory moved to Recently Deleted",
      duration: 1500,
    });
  };
  
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    navigate(`/tag/${encodeURIComponent(tag)}`);
  };

  return (
    <div 
      className="memory-card cursor-pointer rounded-lg overflow-hidden bg-card border animate-fade-in hover:shadow-md transition-shadow"
      onClick={() => onClick?.(memory)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setImageIndex(0);
        setCurrentImage(memory.thumbnail);
      }}
    >
      <div className="relative aspect-video">
        <img 
          src={currentImage} 
          alt={memory.title}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        
        {/* Type indicator */}
        <div className="absolute top-2 left-2 bg-black/40 text-white p-1 rounded-md backdrop-blur-sm">
          {memory.type === 'video' ? (
            <Video size={16} />
          ) : (
            <Image size={16} />
          )}
        </div>
        
        {/* Three-dot dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()} 
              className="absolute top-2 right-2 p-1 rounded-full text-white hover:bg-white/20 transition-colors"
              aria-label="Options"
            >
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleToggleFavorite}>
              <Star size={16} className={cn(
                "mr-2",
                memory.isFavorite && "text-yellow-400 fill-yellow-400"
              )} />
              {memory.isFavorite ? "Remove favorite" : "Add to favorites"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleHighlight}>
              <Award size={16} className={cn(
                "mr-2",
                memory.isHighlighted && "text-purple-400 fill-purple-400"
              )} />
              {memory.isHighlighted ? "Remove highlight" : "Add to highlights"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteMemory} className="text-destructive">
              <Trash2 size={16} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Title and date */}
        <div className="absolute bottom-0 left-0 w-full p-3 text-white">
          <h3 className="font-medium text-sm truncate">{memory.title}</h3>
          <div className="flex items-center gap-1 text-xs opacity-80 mt-1">
            <Calendar size={12} />
            <span>{memory.date}</span>
          </div>
        </div>
      </div>
      
      {/* Tags */}
      {memory.tags.length > 0 && (
        <div className="px-3 py-2 flex flex-wrap gap-1">
          {memory.tags.map((tag) => (
            <span 
              key={tag} 
              className="inline-block bg-secondary text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-secondary/70"
              onClick={(e) => handleTagClick(e, tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryCard;
