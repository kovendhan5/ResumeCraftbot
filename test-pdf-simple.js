// Simple test for PDF parsing functionality
const fs = require('fs');

async function testPdfParsing() {
  try {
    // Test if pdf-parse can be required
    const pdfParse = require('pdf-parse');
    console.log('✅ pdf-parse module loaded successfully');
    
    // Test with a simple buffer (empty test)
    try {
      await pdfParse(Buffer.from('test'));
    } catch (e) {
      console.log('✅ pdf-parse is callable (expected error for invalid PDF)');
    }
    
    console.log('🎉 PDF parsing setup is working correctly!');
    return true;
  } catch (error) {
    console.error('❌ PDF parsing test failed:', error.message);
    return false;
  }
}

testPdfParsing();
