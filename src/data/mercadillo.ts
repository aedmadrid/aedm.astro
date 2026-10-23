/**
 * Datos del Mercadillo de Navidad.
 *
 * Todo lo que cambia de una edición a otra está aquí: fechas, enlaces,
 * cartel, plano y puestos. Para preparar la nueva edición basta con editar
 * `edicion` y sustituir `mesas` por los puestos inscritos.
 */

export interface MercadilloRed {
    usuario: string;
    url: string;
}

export interface MercadilloMesa {
    /** Identificador usado en el mapa y en los enlaces (#mesa-<id>). */
    id: string;
    /** Etiqueta visible del puesto: "1", "2A", "5B"... */
    mesa: string;
    nombre: string;
    descripcion: string;
    hashtags: string[];
    redes: MercadilloRed[];
    /** Coordenadas [y, x] dentro del plano (Leaflet CRS.Simple). */
    pos: [number, number];
}

export interface MercadilloEdicion {
    year: number;
    nombre: string;
    fecha: string;
    horario: string;
    lugar: string;
    /** Cartel de la edición (en /public). */
    cartel: string;
    /** Plano de los puestos (en /public). */
    mapa: string;
    /** Tamaño real del plano, en píxeles. */
    mapaAncho: number;
    mapaAlto: number;
    calendarioUrl: string;
    newsletterUrl: string;
    inscripcionUrl: string;
    cartelesUrl: string;
    /** Texto del aviso de inscripción. Déjalo vacío para ocultarlo. */
    avisoInscripcion?: string | null;
    /** Nota entre paréntesis que acompaña al aviso. */
    avisoNota?: string | null;
}

// TODO nueva edición: actualizar YEAR, fecha, horario y enlaces.
const YEAR = 2026;

export const edicion: MercadilloEdicion = {
    year: YEAR,
    nombre: `Mercadillo de Navidad ${YEAR}`,
    fecha: "viernes 18 de diciembre",
    horario: "De 10 a 20h",
    lugar: "Escuela Superior de Diseño de Madrid",
    cartel: "/img/mercadillo/cartel.png",
    mapa: "/img/mercadillo/mapa.svg",
    mapaAncho: 2670,
    mapaAlto: 1641,
    calendarioUrl:
        "https://www.icloud.com/invites/036H00cwSGz6EeFEa9plaXkCQ",
    newsletterUrl:
        "https://asoaadm.substack.com/subscribe?utm_source=menu&simple=true&next=https%3A%2F%2Fwww.instagram.com%2Faso.esd%2F",
    inscripcionUrl:
        "https://aedm.notion.site/5d276f0f98e282c2be0e01979c4d4de9",
    cartelesUrl: "",
    avisoInscripcion: null,
};

/** Hashtags que se muestran en la portada del mercadillo. */
export const hashtagsPortada: string[][] = [
    [
        "pegatinas",
        "llaveros",
        "prints",
        "fanzine",
        "ilustración",
        "joyería",
        "albumilustrado",
        "crochet",
        "cuadernos",
        "grabados",
        "marcapáginas",
        "pendientes",
        "ropa",
        "accesorio",
        "aluminio",
        "amigurumis",
    ],
    [
        "artesanía",
        "bisutería",
        "bolsos",
        "chapas",
        "camisetas",
        "carteles",
        "collares",
        "color",
        "diy",
        "encuadernación",
        "fanart",
        "fotografia",
        "furby",
        "handmade",
    ],
    [
        "imanes",
        "joyeríaenplata",
        "láminas",
        "madera",
        "papelería",
        "peluches",
        "postales",
        "sorpresa",
        "decoloración",
    ],
];

