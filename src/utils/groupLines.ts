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

  // Replace any substring in importLines that include any groupLabels string with ''
  // This is to prevent duplicate labels
  const replacedGroupLines = importLines.map((data) => {
    let lineStr = data.line;
    groupLabels.forEach((label) => {
      lineStr = lineStr.replace(`// ${label}\n`, '');
    });
    return { line: lineStr, path: data.path };
  });

  // Filter out any empty lines from replacedGroupLines
  const filteredImportLines = replacedGroupLines.filter((data) => data.line !== '');

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
