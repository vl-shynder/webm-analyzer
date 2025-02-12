import React from "react";

export interface JsonResult {
  fileName: string;
  isValid: boolean;
  details: string[];
}

interface JsonResultsProps {
  results: Record<string, JsonResult>;
}

const JsonResults: React.FC<JsonResultsProps> = ({ results }) => {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
    >
      {Object.entries(results).map(([path, result], index) => (
        <div
          key={index}
          style={{
            backgroundColor: result.isValid ? "#1a2b1a" : "#2b1a1a",
            padding: "10px",
            borderRadius: "4px",
            border: `1px solid ${result.isValid ? "#234723" : "#472323"}`,
            fontSize: "0.85em",
          }}
        >
          <div
            style={{ fontWeight: "bold", color: "#fff", marginBottom: "4px" }}
          >
            {result.fileName}
          </div>
          <div style={{ color: "#aaa" }}>
            {result.isValid ? "✅ Valid" : "❌ Invalid"} -{" "}
            {result.details.join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JsonResults;
