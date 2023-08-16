// components/RichTextEditor.tsx

import React, { useRef, useEffect, useState } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

let DOMAIN = `http://localhost:3000`;
if(typeof window !== "undefined"){
  DOMAIN = `http://${window.location.hostname}:${window.location.port}`;
}


interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

interface UploadResponse {
  fileUrl: string;
}
const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<any>(null);
  const [editorData, setEditorData] = useState("");

  useEffect(() => {
    // When the editor is ready, set the initial content
    if (editorRef.current && value) {
      editorRef.current.setData(value);
    }
  }, [value]);

  onChange;
  const handleEditorReady = (editor: any) => {
    // 에디터 인스턴스를 ref에 저장합니다
    editorRef.current = editor;
    // 에디터가 준비되면 이미지 업로드 기능을 활성화합니다
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return handleImageUpload(loader);
    };
  };

  const handleImageUpload = (loader: any) => {
    return {
      upload() {
        return new Promise((resolve, reject) => {
          let formData = new FormData();
          loader.file.then((file: any) => {
            formData.append("image", file);
            fetch("/api/upload", {
              method: "POST",
              body: formData,
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then((res: UploadResponse) => {
                resolve({
                  default: `${DOMIAN}/${res.fileUrl}`,
                });
              })
              .catch((err) => reject(err));
          });
        });
      },
    };
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onReady={handleEditorReady}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
};

export default RichTextEditor;
