import React, { useState } from "react";

import { Flex } from "@chakra-ui/react";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import ImageResize from "tiptap-extension-resize-image";
import TextStyle from "@tiptap/extension-text-style";

import {
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuCode,
  LuList,
  LuListOrdered,
  LuTextQuote,
  LuImagePlus,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuAlignJustify,
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
} from "react-icons/lu";
import styled from "styled-components";

const StyledWrapper = styled.div`
  height: 400px;
  padding: 8px;
  border: 1px solid #cdcdcd;
  border-radius: 6px;
  overflow: auto;
  transition: box-shadow 0.2s ease;
  font-size: 15px;
  background-color: #fff;
  color: #303030;

  &:focus-within {
    outline: 1px solid #009fda;
    border: none;
    box-shadow: 0 0 0 0.15rem rgba(0, 156, 255, 0.25);
  }

  & [contenteditable="true"]:focus {
    outline: none;
  }

  em {
    font-style: italic;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 1.5rem;
    font-weight: 600;
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  h3 {
    font-size: 1.15rem;
  }

  h4 {
    font-size: 1.05rem;
  }

  h5 {
    font-size: 1rem;
  }

  h6 {
    font-size: 0.95rem;
  }

  code {
    background-color: #ccc;
    border-radius: 0.4rem;
    color: #303030;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  ul,
  ol {
    padding: 0 0 0 1rem;
    margin: 1.25rem 0 1.25rem 1.25rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  blockquote {
    border-left: 3px solid #ccc;
    margin: 1.5rem 0;
    padding-left: 1rem;
  }
`;

const StyledMenuBar = styled(Flex)`
  justify-content: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 6px;

  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .child {
      padding-right: 20px;
      border-right: 1px solid #ccc;
    }
  }

  button {
    padding: 0 6px;
    height: 28px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  button:hover {
    background: #f2f2f2;
  }

  .is-active {
    background: #e2e8f0;
    color: #2b6cb0;
  }
`;

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  const [color, setColor] = useState("#303030");

  if (!editor) return null;

  const applyColor = (newColor) => {
    setColor(newColor);
    editor.chain().focus().setColor(newColor).run();
  };

  const headingIcons = [
    LuHeading1,
    LuHeading2,
    LuHeading3,
    LuHeading4,
    LuHeading5,
    LuHeading6,
  ];

  return (
    <StyledMenuBar>
      <Flex className="button-group">
        <Flex className="child">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <LuBold />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <LuItalic />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <LuStrikethrough />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "is-active" : ""}
          >
            <LuCode />
          </button>

          <input
            type="color"
            value={color}
            onChange={(e) => applyColor(e.target.value)}
            style={{
              border: "none",
              background: "none",
              width: 24,
              height: 24,
              cursor: "pointer",
            }}
            title="Chọn màu chữ"
          />
        </Flex>

        <Flex className="child">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? "is-active" : ""}
          >
            P
          </button>

          {[1, 2, 3, 4, 5, 6].map((level) => {
            const Icon = headingIcons[level - 1];
            return (
              <button
                type="button"
                key={level}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
                className={
                  editor.isActive("heading", { level }) ? "is-active" : ""
                }
              >
                <Icon />
              </button>
            );
          })}
        </Flex>

        <Flex className="child">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            <LuList />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
          >
            <LuListOrdered />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "is-active" : ""}
          >
            <LuTextQuote />
          </button>
        </Flex>

        <Flex className="child">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <LuAlignLeft />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <LuAlignCenter />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <LuAlignRight />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <LuAlignJustify />
          </button>
        </Flex>

        {/* <button
          onClick={() => editor.chain().focus().setColor("#958DF1").run()}
          className={
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active"
              : ""
          }
        >
          Purple
        </button> */}

        {/* <button onClick={() => document.getElementById("file-upload")?.click()}>
          <LuImagePlus />
        </button>
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result;
              editor?.chain().focus().setImage({ src: base64 }).run();
            };
            reader.readAsDataURL(file);
          }}
        /> */}

        <button
          type="button"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <LuImagePlus />
        </button>

        <input
          type="file"
          id="file-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            console.log("Hình ảnh đã chọn:", e.target.files);
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result;
              if (base64) {
                editor?.chain().focus().setImage({ src: base64 }).run();

                editor
                  ?.chain()
                  .focus()
                  .updateAttributes("image", { width: "80px" })
                  .run();
              } else {
                console.error("Không thể đọc dữ liệu ảnh!");
              }
            };
            reader.readAsDataURL(file);
          }}
        />
      </Flex>
    </StyledMenuBar>
  );
};

const extensions = [
  Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  StarterKit.configure({
    heading: false,
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  TextStyle,
  Color.configure({
    types: ["textStyle"],
  }),
  // Image.configure({
  //   inline: false,
  //   allowBase64: true,
  // }),
  ImageResize.configure({
    inline: false,
    allowBase64: true,
    resizeHandles: true,
  }),
  TextAlign.configure({ types: ["paragraph"] }),
];

const content = `
<h6>Giới thiệu sự kiện</h6>
<p>[Tóm tắt ngắn gọn về sự kiện: Nội dung chính của sự kiện, điểm đặc sắc nhất và lý do khiến người tham gia không nên bỏ lỡ]</p>

<h6>Chi tiết chương trình</h6>
<ul>
  <li><p>Hoạt động nổi bật trong sự kiện</p></li>
  <li><p>Khách mời</p></li>
  <li><p>Trải nghiệm đặc biệt</p></li>

</ul>

`;

export default function RichTextEditor({ value, setFormData }) {
  return (
    <StyledWrapper>
      {/* <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
      /> */}
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={value || content}
        onUpdate={({ editor }) => {
          const newContent = editor.getHTML();
          console.log("Nội dung từ editor:", newContent);
          setFormData((prev) => ({ ...prev, moTa: newContent })); // Cập nhật `moTa`
        }}
      />
    </StyledWrapper>
  );
}
