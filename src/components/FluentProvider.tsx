"use client";

import {
  FluentProvider,
  webLightTheme,
  createLightTheme,
  BrandVariants,
} from "@fluentui/react-components";
import { ReactNode } from "react";

// Aioli brand colors
const aioliBrand: BrandVariants = {
  10: "#020305",
  20: "#111723",
  30: "#16263D",
  40: "#193253",
  50: "#1B3F6A",
  60: "#1D4C82",
  70: "#1E5A9B",
  80: "#2068B4",
  90: "#3D78BD",
  100: "#5688C5",
  110: "#6D98CD",
  120: "#83A8D5",
  130: "#99B9DD",
  140: "#AFC9E5",
  150: "#C5DAED",
  160: "#DBE9F5",
};

const aioliTheme = createLightTheme(aioliBrand);

export function AppFluentProvider({ children }: { children: ReactNode }) {
  return (
    <FluentProvider theme={aioliTheme}>
      {children}
    </FluentProvider>
  );
}
