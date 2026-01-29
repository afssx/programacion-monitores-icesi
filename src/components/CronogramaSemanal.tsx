import React from "react";
import {
  type PersonaData,
  type DiaSemana,
  type Franja,
  dias,
  franjasNormal,
  franjasSabado,
} from "../types";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from "@mui/material";

interface Props {
  personas: PersonaData[];
  maxHorasSemanales: number;
}

const horasFranja: Record<Franja, number> = {
  "07:00 am - 10:00 am": 3,
  "10:00 am - 01:00 pm": 3,
  "02:00 pm - 05:00 pm": 3,
  "05:00 pm - 07:00 pm": 2,
  "07:00 pm - 09:00 pm": 2,
};

export const CronogramaSemanal: React.FC<Props> = ({ personas, maxHorasSemanales }) => {
  const horasPersona = Object.fromEntries(personas.map((p) => [p.id, 0])) as Record<
    PersonaData["id"],
    number
  >;

  const asign: Record<DiaSemana, Record<Franja, PersonaData[]>> = {} as any;

  dias.forEach((d) => {
    asign[d] = {} as any;
    const franjas = d === "Sábado" ? franjasSabado : franjasNormal;

    franjas.forEach((f, idx) => {
      const duracion = horasFranja[f];
      const dispo = personas.filter((p) => p.disponibilidad[d]?.includes(f));

      // Si hay una persona tipo bloqueo, la franja queda bloqueada
      const bloqueos = dispo.filter((p) => p.tipo === "bloqueo");
      if (bloqueos.length) {
        asign[d][f] = [bloqueos[0]];
        return;
      }

      // Respeta tope semanal
      const elegibles = dispo.filter(
        (p) => horasPersona[p.id] + duracion <= maxHorasSemanales
      );

      const veteranos = elegibles.filter((p) => p.tipo === "veterano");
      let seleccion: PersonaData[] = [];

      const esPrimeraOultima = idx === 0 || idx === franjas.length - 1;

      if (veteranos.length) {
        const titularVeterano = veteranos[0];
        seleccion.push(titularVeterano);
        const restantes = elegibles.filter((p) => p.id !== titularVeterano.id);
        seleccion.push(...restantes.slice(0, 2));
      } else if (!esPrimeraOultima) {
        // Para franjas intermedias se permite sin veterano
        seleccion = elegibles.slice(0, 3);
      } else {
        // Franja de apertura o cierre sin veterano elegible: se deja sin asignar
        seleccion = [];
      }

      // Suma horas a quienes fueron asignados
      seleccion.forEach((p) => {
        horasPersona[p.id] += duracion;
      });

      asign[d][f] = seleccion;
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
                          {p.tipo === "bloqueo"
                            ? `${p.nombre} (Bloqueado)`
                            : `${p.nombre} ${p.tipo==="veterano"?"(V)":"(N)"}`}
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
