import { useState } from "react";

export default function Admin() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/.netlify/functions/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) alert("Uploaded! Wait ~30s for rebuild.");
    else alert("Upload failed");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Markdown</h1>
      <input
        type="file"
        accept=".md"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}
