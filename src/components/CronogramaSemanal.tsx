import React from "react";
import { type PersonaData, type DiaSemana, type Franja, dias, franjasNormal, franjasSabado } from "../types";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from "@mui/material";

interface Props {
  personas: PersonaData[];
}

export const CronogramaSemanal: React.FC<Props> = ({ personas }) => {
  const asign: Record<DiaSemana, Record<Franja, PersonaData[]>> = {} as any;
  dias.forEach(d => {
    asign[d] = {} as any;
    const franjas = d==="Sábado" ? franjasSabado : franjasNormal;
    franjas.forEach(f => {
      const dispo = personas.filter(p => p.disponibilidad[d]?.includes(f));
      const vet = dispo.filter(p => p.tipo==="veterano");
      let sel: PersonaData[] = [];
      if (vet.length) sel = [vet[0], ...dispo.filter(p => p.id!==vet[0].id).slice(0,2)];
      else sel = dispo.slice(0,3);
      asign[d][f] = sel;
    });
  });

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" align="center" sx={{ mt:2 }}>Cronograma Semanal</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {dias.map(d => <TableCell key={d}>{d}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {franjasNormal.map(f => (
            <TableRow key={f}>
              <TableCell>{f.replace("-", "‑")}</TableCell>
              {dias.map(d => {
                const franjas = d==="Sábado" ? franjasSabado : franjasNormal;
                const selected = franjas.includes(f) ? asign[d][f] : [];
                return (
                  <TableCell key={d}>
                    {selected.length > 0 ? (
                      selected.map(p => (
                        <Typography key={p.id} variant="body2">
                          {p.nombre} {p.tipo==="veterano"?"(V)":"(N)"}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" color="error">
                        &mdash;
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
