'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define translations structure
interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

// NOTE: This is a partial translation for demonstration purposes.
const translations: Translations = {
  // Language Names
  english: { en: 'English', dz: 'English', es: 'English', fr: 'Anglais' },
  dzongkha: { en: 'Dzongkha', dz: 'རྫོང་ཁ', es: 'Dzongkha', fr: 'Dzongkha' },
  spanish: { en: 'Spanish', dz: 'Spanish', es: 'Español', fr: 'Espagnol' },
  french: { en: 'French', dz: 'French', es: 'Francés', fr: 'Français' },

  // Auth Page
  signIn: { en: 'Sign In', dz: 'ནང་བསྐྱོད།', es: 'Iniciar Sesión', fr: 'Se Connecter' },
  signUp: { en: 'Sign Up', dz: 'ཐོ་བཀོད་ནི།', es: 'Registrarse', fr: "S'inscrire" },
  accessDashboard: { en: 'Access your eBhutanza dashboard.', dz: 'ཁྱེད་རང་གི་ eBhutanza འཛིན་སྐྱོང་ལྟེ་བ་ནང་བསྐྱོད།', es: 'Accede a tu panel de eBhutanza.', fr: 'Accédez à votre tableau de bord eBhutanza.' },
  createAccount: { en: 'Create your eBhutanza account to get started.', dz: 'འགོ་བཙུགས་ནིའི་དོན་ལུ་ཁྱེད་རང་གི་ eBhutanza རྩིས་ཐོ་བཟོ།', es: 'Crea tu cuenta de eBhutanza para empezar.', fr: 'Créez votre compte eBhutanza pour commencer.' },
  emailLabel: { en: 'Email', dz: 'གློག་འཕྲིན།', es: 'Correo Electrónico', fr: 'E-mail' },
  passwordLabel: { en: 'Password', dz: 'གསང་ཚིག', es: 'Contraseña', fr: 'Mot de passe' },
  fullNameLabel: { en: 'Full Name', dz: 'མིང་གཏམ།', es: 'Nombre Completo', fr: 'Nom Complet' },
  fullNameGovDocs: { en: 'Must be as per your government-issued documents.', dz: 'ཁྱེད་རང་གི་གཞུང་གིས་བྱིན་མི་ཡིག་ཆ་དང་འཁྲིལ་དགོ།', es: 'Debe coincidir con sus documentos de identidad oficiales.', fr: 'Doit correspondre à vos documents officiels.' },
  passwordMinChars: { en: 'Must be at least 8 characters long.', dz: 'ཉུང་མཐའ་ཡང་ཡིག་འབྲུ་ ༨ དགོ།', es: 'Debe tener al menos 8 caracteres.', fr: 'Doit contenir au moins 8 caractères.' },
  createAccountButton: { en: 'Create Account', dz: 'རྩིས་ཐོ་བཟོ།', es: 'Crear Cuenta', fr: 'Créer un Compte' },

  // Dashboard Layout
  dashboard: { en: 'Dashboard', dz: 'འཛིན་སྐྱོང་ལྟེ་བ།', es: 'Panel', fr: 'Tableau de bord' },
  myApplication: { en: 'My Application', dz: 'ངའི་ཞུ་ཡིག', es: 'Mi Solicitud', fr: 'Ma Demande' },
  aiCompliance: { en: 'AI Compliance', dz: 'AI མཐུན་རྐྱེན།', es: 'Cumplimiento IA', fr: 'Conformité IA' },
  incorporate: { en: 'Incorporate', dz: 'ལས་འཛུགས་བསྐྲུན་པ།', es: 'Incorporar', fr: 'Créer une société' },
  welcomeMessage: { en: 'Joen pa Leg So, {userName}', dz: 'བཀྲ་ཤིས་བདེ་ལེགས་, {userName}', es: 'Bienvenido, {userName}', fr: 'Bienvenue, {userName}' },
  editProfile: { en: 'Edit Profile', dz: 'རང་གི་ལོ་རྒྱུས་ཞུན་དག', es: 'Editar Perfil', fr: 'Modifier le Profil' },
  settings: { en: 'Settings', dz: 'སྒྲིག་སྟངས།', es: 'Ajustes', fr: 'Paramètres' },
  logOut: { en: 'Log Out', dz: 'ཕྱིར་ཐོན།', es: 'Cerrar Sesión', fr: 'Se Déconnecter' },
  
  // Dashboard Page
  welcomeTitle: { en: 'Welcome to eBhutanza. Your digital residency for a borderless world starts here.', dz: 'eBhutanza ལུ་འབྱོན་པ་ལེགས་སོ། ས་མཚམས་མེད་པའི་འཛམ་གླིང་ནང་གི་ཁྱེད་རང་གི་ཌི་ཇི་ཊཱལ་གནས་སྡོད་འདི་ལས་འགོ་བཙུགས།', es: 'Bienvenido a eBhutanza. Tu residencia digital para un mundo sin fronteras empieza aquí.', fr: 'Bienvenue sur eBhutanza. Votre résidence numérique pour un monde sans frontières commence ici.' },
  applicationProgress: { en: 'Application Progress', dz: 'ཞུ་ཡིག་གི་འ پیشرفت', es: 'Progreso de la Solicitud', fr: 'Progression de la Demande' },
  applicationStatus: { en: 'Your application is', dz: 'ཁྱེད་རང་གི་ཞུ་ཡིག་འདི།', es: 'Tu solicitud está', fr: 'Votre demande est' },
  pendingSubmission: { en: 'Pending Submission', dz: '제출 보류 중', es: 'Pendiente de Envío', fr: 'En attente de soumission' },
  inProgress: { en: 'In Progress', dz: 'ལཱ་འབད་བའི་བསྒང་།', es: 'En Progreso', fr: 'En cours' },
  submittedForReview: { en: 'Submitted for Review', dz: 'བསྐྱར་ཞིབ་འབད་ནིའི་དོན་ལུ་བཙུགས་ཡོད།', es: 'Enviado para Revisión', fr: 'Soumis pour Examen' },
  percentComplete: { en: '{progress}% complete', dz: '{progress}% ཚར་ཡོད།', es: '{progress}% completado', fr: '{progress}% terminé' },
  continueApplication: { en: 'Continue Application', dz: 'ཞུ་ཡིག་མུ་མཐུད་འབད།', es: 'Continuar Solicitud', fr: "Continuer la demande" },
  aiComplianceCheck: { en: 'AI Compliance Check', dz: 'AI མཐུན་རྐྱེན་ཞིབ་དཔྱད།', es: 'Verificación de Cumplimiento IA', fr: 'Vérification de Conformité IA' },
  aiComplianceCheckDesc: { en: 'Leverage our AI to proactively identify and address potential compliance issues.', dz: 'མཐུན་རྐྱེན་གྱི་དཀའ་ངལ་ཚུ་སྔོན་མ་ལས་ངོས་འཛིན་དང་སེལ་ཐབས་ལུ་ང་བཅས་ཀྱི་ AI ལག་ལེན་འཐབ།', es: 'Utilice nuestra IA para identificar y abordar proactivamente posibles problemas de cumplimiento.', fr: 'Tirez parti de notre IA pour identifier et résoudre de manière proactive les problèmes de conformité potentiels.' },
  aiComplianceCheckContent: { en: 'Analyze applicant data against compliance and risk metrics to proactively flag issues before submission, saving you time and increasing your chances of approval.', dz: 'ཞུ་ཡིག་མ་བཙུགས་པའི་སྔོན་ལས་ དཀའ་ངལ་ཚུ་སྔོན་མ་ལས་ངོས་འཛིན་འབད་ནི་ལུ་ ཞུ་ཡིག་གི་གནད་ས้อมูลཚུ་ མཐུན་རྐྱེན་དང་ཉེན་ཁའི་ཚད་གཞི་ཚུ་དང་བསྟུན་ཏེ་དབྱེ་ཞིབ་འབད་ནི་ དེ་གིས་ཁྱེད་ཀྱི་དུས་ཚོད་བསྲི་ཚགས་འབད་ཚུགས་པའི་ཁར་ གནང་བ་ཐོབ་པའི་གོ་སྐབས་ཡང་མཐོ་རུ་གཏང་ཚུགས།', es: 'Analice los datos del solicitante con las métricas de cumplimiento y riesgo para marcar proactivamente los problemas antes del envío, ahorrándole tiempo y aumentando sus posibilidades de aprobación.', fr: "Analysez les données des candidats par rapport aux mesures de conformité et de risque pour signaler de manière proactive les problèmes avant la soumission, ce qui vous fait gagner du temps et augmente vos chances d'approbation." },
  runCheck: { en: 'Run Check', dz: 'ཞིབ་དཔྱད་འབད།', es: 'Ejecutar Verificación', fr: 'Lancer la vérification' },
  businessIncorporation: { en: 'Business Incorporation', dz: 'ཚོང་འབྲེལ་ལས་འཛུགས།', es: 'Incorporación de Empresas', fr: "Création d'entreprise" },
  businessIncorporationDesc: { en: 'Seamlessly register your new company once your e-residency is approved.', dz: 'ཁྱེད་རང་གི་ e-residency གནང་བ་ཐོབ་ཚར་བའི་ཤུལ་ལས་ ཁྱེད་རང་གི་ལས་སྡེ་གསརཔ་ཐོ་བཀོད་འབད་ནི་ལུ་ ཐོགས་ཆགས་མེདཔ།', es: 'Registre su nueva empresa sin problemas una vez que se apruebe su residencia electrónica.', fr: 'Enregistrez votre nouvelle entreprise en toute simplicité une fois votre e-résidence approuvée.' },
  businessIncorporationContent: { en: 'Our integration with official registries streamlines the process of establishing your business entity.', dz: 'གཞུང་འབྲེལ་གྱི་ཐོ་བཀོད་འབད་ས་ཚུ་དང་གཅིག་ཁར་ང་བཅས་ཀྱི་མཉམ་འབྲེལ་འདི་གིས་ ཁྱེད་རང་གི་ཚོང་འབྲེལ་གྱི་ངོ་བོ་གཞི་བཙུགས་འབད་ནིའི་ལམ་ལུགས་འདི་ལས་སླ་བཟོ།', es: 'Nuestra integración con los registros oficiales agiliza el proceso de establecimiento de su entidad comercial.', fr: "Notre intégration avec les registres officiels simplifie le processus de création de votre entité commerciale." },
  learnMore: { en: 'Learn More', dz: 'ተጨማሪ ይወቁ', es: 'Saber Más', fr: 'En savoir plus' },

  // Application Page
  personalInfo: { en: 'Personal Information', dz: 'སྒེར་གྱི་གནད་སོ།', es: 'Información Personal', fr: 'Informations Personnelles' },
  personalInfoDesc: { en: 'This information should match your official documents.', dz: 'གནད་སོ་འདི་ཁྱེད་རང་གི་གཞུང་འབྲེལ་ཡིག་ཆ་དང་འཁྲིལ་དགོ།', es: 'Esta información debe coincidir con sus documentos oficiales.', fr: 'Ces informations doivent correspondre à vos documents officiels.' },
  emailAddressLabel: { en: 'Email Address', dz: 'གློག་འཕྲིན་ཁ་བྱང་།', es: 'Dirección de Correo Electrónico', fr: 'Adresse e-mail' },
  countryOfCitizenship: { en: 'Country of Citizenship', dz: 'ዜግነት ያለበት አገር', es: 'País de Ciudadanía', fr: 'Pays de citoyenneté' },
  documentUpload: { en: 'Document Upload (KYC/AML)', dz: 'ཡིག་ཆ་ཕབ་ལེན། (KYC/AML)', es: 'Carga de Documentos (KYC/AML)', fr: 'Téléchargement de documents (KYC/AML)' },
  documentUploadDesc: { en: 'Securely upload a clear, full-page scan of your passport. This will be used for verification.', dz: 'ཁྱེད་རང་གི་ཕྱི་སྐྱོད་ බලපත්‍රයේ පැහැදිලි, සම්පූර්ණ පිටු ස්කෑන් එකක් සුරක්ෂිතව උඩුගත කරන්න. මෙය සත්‍යාපනය සඳහා භාවිතා කරනු ඇත.', es: 'Suba de forma segura un escaneo claro y de página completa de su pasaporte. Se utilizará para verificación.', fr: 'Téléchargez en toute sécurité une numérisation claire et pleine page de votre passeport. Ceci sera utilisé pour la vérification.' },
  passportScan: { en: 'Passport Scan', dz: 'ཕྱི་སྐྱོད་ බලපත්‍ර ස්කෑන්', es: 'Escaneo de Pasaporte', fr: 'Scan du passeport' },
  clickToUpload: { en: 'Click to upload', dz: 'ཕབ་ལེན་འབད་ནིའི་དོན་ལུ་ཨེབ་ནི།', es: 'Haz clic para subir', fr: 'Cliquez pour télécharger' },
  dragAndDrop: { en: 'or drag and drop', dz: 'ཡང་ན་འདྲུད་དེ་བཞག་ནི།', es: 'o arrastra y suelta', fr: 'ou glisser-déposer' },
  fileUploaded: { en: 'File Uploaded', dz: 'ཡིག་སྣོད་ཕབ་ལེན་འབད་ཚར་ཡི།', es: 'Archivo Subido', fr: 'Fichier téléchargé' },
  fileTypes: { en: 'PDF, PNG, JPG (MAX. 5MB)', dz: 'PDF, PNG, JPG (MAX. 5MB)', es: 'PDF, PNG, JPG (MÁX. 5MB)', fr: 'PDF, PNG, JPG (MAX. 5 Mo)' },
  digitalSignature: { en: 'Digital Signature', dz: 'ཌི་ཇི་ཊཱལ་ས་རྟགས།', es: 'Firma Digital', fr: 'Signature numérique' },
  digitalSignatureDesc: { en: 'By typing your full name, you are digitally signing this application and agreeing to our terms and conditions.', dz: 'ཁྱེད་རང་གི་མིང་གཏམ་ཡིག་དཔར་བསྐྲུན་ཏེ་ ཞུ་ཡིག་འདི་ནང་ཌི་ཇི་ཊཱལ་ཐོག་ལས་ས་རྟགས་བཀོད་དེ་ ང་བཅས་ཀྱི་གནས་སྟངས་དང་ཆ་རྐྱེན་ཚུ་དང་མཐུན་པ་ཡོད།', es: 'Al escribir su nombre completo, está firmando digitalmente esta solicitud y aceptando nuestros términos y condiciones.', fr: "En tapant votre nom complet, vous signez numériquement cette demande et acceptez nos termes et conditions." },
  agreementSignature: { en: 'Agreement Signature', dz: 'ስምምነት ፊርማ', es: 'Firma del Acuerdo', fr: "Signature de l'accord" },
  submitApplication: { en: 'Submit Application', dz: 'ཞུ་ཡིག་བཙུགས།', es: 'Enviar Solicitud', fr: 'Soumettre la demande' },
  applicationSubmitted: { en: 'Application Submitted', dz: 'ཞུ་ཡིག་བཙུགས་ཚར་ཡི།', es: 'Solicitud Enviada', fr: 'Demande soumise' },
  applicationSubmittedDesc: { en: 'Your application has been successfully submitted for review.', dz: 'ཁྱེད་རང་གི་ཞུ་ཡིག་བསྐྱར་ཞིབ་འབད་ནིའི་དོན་ལུ་ལེགས་ཤོམ་སྦེ་བཙུགས་ཚར་ཡི།', es: 'Su solicitud ha sido enviada con éxito para su revisión.', fr: 'Votre demande a été soumise avec succès pour examen.' },

  // Compliance Page
  aiPoweredCompliance: { en: 'AI-Powered Compliance & Risk Assessment', dz: 'AI-Powered Compliance & Risk Assessment', es: 'Evaluación de Riesgos y Cumplimiento con IA', fr: "Évaluation de la conformité et des risques optimisée par l'IA" },
  aiPoweredComplianceDesc: { en: 'Enter applicant data to analyze for potential compliance and risk issues. Our AI will provide a summary, flag issues, suggest actions, and determine an overall risk level.', dz: 'མཐུན་རྐྱེན་དང་ཉེན་ཁའི་དཀའ་ངལ་ཡོད་མེད་དབྱེ་ཞིབ་འབད་ནིའི་དོན་ལུ་ ཞུ་ཡིག་གི་གནད་ས้อมูลབཙུགས། ང་བཅས་ཀྱི་ AI གིས་བསྡོམས་བཤད་དང་། དཀའ་ངལ་ཚུ་གསལ་བཀོད། ལཱ་འབད་ཐངས་ཚུ་གི་བསམ་འཆར། སྤྱིར་བཏང་གི་ཉེན་ཁའི་གནས་ཚད་ཚུ་གསལ་བཀོད་འབད་འོང་།', es: 'Ingrese los datos del solicitante para analizar posibles problemas de cumplimiento y riesgo. Nuestra IA proporcionará un resumen, marcará problemas, sugerirá acciones y determinará un nivel de riesgo general.', fr: "Saisissez les données du candidat pour analyser les problèmes potentiels de conformité et de risque. Notre IA fournira un résumé, signalera les problèmes, suggérera des actions et déterminera un niveau de risque global." },
  applicantData: { en: 'Applicant Data', dz: 'ཞུ་ཡིག་གི་གནད་ས้อมูล', es: 'Datos del Solicitante', fr: 'Données du candidat' },
  applicantDataPlaceholder: { en: 'Paste comprehensive data about the applicant, including personal information, business history, and financial details.', dz: 'ཞུ་ཡིག་གི་གནད་ས้อมูลརྒྱ་ཆེ་ས་བཙུགས་ནི་ དེ་ཡང་སྒེར་གྱི་གནད་སོ། ཚོང་འབྲེལ་གྱི་ལོ་རྒྱུས། དངུལ་འབྲེལ་གྱི་གནད་ས้อมูลཚུ་ཚུད།', es: 'Pegue datos completos sobre el solicitante, incluida información personal, historial comercial y detalles financieros.', fr: "Collez des données complètes sur le candidat, y compris des informations personnelles, des antécédents professionnels et des détails financiers." },
  assessRisk: { en: 'Assess Risk', dz: 'ཉེན་ཁ་ערך', es: 'Evaluar Riesgo', fr: 'Évaluer le risque' },
  overallRiskLevel: { en: 'Overall Risk Level', dz: 'སྤྱིར་བཏང་གི་ཉེན་ཁའི་གནས་ཚད།', es: 'Nivel de Riesgo General', fr: "Niveau de risque global" },
  low: { en: 'Low', dz: 'ಕಡಿಮೆ', es: 'Bajo', fr: 'Faible' },
  medium: { en: 'Medium', dz: 'ಮಧ್ಯಮ', es: 'Medio', fr: 'Moyen' },
  high: { en: 'High', dz: 'ಹೆಚ್ಚು', es: 'Alto', fr: 'Élevé' },
  assessmentSummary: { en: 'Assessment Summary', dz: 'བገምገማ සාරාංශය', es: 'Resumen de la Evaluación', fr: "Résumé de l'évaluation" },
  flaggedIssues: { en: 'Flagged Issues', dz: 'ಗುರುತಿಸಲಾದ ಸಮಸ್ಯೆಗಳು', es: 'Problemas Marcados', fr: 'Problèmes signalés' },
  suggestedActions: { en: 'Suggested Actions', dz: 'යෝජිත ක්‍රියාමාර්ග', es: 'Acciones Sugeridas', fr: 'Actions suggérées' },

  // Incorporation Page
  incorporateBusiness: { en: 'Incorporate Your Business', dz: 'ཁྱེད་རང་གི་ཚོང་འབྲེལ་ལས་འཛུགས་བསྐྲུན་པ།', es: 'Incorpore su Negocio', fr: 'Créez votre entreprise' },
  incorporateBusinessDesc: { en: 'Fill in your company details below to begin the incorporation process. This service is available after e-residency approval.', dz: 'ལས་འཛུགས་བསྐྲུན་པའི་ལམ་ལུགས་འགོ་བཙུགས་ནིའི་དོན་ལུ་ ཁྱེད་རང་གི་ལས་སྡེའི་གནད་ས้อมูลཚུ་འོག་ལུ་བཀང་། ཞབས་ཏོག་འདི་ e-residency གནང་བ་ཐོབ་པའི་ཤུལ་ལས་ཐོབ་ཚུགས།', es: 'Complete los detalles de su empresa a continuación para comenzar el proceso de incorporación. Este servicio está disponible después de la aprobación de la residencia electrónica.', fr: "Remplissez les détails de votre entreprise ci-dessous pour commencer le processus de création. Ce service est disponible après l'approbation de la résidence électronique." },
  companyName: { en: 'Proposed Company Name', dz: 'བཏོན་ཡོད་པའི་ལས་སྡེའི་མིང་།', es: 'Nombre de la Empresa Propuesto', fr: "Nom de l'entreprise proposé" },
  companyNameDesc: { en: 'The name will be checked for availability.', dz: 'མིང་འདི་ཐོབ་ཚུགས་ག་མི་ཚུགས་ཞིབ་དཔྱད་འབད་འོང་།', es: 'Se comprobará la disponibilidad del nombre.', fr: 'La disponibilité du nom sera vérifiée.' },
  companyType: { en: 'Company Type', dz: 'ལས་སྡེའི་དབྱེ་བ།', es: 'Tipo de Empresa', fr: "Type d'entreprise" },
  companyTypePlaceholder: { en: 'Select a legal entity type', dz: 'ཁྲིམས་མཐུན་གྱི་ངོ་བོའི་དབྱེ་བ་ཅིག་གདམ་ཁ་རྐྱབས།', es: 'Seleccione un tipo de entidad legal', fr: "Sélectionnez un type d'entité juridique" },
  privateLimited: { en: 'Private Limited Company', dz: 'སྒེར་གྱི་ཚད་འཛིན་ལས་སྡེ།', es: 'Sociedad de Responsabilidad Limitada Privada', fr: 'Société à responsabilité limitée privée' },
  soleProprietorship: { en: 'Sole Proprietorship', dz: 'སྒེར་གྱི་བདག་དབང་།', es: 'Propietario Único', fr: 'Entreprise individuelle' },
  publicLimited: { en: 'Public Limited Company', dz: 'མང་སྡེ་ཚད་འཛིན་ལས་སྡེ།', es: 'Sociedad Anónima Pública', fr: 'Société anonyme publique' },
  businessActivity: { en: 'Principal Business Activity', dz: 'ཚོང་འབྲེལ་གྱི་ལཱ་གཙོ་བོ།', es: 'Actividad Comercial Principal', fr: 'Activité commerciale principale' },
  submitForIncorporation: { en: 'Submit for Incorporation', dz: 'ལས་འཛུགས་བསྐྲུན་ནིའི་དོན་ལུ་བཙུགས།', es: 'Enviar para Incorporación', fr: "Soumettre pour la création d'entreprise" },

  // Profile Page
  editProfileTitle: { en: 'Edit Profile', dz: 'རང་གི་ལོ་རྒྱུས་ཞུན་དག', es: 'Editar Perfil', fr: 'Modifier le Profil' },
  editProfileDesc: { en: 'Manage your account settings and personal information.', dz: 'ཁྱེད་རང་གི་རྩིས་ཐོའི་སྒྲིག་སྟངས་དང་སྒེར་གྱི་གནད་སོ་ཚུ་འཛིན་སྐྱོང་འཐབ།', es: 'Gestiona la configuración de tu cuenta y tu información personal.', fr: "Gérez les paramètres de votre compte et vos informations personnelles." },
  profilePhoto: { en: 'Profile Photo', dz: 'རང་གི་ལོ་རྒྱུས་ཀྱི་པར།', es: 'Foto de Perfil', fr: 'Photo de profil' },
  uploadPhoto: { en: 'Upload Photo', dz: 'པར་ཕབ་ལེན།', es: 'Subir Foto', fr: 'Télécharger une photo' },
  squareImageRecommended: { en: 'A square image is recommended.', dz: 'གྲུ་བཞི་པར་ཅིག་བཏོན་པ་ཅིན་ལེགས།', es: 'Se recomienda una imagen cuadrada.', fr: 'Une image carrée est recommandée.' },
  emailChangeDesc: { en: 'Changing your email requires a secure verification process.', dz: 'ཁྱེད་རང་གི་གློག་འཕྲིན་སོར་བརྗེ་འབད་ནི་ལུ་ ཉེན་སྲུང་ཅན་གྱི་ངོས་འཛིན་ར་སྤྲོད་ཀྱི་ལམ་ལུགས་ཅིག་དགོ།', es: 'Cambiar su correo electrónico requiere un proceso de verificación seguro.', fr: "Changer votre e-mail nécessite un processus de vérification sécurisé." },
  saveChanges: { en: 'Save Changes', dz: 'སོར་བརྗེ་ཚུ་བསྲི་ཚགས་འབད།', es: 'Guardar Cambios', fr: 'Enregistrer les modifications' },

  // Settings Page
  appearance: { en: 'Appearance', dz: 'བཟོ་རྣམ།', es: 'Apariencia', fr: 'Apparence' },
  appearanceDesc: { en: 'Customize the look and feel of your dashboard.', dz: 'ཁྱེད་རང་གི་འཛིན་སྐྱོང་ལྟེ་བའི་བཟོ་རྣམ་དང་ཚོར་སྣང་ཚུ་སྒྲིག་སྟངས་བཟོ།', es: 'Personaliza el aspecto de tu panel.', fr: "Personnalisez l'apparence de votre tableau de bord." },
  darkMode: { en: 'Dark Mode', dz: 'ནག་པོའི་བཟོ་རྣམ།', es: 'Modo Oscuro', fr: 'Mode sombre' },
  darkModeDesc: { en: 'Toggles between a light and dark theme.', dz: 'དཀར་པོའི་བཟོ་རྣམ་དང་ནག་པོའི་བཟོ་རྣམ་གྱི་བར་ན་སོར་བརྗེ་འབད།', es: 'Alterna entre un tema claro y oscuro.', fr: 'Bascule entre un thème clair et un thème sombre.' },
  notificationPrefs: { en: 'Notification Preferences', dz: 'བརྡ་བསྐུལ་གྱི་དགའ་གདམ།', es: 'Preferencias de Notificación', fr: 'Préférences de notification' },
  notificationPrefsDesc: { en: 'Manage how we contact you.', dz: 'ང་བཅས་ཀྱིས་ཁྱེད་ལུ་འབྲེལ་བ་འབད་ཐངས་ཚུ་འཛིན་སྐྱོང་འཐབ།', es: 'Gestiona cómo te contactamos.', fr: 'Gérez la façon dont nous vous contactons.' },
  appUpdates: { en: 'Application Updates', dz: 'ཞུ་ཡིག་གི་གསར་བསྒྱུར།', es: 'Actualizaciones de la Aplicación', fr: "Mises à jour de l'application" },
  appUpdatesDesc: { en: 'Receive email notifications about the status of your applications.', dz: 'ཁྱེད་རང་གི་ཞུ་ཡིག་གི་གནས་སྟངས་སྐོར་ལས་གློག་འཕྲིན་གྱི་བརྡ་བསྐུལ་ཚུ་ལེན།', es: 'Recibe notificaciones por correo electrónico sobre el estado de tus solicitudes.', fr: "Recevez des notifications par e-mail sur l'état de vos demandes." },
  promoEmails: { en: 'Promotional Emails', dz: 'ཁྱབ་བསྒྲགས་ཀྱི་གློག་འཕྲིན།', es: 'Correos Promocionales', fr: 'E-mails promotionnels' },
  promoEmailsDesc: { en: 'Get emails about new features, services, and special offers.', dz: 'ཁྱད་ཆོས་གསརཔ་དང་། ཞབས་ཏོག། དམིགས་བསལ་གྱི་གོ་སྐབས་ཚུ་གི་སྐོར་ལས་གློག་འཕྲིན་ཚུ་ལེན།', es: 'Recibe correos sobre nuevas funciones, servicios y ofertas especiales.', fr: 'Recevez des e-mails sur les nouvelles fonctionnalités, les services et les offres spéciales.' },
  security: { en: 'Security', dz: 'སྲུང་སྐྱོབ།', es: 'Seguridad', fr: 'Sécurité' },
  securityDesc: { en: 'Manage your account security settings.', dz: 'ཁྱེད་རང་གི་རྩིས་ཐོའི་སྲུང་སྐྱོབ་སྒྲིག་སྟངས་ཚུ་འཛིན་སྐྱོང་འཐབ།', es: 'Gestiona la configuración de seguridad de tu cuenta.', fr: "Gérez les paramètres de sécurité de votre compte." },
  twoFactorAuth: { en: 'Two-Factor Authentication (2FA)', dz: 'རིམ་པ་གཉིས་ཀྱི་ངོས་འཛིན་ར་སྤྲོད། (2FA)', es: 'Autenticación de Dos Factores (2FA)', fr: 'Authentification à deux facteurs (2FA)' },
  twoFactorAuthDesc: { en: 'Add an extra layer of security to your account.', dz: 'ཁྱེད་རང་གི་རྩིས་ཐོ་ནང་སྲུང་སྐྱོབ་ཀྱི་རིམ་པ་ተጨማሪ ավելացնել', es: 'Añade una capa extra de seguridad a tu cuenta.', fr: 'Ajoutez une couche de sécurité supplémentaire à votre compte.' },
  setup2FA: { en: 'Set Up 2FA', dz: '2FA སྒྲིག་སྟངས་བཟོ།', es: 'Configurar 2FA', fr: 'Configurer 2FA' },
  changePassword: { en: 'Change Password', dz: 'གསང་ཚིག་སོར་བརྗེ་འབད།', es: 'Cambiar Contraseña', fr: 'Changer le mot de passe' },
  currentPassword: { en: 'Current Password', dz: 'ད་ལྟོའི་གསང་ཚིག', es: 'Contraseña Actual', fr: 'Mot de passe actuel' },
  newPassword: { en: 'New Password', dz: 'གསང་ཚིག་གསརཔ།', es: 'Nueva Contraseña', fr: 'Nouveau mot de passe' },
  confirmNewPassword: { en: 'Confirm New Password', dz: 'གསང་ཚིག་གསརཔ་ངེས་བརྟན་བཟོ།', es: 'Confirmar Nueva Contraseña', fr: 'Confirmer le nouveau mot de passe' },
  updatePassword: { en: 'Update Password', dz: 'གསང་ཚིག་གསར་བསྒྱུར་འབད།', es: 'Actualizar Contraseña', fr: 'Mettre à jour le mot de passe' },
  dataPrivacy: { en: 'Data & Privacy', dz: 'གནད་ས้อมูลདང་སྒེར་དབང།', es: 'Datos y Privacidad', fr: 'Données et confidentialité' },
  dataPrivacyDesc: { en: 'Manage your personal data and account.', dz: 'ཁྱེད་རང་གི་སྒེར་གྱི་གནད་ས้อมูลདང་རྩིས་ཐོ་འཛིན་སྐྱོང་འཐབ།', es: 'Gestiona tus datos personales y tu cuenta.', fr: 'Gérez vos données personnelles et votre compte.' },
  downloadData: { en: 'Download Your Data', dz: 'ཁྱེད་རང་གི་གནད་ས้อมูลཕབ་ལེན།', es: 'Descargar tus Datos', fr: 'Télécharger vos données' },
  downloadDataDesc: { en: 'Get a copy of all your data stored with eBhutanza.', dz: 'eBhutanza ནང་བསགས་ཡོད་པའི་ཁྱེད་རང་གི་གནད་ས้อมูลཆ་མཉམ་གྱི་འདྲ་ཅིག་ལེན།', es: 'Obtén una copia de todos tus datos almacenados en eBhutanza.', fr: "Obtenez une copie de toutes vos données stockées sur eBhutanza." },
  download: { en: 'Download', dz: 'ཕབ་ལེན།', es: 'Descargar', fr: 'Télécharger' },
  deleteAccount: { en: 'Delete Account', dz: 'རྩིས་ཐོ་བཏོན་གཏང།', es: 'Eliminar Cuenta', fr: 'Supprimer le compte' },
  deleteAccountDesc: { en: 'This will permanently delete your account and all associated data. This action cannot be undone.', dz: 'འདི་གིས་ཁྱེད་རང་གི་རྩིས་ཐོ་དང་འབྲེལ་ཡོད་གནད་ས้อมูลཆ་མཉམ་རྦད་དེ་བཏོན་གཏང་འོང་། ལཱ་འདི་སླར་ལོག་འབད་མི་ཚུགས།', es: 'Esto eliminará permanentemente tu cuenta y todos los datos asociados. Esta acción no se puede deshacer.', fr: 'Cela supprimera définitivement votre compte et toutes les données associées. Cette action est irréversible.' },
  delete: { en: 'Delete', dz: 'བཏོན་གཏང།', es: 'Eliminar', fr: 'Supprimer' },
  areYouSure: { en: 'Are you absolutely sure?', dz: 'ཁྱེད་རང་གཏན་གཏན་སྨོནནམ?', es: '¿Estás absolutamente seguro?', fr: 'Êtes-vous absolument sûr ?' },
  areYouSureDesc: { en: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.', dz: 'ལཱ་འདི་སླར་ལོག་འབད་མི་ཚུགས། འདི་གིས་ཁྱེད་རང་གི་རྩིས་ཐོ་རྦད་དེ་བཏོན་གཏང་ཞིནམ་ལས་ང་བཅས་ཀྱི་སར་བར་ལས་ཁྱེད་རང་གི་གནད་ས้อมูลཚུ་ཡང་བཏོན་གཏང་འོང་།', es: 'Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y tus datos de nuestros servidores.', fr: 'Cette action est irréversible. Elle supprimera définitivement votre compte et vos données de nos serveurs.' },
  cancel: { en: 'Cancel', dz: 'རద్దుའབད།', es: 'Cancelar', fr: 'Annuler' },
  continue: { en: 'Continue', dz: 'མུ་མཐུད།', es: 'Continuar', fr: 'Continuer' },
  passwordUpdated: { en: 'Password Updated', dz: 'གསང་ཚིག་གསར་བསྒྱུར་འབད་ཚར་ཡི།', es: 'Contraseña Actualizada', fr: 'Mot de passe mis à jour' },
  passwordUpdatedDesc: { en: 'Your password has been changed successfully.', dz: 'ཁྱེད་རང་གི་གསང་ཚིག་ལེགས་ཤོམ་སྦེ་སོར་བརྗེ་འབད་ཚར་ཡི།', es: 'Tu contraseña ha sido cambiada exitosamente.', fr: 'Votre mot de passe a été modifié avec succès.' },
  themeChanged: { en: 'Theme changed to {theme}', dz: '{theme} ལུ་བཟོ་རྣམ་སོར་བརྗེ་འབད་ཡི།', es: 'Tema cambiado a {theme}', fr: 'Thème changé en {theme}' },
};

const getTranslator = (lang: string) => (key: string, params?: { [key: string]: string | number }) => {
    let text = translations[key]?.[lang] || key;
    if (params) {
        Object.keys(params).forEach(pKey => {
            text = text.replace(`{${pKey}}`, String(params[pKey]));
        });
    }
    return text;
};


type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');

  const t = getTranslator(language);
  
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
