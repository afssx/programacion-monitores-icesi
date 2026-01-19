import React, { useState } from "react";
import {
  type PersonaData,
  type DiaSemana,
  type Franja,
  dias,
  franjasNormal,
  franjasSabado,
} from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { ListaPersonas } from "./ListaPersonas";

type FormValues = {
  nombre: string;
  tipo: "nuevo" | "veterano";
  disponibilidad: { [key in DiaSemana]?: Record<Franja, boolean> };
};

interface Props {
  onSubmit: (persona: PersonaData) => void;
}

export const RegistroPersonaForm: React.FC<Props> = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      tipo: "nuevo",
      disponibilidad: dias.reduce((acc, d) => {
        const frs = d === "Sábado" ? franjasSabado : franjasNormal;
        acc[d] = Object.fromEntries(frs.map((f) => [f, false]));
        return acc;
      }, {} as any),
    },
  });

  const [personas, setPersonas] = useState<PersonaData[]>([]);

  const enviar = (data: FormValues) => {
    const dispo: PersonaData["disponibilidad"] = {};
    dias.forEach((d) => {
      const map = data.disponibilidad[d];
      if (map) {
        const selected = Object.entries(map)
          .filter(([, val]) => val)
          .map(([f]) => f as Franja);
        if (selected.length) dispo[d] = selected;
      }
    });
    const persona: PersonaData = {
      id: uuidv4(),
      nombre: data.nombre,
      tipo: data.tipo,
      disponibilidad: dispo,
    };
    setPersonas((prev) => [...prev, persona]);

    onSubmit(persona);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(enviar)}>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Nombre"
          fullWidth
          {...register("nombre", { required: "El nombre es requerido" })}
          error={!!errors.nombre}
          helperText={errors.nombre?.message}
        />

        <FormControl fullWidth error={!!errors.tipo}>
          <InputLabel id="tipo-label">Tipo</InputLabel>
          <Controller
            name="tipo"
            control={control}
            rules={{ required: "El tipo es requerido" }}
            render={({ field }) => (
              <Select {...field} labelId="tipo-label" label="Tipo">
                <MenuItem value="nuevo">Nuevo</MenuItem>
                <MenuItem value="veterano">Veterano</MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.tipo?.message}</FormHelperText>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ my: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {dias.map((d) => (
                <TableCell key={d}>{d}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {franjasNormal.map((f) => (
              <TableRow key={f}>
                <TableCell>{f.replace("-", "‑")}</TableCell>
                {dias.map((d) => {
                  const frs = d === "Sábado" ? franjasSabado : franjasNormal;
                  if (!frs.includes(f)) return <TableCell key={d} />;
                  return (
                    <TableCell key={d} align="center">
                      <Controller
                        name={`disponibilidad.${d}.${f}`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox {...field} checked={field.value} />
                        )}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button type="submit" variant="contained" color="primary">
        Registrar Persona
      </Button>
      <ListaPersonas personas={personas} />
    </form>
  );
};
