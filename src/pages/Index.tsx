import React, { useState } from 'react';
import ImageDropzone from '@/components/ImageDropzone';
import HashtagDisplay from '@/components/HashtagDisplay';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setHashtags([]);
  };

  const generateHashtags = async () => {
    if (!selectedImage) return;

    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);

    reader.onloadend = async () => {
      const base64Image = reader.result;

      try {
        const res = await fetch("https://saraung-hashtag-generator.hf.space/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await res.json();

        if (Array.isArray(data.hashtags)) {
          setHashtags(data.hashtags); // already an array
        } else if (typeof data.hashtags === 'string') {
          const hashtagList = data.hashtags
            .replace(/#/g, '')
            .split(/\s+/)
            .filter(Boolean)
            .map((tag) => `#${tag}`);

          setHashtags(hashtagList);
        } else {
          console.error("❌ Invalid response structure from server:", data);
          alert("😢 Failed to generate hashtags. Try again later.");
        }
      } catch (err) {
        console.error("🚫 Unable to connect to the server.", err);
        alert("🚫 Unable to connect to the server.");
      }

      setIsLoading(false);
    };
  };

  return (
    <div className="min-h-screen w-full hashtag-gradient">
      <div className="container max-w-4xl mx-auto px-4 py-12 sm:py-20">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
            Smart Hashtag Generator
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload an image and instantly generate relevant hashtags for your social media posts using AI technology.
          </p>
        </header>

        <div className="max-w-lg mx-auto mb-8">
          <ImageDropzone onImageSelected={handleImageSelected} />
        </div>

        <div className="flex justify-center mb-12">
          <button
            onClick={generateHashtags}
            disabled={!selectedImage || isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full
                       shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:shadow-none animate-fade-in"
          >
            <span>Generate Hashtags</span>
            <ArrowRight size={18} className="animate-bounce-soft" />
          </button>
        </div>

        <div className="max-w-lg mx-auto">
          {(hashtags.length > 0 || isLoading) && (
            <HashtagDisplay hashtags={hashtags} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
