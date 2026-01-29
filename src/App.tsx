import React, { useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Container, Box, Button } from "@mui/material";

import { ColorModeContext } from "./ThemeContext";
import { RegistroPersonaForm } from "./components/RegistroPersonaForm";
import { CronogramaSemanal } from "./components/CronogramaSemanal";
import type { PersonaData } from "./types";
import Header from "./components/Header";

export const App: React.FC = () => {
  const [personas, setPersonas] = useState<PersonaData[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("personas");
      return stored ? (JSON.parse(stored) as PersonaData[]) : [];
    } catch {
      return [];
    }
  });
  const [completado, setCompletado] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [maxHoras, setMaxHoras] = useState<number>(14);

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
  const handleDelete = (id: string) =>
    setPersonas((prev) => prev.filter((p) => p.id !== id));

  useEffect(() => {
    try {
      localStorage.setItem("personas", JSON.stringify(personas));
    } catch {
      // ignore storage errors
    }
  }, [personas]);

  const finalize = () => setCompletado(true);
  const reiniciar = () => {
    setPersonas([]);
    setCompletado(false);
    setMaxHoras(14);
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
                <RegistroPersonaForm
                  onSubmit={handleAdd}
                  onDelete={handleDelete}
                  maxHoras={maxHoras}
                  onMaxHorasChange={setMaxHoras}
                  personas={personas}
                />
                {personas.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={finalize}>
                      Generar cronograma
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <>
                <button onClick={reiniciar}>Reiniciar registro</button>
                <CronogramaSemanal personas={personas} maxHorasSemanales={maxHoras} />
              </>
            )}
          </Container>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
