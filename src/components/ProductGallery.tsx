import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const activeImage = images[selected] ?? images[0];
  if (!activeImage) return null;

  return (
    <div className="min-w-0 space-y-3">
      <Dialog>
        <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-secondary">
          <img src={activeImage} alt={`${name} — foto ${selected + 1}`} className="h-full w-full object-contain" />
          <DialogTrigger asChild>
            <Button variant="secondary" size="icon" className="absolute bottom-3 right-3" aria-label="Ampliar foto" title="Ampliar foto">
              <Expand />
            </Button>
          </DialogTrigger>
          {images.length > 1 && (
            <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
              <Button variant="secondary" size="icon" aria-label="Foto anterior" title="Foto anterior" onClick={() => setSelected((selected + images.length - 1) % images.length)}><ChevronLeft /></Button>
              <Button variant="secondary" size="icon" aria-label="Próxima foto" title="Próxima foto" onClick={() => setSelected((selected + 1) % images.length)}><ChevronRight /></Button>
            </div>
          )}
        </div>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="pr-6">{name}</DialogTitle>
          <img src={activeImage} alt={`${name} — foto ${selected + 1} ampliada`} className="max-h-[75dvh] w-full object-contain" />
        </DialogContent>
      </Dialog>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1" aria-label="Fotos do produto">
          {images.map((image, index) => (
            <Button key={image} variant="outline" aria-label={`Ver foto ${index + 1}`} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`h-20 w-16 shrink-0 overflow-hidden rounded-md p-0 ${selected === index ? "border-gold ring-1 ring-gold" : ""}`}>
              <img src={image} alt={`${name} — miniatura ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}