import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import JsonResults, { JsonResult } from "./components/JsonResults";
import { ValidationResult, WebMAnalyzer } from "./webm-analyzer";

function App() {
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);
  const [jsonResults, setJsonResults] = useState<Record<
    string,
    JsonResult
  > | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const analyzer = new WebMAnalyzer();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const results: ValidationResult[] = [];
    acceptedFiles.forEach(async (file) => {
      const result = await analyzer.analyzeChunk(file, file.name);
      results.push(result);
      if (results.length === acceptedFiles.length) {
        results.sort((a, b) => a.fileName.localeCompare(b.fileName));
        setValidationResults(results);
      }
    });
  }, []);

  const resetResults = () => {
    setValidationResults([]);
  };

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/webm": [".webm"],
    },
    noClick: true, // Disable click to open file dialog
  });

  const handleJsonFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        setJsonResults(json);
        setValidationResults([]); // Clear individual results
      } catch (error) {
        console.error("Error reading JSON file:", error);
      }
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Visual overlay for drag state */}
      {isDragActive && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#1a1a1acc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              padding: "40px",
              border: "3px dashed #444",
              borderRadius: "8px",
              backgroundColor: "#1a1a1a",
              color: "#fff",
            }}
          >
            Drop WebM files here...
          </div>
        </div>
      )}

      {/* Main content - actual drop target */}
      <div
        {...getRootProps()}
        style={{
          padding: "20px",
          backgroundColor: "#1a1a1a",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#333",
              border: "1px solid #444",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            Select WebM files
          </button>
          <button
            onClick={() => jsonInputRef.current?.click()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#333",
              border: "1px solid #444",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            Load JSON Results
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files) {
                onDrop(Array.from(e.target.files));
              }
            }}
            accept=".webm"
            multiple
            style={{ display: "none" }}
          />
          <input
            type="file"
            ref={jsonInputRef}
            onChange={handleJsonFileSelect}
            accept=".json"
            style={{ display: "none" }}
          />
        </div>

        {validationResults.length > 0 && (
          <>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0" }}>
              {validationResults.map((result, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: result.isValid ? "#1a2b1a" : "#2b1a1a",
                    padding: "10px",
                    margin: "10px 0",
                    borderRadius: "4px",
                    border: `1px solid ${
                      result.isValid ? "#234723" : "#472323"
                    }`,
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontWeight: "bold", color: "#fff" }}>
                    {result.fileName}
                  </div>
                  <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                    {result.isValid ? "✅ Valid" : "❌ Invalid"} -{" "}
                    {result.details.join(", ")}
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={resetResults}
              style={{
                padding: "8px 16px",
                backgroundColor: "#333",
                border: "1px solid #444",
                borderRadius: "4px",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              Reset
            </button>
          </>
        )}

        {jsonResults && (
          <>
            <JsonResults results={jsonResults} />
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={() => setJsonResults(null)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#333",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                Reset JSON Results
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
