import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useNavigationType,
  useParams,
} from 'react-router-dom';
import { Page, HotelStory } from './types';
import { HOTEL_STORIES } from './data/hotels';
import { traducirHotel } from './data/textosEn';
import { useIdioma } from './src/lib/idioma';
import { analizarRuta, IDIOMAS, ruta, type Clave } from './src/lib/rutas';
import { Navbar } from './components/Navbar';
import { HomeMain } from './components/HomeMain';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { WorkModal } from './components/WorkModal';
import { ProjectsPage } from './components/ProjectsPage';
import { ProjectCaseStudy } from './components/ProjectCaseStudy';
import { InquiryModal } from './components/InquiryModal';
import { Footer } from './components/Footer';
import { HotelDetail } from './components/HotelDetail';
import { PhotoZoomTransition } from './components/PhotoZoomTransition';
import { IntroLoader } from './components/IntroLoader';
import { ContentProvider, useSiteContent } from './src/lib/content';
import { Metadatos } from './src/lib/Metadatos';
import { IdiomaProvider } from './src/lib/idioma';
import {
  hayHistorialPropio,
  pedirAncla,
  posicionGuardada,
  restaurarScroll,
  tomarAncla,
  vigilarPosicion,
} from './src/lib/recorrido';

/** El resto de la web sigue hablando en términos de `Page` (Navbar y Footer
 *  no saben de rutas), así que aquí se traduce entre los dos mundos. Las
 *  direcciones las pone `src/lib/rutas.ts`, que es quien sabe cómo se llama
 *  cada página en cada idioma. */
/** La subcarpeta en la que está colgado el sitio. En GitHub Pages es
 *  `/New-Portafolio-2.0/`; cuando Mayurlin migre a su dominio será `/`. Vite
 *  la inyecta al compilar, así que no hay nada escrito a mano. */
const BASE = import.meta.env.BASE_URL;

const CLAVE_POR_PAGINA: Record<Page, Clave> = {
  home: 'inicio',
  projects: 'proyectos',
  about: 'equipo',
  contact: 'contacto',
};
const PAGINA_POR_CLAVE: Partial<Record<Clave, Page>> = {
  inicio: 'home',
  proyectos: 'projects',
  equipo: 'about',
  contacto: 'contact',
};

/** Las cuatro páginas del menú. Son las que abren con la intro y las únicas
 *  que `Page` sabe nombrar. */
const CLAVES_DE_MENU: Clave[] = ['inicio', 'proyectos', 'equipo', 'contacto'];

/** Las rutas nacieron con nombres de hoteles que no eran los reales -- un
 *  enlace a Deltapark decía "hotel-caruso-belmond", y compartirlo hacía
 *  parecer que el trabajo era de otro estudio. Ya apuntan al hotel correcto;
 *  este mapa mantiene vivos los enlaces antiguos que puedan estar
 *  circulando, llevándolos al nuevo. */
const LEGACY_HOTEL_IDS: Record<string, string> = {
  'aman-venice': 'intercontinental-lisboa',
  'villa-cimbrone-ravello': 'vestige-binidufa',
  'hotel-caruso-belmond': 'deltapark-vitalresort',
  'borgo-egnazia-puglia': 'honeymoon-petra-villas',
  'hotel-danieli-venezia': 'gpro-valparaiso',
  'villa-deste-como': 'hotel-esplendido',
  'san-domenico-palace': 'welmoon-villas',
};

/** Rutas que sí abren con la intro: Inicio y las tres páginas del menú. Un
 *  enlace de difusión apunta a /trabajo/:id o /proyecto/:slug, y esos entran
 *  directos al contenido. */
function esRutaDeEntradaConIntro(): boolean {
  if (typeof window === 'undefined') return true;
  // La ruta ya no vive detrás de una almohadilla, así que se lee del camino
  // de verdad. Hay que quitarle la subcarpeta en la que está colgado el sitio
  // (en GitHub Pages es `/New-Portafolio-2.0/`, en su dominio será `/`).
  const base = BASE.replace(/\/$/, '');
  let camino = window.location.pathname;
  if (base && camino.startsWith(base)) camino = camino.slice(base.length);
  const partes = analizarRuta(camino || '/');
  return !partes || CLAVES_DE_MENU.includes(partes.clave);
}

