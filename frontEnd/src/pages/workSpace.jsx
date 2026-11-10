import { useState } from "react";
import "./Workspace.css";

export default function WorkSpace() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [latex, setLatex] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setLatex("");

    if (selected.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleConvert = () => {
    if (!file) return;
    // TODO: send `file` to your backend / API and call setLatex(result)
    setLatex("% LaTeX output will appear here");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
  };

  return (
    <div className="app">
      <header>
        <h1>To LaTeX</h1>
      </header>

      <main className="workspace">
        <section className="panel">
          <h2>Input</h2>

          <label className="dropzone" htmlFor="file-input">
            <span>Click to upload a file</span>
            <small>Images or documents</small>
            <input
              id="file-input"
              type="file"
              accept="image/*,.pdf,.txt,.doc,.docx"
              onChange={handleFileChange}
              hidden
            />
          </label>

          <div className="preview">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" />
            ) : file ? (
              <p>{file.name}</p>
            ) : (
              <p>No file selected</p>
            )}
          </div>

          <button type="button" onClick={handleConvert} disabled={!file}>
            Convert to LaTeX
          </button>
        </section>

        <section className="panel">
          <h2>LaTeX output</h2>
          <textarea
            value={latex}
            readOnly
            placeholder="Your LaTeX will appear here..."
          />
          <button type="button" onClick={handleCopy} disabled={!latex}>
            Copy
          </button>
        </section>
      </main>
    </div>
  );
}