export interface MoveInstruction {
  notation: string;
  face: string;
  direction: string;
  en: {
    title: string;
    description: string;
    tip: string;
  };
  hi: {
    title: string;
    description: string;
    tip: string;
  };
  hinglish: {
    title: string;
    description: string;
    tip: string;
  };
}

export const MOVE_INSTRUCTIONS: Record<string, MoveInstruction> = {
  R: {
    notation: 'R',
    face: 'Right',
    direction: 'Clockwise 90°',
    en: {
      title: 'Right Face Clockwise',
      description: 'Turn the right layer upwards / away from you by 90 degrees.',
      tip: 'Use your right hand index/thumb to push the right layer away from you.',
    },
    hi: {
      title: 'दायां फलक दक्षिणावर्त',
      description: 'दाएं हिस्से को अपनी तरफ से दूर ऊपर की ओर 90 डिग्री घुमाएं।',
      tip: 'दाएं हाथ की अंगुलियों से दाएं भाग को ऊपर की ओर धकेलें।',
    },
    hinglish: {
      title: 'Right Face Clockwise (R)',
      description: 'Right side layer ko upar ki taraf 90 degree ghumao.',
      tip: 'Right haath se right layer ko aage/upar push karo.',
    },
  },
  "R'": {
    notation: "R'",
    face: 'Right',
    direction: 'Counter-Clockwise 90°',
    en: {
      title: 'Right Face Counter-Clockwise',
      description: 'Turn the right layer downwards / toward you by 90 degrees.',
      tip: 'Pull the right layer toward you using your right thumb or finger.',
    },
    hi: {
      title: 'दायां फलक वामावर्त',
      description: 'दाएं हिस्से को अपनी ओर नीचे 90 डिग्री घुमाएं।',
      tip: 'दाएं अंगूठे से दाएं परत को नीचे की तरफ खींचे।',
    },
    hinglish: {
      title: "Right Face Counter-Clockwise (R')",
      description: 'Right layer ko apni taraf neeche 90 degree ghumao.',
      tip: 'Right layer ko neeche pull karo.',
    },
  },
  R2: {
    notation: 'R2',
    face: 'Right',
    direction: '180° Half Turn',
    en: {
      title: 'Right Face Double Turn',
      description: 'Turn the right layer a full 180 degrees (two 90° turns).',
      tip: 'Rotate the right layer halfway around until colors invert.',
    },
    hi: {
      title: 'दायां फलक 180° घुमाव',
      description: 'दाएं हिस्से को पूरा 180 डिग्री (दो बार 90°) घुमाएं।',
      tip: 'दाएं हिस्से को आधा चक्कर घुमाएं।',
    },
    hinglish: {
      title: 'Right Face 180° Turn (R2)',
      description: 'Right layer ko pura 180 degree (2 baar) ghumao.',
      tip: 'Right layer ko do baar turn karo.',
    },
  },

  L: {
    notation: 'L',
    face: 'Left',
    direction: 'Clockwise 90°',
    en: {
      title: 'Left Face Clockwise',
      description: 'Turn the left layer downwards / toward you by 90 degrees.',
      tip: 'Looking directly at the left face, clockwise moves the top towards front.',
    },
    hi: {
      title: 'बायां फलक दक्षिणावर्त',
      description: 'बाएं हिस्से को नीचे की ओर 90 डिग्री घुमाएं।',
      tip: 'बाएं हाथ से बाएं हिस्से को नीचे की ओर मोड़ें।',
    },
    hinglish: {
      title: 'Left Face Clockwise (L)',
      description: 'Left layer ko neeche ki taraf 90 degree ghumao.',
      tip: 'Left layer ko neeche pull karo.',
    },
  },
  "L'": {
    notation: "L'",
    face: 'Left',
    direction: 'Counter-Clockwise 90°',
    en: {
      title: 'Left Face Counter-Clockwise',
      description: 'Turn the left layer upwards / away from you by 90 degrees.',
      tip: 'Push the left layer upwards away from you.',
    },
    hi: {
      title: 'बायां फलक वामावर्त',
      description: 'बाएं हिस्से को ऊपर की ओर 90 डिग्री घुमाएं।',
      tip: 'बाएं हिस्से को ऊपर धकेलें।',
    },
    hinglish: {
      title: "Left Face Counter-Clockwise (L')",
      description: 'Left layer ko upar ki taraf 90 degree ghumao.',
      tip: 'Left layer ko upar push karo.',
    },
  },
  L2: {
    notation: 'L2',
    face: 'Left',
    direction: '180° Half Turn',
    en: {
      title: 'Left Face Double Turn',
      description: 'Turn the left layer a full 180 degrees (two 90° turns).',
      tip: 'Rotate the left layer halfway around.',
    },
    hi: {
      title: 'बायां फलक 180° घुमाव',
      description: 'बाएं हिस्से को पूरा 180 डिग्री घुमाएं।',
      tip: 'बाएं हिस्से को दो बार घुमाएं।',
    },
    hinglish: {
      title: 'Left Face 180° Turn (L2)',
      description: 'Left layer ko pura 180 degree ghumao.',
      tip: 'Left layer ko do baar turn karo.',
    },
  },

  U: {
    notation: 'U',
    face: 'Up',
    direction: 'Clockwise 90°',
    en: {
      title: 'Top Face Clockwise',
      description: 'Turn the top layer to the left by 90 degrees.',
      tip: 'Use your right index finger to pull the top layer from right to left.',
    },
    hi: {
      title: 'ऊपरी फलक दक्षिणावर्त',
      description: 'ऊपरी हिस्से को बाईं ओर 90 डिग्री घुमाएं।',
      tip: 'दाएं हाथ की तर्जनी से ऊपरी परत को बाईं ओर खींचें।',
    },
    hinglish: {
      title: 'Top Layer Clockwise (U)',
      description: 'Upar wali layer ko left ki taraf 90 degree ghumao.',
      tip: 'Right index finger se top layer ko left push/pull karo.',
    },
  },
  "U'": {
    notation: "U'",
    face: 'Up',
    direction: 'Counter-Clockwise 90°',
    en: {
      title: 'Top Face Counter-Clockwise',
      description: 'Turn the top layer to the right by 90 degrees.',
      tip: 'Use your left index finger to flick the top layer from left to right.',
    },
    hi: {
      title: 'ऊपरी फलक वामावर्त',
      description: 'ऊपरी हिस्से को दाईं ओर 90 डिग्री घुमाएं।',
      tip: 'बाएं हाथ की तर्जनी से ऊपरी हिस्से को दाईं ओर घुमाएं।',
    },
    hinglish: {
      title: "Top Layer Counter-Clockwise (U')",
      description: 'Upar wali layer ko right ki taraf 90 degree ghumao.',
      tip: 'Left index finger se top layer ko right ki taraf flick karo.',
    },
  },
  U2: {
    notation: 'U2',
    face: 'Up',
    direction: '180° Half Turn',
    en: {
      title: 'Top Face Double Turn',
      description: 'Turn the top layer 180 degrees (two 90° turns).',
      tip: 'Double flick the top layer with your right index and middle fingers.',
    },
    hi: {
      title: 'ऊपरी फलक 180° घुमाव',
      description: 'ऊपरी परत को 180 डिग्री घुमाएं।',
      tip: 'ऊपरी परत को आधा घुमाव दें।',
    },
    hinglish: {
      title: 'Top Layer 180° Turn (U2)',
      description: 'Top layer ko pura 180 degree ghumao.',
      tip: 'Top layer ko do baar 90° turn karo.',
    },
  },

  D: {
    notation: 'D',
    face: 'Down',
    direction: 'Clockwise 90°',
    en: {
      title: 'Bottom Face Clockwise',
      description: 'Turn the bottom layer to the right by 90 degrees.',
      tip: 'Use your left ring finger to push the bottom layer to the right.',
    },
    hi: {
      title: 'निचला फलक दक्षिणावर्त',
      description: 'निचले हिस्से को दाईं ओर 90 डिग्री घुमाएं।',
      tip: 'निचली परत को दाईं ओर मोड़ें।',
    },
    hinglish: {
      title: 'Bottom Layer Clockwise (D)',
      description: 'Neeche wali layer ko right ki taraf 90 degree ghumao.',
      tip: 'Bottom layer ko right side turn karo.',
    },
  },
  "D'": {
    notation: "D'",
    face: 'Down',
    direction: 'Counter-Clockwise 90°',
    en: {
      title: 'Bottom Face Counter-Clockwise',
      description: 'Turn the bottom layer to the left by 90 degrees.',
      tip: 'Use your right ring finger to push the bottom layer to the left.',
    },
    hi: {
      title: 'निचला फलक वामावर्त',
      description: 'निचले हिस्से को बाईं ओर 90 डिग्री घुमाएं।',
      tip: 'निचली परत को बाईं ओर मोड़ें।',
    },
    hinglish: {
      title: "Bottom Layer Counter-Clockwise (D')",
      description: 'Neeche wali layer ko left ki taraf 90 degree ghumao.',
      tip: 'Bottom layer ko left side turn karo.',
    },
  },
  D2: {
    notation: 'D2',
    face: 'Down',
    direction: '180° Half Turn',
    en: {
      title: 'Bottom Face Double Turn',
      description: 'Turn the bottom layer 180 degrees.',
      tip: 'Rotate the bottom layer halfway around.',
    },
    hi: {
      title: 'निचला फलक 180° घुमाव',
      description: 'निचली परत को पूरा 180 डिग्री घुमाएं।',
      tip: 'निचली परत को दो बार घुमाएं।',
    },
    hinglish: {
      title: 'Bottom Layer 180° Turn (D2)',
      description: 'Bottom layer ko 180 degree ghumao.',
      tip: 'Bottom layer ko do baar 90° turn karo.',
    },
  },

  F: {
    notation: 'F',
    face: 'Front',
    direction: 'Clockwise 90°',
    en: {
      title: 'Front Face Clockwise',
      description: 'Turn the front face clockwise (like turning a steering wheel to the right) by 90 degrees.',
      tip: 'Push the top-right corner of the front face down with your right index finger.',
    },
    hi: {
      title: 'सामने का फलक दक्षिणावर्त',
      description: 'सामने वाले हिस्से को घड़ी की सुई की दिशा में 90 डिग्री घुमाएं।',
      tip: 'स्टीयरिंग व्हील की तरह दाईं ओर घुमाएं।',
    },
    hinglish: {
      title: 'Front Face Clockwise (F)',
      description: 'Front face ko clock ki disha mein right ki taraf 90 degree ghumao.',
      tip: 'Steering wheel ki tarah right turn karo.',
    },
  },
  "F'": {
    notation: "F'",
    face: 'Front',
    direction: 'Counter-Clockwise 90°',
    en: {
      title: 'Front Face Counter-Clockwise',
      description: 'Turn the front face counter-clockwise by 90 degrees.',
      tip: 'Push the top-left corner of the front face down with your left index finger.',
    },
    hi: {
      title: 'सामने का फलक वामावर्त',
      description: 'सामने वाले हिस्से को घड़ी की विपरीत दिशा में 90 डिग्री घुमाएं।',
      tip: 'स्टीयरिंग व्हील की तरह बाईं ओर घुमाएं।',
    },
    hinglish: {
      title: "Front Face Counter-Clockwise (F')",
      description: 'Front face ko ulti clock ki disha mein 90 degree ghumao.',
      tip: 'Steering wheel ki tarah left turn karo.',
    },
  },
  F2: {
    notation: 'F2',
    face: 'Front',
    direction: '180° Half Turn',
    en: {
      title: 'Front Face Double Turn',
      description: 'Turn the front face a full 180 degrees.',
      tip: 'Rotate the front face halfway around.',
    },
    hi: {
      title: 'सामने का फलक 180° घुमाव',
      description: 'सामने वाले हिस्से को पूरा 180 डिग्री घुमाएं।',
      tip: 'सामने वाले हिस्से को आधा चक्कर घुमाएं।',
    },
    hinglish: {
      title: 'Front Face 180° Turn (F2)',
      description: 'Front face ko 180 degree ghumao.',
      tip: 'Front face ko 2 baar turn karo.',
    },
  },

  B: {
    notation: 'B',
    face: 'Back',
    direction: 'Clockwise 90°',
    en: {
      title: 'Back Face Clockwise',
      description: 'Looking directly at the back, turn the back face clockwise by 90 degrees.',
      tip: 'Turn the back face with your index or ring finger.',
    },
    hi: {
      title: 'पिछला फलक दक्षिणावर्त',
      description: 'पीछे वाले हिस्से को दक्षिणावर्त 90 डिग्री घुमाएं।',
      tip: 'पीछे की परत को दाईं ओर घुमाएं।',
    },
    hinglish: {
      title: 'Back Face Clockwise (B)',
      description: 'Peeche wali layer ko clockwise 90 degree ghumao.',
      tip: 'Back layer ko clock ki direction mein ghumao.',
    },
  },
  "B'": {
    notation: "B'",
    face: 'Back',
    direction: 'Counter-Clockwise 90°',
    en: {
      title: 'Back Face Counter-Clockwise',
      description: 'Looking directly at the back, turn the back face counter-clockwise by 90 degrees.',
      tip: 'Turn the back face counter-clockwise.',
    },
    hi: {
      title: 'पिछला फलक वामावर्त',
      description: 'पीछे वाले हिस्से को वामावर्त 90 डिग्री घुमाएं।',
      tip: 'पीछे की परत को बाईं ओर घुमाएं।',
    },
    hinglish: {
      title: "Back Face Counter-Clockwise (B')",
      description: 'Peeche wali layer ko counter-clockwise 90 degree ghumao.',
      tip: 'Back layer ko ulti disha mein ghumao.',
    },
  },
  B2: {
    notation: 'B2',
    face: 'Back',
    direction: '180° Half Turn',
    en: {
      title: 'Back Face Double Turn',
      description: 'Turn the back face a full 180 degrees.',
      tip: 'Rotate the back face halfway around.',
    },
    hi: {
      title: 'पिछला फलक 180° घुमाव',
      description: 'पीछे वाले हिस्से को पूरा 180 डिग्री घुमाएं।',
      tip: 'पीछे की परत को दो बार घुमाएं।',
    },
    hinglish: {
      title: 'Back Face 180° Turn (B2)',
      description: 'Peeche wali layer ko 180 degree ghumao.',
      tip: 'Back layer ko do baar turn karo.',
    },
  },
};

export function getMoveInstruction(move: string, lang: 'en' | 'hi' | 'hinglish' = 'en'): MoveInstruction {
  const normalized = move.trim();
  const instruction = MOVE_INSTRUCTIONS[normalized];
  if (instruction) return instruction;

  return {
    notation: normalized,
    face: normalized[0] || 'Unknown',
    direction: 'Turn',
    en: {
      title: `Move ${normalized}`,
      description: `Perform move ${normalized} on your cube.`,
      tip: 'Match your physical cube to the 3D model.',
    },
    hi: {
      title: `चाल ${normalized}`,
      description: `अपने क्यूब पर चाल ${normalized} करें।`,
      tip: 'अपने क्यूब को 3D मॉडल से मिलाएं।',
    },
    hinglish: {
      title: `Move ${normalized}`,
      description: `Apne physical cube par move ${normalized} apply karo.`,
      tip: 'Apne cube ko screen wale 3D cube se match karo.',
    },
  };
}
