/**
 * TECHPATH — COMPREHENSIVE MULTILINGUAL & RTL LOCALIZATION SYSTEM
 * Supports 51 Global Languages with Native Unicode Typography & Bi-Directional (RTL) Layouts
 */

import { APP_CONFIG } from '../config.js';
import { learningContext } from '../context/LearningContext.js';

// Canonical English Master Dictionary (Fallback Baseline)
const EN_MASTER = {
  // Navigation & Core Modules
  dashboard: 'Command Dashboard',
  learnhub: 'LearnHub & Subjects',
  model_3d: '3D Engineering Explorer',
  skills: 'Skills Matrix & Gaps',
  career: 'Career Trajectories',
  projects: 'Engineering Capstones',
  exams: 'Exams & Placements',
  mock_interview: 'Mock Interview Studio',
  pdf_analyzer: 'PDF & Notes Analyzer',
  doubt_solver: 'AI Doubt Solver',
  library: 'My Resource Library',
  reviews: 'Student Reviews',
  contact: 'Contact & Support',
  settings: 'Settings',
  security: 'Security Center',
  preferences: 'Preferences',
  reviews: 'Reviews',
  help_center: 'Help Center',
  contact_us: 'Contact Us',
  support_tickets: 'Support Tickets',
  faq: 'FAQ',
  privacy_data: 'Privacy & Data',
  cookie_preferences: 'Cookie Preferences',
  terms_of_use: 'Terms of Use',
  terms_of_service: 'Terms of Use',
  privacy_policy: 'Privacy Policy',
  ai_disclaimer: 'AI Disclaimer',
  educational_disclaimer: 'Educational Disclaimer',
  copyright_policy: 'Copyright Policy',
  upload_policy: 'Upload Policy',
  data_retention: 'Data Retention',
  data_deletion_request: 'Data Deletion Request',
  account_deletion: 'Account Deletion',
  profile: 'Profile',
  connect: 'TechPath Connect',
  friends: 'My Friends',
  friend_requests: 'Friend Requests',
  chat: 'Student Messages',
  classes: 'TechPath Classes',
  my_classes: 'My Classes',
  teacher_studio: 'Teacher Studio',
  book_class: 'Book Class',
  classroom: 'Interactive Classroom',
  quiz_league: 'Monthly Quiz League',
  practice_center: 'Practice Center',
  exam_center: 'Exam Center & Prep',
  pyqs: 'Previous Year Questions',
  my_exams: 'My Target Exams',
  interview_prep: 'Interview Preparation & Studio',
  search_placeholder: 'Global Telemetry Search (Ctrl + K)...',

  // TechPath Connect & Marketplace
  connect_sub: 'Discover & collaborate with engineering peers in your branch',
  send_request: 'Send Friend Request',
  cancel_request: 'Cancel Request',
  accept_request: 'Accept Request',
  reject_request: 'Reject Request',
  remove_friend: 'Remove Friend',
  send_message: 'Send Message',
  user_id_label: 'TechPath ID',
  copy_id: 'Copy ID',
  copied: 'Copied!',
  tell_about_yourself: 'Tell other students a little about yourself',
  block_user: 'Block User',
  report_user: 'Report User',
  no_peers_found: 'No engineering peers found matching your criteria.',
  search_peers: 'Search peers by name, ID, skills, or bio...',

  // Actions & Buttons
  sign_in: 'Sign In',
  sign_up: 'Create Account',
  continue_google: 'Continue with Google',
  logout: 'Sign Out',
  solve: 'Solve Question',
  clear: 'Clear',
  copy_answer: 'Copy Answer',
  copy_code: 'Copy Code',
  regenerate: 'Regenerate',
  explain_simpler: 'Explain Simpler',
  explain_detail: 'Explain in Detail',
  save_library: 'Save to Library',
  submit: 'Submit Response',
  cancel: 'Cancel',
  loading: 'Processing Telemetry...',
  view_english: 'View in English',
  retry: 'Retry',
  browse: 'Browse',
  upload_image: 'Upload Image / Diagram',
  take_photo: 'Capture Photo',

  // Auth & Titles
  welcome_back: 'Welcome Back',
  welcome_subtitle: 'Sign in to continue your engineering journey.',
  create_account_title: 'Create Your Account',
  create_account_sub: 'Join thousands of engineering students on TechPath.',
  forgot_pw: 'Forgot password?',
  remember_me: 'Remember me',
  consent_label: 'I agree to the Terms of Use and Privacy Policy.',

  // Doubt Solver
  doubt_solver_title: 'AI Doubt Solver by TechPath',
  doubt_solver_sub: 'Type, paste, or upload mathematical problems, schematics, or code in C, C++, Java, and Python.',
  doubt_input_placeholder: 'Type your technical question or paste algorithmic code/problem statement...',
  doubt_step1: 'Analyzing question and input telemetry...',
  doubt_step2: 'Identifying engineering domain and core principles...',
  doubt_step3: 'Executing step-by-step mathematical & architectural derivation...',
  doubt_final_answer: 'Final Solution & Verification',
  doubt_concept: 'Underlying Engineering Concept',
  image_unreadable: 'Image quality is too low to reliably read the question. Please upload a clearer image.',

  // Common Empty & Loading States
  branch_isolation_notice: 'Content for this branch is currently being prepared.',
  empty_state_title: 'No items available yet',
  empty_state_desc: 'Check back shortly or explore recommended modules.'
};

