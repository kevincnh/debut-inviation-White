import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// ─── data ────────────────────────────────────────────────────────────────────

interface Photo {
  id: number;
  src: string;
  alt: string;
  category: "showcase" | "gallery";
  caption: string;
  year?: string;
  description?: string;
}

const photos: Photo[] = [
  // showcase (timeline)
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=1600&fit=crop&auto=format",
    alt: "Young Sofia playing in sunlight",
    category: "showcase",
    caption: "A Joyful Beginning",
    year: "2008",
    description: "The earliest memories bathed in golden sunlight, where every fallen leaf and gentle breeze held a new discovery.",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1485199692108-c3b5069de6a0?w=1200&h=1600&fit=crop&auto=format",
    alt: "Childhood garden",
    category: "showcase",
    caption: "Roots in the Garden",
    year: "2013",
    description: "A quiet sanctuary of blooming flowers where imagination ran wild and the seeds of creativity were first planted.",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&h=1600&fit=crop&auto=format",
    alt: "Ballet recital",
    category: "showcase",
    caption: "Pointe and Grace",
    year: "2018",
    description: "Countless hours of discipline, worn-out slippers, and the beautiful pursuit of perfection on stage.",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=1600&fit=crop&auto=format",
    alt: "Portrait in golden light",
    category: "showcase",
    caption: "Edge of Eighteen",
    year: "2024",
    description: "A quiet moment of reflection, poised on the edge of adulthood. The calm before a beautiful storm of celebration.",
  },

  // gallery (pre-debut shoot)
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&h=1600&fit=crop&auto=format",
    alt: "Debut portrait in gown",
    category: "gallery",
    caption: "The First Look",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600&h=1200&fit=crop&auto=format",
    alt: "Grand ballroom entrance",
    category: "gallery",
    caption: "A Grand Entrance",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=1200&h=1600&fit=crop&auto=format",
    alt: "Debut gown detail",
    category: "gallery",
    caption: "Intricate Silks",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&h=1200&fit=crop&auto=format",
    alt: "Cotillion waltz",
    category: "gallery",
    caption: "The Midnight Waltz",
  },
  {
    id: 17,
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&h=1600&fit=crop&auto=format",
    alt: "Flowers and celebration",
    category: "gallery",
    caption: "Petals & Promises",
  },
];

const showcasePhotos = photos.filter((p) => p.category === "showcase");
const galleryPhotos = photos.filter((p) => p.category === "gallery");

// ─── typography components ────────────────────────────────────────────────────

const SerifItalic = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className={`italic ${className}`}>
    {children}
  </span>
);

const Serif = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className={className}>
    {children}
  </span>
);

const Cinzel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span style={{ fontFamily: "'Cinzel', serif" }} className={className}>
    {children}
  </span>
);

const Sans = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className={className}>
    {children}
  </span>
);

// ─── lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  photos,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const photo = photos[index];

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-foreground hover:text-primary transition-colors z-10"
      >
        <X size={32} strokeWidth={1} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 md:left-12 text-foreground/40 hover:text-primary transition-colors z-10"
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 md:right-12 text-foreground/40 hover:text-primary transition-colors z-10"
      >
        <ChevronRight size={48} strokeWidth={1} />
      </button>

      <div
        className="max-w-6xl w-full mx-12 flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={photo.src} alt={photo.alt} className="max-h-[85vh] w-auto object-contain shadow-2xl" />
        <div className="text-center">
          <SerifItalic className="text-2xl md:text-3xl text-foreground">{photo.caption}</SerifItalic>
        </div>
      </div>
    </div>
  );
}

