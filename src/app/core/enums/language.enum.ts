// Enum for languages
export enum Language {
  English = "English",
  Hindi = "Hindi",
  Tamil = "Tamil",
  Telugu = "Telugu",
  Kannada = "Kannada",
  Bengali = "Bengali",
  Marathi = "Marathi",
  Gujarati = "Gujarati",
  Urdu = "Urdu",
  Punjabi = "Punjabi"
}

// Enum for proficiency levels
export enum Proficiency {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Professional = "Professional"
}

// Type mapping a language to its proficiency
export interface LanguageEntry {
  language: Language;
  proficiency: Proficiency;
}

// Example: one language with its proficiency
const myLanguages: LanguageEntry[] = [
  { language: Language.English, proficiency: Proficiency.Professional  },
  { language: Language.Hindi, proficiency: Proficiency.Intermediate },
  { language: Language.Tamil, proficiency: Proficiency.Beginner }
];
