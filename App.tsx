import React, { useLayoutEffect, useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Page, HotelStory } from './types';
import { HOTEL_STORIES } from './data/hotels';
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

/** Cada página real vive en su propia ruta (URL compartible), pero el resto
 *  de la web sigue hablando en términos de `Page` como antes: este mapa
 *  traduce entre los dos mundos sin tocar Navbar.tsx ni Footer.tsx. */
const PATH_BY_PAGE: Record<Page, string> = {
  home: '/',
  projects: '/proyectos',
  about: '/acerca-de',
  contact: '/contacto',
};
const PAGE_BY_PATH: Partial<Record<string, Page>> = {
  '/': 'home',
  '/proyectos': 'projects',
  '/acerca-de': 'about',
  '/contacto': 'contact',
};

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
  // HashRouter: la ruta vive detrás de la almohadilla.
  const hash = window.location.hash.replace(/^#/, '');
  const ruta = (hash.split('?')[0] || '/').replace(/\/+$/, '') || '/';
  return ruta in PAGE_BY_PATH;
}

/** Ficha de un proyecto de Trabajo, alcanzable por URL propia
 *  (/trabajo/:id) además de por clic desde Inicio. */
const WorkProjectRoute: React.FC<{ onOpenAvailability: () => void }> = ({ onOpenAvailability }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hotels: hotelContent } = useSiteContent();
  const idx = HOTEL_STORIES.findIndex((s) => s.id === id);

  if (idx === -1) {
    const renamed = id ? LEGACY_HOTEL_IDS[id] : undefined;
    navigate(renamed ? `/trabajo/${renamed}` : '/', { replace: true });
    return null;
  }

  const total = HOTEL_STORIES.length;
  const base = HOTEL_STORIES[idx];
  const story: HotelStory = {
    ...base,
    hotelName: hotelContent[idx]?.hotelName ?? base.hotelName,
    coupleName: hotelContent[idx]?.coupleName ?? base.coupleName,
    description: hotelContent[idx]?.description ?? base.description,
    quote: hotelContent[idx]?.quote ?? base.quote,
  };
  const prevStory = HOTEL_STORIES[(idx - 1 + total) % total];
  const nextStory = HOTEL_STORIES[(idx + 1) % total];

  return (
    <HotelDetail
      story={story}
      onBack={() => navigate('/')}
      onNavigateStory={(direction) =>
        navigate(`/trabajo/${direction === 'next' ? nextStory.id : prevStory.id}`)
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

  const currentPage: Page = PAGE_BY_PATH[location.pathname] ?? 'home';

  const handleNavigate = (page: Page) => {
    navigate(PATH_BY_PAGE[page]);
  };

  // El reseteo va después del render, no en el manejador: hacerlo antes de que
  // React monte la página nueva dejaba el scroll a media altura.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  const handleSelectStory = (story: HotelStory) => {
    if (pendingTransition) return;
    setPendingTransition(story);
  };

  const handleTransitionComplete = () => {
    if (pendingTransition) {
      navigate(`/trabajo/${pendingTransition.id}`);
    }
    setPendingTransition(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openAvailability = () => setIsInquiryOpen(true);
  const openWork = () => setIsWorkOpen(true);

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#1a1918] font-sans antialiased selection:bg-[#1a1918] selection:text-[#f5f3ed]">
      {/* Top Header Navigation */}
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
          <Routes>
            <Route
              path="/"
              element={
                <HomeMain
                  introDone={introPlayed}
                  onNavigate={handleNavigate}
                  onOpenAvailability={openAvailability}
                  onOpenWork={openWork}
                  onSelectStory={handleSelectStory}
                />
              }
            />
            <Route path="/proyectos" element={<ProjectsPage onOpenAvailability={openAvailability} />} />
            <Route path="/acerca-de" element={<About onOpenAvailability={openAvailability} />} />
            <Route path="/contacto" element={<Contact onOpen={openAvailability} />} />
            <Route path="/trabajo/:id" element={<WorkProjectRoute onOpenAvailability={openAvailability} />} />
            <Route path="/proyecto/:id" element={<ProjectCaseStudy onOpenAvailability={openAvailability} />} />
            <Route
              path="*"
              element={
                <HomeMain
                  introDone={introPlayed}
                  onNavigate={handleNavigate}
                  onOpenAvailability={openAvailability}
                  onOpenWork={openWork}
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

export default function App() {
  return (
    <ContentProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </ContentProvider>
  );
}
