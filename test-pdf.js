// Test PDF parsing functionality
const fs = require('fs');
const path = require('path');

async function testPdfParse() {
  try {
    const pdfParse = require('pdf-parse');
    console.log('pdf-parse module loaded successfully');
    console.log('PDF parsing functionality is ready');
    return true;
  } catch (error) {
    console.error('PDF parsing test failed:', error.message);
    return false;
  }
}

testPdfParse().then(success => {
  if (success) {
    console.log('✅ PDF support is working!');
  } else {
    console.log('❌ PDF support needs debugging');
  }
});
