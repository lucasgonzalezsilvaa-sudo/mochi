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

export type Coordinator = {
  name: string;
  photo: string;
  bio: string;
};

export const coordinators: Coordinator[] = [
  {
    name: "Mochi",
    photo: "/images/about-mochi.jpg",
    bio: "Viajero, fotógrafo y creador de Los Viajes de Mochi. Acompaña cada grupo de punta a punta, cuidando los tiempos y el vínculo entre quienes viajan.",
  },
];

// Los viajes (tours) ahora se gestionan desde el panel /admin y se
// guardan como archivos en content/viajes/. Ver src/lib/viajes.ts.
