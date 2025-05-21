import { useState } from "react";

export function useFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleFileChange = (file: File | null) => {
    if (file) {
      setFile(file);
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setFileName(null);
      setDataUrl(null);
    }
  };
  
  return {
    file,
    dataUrl,
    fileName,
    handleFileChange
  };
}
