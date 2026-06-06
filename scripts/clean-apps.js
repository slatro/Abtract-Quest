const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../apps_local.json');
const apps = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

function cleanDescription(desc) {
  if (!desc) return "";
  
  // Replace double-backslashes \\r\\n or \\n with space
  let clean = desc.replace(/\\\\r\\\\n/g, ' ')
                  .replace(/\\r\\n/g, ' ')
                  .replace(/\\\\n/g, ' ')
                  .replace(/\\n/g, ' ')
                  .replace(/\r\n/g, ' ')
                  .replace(/\n/g, ' ');

  // Replace unicode &
  clean = clean.replace(/\\u0026/g, '&');
  
  // Replace double backslashes leftover
  clean = clean.replace(/\\\\/g, '');

  // Clean double spaces
  clean = clean.replace(/\s+/g, ' ').trim();

  return clean;
}

const gamingNames = [
  "maze of gains", "tollan universe", "gigaverse", "trivia rush", "unchained",
  "supertripland", "lingo", "rugpull bakery", "polar pair-up", "pudgy penguins",
  "digitoys", "anichess", "moody madness", "cambria", "onchain heroes", "duper",
  "prontoboro"
];

const defiNames = [
  "depth protocol", "aborean finance", "kona", "blue protocol", "bigcoin"
];

const socialNames = [
  "amigo", "cosmo(modhaus)"
];

const toolingNames = [
  "opensea", "dyli"
];

const updatedApps = apps.map(app => {
  const nameLower = app.name.toLowerCase();
  let category = "App";

  if (gamingNames.some(gn => nameLower.includes(gn))) {
    category = "Gaming";
  } else if (defiNames.some(dn => nameLower.includes(dn))) {
    category = "DeFi";
  } else if (socialNames.some(sn => nameLower.includes(sn))) {
    category = "Social";
  } else if (toolingNames.some(tn => nameLower.includes(tn))) {
    category = "Tooling";
  }

  return {
    ...app,
    description: cleanDescription(app.description),
    category: category
  };
});

fs.writeFileSync(filePath, JSON.stringify(updatedApps, null, 2), 'utf-8');
console.log("Cleaned and categorized all apps successfully!");
