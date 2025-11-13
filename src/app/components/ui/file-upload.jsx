"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { uploadToCloudflare } from "@/utils/uploadToCloudflare";

export function FileUpload({ value, onChange, accept, placeholder, className, multiple = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileList = multiple ? Array.from(files) : files[0];
      handleFileUpload(fileList);
    }
  };

  const handleFileUpload = (file) => {
    onChange(file);
  };

  const handleFileSelect = (e) => {
    const files = multiple ? Array.from(e.target.files) : e.target.files[0];
    if (files) {
      handleFileUpload(files);
    }
  };

  const getDisplayValue = () => {
    if (value instanceof File) {
      return value.name;
    }
    // Show full CDN path for existing uploaded files
    return value || "";
  };

  const clearFile = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center gap-2">
          <Input
            value={getDisplayValue()}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            readOnly={value instanceof File}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Drag and drop {multiple ? 'files' : 'a file'} here, or click upload
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}