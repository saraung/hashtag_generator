
import React, { useState, useCallback } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageDropzoneProps {
  onImageSelected: (file: File) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  }, []);

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file.');
      return;
    }

    // Create preview URL
    const filePreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(filePreviewUrl);
    
    // Pass the file to parent component
    onImageSelected(file);
  };

  return (
    <div 
      className={cn(
        'drop-area animate-fade-in flex flex-col items-center justify-center',
        isDragging && 'active'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id="image-upload"
        className="hidden" 
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      {previewUrl ? (
        <div className="relative w-full h-48 sm:h-64 mb-4 overflow-hidden rounded-xl">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-xl animate-scale-in" 
          />
          <button 
            onClick={() => {
              setPreviewUrl(null);
              document.getElementById('image-upload')?.click();
            }}
            className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm
                      hover:bg-white transition-colors border border-slate-200"
          >
            <Upload size={18} className="text-slate-700" />
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 bg-slate-100 p-5 rounded-full">
            <ImageIcon size={32} className="text-slate-400" />
          </div>
          <p className="mb-2 text-lg font-medium text-slate-800">Drop your image here</p>
          <p className="mb-4 text-sm text-slate-500">Or click to browse files</p>
          <button 
            onClick={() => document.getElementById('image-upload')?.click()}
            className="px-4 py-2 text-sm bg-white rounded-full shadow-sm hover:shadow-md
                     transition-all border border-slate-200 text-slate-700 font-medium"
          >
            Select Image
          </button>
        </>
      )}
    </div>
  );
};

export default ImageDropzone;
