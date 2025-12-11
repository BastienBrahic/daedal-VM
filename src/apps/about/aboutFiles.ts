// src/apps/about/aboutFiles.ts

export interface AboutFile {
  id: string;
  index: number;        // ordre vertical
  groupLetter: string;  // O, P, Q, R...
  code: string;         // 010, 012...
  number: number;       // 94, 95...
  title: string;        // Titre du fichier
  videoSrc?: string;    // URL vidéo
  
  // --- NOUVELLES PROPRIÉTÉS ---
  isAccessible: boolean;    // Est-ce que l'utilisateur peut voir la vidéo ?
  triggersEndGame: boolean; // Est-ce que la fin de cette vidéo lance le EndScreen ?
}

export const ABOUT_FILES: AboutFile[] = [
  {
    id: 'oil-lamp',
    index: 0,
    groupLetter: 'C',
    code: '006',
    number: 6,
    title: 'Day_01_initialisation.mp4',
    videoSrc: '/videos/1.mp4',
    isAccessible: false,      // ✅ Accessible
    triggersEndGame: false,  // ❌ Ne finit pas le jeu
  },
  {
    id: 'pants',
    index: 1,
    groupLetter: 'D',
    code: '014',
    number: 14,
    title: 'Day_05_training.mp4',
    videoSrc: '/videos/pants.mp4',
    isAccessible: false,     // 🔒 Accès refusé (Exemple)
    triggersEndGame: false,
  },
  {
    id: 'quiet',
    index: 2,
    groupLetter: 'E',
    code: '024',
    number: 24,
    title: 'Day_12_threshold.mp4',
    videoSrc: '/videos/quiet.mp4',
    isAccessible: false,     // 🔒 Accès refusé
    triggersEndGame: false,
  },
  {
    id: 'questions',
    index: 3,
    groupLetter: 'Q',
    code: '047',
    number: 47,
    title: 'Day_19_split.mp4',
    videoSrc: '/videos/2.mp4',
    isAccessible: true,      // ✅ Accessible (2ème vidéo)
    triggersEndGame: true,   // 🏁 CELLE-CI DÉCLENCHE LA FIN DU JEU (Exemple)
  },
  {
    id: 'raccoon',
    index: 4,
    groupLetter: 'U',
    code: '051',
    number: 51,
    title: 'Day_23_denial.mp4',
    videoSrc: '/videos/raccoon.mp4',
    isAccessible: false,     // 🔒 Accès refusé
    triggersEndGame: false,
  },
  {
    id: 'sir',
    index: 5,
    groupLetter: 'W',
    code: '▓▓▓',
    number: 9999,
    title: 'Day_29_Ãee¬¥¥—•‡‡…‰.mp4',
    videoSrc: '/videos/sir.mp4',
    isAccessible: false,     // 🔒 Accès refusé
    triggersEndGame: false,
  },
];