// 51 Languages Dictionaries
const DICTIONARIES = {
  en: EN_MASTER,

  // Indic Languages
  te: {
    dashboard: 'కమాండ్ డాష్‌బోర్డ్', learnhub: 'లెర్న్‌హబ్ & సబ్జెక్టులు', model_3d: '3D ఇంజనీరింగ్ ఎక్స్‌ప్లోరర్',
    skills: 'నైపుణ్యాల మాత్రిక', career: 'కెరీర్ మార్గాలు', projects: 'ఇంజనీరింగ్ ప్రాజెక్ట్‌లు',
    exams: 'పరీక్షల తయారీ', mock_interview: 'మాక్ ఇంటర్వ్యూ స్టూడియో', pdf_analyzer: 'పిడిఎఫ్ ఎనలైజర్',
    doubt_solver: 'AI సందేహ నివారణి', library: 'వనరుల లైబ్రరీ', reviews: 'విద్యార్థుల సమీక్షలు',
    contact: 'సంప్రదించండి & మద్దతు', settings: 'సెట్టింగ్‌లు', search_placeholder: 'శోధించండి...',
    sign_in: 'లాగిన్ అవ్వండి', sign_up: 'ఖాతా సృష్టించండి', continue_google: 'గూగుల్‌తో కొనసాగండి',
    solve: 'పరిష్కరించండి', copy_code: 'కోడ్ కాపీ చేయండి', doubt_solver_title: 'TechPath AI సందేహ నివారణి'
  },
  hi: {
    dashboard: 'कमांड डैशबोर्ड', learnhub: 'लर्नहब और विषय', model_3d: '3D इंजीनियरिंग एक्सप्लोरर',
    skills: 'कौशल मैट्रिक्स और अंतराल', career: 'करियर पथ', projects: 'इंजीनियरिंग प्रोजेक्ट्स',
    exams: 'परीक्षा और प्लेसमेंट', mock_interview: 'मॉक इंटरव्यू स्टूडियो', pdf_analyzer: 'पीडीएफ विश्लेषक',
    doubt_solver: 'एआई संदेह निवारक', library: 'संसाधन पुस्तकालय', reviews: 'छात्र समीक्षाएं',
    contact: 'संपर्क और सहायता', settings: 'सुरक्षा और प्राथमिकताएं', search_placeholder: 'खोजें...',
    sign_in: 'साइन इन करें', sign_up: 'खाता बनाएं', continue_google: 'गूगल के साथ जारी रखें',
    solve: 'प्रश्न हल करें', copy_code: 'कोड कॉपी करें', doubt_solver_title: 'TechPath एआई संदेह निवारक'
  },
  ta: {
    dashboard: 'கட்டளை டாஷ்போர்டு', learnhub: 'கற்றல் மையம் & பாடங்கள்', model_3d: '3D பொறியியல் ஆய்வாளர்',
    skills: 'திறன் அணி & இடைவெளிகள்', career: 'தொழில் பாதைகள்', projects: 'பொறியியல் திட்டங்கள்',
    doubt_solver: 'AI ஐய தீர்க்கும் தளம்', library: 'நூலகம்', reviews: 'மதிப்புரைகள்',
    sign_in: 'உள்நுழைக', sign_up: 'பதிவு செய்க', continue_google: 'கூகிள் மூலம் தொடர்க', solve: 'தீர்வு காண்க'
  },
  kn: {
    dashboard: 'ಕಮಾಂಡ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', learnhub: 'ಲರ್ನ್‌ಹಬ್ ಮತ್ತು ವಿಷಯಗಳು', model_3d: '3D ಎಂಜಿನಿಯರಿಂಗ್ ಎಕ್ಸ್‌ಪ್ಲೋರರ್',
    skills: 'ಕೌಶಲ್ಯ ಮ್ಯಾಟ್ರಿಕ್ಸ್', career: 'ವೃತ್ತಿಪರ ಮಾರ್ಗಗಳು', projects: 'ಎಂಜಿನಿಯರಿಂಗ್ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು',
    doubt_solver: 'AI ಸಂದೇಹ ಪರಿಹಾರಕ', library: 'ಲೈಬ್ರರಿ', sign_in: 'ಸೈನ್ ಇನ್', sign_up: 'ಖಾತೆ ರಚಿಸಿ', solve: 'ಪರಿಹರಿಸಿ'
  },
  ml: {
    dashboard: 'കമാൻഡ് ഡാഷ്‌ബോർഡ്', learnhub: 'ലേൺഹബ്ബ് & വിഷയങ്ങൾ', model_3d: '3D എഞ്ചിനീയറിംഗ് മോഡലുകൾ',
    skills: 'സ്‌കിൽസ് മാട്രിക്സ്', career: 'കരിയർ പാതകൾ', doubt_solver: 'AI സംശയ നിവാരണം', sign_in: 'സൈൻ ഇൻ', solve: 'പരിഹരിക്കുക'
  },
  mr: {
    dashboard: 'कमांड डॅशबोर्ड', learnhub: 'लर्नहब आणि विषय', model_3d: '3D अभियांत्रिकी एक्सप्लोरर',
    skills: 'कौशल्य मॅट्रिक्स', career: 'करिअर मार्ग', doubt_solver: 'AI शंका निवारण', sign_in: 'साइन इन', solve: 'सोडवा'
  },
  bn: {
    dashboard: 'কমান্ড ড্যাশবোর্ড', learnhub: 'লার্নহাব ও বিষয়সমূহ', model_3d: '3D ইঞ্জিনিয়ারিং এক্সপ্লোরার',
    skills: 'দক্ষতা ম্যাট্রিক্স', career: 'ক্যারিয়ার পথ', doubt_solver: 'AI সন্দেহ সমাধানকারী', sign_in: 'সাইন ইন', solve: 'সমাধান করুন'
  },
  gu: {
    dashboard: 'કમાન્ડ ડેશબોર્ડ', learnhub: 'લર્નહબ અને વિષયો', model_3d: '3D એન્જિનિયરિંગ એક્સપ્લોરર',
    skills: 'સ્કિલ્સ મેટ્રિક્સ', doubt_solver: 'AI શંકા નિવારક', sign_in: 'સાઇન ઇન', solve: 'ઉકેલો'
  },
  pa: {
    dashboard: 'ਕਮਾਂਡ ਡੈਸ਼ਬੋਰਡ', learnhub: 'ਲਰਨਹੱਬ ਅਤੇ ਵਿਸ਼ੇ', model_3d: '3D ਇੰਜੀਨੀਅਰਿੰਗ ਐਕਸਪਲੋਰਰ',
    doubt_solver: 'AI ਸ਼ੰਕਾ ਹੱਲ ਕਰਨ ਵਾਲਾ', sign_in: 'ਸਾਈਨ ਇਨ', solve: 'ਹੱਲ ਕਰੋ'
  },
  ur: {
    dashboard: 'کمانڈ ڈیش بورڈ', learnhub: 'لرن ہب اور مضامین', model_3d: 'تھری ڈی انجینئرنگ ایکسپلورر',
    skills: 'مہارتوں کا میٹرکس', career: 'کیریئر کے راستے', doubt_solver: 'اے آئی شبہات حل کنندہ',
    library: 'وسائل لائبریری', sign_in: 'سائن ان کریں', sign_up: 'اکاؤنٹ بنائیں', continue_google: 'گوگل کے ساتھ جاری رکھیں', solve: 'حل کریں'
  },
  or: { dashboard: 'କମାଣ୍ଡ ଡ୍ୟାସବୋର୍ଡ', learnhub: 'ପାଠ୍ୟକ୍ରମ', doubt_solver: 'AI ସନ୍ଦେହ ସମାଧାନକାରୀ', sign_in: 'ସାଇନ ଇନ' },
  as: { dashboard: 'কমাণ্ড ডেচব’ৰ্ড', learnhub: 'বিষয়সমূহ', doubt_solver: 'AI সন্দেহ নিবাৰক', sign_in: 'ছাইন ইন' },
  ne: { dashboard: 'कमान्ड ड्यासबોર્ડ', learnhub: 'विषयहरू', doubt_solver: 'AI शङ्का समाधानकर्ता', sign_in: 'साइन इन' },
  si: { dashboard: 'විධාන පුවරුව', learnhub: 'පාඨමාලා', doubt_solver: 'AI ගැටළු විසඳුම්කරු', sign_in: 'ඇතුල් වන්න' },

  // European & Global Languages
  es: {
    dashboard: 'Panel de Control', learnhub: 'LearnHub y Asignaturas', model_3d: 'Explorador 3D de Ingeniería',
    skills: 'Matriz de Habilidades', career: 'Trayectorias Profesionales', projects: 'Proyectos Capstone',
    exams: 'Exámenes y Admisiones', mock_interview: 'Estudio de Entrevistas', pdf_analyzer: 'Analizador de PDF',
    doubt_solver: 'Solucionador de Dudas con IA', library: 'Biblioteca de Recursos', reviews: 'Opiniones de Estudiantes',
    contact: 'Contacto y Soporte', settings: 'Configuración y Privacidad', search_placeholder: 'Buscar telemetría (Ctrl + K)...',
    sign_in: 'Iniciar Sesión', sign_up: 'Crear Cuenta', continue_google: 'Continuar con Google',
    solve: 'Resolver Pregunta', copy_code: 'Copiar Código', doubt_solver_title: 'Solucionador de Dudas IA por TechPath'
  },
  fr: {
    dashboard: 'Tableau de Bord', learnhub: 'LearnHub & Matières', model_3d: 'Explorateur 3D Ingénierie',
    skills: 'Matrice des Compétences', career: 'Trajectoires de Carrière', projects: 'Projets d\'Ingénierie',
    doubt_solver: 'Résolveur de Doutes IA', library: 'Bibliothèque de Ressources', reviews: 'Avis des Étudiants',
    sign_in: 'Connexion', sign_up: 'Créer un Compte', continue_google: 'Continuer avec Google', solve: 'Résoudre la Question'
  },
  de: {
    dashboard: 'Befehls-Dashboard', learnhub: 'LearnHub & Fächer', model_3d: '3D-Engineering-Explorer',
    skills: 'Kompetenzmatrix', career: 'Karrierewege', projects: 'Ingenieurprojekte',
    doubt_solver: 'KI-Fragenlöser', library: 'Ressourcenbibliothek', sign_in: 'Anmelden', sign_up: 'Konto Erstellen', solve: 'Frage Lösen'
  },
  it: {
    dashboard: 'Pannello di Controllo', learnhub: 'LearnHub e Materie', model_3d: 'Esploratore 3D Ingegneria',
    doubt_solver: 'Risolutore di Dubbi IA', library: 'Libreria Risorse', sign_in: 'Accedi', sign_up: 'Registrati', solve: 'Risolvi'
  },
  pt: {
    dashboard: 'Painel de Controle', learnhub: 'LearnHub e Disciplinas', model_3d: 'Explorador 3D de Engenharia',
    skills: 'Matriz de Habilidades', career: 'Trajetórias de Carreira', doubt_solver: 'Tirador de Dúvidas IA',
    library: 'Biblioteca de Recursos', sign_in: 'Entrar', sign_up: 'Criar Conta', solve: 'Resolver'
  },
  'pt-BR': {
    dashboard: 'Painel de Controle', learnhub: 'LearnHub e Matérias', model_3d: 'Explorador 3D de Engenharia',
    skills: 'Matriz de Competências', career: 'Carreiras', doubt_solver: 'Tira-Dúvidas IA',
    library: 'Biblioteca', sign_in: 'Entrar', sign_up: 'Cadastre-se', continue_google: 'Continuar com o Google', solve: 'Resolver Questão'
  },
  nl: { dashboard: 'Bedieningsdashboard', learnhub: 'LearnHub & Vakken', model_3d: '3D Engineering Verkenner', doubt_solver: 'AI Vragenoplosser', sign_in: 'Inloggen' },
  ru: {
    dashboard: 'Панель Управления', learnhub: 'LearnHub и Предметы', model_3d: '3D Инженерный Проводник',
    skills: 'Матрица Навыков', career: 'Карьерные Пути', doubt_solver: 'ИИ Помощник по Вопросам',
    library: 'Библиотека', sign_in: 'Войти', sign_up: 'Регистрация', solve: 'Решить Вопрос'
  },
  uk: { dashboard: 'Панель Керування', learnhub: 'LearnHub та Предмети', doubt_solver: 'ШІ Помічник у Навчанні', sign_in: 'Увійти' },
  pl: { dashboard: 'Panel Główny', learnhub: 'Przedmioty i Kursy', doubt_solver: 'Asystent Rozwiązywania Zadań AI', sign_in: 'Zaloguj się' },
  cs: { dashboard: 'Řídicí Panel', learnhub: 'Předměty', doubt_solver: 'AI Řešitel Úloh', sign_in: 'Přihlásit se' },
  sk: { dashboard: 'Riadiaci Panel', learnhub: 'Predmety', doubt_solver: 'AI Riešiteľ Úloh', sign_in: 'Prihlásiť sa' },
  hu: { dashboard: 'Vezérlőpult', learnhub: 'Tantárgyak', doubt_solver: 'MI Feladatmegoldó', sign_in: 'Bejelentkezés' },
  ro: { dashboard: 'Panou de Comandă', learnhub: 'Discipline', doubt_solver: 'Rezolvitor Întrebări AI', sign_in: 'Autentificare' },
  bg: { dashboard: 'Контролен Панел', learnhub: 'Предмети', doubt_solver: 'AI Помощник за Въпроси', sign_in: 'Вход' },
  el: { dashboard: 'Πίνακας Ελέγχου', learnhub: 'Μαθήματα', doubt_solver: 'Επίλυση Αποριών με AI', sign_in: 'Σύνδεση' },
  sr: { dashboard: 'Командна Табла', learnhub: 'Предмети', doubt_solver: 'АИ Решавач Питања', sign_in: 'Пријави се' },
  hr: { dashboard: 'Nadzorna Ploča', learnhub: 'Predmeti', doubt_solver: 'AI Rješavač Pitanja', sign_in: 'Prijava' },
  sl: { dashboard: 'Nadzorna Plošča', learnhub: 'Predmeti', doubt_solver: 'UI Pomočnik za Naloge', sign_in: 'Prijava' },
  lt: { dashboard: 'Valdymo Skydelis', learnhub: 'Dalykai', doubt_solver: 'DI Klausimų Sprendiklis', sign_in: 'Prisijungti' },
  lv: { dashboard: 'Vadības Panelis', learnhub: 'Priekšmeti', doubt_solver: 'AI Jautājumu Risinātājs', sign_in: 'Ienākt' },
  et: { dashboard: 'Juhtpaneel', learnhub: 'Õppeained', doubt_solver: 'Tehisintellekti Küsimuste Lahendaja', sign_in: 'Logi sisse' },

  // Middle Eastern RTL Languages
  ar: {
    dashboard: 'لوحة التحكم الرئيسية', learnhub: 'مركز التعلم والمقررات', model_3d: 'مستكشف الهندسة ثلاثي الأبعاد',
    skills: 'مصفوفة المهارات وسد الفجوات', career: 'المسارات المهنية', projects: 'المشاريع الهندسية',
    exams: 'الامتحانات والتوظيف', mock_interview: 'استوديو المقابلات التجريبية', pdf_analyzer: 'محلل المستندات والملاحظات',
    doubt_solver: 'مساعد حل الشكوك الذكي', library: 'مكتبة الموارد', reviews: 'آراء وتقييمات الطلاب',
    contact: 'الاتصال والدعم الفني', settings: 'الأمان والتفضيلات', search_placeholder: 'بحث شامل...',
    sign_in: 'تسجيل الدخول', sign_up: 'إنشاء حساب جديد', continue_google: 'المتابعة عبر جوجل',
    solve: 'حل السؤال الآن', copy_code: 'نسخ الكود البرمجي', doubt_solver_title: 'مساعد TechPath لحل المسائل بالذكاء الاصطناعي'
  },
  he: {
    dashboard: 'לוח בקרה ראשי', learnhub: 'מרכז למידה וקורסים', model_3d: 'סייר הנדסה בתלת-ממד',
    skills: 'מטריצת מיומנויות', career: 'מסלולי קריירה', doubt_solver: 'פותר שאלות מבוסס בינה מלאכותית',
    library: 'ספריית משאבים', sign_in: 'התחברות', sign_up: 'הרשמה', continue_google: 'המשך עם Google', solve: 'פתור שאלה'
  },
  fa: {
    dashboard: 'داشبورد مدیریت', learnhub: 'مرکز یادگیری و دروس', model_3d: 'کاوشگر سه‌بعدی مهندسی',
    skills: 'ماتریس مهارت‌ها', career: 'مسیرهای شغلی', doubt_solver: 'حل‌کننده هوشمند سوالات مهندسی',
    library: 'کتابخانه منابع', sign_in: 'ورود', sign_up: 'ایجاد حساب', continue_google: 'ادامه با گوگل', solve: 'حل مسئله'
  },
  tr: {
    dashboard: 'Kontrol Paneli', learnhub: 'Öğrenme Merkezi ve Dersler', model_3d: '3D Mühendislik Gezgini',
    skills: 'Beceri Matrisi', career: 'Kariyer Yolları', doubt_solver: 'Yapay Zeka Soru Çözücü',
    library: 'Kaynak Kütüphanesi', sign_in: 'Giriş Yap', sign_up: 'Kayıt Ol', solve: 'Soruyu Çöz'
  },

  // East Asian & Southeast Asian
  zh: {
    dashboard: '控制面板', learnhub: '学习中心与课程', model_3d: '3D 工程系统浏览器',
    skills: '技能矩阵与短板', career: '职业发展路线', projects: '工程毕业设计项目',
    exams: '考试与就业准备', mock_interview: '模拟面试工作室', pdf_analyzer: 'PDF 智能笔记解析',
    doubt_solver: 'AI 答疑解惑助手', library: '资源资料库', reviews: '学员评价',
    contact: '联系与支持', settings: '安全与设置', search_placeholder: '全站搜索 (Ctrl + K)...',
    sign_in: '登录', sign_up: '注册账号', continue_google: '使用 Google 登录',
    solve: '立即解答', copy_code: '复制代码', doubt_solver_title: 'TechPath AI 智能答疑系统'
  },
  'zh-TW': {
    dashboard: '主控制台', learnhub: '學習中心與科目', model_3d: '3D 工程模型探索',
    skills: '技能矩陣', career: '職涯路徑', doubt_solver: 'AI 智慧解題助手',
    library: '資源庫', sign_in: '登入', sign_up: '建立帳號', solve: '立即解答'
  },
  ja: {
    dashboard: 'コマンドダッシュボード', learnhub: 'ラーンハブ＆専門科目', model_3d: '3Dエンジニアリングエクスプローラー',
    skills: 'スキルマトリックス＆ギャップ', career: 'キャリアパス', projects: 'エンジニアリングプロジェクト',
    exams: '試験と就職対策', mock_interview: '模擬面接スタジオ', pdf_analyzer: 'PDF・ノート解析',
    doubt_solver: 'AI疑問・問題解決チューター', library: '学習リソースライブラリ', reviews: '受講生レビュー',
    contact: 'サポート＆お問い合わせ', settings: 'セキュリティと個人設定', search_placeholder: '検索...',
    sign_in: 'ログイン', sign_up: '新規登録', continue_google: 'Googleで続行',
    solve: '問題を解く', copy_code: 'コードをコピー', doubt_solver_title: 'TechPath AI問題解決スタジオ'
  },
  ko: {
    dashboard: '대시보드', learnhub: '러닝허브 및 과목', model_3d: '3D 엔지니어링 탐색기',
    skills: '스킬 매트릭스', career: '커리어 로드맵', projects: '캡스톤 프로젝트',
    doubt_solver: 'AI 질문 및 문제 해결사', library: '자료실', reviews: '수강 후기',
    sign_in: '로그인', sign_up: '회원가입', continue_google: 'Google 계정으로 계속', solve: '문제 풀기'
  },
  th: {
    dashboard: 'แดชบอร์ดหลัก', learnhub: 'ศูนย์การเรียนรู้และรายวิชา', model_3d: 'สำรวจโมเดลวิศวกรรม 3 มิติ',
    doubt_solver: 'AI ผู้ช่วยแก้โจทย์วิศวกรรม', library: 'คลังความรู้', sign_in: 'เข้าสู่ระบบ', sign_up: 'สมัครสมาชิก', solve: 'แก้โจทย์'
  },
  vi: {
    dashboard: 'Bảng Điều Khiển', learnhub: 'LearnHub & Môn Học', model_3d: 'Khám Phá Kỹ Thuật 3D',
    skills: 'Ma Trận Kỹ Năng', career: 'Lộ Trình Nghề Nghiệp', doubt_solver: 'Trợ Lý Giải Bài Tập AI',
    library: 'Thư Viện Tài Liệu', sign_in: 'Đăng Nhập', sign_up: 'Đăng Ký', solve: 'Giải Bài'
  },
  id: {
    dashboard: 'Dasbor Utama', learnhub: 'Pusat Pembelajaran & Subjek', model_3d: 'Penjelajah Teknik 3D',
    skills: 'Matriks Keahlian', career: 'Jalur Karir', doubt_solver: 'Penyelesai Pertanyaan AI',
    library: 'Perpustakaan Sumber Daya', sign_in: 'Masuk', sign_up: 'Daftar', solve: 'Selesaikan'
  },
  ms: {
    dashboard: 'Papan Pemuka', learnhub: 'Pusat Pembelajaran', model_3d: 'Penjelajah Kejuruteraan 3D',
    doubt_solver: 'Penyelesai Masalah AI', library: 'Perpustakaan', sign_in: 'Log Masuk', sign_up: 'Daftar', solve: 'Selesaikan'
  },
  fil: {
    dashboard: 'Command Dashboard', learnhub: 'Mga Kurso at Paksa', model_3d: '3D Engineering Explorer',
    doubt_solver: 'AI Solver ng Tanong', library: 'Aklatan', sign_in: 'Mag-sign In', sign_up: 'Gumawa ng Account', solve: 'Lutasin'
  },
  sw: {
    dashboard: 'Dashibodi Kuu', learnhub: 'Kituo cha Mafunzo', model_3d: 'Uchunguzi wa Uhandisi wa 3D',
    doubt_solver: 'Mtatuaji wa Maswali wa AI', library: 'Maktaba', sign_in: 'Ingia', sign_up: 'Jisajili', solve: 'Tatua'
  }
};

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

