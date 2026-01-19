export interface PersonaData {
  id: string; // identificador único
  nombre: string;
  tipo: "nuevo" | "veterano";
  disponibilidad: {
    [dia in DiaSemana]?: Franja[];
  };
}

export type DiaSemana =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado";

export type Franja =
  | "07:00 am - 10:00 am"
  | "10:00 am - 01:00 pm"
  | "02:00 pm - 05:00 pm"
  | "05:00 pm - 07:00 pm"
  | "07:00 pm - 09:00 pm";

export const dias: DiaSemana[] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const franjasNormal: Franja[] = [
  "07:00 am - 10:00 am",
  "10:00 am - 01:00 pm",
  "02:00 pm - 05:00 pm",
  "05:00 pm - 07:00 pm",
  "07:00 pm - 09:00 pm",
];
export const franjasSabado: Franja[] = [
  "07:00 am - 10:00 am",
  "10:00 am - 01:00 pm",
  "02:00 pm - 05:00 pm",
];
