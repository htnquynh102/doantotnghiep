import { Button, Flex } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { LuUpload, LuX, LuPaperclip } from "react-icons/lu";

export const FileUploadSection = ({ onFilesChange, maxFiles = 1 }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef();

  const truncateFileName = (name, maxLength = 50) => {
    if (name.length <= maxLength) return name;

    const extIndex = name.lastIndexOf(".");
    const extension = extIndex !== -1 ? name.slice(extIndex) : "";
    const baseName = name.slice(0, extIndex !== -1 ? extIndex : name.length);

    const shortBase = baseName.slice(0, maxLength - extension.length - 3);
    return `${shortBase}...${extension}`;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    let uniqueFiles = [...selectedFiles, ...files].filter(
      (file, index, self) =>
        index ===
        self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    setSelectedFiles(uniqueFiles);
    onFilesChange(uniqueFiles);
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        id="fileUpload"
        ref={fileInputRef}
        multiple={maxFiles > 1}
        accept="image/*,.pdf,.doc,.docx"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {selectedFiles.length > 0 && (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {selectedFiles.map((file, index) => (
            <li
              key={index}
              style={{
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Flex w="100%" justifyContent="space-between">
                <Flex alignItems="center" gap={2}>
                  <LuPaperclip />
                  {truncateFileName(file.name)}
                </Flex>

                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  <LuX />
                </button>
              </Flex>
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        onClick={triggerFileSelect}
        style={{
          padding: "4px 16px",
          backgroundColor: "#fafafa",
          color: "#626461",
          border: "1px solid #cdcdcd",
          borderRadius: "6px",
          marginBottom: "12px",
        }}
      >
        <LuUpload />
        Tải lên tệp
      </Button>
    </div>
  );
};
