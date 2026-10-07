import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { openInquiryMail } from '../src/lib/inquiry';
import { useSiteContent } from '../src/lib/content';
import { useIdioma, segun } from '../src/lib/idioma';
import { crearT } from '../src/lib/textos';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [sent, setSent] = useState(false);
  const [composed, setComposed] = useState('');
  const { contact } = useSiteContent();
  const { idioma } = useIdioma();
  const t = crearT(idioma);

  // El sitio es estático: la solicitud se entrega abriendo el correo del
  // visitante ya redactado. Se guarda el texto compuesto por si su navegador
  // no tiene cliente de correo y necesita copiarlo a mano.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComposed(
      openInquiryMail(contact.emailAddress, { name, email, propertyName, availabilityDate })
    );
    setSent(true);
  };

  const handleReset = () => {
    setSent(false);
    setComposed('');
    setName('');
    setEmail('');
    setPropertyName('');
    setAvailabilityDate('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1a1918]/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#f5f3ed] border border-[#1a1918]/20 max-w-lg w-full p-8 md:p-10 shadow-2xl z-10 font-sans"
          >
            <button
              onClick={onClose}
              aria-label={t('cerrar')}
              className="absolute top-4 right-4 text-xs font-sans tracking-widest uppercase text-[#5a5854] hover:text-[#1a1918] p-2 -m-2"
            >
              [ ✕ ]
            </button>

            {sent ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 bg-[#1a1918] text-[#f5f3ed] rounded-full mx-auto flex items-center justify-center font-serif">
                  ✓
                </div>
                <h3 className="font-serif text-2xl text-[#1a1918]">{t('dispLista')}</h3>
                <p className="text-xs text-[#5a5854] leading-relaxed">
                  {segun(
                    idioma,
                    `Gracias ${name}. Abrimos tu correo con la consulta de ${propertyName || t('tuPropiedad')}${availabilityDate ? ` para ${availabilityDate}` : ''} ya redactada: sólo queda enviarla.`,
                    `Thank you ${name}. We are opening your email with the enquiry for ${propertyName || t('tuPropiedad')}${availabilityDate ? ` for ${availabilityDate}` : ''} already written: all that is left is to send it.`
                  )}{' '}
                  {t('disp48h')}
                </p>
                <p className="text-xs text-[#5a5854] leading-relaxed">
                  {t('noSeAbrio')}{' '}
                  <a
                    href={`mailto:${contact.emailAddress}`}
                    className="font-medium text-[#1a1918] underline underline-offset-2"
                  >
                    {contact.emailAddress}
                  </a>
                </p>
                {composed && (
                  <pre className="max-h-40 overflow-auto whitespace-pre-wrap bg-[#fbfaf6] p-3 text-left text-[12px] leading-relaxed text-[#5a5854]">
                    {composed}
                  </pre>
                )}
                <button
                  onClick={handleReset}
                  className="mt-4 bg-[#1a1918] text-[#f5f3ed] px-6 py-2.5 text-xs font-sans tracking-widest uppercase"
                >
                  {t('cerrar')}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#5a5854] block mb-1">
                    {t('dispEyebrow')}
                  </span>
                  <h3 className="font-serif text-2xl text-[#1a1918]">{t('dispTitulo')}</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-sans tracking-widest uppercase text-[#5a5854] block">
                      {t('campoNombre')}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('phNombre')}
                      className="w-full bg-white border border-[#1a1918]/20 p-2.5 text-base focus:outline-none focus:border-[#1a1918]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-sans tracking-widest uppercase text-[#5a5854] block">
                      {t('campoCorreo')}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('phCorreo')}
                      className="w-full bg-white border border-[#1a1918]/20 p-2.5 text-base focus:outline-none focus:border-[#1a1918]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-sans tracking-widest uppercase text-[#5a5854] block">
                      {t('campoPropiedadMarca')}
                    </label>
                    <input
                      type="text"
                      required
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      placeholder={t('phHotelMarca')}
                      className="w-full bg-white border border-[#1a1918]/20 p-2.5 text-base focus:outline-none focus:border-[#1a1918]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-sans tracking-widest uppercase text-[#5a5854] block">
                      {t('campoFechasDisp')}
                    </label>
                    <input
                      type="text"
                      required
                      value={availabilityDate}
                      onChange={(e) => setAvailabilityDate(e.target.value)}
                      placeholder={t('phSemanaEjemplo')}
                      className="w-full bg-white border border-[#1a1918]/20 p-2.5 text-base focus:outline-none focus:border-[#1a1918]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1a1918] text-[#f5f3ed] py-3 text-xs font-sans tracking-[0.2em] uppercase font-medium hover:bg-[#5a5854] transition-colors mt-2"
                  >
                    {t('dispTitulo')}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
