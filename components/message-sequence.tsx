"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = {
  message: string;
  showPhoto?: boolean;
  buttonLabel: string;
};

const steps: Step[] = [
  {
    message: "Hola Inés, alguien te extraña muchísimo",
    buttonLabel: "Continuar",
  },
  {
    message: "¿Adivinas quién es?",
    buttonLabel: "Continuar",
  },
  {
    message:
      "Te daré algunas pistas: tiene cuatro patitas, es pequeñita y cada día espera volver a verte",
    buttonLabel: "Continuar",
  },
  {
    message: "De seguro ya adivinaste jeje (o tal vez no)",
    buttonLabel: "¿Quién podrá ser?",
  },
  {
    message: "Es... Tenshii :D",
    showPhoto: true,
    buttonLabel: "¿Empezar de nuevo?",
  },
];

export function MessageSequence() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function startMusicIfNeeded() {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.volume = 0.4;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }

  useEffect(() => {
    if (!step.showPhoto) return;

    const duration = 0.5; // 3 minutos
    const end = Date.now() + duration;
    const colors = ["#2d6a4f", "#40916c", "#95d5b2", "#ffffff", "#f6c2c9"];

    const frame = () => {
      confetti({
        particleCount: 500,
        angle: 60,
        spread: 60,
        startVelocity: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 500,
        angle: 120,
        spread: 60,
        startVelocity: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Estallido inicial grande
    confetti({
      particleCount: 500,
      spread: 1000,
      origin: { y: 0.6 },
      colors,
    });

    // Estallidos centrales periódicos para que dure más
    const burst = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(burst);
        return;
      }
      confetti({
        particleCount: 500,
        spread: 500,
        startVelocity: 35,
        origin: { y: 0.5 },
        colors,
        scalar: 1.1,
      });
    }, 900);

    frame();

    return () => clearInterval(burst);
  }, [step.showPhoto, index]);

  function handleClick() {
    startMusicIfNeeded();
    setIndex((prev) => (prev + 1) % steps.length);
  }

  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-background">
      {/* Borde de hojas tropicales */}
      <Image
        src="/images/leaf-border.png"
        alt=""
        fill
        priority
        aria-hidden="true"
        className="object-cover"
      />

      {/* Contenido central */}
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-6 py-16">
        <div
          key={index}
          className="flex w-full max-w-md animate-in fade-in slide-in-from-bottom-6 zoom-in-95 flex-col items-center gap-4 duration-700 ease-out"
        >
          {step.showPhoto ? (
            <div className="animate-in fade-in zoom-in-50 spin-in-12 animate-glow overflow-hidden rounded-full border-4 border-card ring-2 ring-primary/50 duration-700">
              <Image
                src="/images/tenshii.png"
                alt="Tenshii, una perrita pequeña y adorable"
                width={540}
                height={540}
                className="h-48 w-48 object-cover sm:h-60 sm:w-60"
              />
            </div>
          ) : null}

          <div className="animate-in fade-in slide-in-from-bottom-4 w-full rounded-2xl border border-border bg-card/95 px-6 py-7 text-center shadow-md backdrop-blur-sm delay-150 duration-700 fill-mode-both">
            <p className="text-balance text-lg font-medium leading-relaxed text-card-foreground sm:text-xl">
              {step.message}
            </p>
          </div>

          <Button
            onClick={handleClick}
            className="animate-in fade-in zoom-in-90 rounded-full px-8 text-primary-foreground shadow-sm transition-transform delay-300 duration-500 fill-mode-both hover:scale-105 active:scale-95"
          >
            {step.buttonLabel}
          </Button>

          {/* Perrito en pixeles bailando, centrado debajo de la caja */}
          {isLast ? (
            <Image
              src="/images/pixel-dog.png"
              alt="Perrito en pixeles bailando"
              width={160}
              height={160}
              className="mt-8 h-32 w-32 animate-bounce rounded-full border-2 border-white/10 drop-shadow-md [image-rendering:pixelated] sm:mt-10 sm:h-40 sm:w-40"
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}
