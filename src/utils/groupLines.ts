import { TConfigWithId, TImportData } from '../types';

export const groupLines = (
  importLines: TImportData[],
  configArray: TConfigWithId[],
): Record<string, TImportData[]> => {
  const linesMap: Record<string, TImportData[]> = {};

  const importanceOrder = configArray
    .slice()
    .sort((a, b) => b.importance - a.importance);
  
  const groupLabels = configArray.map((group) => group.groupLabel).filter((label) => label);

  // Remove any line in importLines that include any groupLabels string
  const filteredImportLines = importLines.filter((importLine) => {
    for (const label of groupLabels) {
      const labelWithComment = `// ${label}`;
      if (importLine.line.includes(labelWithComment)) {
        return false;
      }
    }
    return true;
  });

  filteredImportLines.forEach((importLine) => {
    for (const element of importanceOrder) {
      if (RegExp(element.regex, 'i').test(importLine.path)) {
        if (!linesMap[element.id]) {
          linesMap[element.id] = [];
        }
        linesMap[element.id].push(importLine);
        return;
      }
    }
  });
  return linesMap;
};
