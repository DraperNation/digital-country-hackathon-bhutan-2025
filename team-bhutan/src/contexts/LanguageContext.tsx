import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'dz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.features': 'Features',
    'nav.kyc': 'KYC / Onboarding',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.register': 'Begin Journey',
    
    // Common
    'common.welcome': 'Welcome',
    'common.loading': 'Loading...',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    
    // Home Page
    'home.title': 'Become a Digital Resident of Bhutan',
    'home.subtitle': 'Global entrepreneurship. Himalayan trust. Join the world\'s happiest nation and access international business opportunities from the mystical Dragon Kingdom.',
    'home.cta.kyc': 'Start KYC Verification',
    'home.cta.explore': 'Explore Benefits',
    
    // Dashboard
    'dashboard.title': 'Welcome',
    'dashboard.subtitle': 'Manage your Bhutan eResidency account and services.',
    'dashboard.kyc.title': 'Identity Verification',
    'dashboard.kyc.complete': 'Complete Your Verification',
    'dashboard.kyc.pending': 'Under Review',
    'dashboard.kyc.verified': 'Verification Complete',
    'dashboard.wallet.title': 'Polygon Wallet',
    'dashboard.wallet.connect': 'Connect MetaMask',
    'dashboard.wallet.disconnect': 'Disconnect',
    
    // KYC
    'kyc.title': 'Identity Verification',
    'kyc.subtitle': 'Complete your KYC verification to access all eResidency services.',
    'kyc.step.personal': 'Personal Info',
    'kyc.step.address': 'Address',
    'kyc.step.documents': 'Documents',
    'kyc.step.selfie': 'Selfie',
    'kyc.camera.activate': 'Activate Camera',
    'kyc.camera.capture': 'Capture',
    'kyc.camera.retake': 'Retake',
    'kyc.camera.confirm': 'Confirm',
    
    // Business Services
    'business.title': 'Business Services',
    'business.subtitle': 'Comprehensive business services to help you establish, grow, and manage your company in the Kingdom of Bhutan and beyond.',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.features': 'विशेषताएं',
    'nav.kyc': 'केवाईसी / ऑनबोर्डिंग',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    'nav.register': 'यात्रा शुरू करें',
    
    // Common
    'common.welcome': 'स्वागत',
    'common.loading': 'लोड हो रहा है...',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.save': 'सेव करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.download': 'डाउनलोड',
    'common.upload': 'अपलोड',
    
    // Home Page
    'home.title': 'भूटान के डिजिटल निवासी बनें',
    'home.subtitle': 'वैश्विक उद्यमिता। हिमालयी विश्वास। दुनिया के सबसे खुश राष्ट्र में शामिल हों और रहस्यमय ड्रैगन किंगडम से अंतर्राष्ट्रीय व्यापारिक अवसरों तक पहुंच प्राप्त करें।',
    'home.cta.kyc': 'केवाईसी सत्यापन शुरू करें',
    'home.cta.explore': 'लाभ देखें',
    
    // Dashboard
    'dashboard.title': 'स्वागत',
    'dashboard.subtitle': 'अपने भूटान ई-रेजीडेंसी खाते और सेवाओं का प्रबंधन करें।',
    'dashboard.kyc.title': 'पहचान सत्यापन',
    'dashboard.kyc.complete': 'अपना सत्यापन पूरा करें',
    'dashboard.kyc.pending': 'समीक्षाधीन',
    'dashboard.kyc.verified': 'सत्यापन पूर्ण',
    'dashboard.wallet.title': 'पॉलीगॉन वॉलेट',
    'dashboard.wallet.connect': 'मेटामास्क कनेक्ट करें',
    'dashboard.wallet.disconnect': 'डिस्कनेक्ट करें',
    
    // KYC
    'kyc.title': 'पहचान सत्यापन',
    'kyc.subtitle': 'सभी ई-रेजीडेंसी सेवाओं तक पहुंच के लिए अपना केवाईसी सत्यापन पूरा करें।',
    'kyc.step.personal': 'व्यक्तिगत जानकारी',
    'kyc.step.address': 'पता',
    'kyc.step.documents': 'दस्तावेज',
    'kyc.step.selfie': 'सेल्फी',
    'kyc.camera.activate': 'कैमरा सक्रिय करें',
    'kyc.camera.capture': 'कैप्चर करें',
    'kyc.camera.retake': 'फिर से लें',
    'kyc.camera.confirm': 'पुष्टि करें',
    
    // Business Services
    'business.title': 'व्यापारिक सेवाएं',
    'business.subtitle': 'भूटान राज्य और उससे आगे अपनी कंपनी स्थापित करने, बढ़ाने और प्रबंधित करने में आपकी सहायता के लिए व्यापक व्यापारिक सेवाएं।',
  },
  dz: {
    // Navigation
    'nav.home': 'ཁྱིམ།',
    'nav.about': 'ང་ཚོའི་སྐོར།',
    'nav.features': 'ཁྱད་ཆོས།',
    'nav.kyc': 'ཀེ་ཝའི་སི / ཐོ་འགོད།',
    'nav.dashboard': 'ཌེཤ་བོརཌ།',
    'nav.login': 'ནང་འཇུག',
    'nav.logout': 'ཕྱིར་འབུད།',
    'nav.register': 'འགྲུལ་བཞུད་འགོ་བཙུགས།',
    
    // Common
    'common.welcome': 'དགའ་བསུ།',
    'common.loading': 'འཇུག་བཞིན་པ།',
    'common.submit': 'འབུལ་བ།',
    'common.cancel': 'འདོར་བ།',
    'common.next': 'རྗེས་མ།',
    'common.previous': 'སྔོན་མ།',
    'common.save': 'ཉར་ཚགས།',
    'common.delete': 'སུབ་པ།',
    'common.edit': 'རྩོམ་སྒྲིག',
    'common.view': 'ལྟ་བ།',
    'common.download': 'ཕབ་ལེན།',
    'common.upload': 'ཡར་འཇུག',
    
    // Home Page
    'home.title': 'འབྲུག་གི་ཌིཇི་ཊལ་གནས་ཡུལ་བ་ཞིག་ཆགས།',
    'home.subtitle': 'འཛམ་གླིང་གི་ལག་རྩལ། ཧི་མ་ལ་ཡའི་ཡིད་ཆེས། འཛམ་གླིང་གི་སྐྱིད་པོ་ཤོས་ཀྱི་རྒྱལ་ཁབ་ལ་འཛུལ་ཞུགས་ཤིག་དང་གསང་བའི་འབྲུག་རྒྱལ་ཁབ་ནས་རྒྱལ་སྤྱིའི་ཚོང་ལས་གོ་སྐབས་ལ་ཐོབ་ཐང་ཐོབ།',
    'home.cta.kyc': 'ཀེ་ཝའི་སི་བདེན་དཔྱད་འགོ་བཙུགས།',
    'home.cta.explore': 'ཕན་ཐོགས་ལ་ལྟ།',
    
    // Dashboard
    'dashboard.title': 'དགའ་བསུ།',
    'dashboard.subtitle': 'ཁྱེད་རང་གི་འབྲུག་གི་ཨི་རེ་སི་ཌེན་སི་རྩིས་ཁྲ་དང་ཞབས་ཏོག་བཀོལ་སྤྱོད།',
    'dashboard.kyc.title': 'ངོ་བོ་བདེན་དཔྱད།',
    'dashboard.kyc.complete': 'ཁྱེད་རང་གི་བདེན་དཔྱད་མཇུག་སྒྲིལ།',
    'dashboard.kyc.pending': 'བསྐྱར་ཞིབ་འོག',
    'dashboard.kyc.verified': 'བདེན་དཔྱད་མཇུག་སྒྲིལ།',
    'dashboard.wallet.title': 'པོ་ལི་གོན་ཕོ་བ།',
    'dashboard.wallet.connect': 'མེ་ཊ་མཱསཀ་སྦྲེལ།',
    'dashboard.wallet.disconnect': 'འབྲེལ་མེད།',
    
    // KYC
    'kyc.title': 'ངོ་བོ་བདེན་དཔྱད།',
    'kyc.subtitle': 'ཨི་རེ་སི་ཌེན་སི་ཞབས་ཏོག་ཚང་མར་ཐོབ་ཐང་ཐོབ་པའི་ཆེད་དུ་ཁྱེད་རང་གི་ཀེ་ཝའི་སི་བདེན་དཔྱད་མཇུག་སྒྲིལ།',
    'kyc.step.personal': 'གང་ཟག་གི་ཆ་འཕྲིན།',
    'kyc.step.address': 'ཁྱིམ་ཡུལ།',
    'kyc.step.documents': 'ཡིག་ཆ།',
    'kyc.step.selfie': 'རང་པར།',
    'kyc.camera.activate': 'པར་ཆས་སྤེལ།',
    'kyc.camera.capture': 'འཛིན་པ།',
    'kyc.camera.retake': 'ཡང་བསྐྱར་ལེན།',
    'kyc.camera.confirm': 'ངེས་པར།',
    
    // Business Services
    'business.title': 'ཚོང་ལས་ཞབས་ཏོག',
    'business.subtitle': 'འབྲུག་རྒྱལ་ཁབ་དང་དེ་ལས་ཕར་ཁྱེད་རང་གི་ཚོང་ལས་གཞི་འདེགས་པ་དང་། རྒྱ་སྐྱེད། དོ་དམ་བྱེད་པར་རོགས་རམ་བྱེད་པའི་ཚོང་ལས་ཞབས་ཏོག་ཡོངས་རྫོགས།',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Update document language attribute for proper font rendering
    document.documentElement.lang = lang;
    
    // Apply language-specific classes
    document.documentElement.classList.remove('lang-en', 'lang-hi', 'lang-dz');
    document.documentElement.classList.add(`lang-${lang}`);
  };

  // Set initial language attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.classList.add(`lang-${language}`);
  }, []);

  const t = (key: string): string => {
    const translation = translations[language]?.[key as keyof typeof translations[typeof language]];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      <div lang={language}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};