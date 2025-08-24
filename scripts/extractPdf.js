const fs = require('fs');
const pdf = require('pdf-parse');

async function extractPdfText() {
  try {
    const dataBuffer = fs.readFileSync('./Bong-Menu-new-v4.pdf');
    const data = await pdf(dataBuffer);
    
    console.log('Extracted text from PDF:');
    console.log('=====================================');
    console.log(data.text);
    
    // Save to file for processing
    fs.writeFileSync('./data/menu-raw.txt', data.text);
    console.log('\nSaved raw text to data/menu-raw.txt');
    
  } catch (error) {
    console.error('Error extracting PDF:', error);
  }
}

// Create data directory if it doesn't exist
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

extractPdfText();
