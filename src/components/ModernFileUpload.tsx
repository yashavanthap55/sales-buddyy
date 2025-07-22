import React, { useState, useCallback } from 'react';
import { Upload, File, X, Check } from 'lucide-react';

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface ModernFileUploadProps {
  onFilesUpload?: (files: File[]) => void;
  onCSVParsed?: (products: { name: string; description: string }[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const ModernFileUpload: React.FC<ModernFileUploadProps> = ({ 
  onFilesUpload, 
  onCSVParsed,
  maxFiles = 5,
  acceptedTypes = []
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const parseCSV = useCallback((file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const products: { name: string; description: string }[] = [];
        
        // Skip header row if it exists
        const startIndex = lines[0]?.toLowerCase().includes('name') ? 1 : 0;
        
        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
            if (columns.length >= 1 && columns[0]) {
              products.push({
                name: columns[0],
                description: columns[1] || ''
              });
            }
          }
        }
        
        if (products.length > 0 && onCSVParsed) {
          onCSVParsed(products);
        }
      };
      reader.readAsText(file);
    }
  }, [onCSVParsed]);

  const simulateUpload = useCallback((file: File) => {
    const fileId = Math.random().toString(36).substr(2, 9);
    const newFile: UploadedFile = {
      file,
      id: fileId,
      progress: 0,
      status: 'uploading'
    };

    setUploadedFiles(prev => [...prev, newFile]);

    // Parse CSV if it's a CSV file
    parseCSV(file);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(f => {
          if (f.id === fileId) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            return {
              ...f,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            };
          }
          return f;
        })
      );
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f)
      );
    }, 2000);
  }, [parseCSV]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.slice(0, maxFiles - uploadedFiles.length);

    validFiles.forEach(simulateUpload);
    
    if (onFilesUpload) {
      onFilesUpload(validFiles);
    }
  }, [uploadedFiles.length, maxFiles, simulateUpload, onFilesUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50/50 scale-[1.02]'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
        }`}
      >
        <input
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={acceptedTypes.join(',')}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
            isDragOver ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload className={`h-8 w-8 transition-colors duration-300 ${
              isDragOver ? 'text-blue-600' : 'text-gray-500'
            }`} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragOver ? 'Drop files here' : 'Upload your files'}
            </h3>
            <p className="text-gray-600">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {acceptedTypes.length > 0 ? `Accepted: ${acceptedTypes.join(', ')}` : 'All file types supported'} • Max {maxFiles} files
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Uploaded Files</h4>
          {uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className="flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <File className="h-5 w-5 text-blue-600" />
              </div>
              
              <div className="flex-1 ml-3 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatFileSize(uploadedFile.file.size)}
                  </span>
                </div>
                
                {uploadedFile.status === 'uploading' && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadedFile.progress}%` }}
                    />
                  </div>
                )}
                
                {uploadedFile.status === 'completed' && (
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    <span className="text-xs">Upload complete</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => removeFile(uploadedFile.id)}
                className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernFileUpload;