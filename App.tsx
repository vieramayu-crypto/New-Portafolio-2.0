import React, { useLayoutEffect, useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Page, HotelStory } from './types';
import { HOTEL_STORIES } from './data/hotels';
import { Navbar } from './components/Navbar';
import { HomeMain } from './components/HomeMain';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { WorkPage } from './components/WorkPage';
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
const PATH_BY_PAGE: Record<Page, string> = { home: '/', about: '/acerca-de', contact: '/contacto' };
const PAGE_BY_PATH: Partial<Record<string, Page>> = { '/': 'home', '/acerca-de': 'about', '/contacto': 'contact' };

/** Ficha de un proyecto de Trabajo, alcanzable por URL propia
 *  (/trabajo/:id) además de por clic desde Inicio. */
const WorkProjectRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hotels: hotelContent } = useSiteContent();
  const idx = HOTEL_STORIES.findIndex((s) => s.id === id);

  if (idx === -1) {
    navigate('/trabajo', { replace: true });
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
      onBack={() => navigate('/trabajo')}
      onNavigateStory={(direction) =>
        navigate(`/trabajo/${direction === 'next' ? nextStory.id : prevStory.id}`)
      }
      prevStory={prevStory}
      nextStory={nextStory}
    />
  );
};

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);
  const [pendingTransition, setPendingTransition] = useState<HotelStory | null>(null);
  // The intro plays once per full page load. Internal SPA navigation (e.g.
  // returning to Home from a hotel detail) does not re-trigger it -- a
  // refresh does, because React state resets with the page.
  const [introPlayed, setIntroPlayed] = useState<boolean>(false);

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
          isInquiryOpen ? 'scale-[.994] opacity-60 blur-[20px]' : ''
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
                  onSelectStory={handleSelectStory}
                />
              }
            />
            <Route path="/acerca-de" element={<About onOpenAvailability={openAvailability} />} />
            <Route path="/contacto" element={<Contact onOpen={openAvailability} />} />
            <Route path="/trabajo" element={<WorkPage />} />
            <Route path="/trabajo/:id" element={<WorkProjectRoute />} />
            <Route path="/proyecto/:id" element={<ProjectCaseStudy />} />
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
