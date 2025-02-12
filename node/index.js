const fs = require("fs").promises;
const path = require("path");
const { WebMAnalyzer } = require("./webm-analyzer");

async function analyzeWebMFiles(folderPath) {
  try {
    const files = await fs.readdir(folderPath);
    const analyzer = new WebMAnalyzer();
    const outputPath = path.join(folderPath, "webm-analysis-results.json");

    // Load existing results if file exists
    let results = {};
    try {
      const existingContent = await fs.readFile(outputPath, "utf-8");
      results = JSON.parse(existingContent);
    } catch (error) {
      // File doesn't exist or is invalid, start with empty results
    }

    // Filter and process only .webm files
    for (const file of files) {
      if (path.extname(file).toLowerCase() === ".webm") {
        const filePath = path.join(folderPath, file);
        try {
          const fileData = await fs.readFile(filePath);
          const analysisResult = await analyzer.analyzeChunk(fileData, file);
          results[filePath] = { ...analysisResult };
        } catch (error) {
          results[filePath] = {
            isValid: false,
            error: error.message,
          };
        }
      }
    }

    // Save merged results
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
    console.log(`Analysis complete. Results saved to ${outputPath}`);
  } catch (error) {
    console.error("Error processing folder:", error);
  }
}

// Example usage
const folderPath = process.argv[2] || ".";
analyzeWebMFiles(folderPath);
