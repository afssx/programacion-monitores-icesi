import React, { createContext, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

type ColorModeContextType = { toggleColorMode: () => void };
// eslint-disable-next-line react-refresh/only-export-components
export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
});

export const CustomThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
