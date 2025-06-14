import React from "react";
import { Flex, Input, Button } from "@chakra-ui/react";
import { LuImagePlus } from "react-icons/lu";
import styled from "styled-components";
import { Image } from "@chakra-ui/react";

export const ImageContainer = styled(Flex)`
  width: ${(props) => props.$width || "100%"};
  height: ${(props) => props.$height || "240px"};
  border: 2px dashed #cdcdcd;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 4px;
  position: relative;
  cursor: pointer;

  .upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: white;
    opacity: 0;
    z-index: 2;
    transition: background-color 0.3s, opacity 0.3s;
    display: flex;
  }

  &:hover .upload-overlay {
    background-color: rgba(0, 0, 0, 0.4); /* overlay mờ */
    opacity: 1;
  }
`;

export const EventImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  z-index: 1;
`;

export const ImageUpload = ({
  preview,
  onChange,
  inputId = "image-upload",
  width = "100%",
  height = "240px",
  label = "Thêm ảnh bìa sự kiện",
}) => {
  const imageSrc =
    preview instanceof File ? URL.createObjectURL(preview) : preview;

  return (
    <>
      <ImageContainer
        $width={width}
        $height={height}
        onClick={() => document.getElementById(inputId).click()}
      >
        {/* {preview && <EventImage src={preview} />} */}

        {imageSrc && <EventImage src={imageSrc} />}

        <Flex className="upload-overlay">
          {imageSrc && (
            <Flex
              direction="column"
              align="center"
              justify="center"
              color="white"
              fontWeight="bold"
              fontSize="15px"
            >
              <LuImagePlus size={24} />
              {label}
            </Flex>
          )}
        </Flex>
      </ImageContainer>

      <Input
        type="file"
        id={inputId}
        accept="image/*"
        onChange={onChange}
        display="none"
      />
    </>
  );
};
