import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Container, Box } from "@mui/material";

import { ColorModeContext } from "./ThemeContext";
import { RegistroPersonaForm } from "./components/RegistroPersonaForm";
import { CronogramaSemanal } from "./components/CronogramaSemanal";
import type { PersonaData } from "./types";
import Header from "./components/Header";

export const App: React.FC = () => {
  const [personas, setPersonas] = useState<PersonaData[]>([]);
  const [completado, setCompletado] = useState(false);
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
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const handleAdd = (p: PersonaData) => setPersonas((prev) => [...prev, p]);
  const finalize = () => setCompletado(true);
  const reiniciar = () => {
    setPersonas([]);
    setCompletado(false);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ position: "relative" }}>
          <Header />
          <Container sx={{ py: 4 }}>
            {!completado ? (
              <>
                <RegistroPersonaForm onSubmit={handleAdd} />
                {personas.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <button onClick={finalize}>Generar cronograma</button>
                  </Box>
                )}
              </>
            ) : (
              <>
                <button onClick={reiniciar}>Reiniciar registro</button>
                <CronogramaSemanal personas={personas} />
              </>
            )}
          </Container>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
