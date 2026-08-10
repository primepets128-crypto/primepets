const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['src', 'public'];
const ROOT_FILES = ['index.html'];
const EXTENSIONS = ['.jsx', '.js', '.html', '.css'];

const REPLACEMENTS = [
  // Names
  { regex: /Heads Up For Tails/gi, replace: 'Prime Pets' },
  { regex: /HUFT/g, replace: 'Prime Pets' },
  { regex: /huft\.com/g, replace: 'primepets.com' },
  { regex: /help@huft\.com/g, replace: 'help@primepets.com' },
  
  // Colors
  { regex: /#FF7A00/gi, replace: '#d07e20' }, // Orange -> Golden Orange
  { regex: /#FF4500/gi, replace: '#a65d14' }, // Dark Orange -> Deep Golden
  { regex: /#FF6B00/gi, replace: '#b96c1a' }, // Orange variant -> Golden Orange variant
  { regex: /#1A2E6E/gi, replace: '#5c3110' }, // Blue -> Deep Brown
  { regex: /#2563EB/gi, replace: '#8b4513' }, // Light Blue -> Saddle Brown
  { regex: /#FFF3E0/gi, replace: '#fdf7f1' }, // Light orange bg -> light golden bg
  { regex: /#FFD4AA/gi, replace: '#e6c8a8' }, // Light orange border -> light golden border
  { regex: /text-blue-100/g, replace: 'text-orange-100' }, 
  { regex: /text-blue-200/g, replace: 'text-orange-200' },
  { regex: /text-blue-300/g, replace: 'text-orange-300' }
];

function processDirectory(directory) {
  if (!fs.existsSync(directory)) return;
  const items = fs.readdirSync(directory);

  items.forEach(item => {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else {
      if (EXTENSIONS.includes(path.extname(fullPath))) {
        processFile(fullPath);
      }
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  REPLACEMENTS.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

DIRECTORIES.forEach(processDirectory);
ROOT_FILES.forEach(processFile);
console.log('Rebranding complete.');
