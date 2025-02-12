class WebMAnalyzer {
  EBML_ID = 0x1a45dfa3;

  async analyzeChunk(buffer, fileName) {
    // Check if we have enough bytes for the header
    if (buffer.length < 4) {
      return {
        fileName,
        isValid: false,
        details: ["File too small to contain EBML header"],
      };
    }

    // Read EBML ID
    const id = buffer.readUInt32BE(0);
    if (id !== this.EBML_ID) {
      return {
        fileName,
        isValid: false,
        details: [`Invalid EBML header ID: ${id.toString(16)}`],
      };
    }

    // Read header size
    const sizeInfo = this.readVInt(buffer, 4);
    if (!sizeInfo) {
      return {
        fileName,
        isValid: false,
        details: ["Invalid EBML header size"],
      };
    }

    return {
      fileName,
      isValid: true,
      details: ["Valid EBML header found"],
    };
  }

  readVInt(buffer, start) {
    if (start >= buffer.length) return null;

    const first = buffer[start];
    let length = 1;

    // Count leading zeros to determine length
    while ((first & (0x80 >> (length - 1))) === 0) {
      length++;
      if (length > 8) return null;
    }

    if (start + length > buffer.length) return null;

    let value = first & (0xff >> length);
    for (let i = 1; i < length; i++) {
      value = (value << 8) | buffer[start + i];
    }

    return { value, length };
  }
}

module.exports = { WebMAnalyzer };
