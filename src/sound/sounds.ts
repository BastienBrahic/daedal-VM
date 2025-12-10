import { Howl } from 'howler';

export const sound = {
  click: new Howl({
    src: ['/sounds/click.wav'],
    volume: 0.25,
  }),

  hover: new Howl({
    src: ['/sounds/hover.wav'],
    volume: 0.18,
  }),

  windowOpen: new Howl({
    src: ['/sounds/window-open.wav'],
    volume: 0.3,
  }),

  windowClose: new Howl({
    src: ['/sounds/window-close.wav'],
    volume: 0.3,
  }),

  error: new Howl({
    src: ['/sounds/error.wav'],
    volume: 0.32,
  }),

  notification: new Howl({
    src: ['/sounds/notification.wav'],
    volume: 0.28,
  }),

  glitch: new Howl({
    src: ['/sounds/glitch.wav'],
    volume: 0.3,
  }),

  backgroundLoop: new Howl({
    src: ['/sounds/background-loop.mp3'],
    volume: 0.10,    // Ajuste selon l’ambiance
    loop: true,      // 🔁 boucle infinie
  }),

  // NEW: Son de fin
  outro: new Howl({
    src: ['/sounds/OutroJeu.wav'],
    volume: 0, // On commence à 0 pour le fade-in
    loop: true,
  }),
  
};
