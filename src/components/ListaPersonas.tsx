import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import { Person, BrightnessLow, Block, Delete } from "@mui/icons-material";
import type { PersonaData, DiaSemana, Franja } from "../types";

interface Props {
  personas: PersonaData[];
  onDelete?: (id: PersonaData["id"]) => void;
}

export const ListaPersonas: React.FC<Props> = ({ personas, onDelete }) => {
  if (personas.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        Aún no se han registrado personas.
      </Typography>
    );
  }

  return (
    <Paper variant="outlined" sx={{ mt: 2 }}>
      <List dense>
        {personas.map((p, idx) => (
          <div key={p.id}>
            <ListItem>
              <ListItemIcon>
                {p.tipo === "veterano" ? (
                  <BrightnessLow />
                ) : p.tipo === "bloqueo" ? (
                  <Block />
                ) : (
                  <Person />
                )}
              </ListItemIcon>
              <ListItemText
                primary={p.nombre}
                secondary={
                  <>
                    <span>
                      {p.tipo === "veterano"
                        ? "Veterano"
                        : p.tipo === "bloqueo"
                        ? "Bloqueo de franja"
                        : "Nuevo"}
                    </span>
                    {" · "}
                    <span>{resumenHoras(p)}</span>
                  </>
                }
              />
              {onDelete && (
                <IconButton edge="end" aria-label="Eliminar" onClick={() => onDelete(p.id)}>
                  <Delete />
                </IconButton>
              )}
            </ListItem>
            {idx < personas.length - 1 && <Divider component="li" />}
          </div>
        ))}
      </List>
    </Paper>
  );
};

const horasFranja: Record<Franja, number> = {
  "07:00 am - 10:00 am": 3,
  "10:00 am - 01:00 pm": 3,
  "02:00 pm - 05:00 pm": 3,
  "05:00 pm - 07:00 pm": 2,
  "07:00 pm - 09:00 pm": 2,
};

const diaLetra: Record<DiaSemana, string> = {
  Lunes: "L",
  Martes: "M",
  Miércoles: "X",
  Jueves: "J",
  Viernes: "V",
  Sábado: "S",
};

function resumenHoras(persona: PersonaData): string {
  const horasPorDia = Object.entries(persona.disponibilidad ?? {}).map(([dia, franjas]) => {
    const horas = (franjas as Franja[]).reduce((acc, f) => acc + (horasFranja[f] ?? 0), 0);
    return { dia: dia as DiaSemana, horas };
  });

  const partes = horasPorDia
    .filter((d) => d.horas > 0)
    .map((d) => `${diaLetra[d.dia]}${d.horas}`);

  if (!partes.length) return "0h";
  return partes.join(" · ");
}