/** El botón Volver de una ficha o de un caso.
 *
 *  Hacia atrás de verdad cuando hay algo detrás -- así se recupera la página y
 *  la altura exacta en que se quedó, que es lo que pidió Mayurlin. Y cuando no
 *  lo hay, porque se ha entrado por un enlace directo, a Proyectos señalando el
 *  hotel del que se viene, para no dejar al visitante en la puerta. */
export function useVolver() {
  const navigate = useNavigate();
  const { idioma } = useIdioma();
  return ({ hotelId }: { hotelId?: string } = {}) => {
    if (hayHistorialPropio()) {
      // `navigate(-1)` no admite llevar datos, así que el bloque al que hay
      // que volver se deja apuntado aquí y lo recoge la restauración.
      if (hotelId) pedirAncla(hotelId);
      navigate(-1);
      return;
    }
    navigate(ruta(idioma, 'proyectos'), {
      replace: true,
      state: hotelId ? { irA: hotelId } : undefined,
    });
  };
}

/** Ficha de un proyecto de Trabajo, alcanzable por URL propia
 *  (/trabajo/:id) además de por clic desde Inicio. */
const WorkProjectRoute: React.FC<{ onOpenAvailability: () => void }> = ({ onOpenAvailability }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const volver = useVolver();
  const { hotels: hotelContent } = useSiteContent();
  const { idioma } = useIdioma();
  const idx = HOTEL_STORIES.findIndex((s) => s.id === id);

  if (idx === -1) {
    const renamed = id ? LEGACY_HOTEL_IDS[id] : undefined;
    navigate(renamed ? ruta(idioma, 'trabajo', renamed) : ruta(idioma, 'inicio'), { replace: true });
    return null;
  }

  const total = HOTEL_STORIES.length;

  /** LA FICHA LISTA PARA PINTAR: el idioma primero (rótulo, sitio, país, datos
   *  del rodaje y los textos alternativos de las fotos), y encima lo que
   *  Mayurlin edita en content.
   *
   *  ESTO VALE PARA LAS TRES, no sólo para la que se está viendo. Antes la
   *  ficha de al lado (los enlaces de anterior y siguiente del pie) salía sólo
   *  de `traducirHotel`, que no toca el nombre, así que esos dos enlaces
   *  mostraban el nombre estructural de `data/hotels.ts` y no el publicado.
   *  Se vio con InterContinental, que en inglés es Lisbon y ahí seguía
   *  diciendo Lisboa, pero el fallo era general: cualquier nombre que ella
   *  cambiara en `content.json` no llegaba a esos dos enlaces. */
  const fichaCompleta = (i: number): HotelStory => {
    const base = traducirHotel(HOTEL_STORIES[i], idioma);
    return {
      ...base,
      hotelName: hotelContent[i]?.hotelName ?? base.hotelName,
      coupleName: hotelContent[i]?.coupleName ?? base.coupleName,
      description: hotelContent[i]?.description ?? base.description,
      quote: hotelContent[i]?.quote ?? base.quote,
    };
  };

  const story = fichaCompleta(idx);
  const prevStory = fichaCompleta((idx - 1 + total) % total);
  const nextStory = fichaCompleta((idx + 1) % total);

  return (
    <HotelDetail
      story={story}
      // Vuelve a la pantalla anterior, a la altura en la que se quedó. Si se
      // ha entrado directo por un enlace, no hay pantalla anterior: entonces
      // lleva a Proyectos, y ahí abajo se busca el bloque de este hotel.
      onBack={() => volver({ hotelId: story.id })}
      onNavigateStory={(direction) =>
        navigate(ruta(idioma, 'trabajo', direction === 'next' ? nextStory.id : prevStory.id))
      }
      prevStory={prevStory}
      nextStory={nextStory}
      onOpenAvailability={onOpenAvailability}
    />
  );
};

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);
  const [isWorkOpen, setIsWorkOpen] = useState<boolean>(false);
  const [pendingTransition, setPendingTransition] = useState<HotelStory | null>(null);
  // La intro se reproduce una vez por carga completa. Navegar dentro de la web
  // (volver a Inicio desde un hotel, por ejemplo) no la vuelve a lanzar; una
  // recarga sí, porque el estado de React se reinicia con la página.
  //
  // Salvo si se entra directamente a una ficha o a un caso. Los enlaces que
  // Mayurlin manda a un hotel apuntan a /trabajo/... o a /proyecto/..., y ahí
  // el visitante viene a ver un trabajo concreto: seis segundos de vídeo antes
  // de la primera foto son seis segundos para cerrar la pestaña. Se mira la
  // ruta de entrada una sola vez, al montar, para que abrir Inicio y navegar
  // después a un hotel no cambie nada.
  const [introPlayed, setIntroPlayed] = useState<boolean>(
    () => !esRutaDeEntradaConIntro(),
  );

  const { idioma } = useIdioma();
  const partesRuta = analizarRuta(location.pathname);
  const currentPage: Page = partesRuta
    ? PAGINA_POR_CLAVE[partesRuta.clave] ?? 'home'
    : 'home';

  const handleNavigate = (page: Page) => {
    navigate(ruta(idioma, CLAVE_POR_PAGINA[page]));
  };

  // Mientras se está en una pantalla se va anotando a qué altura está, para
  // poder devolver ahí al visitante si vuelve. Ver el comentario de
  // `vigilarPosicion`: hacerlo sólo al salir no vale.
  useEffect(() => vigilarPosicion(location.key), [location.key]);

  // Al LLEGAR: si es una pantalla nueva, arriba del todo. Si se ha vuelto
  // hacia atrás, a la altura que tenía -- entrar en la galería de un hotel y
  // volver tiene que devolver al bloque de ese hotel, no al principio.
  //
  // Va después del render, no en el manejador: hacerlo antes de que React monte
  // la página nueva dejaba el scroll a media altura.
  useLayoutEffect(() => {
    const guardada = navigationType === 'POP' ? posicionGuardada(location.key) : undefined;
    const ancla = navigationType === 'POP' ? tomarAncla() : null;
    if (guardada === undefined && !ancla) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    return restaurarScroll(guardada ?? 0, ancla);
  }, [location.key, navigationType]);

  const handleSelectStory = (story: HotelStory) => {
    if (pendingTransition) return;
    setPendingTransition(story);
  };

  const handleTransitionComplete = () => {
    if (pendingTransition) {
      navigate(ruta(idioma, 'trabajo', pendingTransition.id));
    }
    setPendingTransition(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openAvailability = () => setIsInquiryOpen(true);
  /* OJO: ahora mismo NADIE llama a esto. La ventana del carrusel de hoteles
     (`WorkModal`) se abría desde el pie del índice flotante de Inicio, con
     "Ver todas las propiedades". Ese índice se mudó a Proyectos y allí ese pie
     no aplica -- ya estás viendo todas -- así que la ventana se quedó sin
     puerta de entrada. Se deja montada, y no borrada, porque Mayurlin dijo
     que no sabe si la querrá para otra sección. */
  const openWork = () => setIsWorkOpen(true);
  void openWork;

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#1a1918] font-sans antialiased selection:bg-[#1a1918] selection:text-[#f5f3ed]">
      {/* Top Header Navigation */}
      {/* No pinta nada: deja en el <head> el título, la descripción, la
          dirección canónica y las alternativas por idioma de la página que
          se esté viendo. */}
      <Metadatos />

      <Navbar currentPage={currentPage} onNavigate={handleNavigate} onOpenAvailability={openAvailability} />

      {/* Detras del cristal, la pagina se desenfoca y se apaga — sin eso, una
          foto a pantalla completa atraviesa el modal como una mancha. Envuelve
          <main> y el pie, nunca el Navbar: un `filter` distinto de `none` crea
          bloque contenedor y le quitaria el `position: fixed`.
          El desenfoque es generoso a proposito: el velo bajo a .78 para que se
          vea el cristal, y con menos desenfoque una foto a pantalla completa
          atraviesa el panel como una mancha reconocible en vez de como
          escarcha. */}
      <div
        className={`transition-[filter,transform,opacity] duration-[620ms] ease-[cubic-bezier(.22,1,.36,1)] ${
          isInquiryOpen || isWorkOpen ? 'scale-[.994] opacity-60 blur-[20px]' : ''
        }`}
      >
        <main>
          {/* LAS MISMAS SEIS PÁGINAS, DOS VECES: una por idioma.
              No son dos webs. Es la misma, montada en las direcciones que le
              tocan a cada idioma (`/proyectos` y `/en/projects`), porque una
              versión que no tiene dirección propia no existe para Google. Las
              direcciones las pone `src/lib/rutas.ts`; aquí sólo se recorren. */}
          <Routes>
            {IDIOMAS.map((idi) => (
              <React.Fragment key={idi}>
                <Route
                  path={ruta(idi, 'inicio')}
                  element={
                    <HomeMain
                      introDone={introPlayed}
                      onNavigate={handleNavigate}
                      onOpenAvailability={openAvailability}
                      onSelectStory={handleSelectStory}
                    />
                  }
                />
                <Route
                  path={ruta(idi, 'proyectos')}
                  element={<ProjectsPage onOpenAvailability={openAvailability} />}
                />
                <Route
                  path={ruta(idi, 'equipo')}
                  element={<About onOpenAvailability={openAvailability} />}
                />
                <Route
                  path={ruta(idi, 'contacto')}
                  element={<Contact onOpen={openAvailability} />}
                />
                <Route
                  path={ruta(idi, 'trabajo', ':id')}
                  element={<WorkProjectRoute onOpenAvailability={openAvailability} />}
                />
                <Route
                  path={ruta(idi, 'proyecto', ':id')}
                  element={<ProjectCaseStudy onOpenAvailability={openAvailability} />}
                />
              </React.Fragment>
            ))}
            <Route
              path="*"
              element={
                <HomeMain
                  introDone={introPlayed}
                  onNavigate={handleNavigate}
                  onOpenAvailability={openAvailability}
                  onSelectStory={handleSelectStory}
                />
              }
            />
          </Routes>
        </main>

        {/* El pie cierra todas las páginas, Inicio incluido: hasta ahora Inicio
            terminaba en seco, sin Instagram, sin navegación y sin aviso legal. */}
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Un solo formulario de solicitud en toda la web: lo abren el CTA de
          Contacto, el del bloque de valor, el del cierre de Inicio, el de
          Acerca de y "Consultar disponibilidad" del menu. */}
      <InquiryModal open={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />

      {/* Trabajo: ventana emergente igual que InquiryModal -- nunca cambia de
          ruta, así que cerrarla deja al visitante exactamente donde estaba. */}
      <WorkModal open={isWorkOpen} onClose={() => setIsWorkOpen(false)} />

      {/* Entry transition: clicked photo zooms full-screen into the story page */}
      {pendingTransition && (
        <PhotoZoomTransition imageUrl={pendingTransition.coverImage} onComplete={handleTransitionComplete} />
      )}

      {/* Intro loader plays once per page load. Going back from a hotel does
          not re-trigger it because App-level state persists across the
          inner navigation. */}
      {!introPlayed && <IntroLoader onDone={() => setIntroPlayed(true)} />}
    </div>
  );
};

/** EL ROUTER VA POR FUERA DE TODO, y ese orden importa: el idioma ahora se
 *  lee de la dirección, así que su proveedor tiene que estar DENTRO del router
 *  para poder consultarla. Antes estaba por encima, cuando el idioma vivía en
 *  el navegador y no en la dirección.
 *
 *  `basename` es la subcarpeta en la que está colgado el sitio. Vite la
 *  inyecta al compilar, así que esto vale igual en GitHub Pages
 *  (`/New-Portafolio-2.0/`) que en el dominio de Mayurlin (`/`). */
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <IdiomaProvider>
        <ContentProvider>
          <AppShell />
        </ContentProvider>
      </IdiomaProvider>
    </BrowserRouter>
  );
}
