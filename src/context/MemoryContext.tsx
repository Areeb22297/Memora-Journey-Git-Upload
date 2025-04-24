import React, { createContext, useContext, useState, useEffect } from 'react';
import { Memory } from '@/components/MemoryCard';
import { useToast } from '@/hooks/use-toast';


// Mock data for memories
const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Beach Sunset',
    date: '2023-07-15',
    type: 'photo',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2h8ZW58MHx8MHx8fDA%3D',
    isFavorite: true,
    isHighlighted: true,
    tags: ['beach', 'sunset', 'vacation'],
    location: 'Malibu, CA',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2h8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVhY2glMjBzdW5zZXR8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjBzdW5zZXR8ZW58MHx8MHx8fDA%3D'
    ]
  },
  {
    id: '2',
    title: 'Mountain Hike',
    date: '2023-07-10',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW91bnRhaW58ZW58MHx8MHx8fDA%3D',
    isFavorite: false,
    isHighlighted: false,
    tags: ['mountains', 'hiking', 'adventure'],
    location: 'Rocky Mountains',
    images: [
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW91bnRhaW58ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW91bnRhaW4lMjBoaWtlfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW4lMjBoaWtlfGVufDB8fDB8fHww'
    ]
  },
  {
    id: '3',
    title: 'Family Dinner',
    date: '2023-07-05',
    type: 'photo',
    thumbnail: 'https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhbWlseSUyMGRpbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
    isFavorite: true,
    isHighlighted: true,
    tags: ['family', 'dinner', 'home'],
    location: 'Home',
    images: [
      'https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhbWlseSUyMGRpbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhbWlseSUyMGRpbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhbWlseSUyMGRpbm5lcnxlbnwwfHwwfHx8MA%3D%3D'
    ]
  },
  {
    id: '4',
    title: 'City Lights',
    date: '2023-07-05',
    type: 'photo',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D',
    isFavorite: true,
    isHighlighted: false,
    tags: ['city', 'night', 'lights'],
    location: 'New York, NY',
    images: [
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D'
    ]
  },
  {
    id: '5',
    title: 'Birthday Party',
    date: '2023-06-20',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlydGhkYXl8ZW58MHx8MHx8fDA%3D',
    isFavorite: false,
    isHighlighted: false,
    tags: ['birthday', 'party', 'celebration'],
    location: 'Home',
    images: [
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlydGhkYXl8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlydGhkYXl8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlydGhkYXl8ZW58MHx8MHx8fDA%3D'
    ]
  },
  {
    id: '6',
    title: 'Garden Flowers',
    date: '2023-06-15',
    type: 'photo',
    thumbnail: 'https://images.unsplash.com/photo-1595351049677-b241d8a5a337?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
    isFavorite: true,
    isHighlighted: true,
    tags: ['garden', 'flowers', 'spring'],
    location: 'Backyard',
    images: [
      'https://images.unsplash.com/photo-1595351049677-b241d8a5a337?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1595351049677-b241d8a5a337?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1595351049677-b241d8a5a337?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zmxvd2Vyc3xlbnwwfHwwfHx8MA%3D%3D'
    ]
  },
  {
    id: '7',
    title: 'Downtown Walk',
    date: '2023-06-10',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D',
    isFavorite: false,
    isHighlighted: false,
    tags: ['downtown', 'walk', 'city'],
    location: 'Seattle, WA',
    images: [
      'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D'
    ]
  },
  {
    id: '8',
    title: 'Pet Play Time',
    date: '2023-06-05',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZG9nfGVufDB8fDB8fHww',
    isFavorite: true,
    isHighlighted: false,
    tags: ['pet', 'dog', 'play'],
    location: 'Park',
    images: [
      'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZG9nfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZG9nfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZG9nfGVufDB8fDB8fHww'
    ]
  }
];

interface MemoryContextType {
  memories: Memory[];
  favoriteMemories: Memory[];
  highlightedMemories: Memory[];
  deletedMemories: Memory[];
  toggleFavorite: (id: string) => void;
  toggleHighlight: (id: string) => void;
  deleteMemory: (id: string) => void;
  restoreMemory: (id: string) => void;
  permanentlyDeleteMemory: (id: string) => void;
  getMemoriesByTag: (tag: string) => Memory[];
  getMemoriesByDate: (date: string) => Memory[];
  addMemory: (memory: Memory) => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);
export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [deletedMemories, setDeletedMemories] = useState<Memory[]>([]);
  const { toast } = useToast();
  
  const favoriteMemories = memories.filter(memory => memory.isFavorite);
  const highlightedMemories = memories.filter(memory => memory.isHighlighted);
  
  const toggleFavorite = (id: string) => {
    setMemories(prevMemories => 
      prevMemories.map(memory => 
        memory.id === id 
          ? { ...memory, isFavorite: !memory.isFavorite } 
          : memory
      )
    );
  };
  
  const toggleHighlight = (id: string) => {
    setMemories(prevMemories => 
      prevMemories.map(memory => 
        memory.id === id 
          ? { ...memory, isHighlighted: !memory.isHighlighted } 
          : memory
      )
    );
  };
  
  const deleteMemory = (id: string) => {
    const memoryToDelete = memories.find(memory => memory.id === id);
    
    if (memoryToDelete) {
      // Remove from active memories
      setMemories(prevMemories => prevMemories.filter(memory => memory.id !== id));
      
      // Add to deleted memories
      setDeletedMemories(prevDeleted => [...prevDeleted, memoryToDelete]);
      
      toast({
        description: "Memory moved to Recently Deleted",
        duration: 3000,
      });
    }
  };
  
  const restoreMemory = (id: string) => {
    const memoryToRestore = deletedMemories.find(memory => memory.id === id);
    
    if (memoryToRestore) {
      // Remove from deleted memories
      setDeletedMemories(prevDeleted => prevDeleted.filter(memory => memory.id !== id));
      
      // Add back to active memories
      setMemories(prevMemories => [...prevMemories, memoryToRestore]);
      
      toast({
        description: "Memory restored successfully",
        duration: 3000,
      });
    }
  };
  
  const permanentlyDeleteMemory = (id: string) => {
    setDeletedMemories(prevDeleted => prevDeleted.filter(memory => memory.id !== id));
    
    toast({
      description: "Memory permanently deleted",
      duration: 3000,
    });
  };
  
  const getMemoriesByTag = (tag: string) => {
    return memories.filter(memory => 
      memory.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  };
  
  const getMemoriesByDate = (date: string) => {
    return memories.filter(memory => memory.date === date);
  };
  
  const addMemory = (memory: Memory) => {
    setMemories(prevMemories => [memory, ...prevMemories]);
  };
  
  useEffect(() => {
    fetch('http://localhost:4001/api/memories')
      .then(res => res.json())
      .then(data => setMemories(data));
  }, []);

  return (
    <MemoryContext.Provider value={{ 
      memories, 
      favoriteMemories, 
      highlightedMemories,
      deletedMemories,
      toggleFavorite, 
      toggleHighlight,
      deleteMemory,
      restoreMemory,
      permanentlyDeleteMemory,
      getMemoriesByTag,
      getMemoriesByDate,
      addMemory
    }}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemories = () => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemories must be used within a MemoryProvider');
  }
  return context;
};
