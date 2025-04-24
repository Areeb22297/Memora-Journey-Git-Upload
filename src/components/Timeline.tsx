
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Memory } from './MemoryCard';

interface TimelineProps {
  memories: Memory[];
  onMemoryClick: (memory: Memory) => void;
}

interface GroupedMemories {
  [key: string]: Memory[];
}

const Timeline = ({ memories, onMemoryClick }: TimelineProps) => {
  // Group memories by date (just using the date string for demo)
  const groupedMemories: GroupedMemories = memories.reduce((groups, memory) => {
    const date = memory.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(memory);
    return groups;
  }, {} as GroupedMemories);

  // Convert to array and sort by date (newest first)
  const sortedDates = Object.keys(groupedMemories).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-8 py-2">
      {sortedDates.map((date) => (
        <div key={date} className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="timeline-dot w-3 h-3 rounded-full bg-primary" />
            <h2 className="text-lg font-medium">{date}</h2>
            <span className="text-sm text-muted-foreground">
              {getRelativeTime(date)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-4">
            {groupedMemories[date].map((memory) => (
              <div 
                key={memory.id}
                className="animate-slide-in"
                onClick={() => onMemoryClick(memory)}
              >
                <img 
                  src={memory.thumbnail} 
                  alt={memory.title} 
                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                />
                <h3 className="mt-2 text-sm font-medium">{memory.title}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