export class I18nEngine {
  static currentLanguage = 'en';
  static subscribers = new Set();

  /**
   * Initializes localization state from persistent storage
   */
  static init() {
    const saved = localStorage.getItem('TP_LANG') || learningContext.get().preferred_language || 'en';
    this.setLanguage(saved, false);
  }

  /**
   * Translates a key, falling back cleanly to English, and finally to a formatted string.
   * NEVER returns undefined, null, or a raw broken template variable.
   */
  static t(key, lang = null) {
    const activeCode = lang || this.currentLanguage || 'en';
    const dict = DICTIONARIES[activeCode] || DICTIONARIES['en'];
    if (dict && dict[key]) return dict[key];
    if (EN_MASTER[key]) return EN_MASTER[key];
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Shorthand alias
   */
  static get(key, lang = null) {
    return this.t(key, lang);
  }

  /**
   * Changes active language at runtime without browser reload or logout
   */
  static setLanguage(langCode, notify = true) {
    if (!langCode) return;
    this.currentLanguage = langCode;
    localStorage.setItem('TP_LANG', langCode);

    try {
      learningContext.setLanguage(langCode);
    } catch { /* ignore */ }

    // Apply text direction (RTL vs LTR)
    const isRtl = RTL_LANGUAGES.has(langCode);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;

    if (isRtl) {
      document.body.classList.add('tp-rtl');
    } else {
      document.body.classList.remove('tp-rtl');
    }

    if (notify) {
      this.subscribers.forEach(fn => {
        try { fn(langCode); } catch (e) { console.error('[I18n] Subscriber note:', e); }
      });
      window.dispatchEvent(new CustomEvent('tp:language_changed', { detail: { langCode, isRtl } }));
    }
  }

  static subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  static isRTL(langCode = null) {
    const code = langCode || this.currentLanguage;
    return RTL_LANGUAGES.has(code);
  }

  static getSupportedLanguages() {
    return APP_CONFIG.languages;
  }
}

// Auto-initialize on import
I18nEngine.init();
