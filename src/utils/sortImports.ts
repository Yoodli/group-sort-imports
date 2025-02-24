import { TConfigWithId } from '../types';
import { getAndValidateConfig } from './getAndValidateConfig';
import { groupLines } from './groupLines';
import { joinMapToFlatArray } from './joinMapToFlatArray';
import { splitImportsAndNonImports } from './splitImportsAndNonImports';

export const sortImports = (text: string, configArray: TConfigWithId[]) => {
  const lines = text.split('\n');
  const { importLines, nonImportLines } = splitImportsAndNonImports(lines);
  const linesMap = groupLines(importLines, configArray);
  const sortedImportLines = joinMapToFlatArray(linesMap, configArray);
  console.log(sortedImportLines, nonImportLines);
  return [...sortedImportLines, ...nonImportLines]
    .filter((line, index, array) => line !== '' || line !== array[index + 1])
    .join('\n');
};
