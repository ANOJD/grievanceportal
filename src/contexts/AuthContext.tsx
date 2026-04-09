import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "user" | "admin" | "department";

export type Language = "en" | "hi" | "kn" | "ta";

interface User {
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (name: string, password: string) => { success: boolean; role: UserRole };
  signup: (name: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    login: "Sign In",
    signup: "Create Account",
    name: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    role: "Select Role",
    user: "Citizen",
    admin: "Administrator",
    department: "Department Officer",
    welcome: "Welcome Back",
    welcomeSub: "Sign in to access the grievance portal",
    newHere: "New here?",
    createAccount: "Create an account",
    haveAccount: "Already have an account?",
    signIn: "Sign in",
    getStarted: "Get Started",
    getStartedSub: "Register to submit and track grievances",
    tagline: "AI-Powered Intelligent Grievance Redressal",
    taglineSub: "Empowering citizens with smart, transparent, and efficient public service complaint resolution.",
    feature1: "Smart AI Classification",
    feature1Sub: "Automatic categorization & priority scoring",
    feature2: "Real-Time Tracking",
    feature2Sub: "Track your complaint lifecycle instantly",
    feature3: "Multi-Language Support",
    feature3Sub: "Submit complaints in your preferred language",
    namePlaceholder: "Enter your username",
    passwordPlaceholder: "Enter your password",
    confirmPlaceholder: "Confirm your password",
    passwordMismatch: "Passwords do not match",
    invalidCredentials: "Invalid username or password",
    userExists: "User already exists",
  },
  hi: {
    login: "साइन इन",
    signup: "खाता बनाएं",
    name: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    role: "भूमिका चुनें",
    user: "नागरिक",
    admin: "प्रशासक",
    department: "विभाग अधिकारी",
    welcome: "वापसी पर स्वागत है",
    welcomeSub: "शिकायत पोर्टल तक पहुंचने के लिए साइन इन करें",
    newHere: "नए हैं?",
    createAccount: "एक खाता बनाएं",
    haveAccount: "पहले से खाता है?",
    signIn: "साइन इन करें",
    getStarted: "शुरू करें",
    getStartedSub: "शिकायतें दर्ज और ट्रैक करने के लिए पंजीकरण करें",
    tagline: "एआई-संचालित बुद्धिमान शिकायत निवारण",
    taglineSub: "स्मार्ट, पारदर्शी और कुशल सार्वजनिक सेवा शिकायत समाधान के साथ नागरिकों को सशक्त बनाना।",
    feature1: "स्मार्ट एआई वर्गीकरण",
    feature1Sub: "स्वचालित वर्गीकरण और प्राथमिकता स्कोरिंग",
    feature2: "रीयल-टाइम ट्रैकिंग",
    feature2Sub: "अपनी शिकायत का जीवनचक्र तुरंत ट्रैक करें",
    feature3: "बहु-भाषा समर्थन",
    feature3Sub: "अपनी पसंदीदा भाषा में शिकायत दर्ज करें",
    namePlaceholder: "अपना उपयोगकर्ता नाम दर्ज करें",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    confirmPlaceholder: "अपने पासवर्ड की पुष्टि करें",
    passwordMismatch: "पासवर्ड मेल नहीं खाते",
    invalidCredentials: "अमान्य उपयोगकर्ता नाम या पासवर्ड",
    userExists: "उपयोगकर्ता पहले से मौजूद है",
  },
  kn: {
    login: "ಸೈನ್ ಇನ್",
    signup: "ಖಾತೆ ರಚಿಸಿ",
    name: "ಬಳಕೆದಾರ ಹೆಸರು",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    confirmPassword: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    role: "ಪಾತ್ರ ಆಯ್ಕೆಮಾಡಿ",
    user: "ನಾಗರಿಕ",
    admin: "ನಿರ್ವಾಹಕ",
    department: "ಇಲಾಖೆ ಅಧಿಕಾರಿ",
    welcome: "ಮರಳಿ ಸ್ವಾಗತ",
    welcomeSub: "ಕುಂದುಕೊರತೆ ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ",
    newHere: "ಹೊಸಬರೇ?",
    createAccount: "ಖಾತೆ ರಚಿಸಿ",
    haveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
    signIn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ",
    getStartedSub: "ದೂರುಗಳನ್ನು ಸಲ್ಲಿಸಲು ಮತ್ತು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ನೋಂದಾಯಿಸಿ",
    tagline: "AI-ಚಾಲಿತ ಬುದ್ಧಿವಂತ ಕುಂದುಕೊರತೆ ಪರಿಹಾರ",
    taglineSub: "ಸ್ಮಾರ್ಟ್, ಪಾರದರ್ಶಕ ಮತ್ತು ಸಮರ್ಥ ಸಾರ್ವಜನಿಕ ಸೇವಾ ದೂರು ಪರಿಹಾರದೊಂದಿಗೆ ನಾಗರಿಕರನ್ನು ಸಬಲೀಕರಿಸುವುದು.",
    feature1: "ಸ್ಮಾರ್ಟ್ AI ವರ್ಗೀಕರಣ",
    feature1Sub: "ಸ್ವಯಂಚಾಲಿತ ವರ್ಗೀಕರಣ ಮತ್ತು ಆದ್ಯತೆ ಸ್ಕೋರಿಂಗ್",
    feature2: "ನೈಜ-ಸಮಯ ಟ್ರ್ಯಾಕಿಂಗ್",
    feature2Sub: "ನಿಮ್ಮ ದೂರಿನ ಜೀವನಚಕ್ರವನ್ನು ತಕ್ಷಣ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    feature3: "ಬಹು-ಭಾಷಾ ಬೆಂಬಲ",
    feature3Sub: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯಲ್ಲಿ ದೂರು ಸಲ್ಲಿಸಿ",
    namePlaceholder: "ನಿಮ್ಮ ಬಳಕೆದಾರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    passwordPlaceholder: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
    confirmPlaceholder: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    passwordMismatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ",
    invalidCredentials: "ಅಮಾನ್ಯ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್",
    userExists: "ಬಳಕೆದಾರ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದ್ದಾರೆ",
  },
  ta: {
    login: "உள்நுழை",
    signup: "கணக்கு உருவாக்கு",
    name: "பயனர்பெயர்",
    password: "கடவுச்சொல்",
    confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்து",
    role: "பங்கைத் தேர்ந்தெடு",
    user: "குடிமகன்",
    admin: "நிர்வாகி",
    department: "துறை அதிகாரி",
    welcome: "மீண்டும் வரவேற்கிறோம்",
    welcomeSub: "புகார் போர்ட்டலை அணுக உள்நுழையவும்",
    newHere: "புதியவரா?",
    createAccount: "கணக்கு உருவாக்கவும்",
    haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    signIn: "உள்நுழையவும்",
    getStarted: "தொடங்குங்கள்",
    getStartedSub: "புகார்களை சமர்ப்பிக்கவும் கண்காணிக்கவும் பதிவு செய்யுங்கள்",
    tagline: "AI-இயங்கும் புத்திசாலி குறைதீர்ப்பு",
    taglineSub: "ஸ்மார்ட், வெளிப்படையான மற்றும் திறமையான பொதுச்சேவை புகார் தீர்வுடன் குடிமக்களை வலுப்படுத்துதல்.",
    feature1: "ஸ்மார்ட் AI வகைப்படுத்தல்",
    feature1Sub: "தானியங்கி வகைப்படுத்தல் & முன்னுரிமை மதிப்பீடு",
    feature2: "நிகழ்நேர கண்காணிப்பு",
    feature2Sub: "உங்கள் புகார் வாழ்க்கைச்சுழற்சியை உடனடியாக கண்காணிக்கவும்",
    feature3: "பல மொழி ஆதரவு",
    feature3Sub: "உங்கள் விருப்பமான மொழியில் புகார் சமர்ப்பிக்கவும்",
    namePlaceholder: "உங்கள் பயனர்பெயரை உள்ளிடவும்",
    passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
    confirmPlaceholder: "உங்கள் கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    passwordMismatch: "கடவுச்சொற்கள் பொருந்தவில்லை",
    invalidCredentials: "தவறான பயனர்பெயர் அல்லது கடவுச்சொல்",
    userExists: "பயனர் ஏற்கனவே உள்ளார்",
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

// Simple in-memory user store (frontend only)
const userStore: { name: string; password: string; role: UserRole }[] = [
  { name: "admin", password: "admin123", role: "admin" },
  { name: "user", password: "user123", role: "user" },
  { name: "officer", password: "officer123", role: "department" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>("en");

  const login = useCallback((name: string, password: string) => {
    const found = userStore.find(
      (u) => u.name.toLowerCase() === name.toLowerCase() && u.password === password
    );
    if (found) {
      setUser({ name: found.name, role: found.role });
      return { success: true, role: found.role };
    }
    return { success: false, role: "user" as UserRole };
  }, []);

  const signup = useCallback((name: string, password: string, role: UserRole) => {
    const exists = userStore.find(
      (u) => u.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return false;
    userStore.push({ name, password, role });
    setUser({ name, role });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, language, setLanguage, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useTranslation() {
  const { language } = useAuth();
  return (key: string) => translations[language]?.[key] || translations.en[key] || key;
}