/** Hashtags que se muestran en el plano (los mismos de la web anterior). */
export const hashtagsPlano: string[][] = [
    [
        "charms",
        "blindbox",
        "amigurumi",
        "print",
        "accesorios",
        "pendientes",
        "fanzine",
        "pegatinas",
        "grabados",
        "chapas",
        "fanart",
        "prints",
        "crochet",
        "ilustración",
        "llaveros",
        "encuadernación",
        "cuadernos",
    ],
    [
        "ilustraciones",
        "láminas",
        "diy",
        "camisetaspersonalizadas",
        "camisetasconlejía",
        "imanes",
        "marcapáginas",
        "postales",
        "fanzines",
        "amigurumis",
        "llaverossorpresa",
        "joyería",
        "artesanal",
        "joyeríaenplata",
        "accesorio",
    ],
    [
        "hoodie",
        "serigrafía",
        "albumilustrado",
        "ropa",
        "decoloración",
        "handmade",
        "joyas",
        "collares",
        "madera",
        "color",
        "artesanía",
        "aluminio",
        "joyasaluminio",
        "ceramica",
        "fotografia",
        "peluches",
        "bolsos",
        "bisutería",
        "prendas",
        "upcycling",
        "pantalones",
        "furby",
        "parches",
    ],
];

export const mesas: MercadilloMesa[] = [
    {
        id: "mesa1",
        mesa: "1",
        nombre: "Malena Valencia y Mar Frontan",
        descripcion:
            "Vendemos cajas sorpresa, charms, amigurumis, prints y accesorios.",
        hashtags: [
            "charms",
            "blindbox",
            "amigurumi",
            "print",
            "accesorios",
        ],
        redes: [
            {
                usuario: "@malenavgart",
                url: "https://www.instagram.com/malenavgart/",
            },
            {
                usuario: "@martiistica",
                url: "https://www.instagram.com/martiistica/",
            },
        ],
        pos: [1350, 600],
    },
    {
        id: "mesa2a",
        mesa: "2A",
        nombre: "Claudia Segovia",
        descripcion:
            "Venta de pendientes hechos con hojas naturales y resina.",
        hashtags: ["pendientes"],
        redes: [],
        pos: [1050, 85],
    },
    {
        id: "mesa2b",
        mesa: "2B",
        nombre: "Carmen",
        descripcion: "Diferentes gustos personales míos puestos en común.",
        hashtags: ["pegatinas", "furby"],
        redes: [
            {
                usuario: "@c.valverdeart",
                url: "https://www.instagram.com/c.valverdeart/",
            },
        ],
        pos: [950, 85],
    },
    {
        id: "mesa3a",
        mesa: "3A",
        nombre: "Julicalifei",
        descripcion:
            "Me gusta crear de forma artesanal y todo lo que vendo siempre está hecho a mano. Llevo tanto fanzines de diversos temas, pegatinas, chapas de fanarts, algunas ilustraciones y grabados originales, cuadros de flores secas... así como accesorios como llaveros de resina y de crochet.",
        hashtags: [
            "fanzine",
            "pegatinas",
            "grabados",
            "chapas",
            "fanart",
            "prints",
            "crochet",
            "ilustración",
            "llaveros",
            "encuadernación",
            "cuadernos",
        ],
        redes: [
            {
                usuario: "@julicalifei",
                url: "https://www.instagram.com/julicalifei/",
            },
        ],
        pos: [600, 85],
    },
    {
        id: "mesa3b",
        mesa: "3B",
        nombre: "Sofia Guzman",
        descripcion:
            "Vendo ilustraciones, pegatinas, fanzines y hasta camisetas hechas con lejía a mano. Soy una ilustradora y diseñadora que proclama el uso artesanal de las cosas, nada realizado con inteligencia artesanal, reflejar que el arte es práctica, pasión y constancia. En estas pequeñas láminas se puede ver mi evolución como artista, y sobretodo me encanta ir a mercadillos porque acercas el arte a la gente, hablas con ella, reflexionas. Cara a cara, persona a persona. Creo que es una experiencia riquísima en todos los aspectos, y me hace crecer mucho como diseñadora, ilustradora y persona.",
        hashtags: [
            "ilustraciones",
            "pegatinas",
            "láminas",
            "prints",
            "fanzine",
            "diy",
            "camisetaspersonalizadas",
            "camisetasconlejía",
        ],
        redes: [
            {
                usuario: "@ssophifia",
                url: "https://www.instagram.com/ssophifia/",
            },
        ],
        pos: [460, 85],
    },
    {
        id: "mesa4",
        mesa: "4",
        nombre: "Lucía Gama",
        descripcion:
            "Mayormente todo lo que hago son diversos productos de ilustración y pequeños objetos de artesanía como imanes y pendientes de arcilla. También llevo algunas obras originales de grabado e ilustración.",
        hashtags: [
            "ilustración",
            "prints",
            "pegatinas",
            "pendientes",
            "imanes",
            "marcapáginas",
            "postales",
            "fanzines",
            "grabados",
        ],
        redes: [
            {
                usuario: "@heliannae",
                url: "https://www.instagram.com/heliannae/",
            },
        ],
        pos: [380, 260],
    },
    {
        id: "mesa5a",
        mesa: "5A",
        nombre: "Eva M.",
        descripcion:
            "Me gustaría vender amigurumis tematizados de las distintas especialidades y posiblemente acompañarlo de pegatinas y llaveros de la misma temática. También me gustaría plantear el crear accesorios y elementos decorativos tejido todo a crochet.",
        hashtags: [
            "amigurumis",
            "crochet",
            "llaveros",
            "llaverossorpresa",
        ],
        redes: [
            {
                usuario: "@e.m_desing_",
                url: "https://www.instagram.com/e.m_desing_/",
            },
        ],
        pos: [800, 450],
    },
    {
        id: "mesa5b",
        mesa: "5B",
        nombre: "UVARTTE",
        descripcion:
            "Pegatinas, ilustraciones y llaveros divertidos dibujados y diseñados por mi.",
        hashtags: ["pegatinas", "ilustración", "llaveros"],
        redes: [
            {
                usuario: "@uvartte",
                url: "https://www.instagram.com/uvartte/",
            },
        ],
        pos: [640, 450],
    },
    {
        id: "mesa6",
        mesa: "6",
        nombre: "Vega de Navascués",
        descripcion:
            "Venta de piezas de joyería de autor, realizadas de forma artesanal con materiales nobles como plata y piedras preciosas.",
        hashtags: ["joyería", "artesanal", "joyeríaenplata", "accesorio"],
        redes: [
            {
                usuario: "@vegadenavascues",
                url: "https://www.instagram.com/vegadenavascues/",
            },
        ],
        pos: [950, 540],
    },
    {
        id: "mesa7",
        mesa: "7",
        nombre: "Sara Ortiz y Graphic Cardo",
        descripcion:
            "Vendo camisetas/sudaderas serigrafiadas con uno de mis diseños, además de prints en papel con la misma ilustración. También tengo otros prints, pegatinas y algunas unidades de uno de mis fanzines.",
        hashtags: [
            "pegatinas",
            "fanzine",
            "hoodie",
            "serigrafía",
            "prints",
            "camisetaspersonalizadas",
            "albumilustrado",
        ],
        redes: [
            {
                usuario: "@demonspirale",
                url: "https://www.instagram.com/demonspirale/",
            },
            {
                usuario: "@graphic.cardo",
                url: "https://www.instagram.com/graphic.cardo/",
            },
        ],
        pos: [1020, 750],
    },
    {
        id: "mesa8a",
        mesa: "8A",
        nombre: "Martuki",
        descripcion:
            "Desde hace unos años me modifico la ropa a mi manera mediante la decoloración o añadiendo pintura apta para la ropa. Hago distintos dibujos, de distinto tamaño y con distinta temática en ropa negra u oscura. También me hago a mi misma pendientes y collares con madera, pintándola por encima con pintura acrílica haciendo diferentes diseños y dibujos.",
        hashtags: [
            "ropa",
            "decoloración",
            "handmade",
            "joyas",
            "pendientes",
            "collares",
            "madera",
            "color",
        ],
        redes: [
            {
                usuario: "@aropacamiseta",
                url: "https://www.instagram.com/aropacamiseta/",
            },
        ],
        pos: [1020, 1050],
    },
    {
        id: "mesa8b",
        mesa: "8B",
        nombre: "Blanca Benito",
        descripcion:
            "Joyería artesanal de aluminio. Pendientes, collares, anillos, marcapáginas.",
        hashtags: ["joyas", "artesanía", "aluminio", "joyasaluminio"],
        redes: [
            {
                usuario: "@blancabenitods",
                url: "https://www.instagram.com/blancabenitods/",
            },
            {
                usuario: "@missblanchejewels",
                url: "https://www.instagram.com/missblanchejewels/",
            },
        ],
        pos: [1020, 1160],
    },
    {
        id: "mesa9a",
        mesa: "9A",
        nombre: "Marina Sabio",
        descripcion:
            "Venta de unas 10-15 piezas de cerámica y porcelana hechas a mano.",
        hashtags: ["ceramica", "handmade", "artesanal"],
        redes: [],
        pos: [1260, 1480],
    },
    {
        id: "mesa9b",
        mesa: "9B",
        nombre: "Patricia García",
        descripcion:
            "La propuesta serían por un lado pegatinas y láminas de ilustraciones (algunos fanarts y otros ilustraciones propias) y unos fanzines de fotografías analógicas de paisaje.",
        hashtags: ["pegatinas", "ilustracion", "fanzine", "fotografia"],
        redes: [
            {
                usuario: "@rani3_draws",
                url: "https://www.instagram.com/rani3_draws/",
            },
        ],
        pos: [1090, 1480],
    },
    {
        id: "mesa10",
        mesa: "10",
        nombre: "inés",
        descripcion:
            "Los productos que hago están basados en el concepto de la personalización, por eso hago llaveros personalizables y peluches que se pueden llevar en el bolso, llaves, pantalón... También hago pegatinas para que la gente decore sus objetos personales a su gusto y que estos tengan algo de su esencia personal.",
        hashtags: ["pegatinas", "peluches", "llaveros"],
        redes: [],
        pos: [950, 1480],
    },
    {
        id: "mesa11",
        mesa: "11",
        nombre: "Ctdart_",
        descripcion:
            "Realizo objetos hechos a mano, como camisetas, joyeros y las propias joyas con arcilla polimérica. También realizo ilustraciones y stickers.",
        hashtags: ["camisetaspersonalizadas", "ilustración", "joyas"],
        redes: [
            {
                usuario: "@ctdart_",
                url: "https://www.instagram.com/ctdart_/",
            },
        ],
        pos: [720, 1480],
    },
    {
        id: "mesa12",
        mesa: "12",
        nombre: "Celia",
        descripcion:
            "Vendo pegatinas con ilustraciones digitales, bolsos y fundas de libro cosidos a mano, cuadernos encuadernados artesanalmente, además de llaveros, collares y pendientes.",
        hashtags: ["pegatinas", "bolsos", "bisutería", "cuadernos"],
        redes: [],
        pos: [570, 1630],
    },
    {
        id: "mesa13",
        mesa: "13",
        nombre: "dissaraemv",
        descripcion:
            "Prendas de arriba como tops o camisas, de abajo; faldas, pantalones y algo de joyería como collares y brazaletes.",
        hashtags: ["ropa", "prendas", "joyeria"],
        redes: [
            {
                usuario: "@dissaraemv_",
                url: "https://www.instagram.com/dissaraemv_/",
            },
        ],
        pos: [720, 1910],
    },
    {
        id: "mesa14",
        mesa: "14",
        nombre: "Lopo",
        descripcion:
            "Venderé accesorios, piezas y parches hechos por upcycling. Todo con material reciclado y reaprovechado.",
        hashtags: [
            "charms",
            "parches",
            "upcycling",
            "accesorios",
            "pantalones",
        ],
        redes: [
            {
                usuario: "@L0p0",
                url: "https://www.instagram.com/L0p0/",
            },
        ],
        pos: [950, 1910],
    },
];
