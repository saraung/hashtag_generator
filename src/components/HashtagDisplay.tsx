
import React, { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface HashtagDisplayProps {
  hashtags: string[];
  isLoading: boolean;
}

const HashtagDisplay: React.FC<HashtagDisplayProps> = ({ hashtags, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    const hashtagText = hashtags.map(tag => `#${tag}`).join(' ');
    navigator.clipboard.writeText(hashtagText);
    
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Hashtags have been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-slate-800">Generating hashtags...</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="h-8 bg-slate-100 rounded-full animate-pulse-soft" 
              style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (hashtags.length === 0) {
    return null;
  }

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-slate-800">Generated Hashtags</h3>
        <button 
          onClick={copyToClipboard}
          className={cn(
            "p-2 rounded-full transition-all",
            copied ? "bg-green-100 text-green-600" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          )}
        >
          {copied ? <Check size={18} /> : <Clipboard size={18} />}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
        {hashtags.map((tag, index) => (
          <span 
            key={index} 
            className="hashtag-pill animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HashtagDisplay;
