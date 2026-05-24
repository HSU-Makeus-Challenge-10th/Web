import { useState, useEffect } from 'react';

interface UseFilePreviewOptions {
  initialFile?: File | null;
  initialUrl?: string | null;
  useFileReader?: boolean;
}

export const useFilePreview = ({
  initialFile = null,
  initialUrl = null,
  useFileReader = true,
}: UseFilePreviewOptions = {}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const [file, setFile] = useState<File | null>(initialFile);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(initialUrl);
      return;
    }

    if (useFileReader) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file, initialUrl, useFileReader]);

  const updateFile = (newFile: File | null) => {
    setFile(newFile);
  };

  const resetPreview = () => {
    setFile(null);
    setPreviewUrl(initialUrl);
  };

  return {
    previewUrl,
    file,
    updateFile,
    resetPreview,
  };
};
