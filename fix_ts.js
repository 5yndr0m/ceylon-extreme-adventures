const fs = require('fs');
let content = fs.readFileSync('src/app/contact/page.tsx', 'utf8');
content = content.replace(/const item = e\.currentTarget\.closest\('\.faq-item'\);/g, "const item = e.currentTarget.closest('.faq-item'); if (!item) return;");
fs.writeFileSync('src/app/contact/page.tsx', content);
