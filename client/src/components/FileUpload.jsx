import { useRef } from "react";

function FileUpload({ onFileSelect }) {
  const inputRef = useRef();

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <>
      <button
        className="upload-btn"
        onClick={() => inputRef.current.click()}
        title="Upload File"
      >
        📎
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.doc,.docx"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </>
  );
}

export default FileUpload;