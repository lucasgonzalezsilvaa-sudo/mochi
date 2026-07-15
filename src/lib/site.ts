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
  image: string;
  blurb: string;
  accent: "terra" | "ocean" | "sun";
};

export const tours: Tour[] = [
  {
    slug: "atacama-infinito",
    name: "Atacama Infinito",
    place: "San Pedro de Atacama · Chile",
    dates: "11 – 17 nov 2026",
    image: "/images/hero-atacama.jpg",
    blurb:
      "El desierto más árido del mundo, sus lagunas altiplánicas y los cielos más estrellados del planeta.",
    accent: "terra",
  },
  {
    slug: "colombia-mochilera",
    name: "Colombia Mochilera",
    place: "Santa Marta · Minca · Palomino",
    dates: "20 – 30 ene 2027",
    image: "/images/colombia.jpg",
    blurb:
      "Caribe, sierra y selva. Del mar turquesa a los pueblos de montaña, viviendo Colombia sin apuro.",
    accent: "ocean",
  },
  {
    slug: "patagonia-salvaje",
    name: "Patagonia Salvaje",
    place: "Puerto Madryn · Argentina",
    dates: "20 – 26 oct 2026",
    image: "/images/patagonia.jpg",
    blurb:
      "Avistaje de ballenas, costa infinita y la fauna más increíble del Atlántico Sur.",
    accent: "sun",
  },
];