// ─── app ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => {
    setLightboxIndex(i);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryPhotos.length : null));
  }, []);

  const prevPhoto = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryPhotos.length) % galleryPhotos.length : null));
  }, []);

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/20 selection:text-primary p-4 md:p-8 lg:p-12">
      {/* Outer Passepartout Frame */}
      <div className="border border-border min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-6rem)] bg-card flex flex-col shadow-sm">
        
        {/* Navigation / Header */}
        <header className="p-8 flex justify-between items-center z-10 relative bg-card">
          <Sans className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground">The Debut</Sans>
          <Cinzel className="text-xl md:text-2xl tracking-widest text-primary">S.R.</Cinzel>
          <Sans className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground">June 2026</Sans>
        </header>

        {/* Hero Section */}
        <section className="relative flex-1 flex flex-col items-center justify-center p-8 min-h-[80vh] overflow-hidden">
          <div className="absolute inset-0 m-4 md:m-8 lg:m-12">
            <img
              src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=2000&h=2400&fit=crop&auto=format"
              alt="Sofia"
              className="w-full h-full object-cover object-[center_20%] opacity-90"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="relative z-10 bg-background/80 backdrop-blur-sm p-12 md:p-24 border border-border/50 text-center max-w-3xl shadow-xl">
            <Sans className="block text-primary text-xs md:text-sm tracking-[0.4em] uppercase mb-6">
              You are invited to the 18th Debut of
            </Sans>
            <Cinzel className="block text-5xl md:text-7xl lg:text-[7rem] leading-none mb-4 text-foreground tracking-widest">
              SOFIA
            </Cinzel>
            <Cinzel className="block text-4xl md:text-6xl lg:text-[5rem] leading-none mb-10 text-foreground/80 tracking-widest">
              REYES
            </Cinzel>
            <div className="w-16 h-[1px] bg-primary mx-auto mb-10" />
            <SerifItalic className="block text-2xl md:text-3xl text-muted-foreground">
              A celebration of youth, beauty, & grace.
            </SerifItalic>
          </div>
        </section>

        {/* The Invitation Details (Physical Card Effect) */}
        <section className="py-32 px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto bg-card border border-border shadow-md p-12 md:p-20 text-center relative">
            {/* Elegant corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-primary/50" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/50" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-primary/50" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-primary/50" />

            <Serif className="text-4xl md:text-5xl text-foreground mb-4 block">The Celebration</Serif>
            <Sans className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto block mb-16">
              Join us for an evening of fine dining and dancing as we celebrate eighteen beautiful years and the exciting journey ahead.
            </Sans>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="pt-8 md:pt-0">
                <Cinzel className="text-primary text-sm tracking-[0.2em] mb-4 block">When</Cinzel>
                <SerifItalic className="text-2xl block mb-2">Saturday, June 28</SerifItalic>
                <Sans className="text-xs uppercase tracking-widest text-muted-foreground block">
                  6:00 in the evening
                </Sans>
              </div>
              <div className="pt-12 md:pt-0">
                <Cinzel className="text-primary text-sm tracking-[0.2em] mb-4 block">Where</Cinzel>
                <SerifItalic className="text-2xl block mb-2">The Grand Ballroom</SerifItalic>
                <Sans className="text-xs uppercase tracking-widest text-muted-foreground block">
                  Makati Shangri-La
                </Sans>
              </div>
              <div className="pt-12 md:pt-0">
                <Cinzel className="text-primary text-sm tracking-[0.2em] mb-4 block">Attire</Cinzel>
                <SerifItalic className="text-2xl block mb-2">Formal / Black Tie</SerifItalic>
                <Sans className="text-xs uppercase tracking-widest text-muted-foreground block">
                  Blush, Ivory & Gold
                </Sans>
              </div>
            </div>
          </div>
        </section>

        {/* The Journey (Horizontal Lookbook) */}
        <section className="py-32 overflow-hidden border-t border-border">
          <div className="px-8 md:px-24 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Sans className="text-primary text-xs tracking-[0.3em] uppercase mb-4 block">A Glimpse into the Past</Sans>
              <Serif className="text-5xl md:text-6xl text-foreground block">Her Story</Serif>
            </div>
            <Sans className="text-xs tracking-widest uppercase text-muted-foreground">Swipe to explore →</Sans>
          </div>

          {/* Horizontal Snap Scrolling */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 md:gap-16 pb-12 px-8 md:px-24 hide-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {showcasePhotos.map((photo) => (
              <div key={photo.id} className="snap-center shrink-0 w-[85vw] md:w-[45vw] lg:w-[35vw] flex flex-col group">
                <div className="overflow-hidden mb-8 border border-border p-2 bg-background">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-[50vh] md:h-[60vh] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="flex justify-between items-baseline mb-4">
                  <SerifItalic className="text-3xl text-foreground">{photo.caption}</SerifItalic>
                  <Sans className="text-xs uppercase tracking-widest text-primary">{photo.year}</Sans>
                </div>
                <div className="w-12 h-px bg-border mb-4" />
                <Sans className="text-sm leading-relaxed text-muted-foreground font-light">
                  {photo.description}
                </Sans>
              </div>
            ))}
            {/* spacer for the end of the scroll */}
            <div className="shrink-0 w-8 md:w-24" />
          </div>
        </section>

        {/* The Gallery (Airy Staggered Layout) */}
        <section className="py-32 px-8 bg-muted/20 border-t border-border">
          <div className="text-center mb-32">
            <Sans className="text-primary text-xs tracking-[0.3em] uppercase mb-4 block">Pre-Debut Portraits</Sans>
            <Serif className="text-5xl md:text-6xl text-foreground block">The Exhibition</Serif>
          </div>

          <div className="max-w-5xl mx-auto space-y-40">
            {galleryPhotos.map((photo, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={photo.id} className={`flex flex-col ${isEven ? 'items-start' : 'items-end'}`}>
                  <div 
                    className={`w-full md:w-[70%] cursor-pointer group relative bg-background border border-border p-3 shadow-lg`}
                    onClick={() => openLightbox(i)}
                  >
                    <img 
                      src={photo.src} 
                      alt={photo.alt} 
                      className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-background/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className={`mt-8 max-w-sm ${isEven ? 'text-left ml-4 md:ml-12' : 'text-right mr-4 md:mr-12'}`}>
                    <SerifItalic className="text-3xl md:text-4xl text-foreground block mb-4">{photo.caption}</SerifItalic>
                    <div className={`w-8 h-px bg-primary ${isEven ? 'ml-0' : 'ml-auto'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RSVP Section */}
        <section className="py-40 px-8 text-center border-t border-border bg-card relative overflow-hidden">
          <Cinzel className="text-6xl md:text-8xl text-foreground/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none w-full leading-none">
            RSVP
          </Cinzel>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <Serif className="text-5xl md:text-6xl text-foreground block mb-8">Grace Us With Your Presence</Serif>
            <Sans className="text-muted-foreground text-sm md:text-base font-light leading-relaxed mb-16 block">
              Please let us know if you can make it to this special evening. <br className="hidden md:block"/>
              Kindly respond by June 1, 2026.
            </Sans>
            
            <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-16 py-5 transition-colors duration-300 cursor-pointer">
              <Sans className="text-xs tracking-[0.3em] uppercase">Confirm Attendance</Sans>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border text-center">
          <Cinzel className="text-primary text-lg tracking-widest block mb-2">SOFIA REYES</Cinzel>
          <Sans className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground block">
            Eighteenth Debut &copy; 2026
          </Sans>
        </footer>

      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={galleryPhotos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextPhoto}
          onPrev={prevPhoto}
        />
      )}
    </div>
  );
}
