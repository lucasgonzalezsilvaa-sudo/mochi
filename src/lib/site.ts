export const site = {
  name: "Los Viajes de Mochi",
  shortName: "Mochi",
  tagline: "Algunos viajes cambian el destino. Otros, la manera de mirar el mundo.",
  description:
    "Viajes en grupos reducidos por Sudamérica y notas de viaje de Mochi: consejos, rutas y experiencias para viajar distinto.",
  url: "https://mochiviaja.com",
  email: "maxi@losviajedemochi.com",
  phone: "+598 92 825 235",
  whatsapp: "https://wa.me/message/XZYP2CDES5NWP1",
  instagram: "https://instagram.com/losviajesdemochi",
  instagramHandle: "@losviajesdemochi",
};

export type Tour = {
  slug: string;
  name: string;
  place: string;
  dates: string;
  duration: string;
  image: string;
  blurb: string;
  intro: string[];
  highlights: string[];
  includes: string[];
  accent: "terra" | "ocean" | "sun";
};

export const tours: Tour[] = [
  {
    slug: "atacama-infinito",
    name: "Atacama Infinito",
    place: "San Pedro de Atacama · Chile",
    dates: "11 – 17 nov 2026",
    duration: "7 días / 6 noches",
    image: "/images/hero-atacama.jpg",
    blurb:
      "El desierto más árido del mundo, sus lagunas altiplánicas y los cielos más estrellados del planeta.",
    intro: [
      "Atacama es un lugar que no se parece a nada. Salares infinitos, lagunas de color imposible, géiseres al amanecer y noches con más estrellas de las que creías que existían.",
      "Vamos a recorrerlo sin apuro, en grupo chico, dejando tiempo para el silencio y para esas charlas que solo aparecen mirando el cielo del desierto.",
    ],
    highlights: [
      "Valle de la Luna al atardecer",
      "Géiseres del Tatio al amanecer",
      "Lagunas altiplánicas y salar de Atacama",
      "Noche de observación astronómica",
      "Pueblos y ferias de San Pedro",
    ],
    includes: [
      "Alojamiento 6 noches",
      "Traslados y excursiones del itinerario",
      "Acompañamiento de Mochi durante todo el viaje",
      "Grupo reducido",
    ],
    accent: "terra",
  },
  {
    slug: "colombia-mochilera",
    name: "Colombia Mochilera",
    place: "Santa Marta · Minca · Palomino",
    dates: "20 – 30 ene 2027",
    duration: "11 días / 10 noches",
    image: "/images/colombia.jpg",
    blurb:
      "Caribe, sierra y selva. Del mar turquesa a los pueblos de montaña, viviendo Colombia sin apuro.",
    intro: [
      "Colombia se vive con todos los sentidos: el calor del Caribe, la sierra verde de Minca, los ríos de Palomino y una energía que te contagia desde el primer día.",
      "Un viaje mochilero de verdad, pero con todo resuelto: vos ponés las ganas y la mochila, del resto me ocupo yo.",
    ],
    highlights: [
      "Playas del Caribe en Santa Marta",
      "Minca: cascadas, café y sierra",
      "Tubing por el río de Palomino",
      "Atardeceres y música en la costa",
      "Comida local y mercados",
    ],
    includes: [
      "Alojamiento 10 noches",
      "Traslados entre destinos",
      "Experiencias del itinerario",
      "Acompañamiento de Mochi y grupo reducido",
    ],
    accent: "ocean",
  },
  {
    slug: "patagonia-salvaje",
    name: "Patagonia Salvaje",
    place: "Puerto Madryn · Argentina",
    dates: "20 – 26 oct 2026",
    duration: "7 días / 6 noches",
    image: "/images/patagonia.jpg",
    blurb:
      "Avistaje de ballenas, costa infinita y la fauna más increíble del Atlántico Sur.",
    intro: [
      "La Patagonia atlántica es pura vida salvaje: ballenas francas que se acercan a la costa, pingüinos, lobos marinos y una inmensidad que te reordena por dentro.",
      "Un viaje para desconectar de todo y volver a conectar con lo esencial, en la mejor época para ver ballenas.",
    ],
    highlights: [
      "Avistaje de ballenas francas",
      "Península Valdés y su fauna",
      "Colonias de pingüinos y lobos marinos",
      "Costa y estepa patagónica",
      "Atardeceres infinitos",
    ],
    includes: [
      "Alojamiento 6 noches",
      "Traslados y excursiones",
      "Salida de avistaje de ballenas",
      "Acompañamiento de Mochi y grupo reducido",
    ],
    accent: "sun",
  },
];

export function getTour(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
