import { useState } from 'react';

export const useTagsManager = (initialTags: string[] = []) => {
  const [tags, setTags] = useState<string[]>(initialTags);

  const handleAddTag = (tag: string) => {
    setTags((prev) => [...prev, tag]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const resetTags = (newTags: string[] = []) => {
    setTags(newTags);
  };

  return {
    tags,
    setTags,
    handleAddTag,
    handleRemoveTag,
    resetTags,
  };
};
