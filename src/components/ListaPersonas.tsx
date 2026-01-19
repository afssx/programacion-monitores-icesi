import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import { Person, BrightnessLow } from "@mui/icons-material";
import type { PersonaData } from "../types";

interface Props {
  personas: PersonaData[];
}

export const ListaPersonas: React.FC<Props> = ({ personas }) => {
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
                {p.tipo === "veterano" ? <BrightnessLow /> : <Person />}
              </ListItemIcon>
              <ListItemText
                primary={p.nombre}
                secondary={p.tipo === "veterano" ? "Veterano" : "Nuevo"}
              />
            </ListItem>
            {idx < personas.length - 1 && <Divider component="li" />}
          </div>
        ))}
      </List>
    </Paper>
  );
};
