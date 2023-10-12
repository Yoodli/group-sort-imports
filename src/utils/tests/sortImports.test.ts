/**
 * This test may run from the root by:
 * npx jest src/utils/sortImports.test.ts
 */

import * as fs from 'fs';
import { TConfigWithId } from "../../types";
import { sortImports } from "../sortImports";

const mockConfig = [{"regex":"(^react)|(^lib-fullstack$)","importance":100,"lineAfter":true,"id":0},{"groupLabel":"Components","regex":"(components/)|(views)|(@mui/material)|(ui/)","importance":90,"lineAfter":true,"id":1},{"groupLabel":"Assets","regex":"(assets)|(@mui/icons*)|(.svg)|(.png)","importance":80,"lineAfter":true,"id":2},{"groupLabel":"Utils","regex":".","importance":1,"lineAfter":true,"id":3}];

describe("sort-group-imports", () => {
  test("test1 Add utils label", async () => {
    const data = fs.readFileSync('src/utils/tests/test1.txt', 'utf-8');
    const out = sortImports(data, mockConfig as TConfigWithId[]);
    expect(out).toMatchInlineSnapshot(`
"// Utils
import { getAndValidateConfig } from './utils/getAndValidateConfig';
import { sortImports } from './utils/sortImports';
"
`);
  });

  test("test2 First group no label", async () => {
    const data = fs.readFileSync('src/utils/tests/test2.txt', 'utf-8');
    const out = sortImports(data, mockConfig as TConfigWithId[]);
    expect(out).toMatchInlineSnapshot(`
"import { data } from "lib-fullstack";

// Utils
import {
  data,
  average,
} from "lib-fullstack/utils/agg";
import { CONSTANT_NAME, CONSTANT2 } from "lib-fullstack/utils/data";
import { roundNum } from "lib-fullstack/utils/helper";

export type Demo = {
  title: string;
  image: string;
};
"
`);
  });


  test("test3 All groups working", async () => {
    const data = fs.readFileSync('src/utils/tests/test3.txt', 'utf-8');
    const out = sortImports(data, mockConfig as TConfigWithId[]);
    expect(out).toMatchInlineSnapshot(`
"import React from "react";

// Components
import { Stack, Typography, Button, Box } from "@mui/material";

// Assets
import Icon from "src/assets/icons/Icon";
import Logo from "src/assets/logos/Logo";

// Utils
import { OnboardingSteps } from "./Onboarding";
import { getColor } from "utils/Colors";
import { Instrumentation, Events } from "utils/EventUtils";

export default function SimpleFunction(props: {
  done: (val: number) => void;
  handleDone: () => void;
}): JSX.Element {};"
`);
  });


  test("test4 Remove duplicate group labels", async () => {
    const data = fs.readFileSync('src/utils/tests/test4.txt', 'utf-8');
    const out = sortImports(data, mockConfig as TConfigWithId[]);
    expect(out).toMatchInlineSnapshot(`
"// Components
import { Stack, Typography, Button, Box } from "@mui/material";

// Assets
import Icon from "src/assets/icons/Icon";
import Logo from "src/assets/logos/Logo";

// Utils
import { getColor } from "utils/Colors";
import { Instrumentation, Events } from "utils/EventUtils";

export default function SimpleFunction(props: {
  done: (val: number) => void;
  handleDone: () => void;
}): JSX.Element {};"
`);
  });  

  test("test5 No imports leaves no space", async () => {
    const data = fs.readFileSync('src/utils/tests/test5.txt', 'utf-8');
    const out = sortImports(data, mockConfig as TConfigWithId[]);
    expect(out).toMatchInlineSnapshot(`
"export default function SimpleFunction(props: {
  done: (val: nunber) => void;
  handleDone: () => void;
}): JSX.Element {};"
`);
  });  

});
