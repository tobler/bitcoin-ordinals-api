import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isPassword?: boolean;
  className?: string;
  required?: boolean;
}

export const FormInputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  isPassword = false,
  className = "",
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={className}>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          type={isPassword && !showPassword ? "password" : type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
          required={required}
        />
        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-gray-500 p-0 h-auto"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

interface TextAreaFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
  required?: boolean;
}

export const FormTextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  className = "",
  required = false,
}) => {
  return (
    <div className={className}>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full resize-none"
        required={required}
      />
    </div>
  );
};

interface FileUploadFieldProps {
  id: string;
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
  className?: string;
  required?: boolean;
}

export const FormFileUploadField: React.FC<FileUploadFieldProps> = ({
  id,
  label,
  onChange,
  accept = "image/*",
  className = "",
  required = false,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      onChange(file);
    } else {
      setSelectedFileName(null);
      onChange(null);
    }
  };

  return (
    <div className={className}>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={id}
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
            >
              <span>Upload a file</span>
              <input
                id={id}
                name={id}
                type="file"
                className="sr-only"
                accept={accept}
                onChange={handleFileChange}
                required={required}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            {selectedFileName ? selectedFileName : "PNG, JPG, GIF up to 5MB"}
          </p>
        </div>
      </div>
    </div>
  );
};

interface AttributeInputProps {
  attributes: Array<{ trait_type: string; value: string }>;
  setAttributes: (attributes: Array<{ trait_type: string; value: string }>) => void;
  className?: string;
}

export const AttributeInput: React.FC<AttributeInputProps> = ({
  attributes,
  setAttributes,
  className = "",
}) => {
  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const updateAttribute = (index: number, field: "trait_type" | "value", value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  return (
    <div className={className}>
      <Label className="block text-sm font-medium text-gray-700 mb-1">Attributes</Label>
      <div className="space-y-2">
        {attributes.map((attr, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Trait type"
              value={attr.trait_type}
              onChange={(e) => updateAttribute(index, "trait_type", e.target.value)}
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="Value"
              value={attr.value}
              onChange={(e) => updateAttribute(index, "value", e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeAttribute(index)}
              className="px-3 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={addAttribute}
        className="mt-2 text-sm text-blue-600 font-medium flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Add Attribute
      </Button>
    </div>
  );
};
