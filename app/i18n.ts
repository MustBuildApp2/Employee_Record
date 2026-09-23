export type Language = "en" | "zh" | "ta" | "bn" | "ms";

export interface Translations {
  // Brand & Common
  brandName: string;
  brandSub: string;
  operationsPortal: string;
  portalSubtitle: string;
  welcomeBack: string;
  signIn: string;
  signingIn: string;
  signOut: string;
  quickDemo: string;
  workEmail: string;
  password: string;
  rememberSession: string;
  forgotPassword: string;
  biometricLogin: string;
  orAuthWith: string;

  // Nav
  overview: string;
  employeeRecords: string;
  expiryCalendar: string;
  complianceMatrix: string;
  subcontractors: string;
  exportAudit: string;
  operationsCore: string;
  managementAudits: string;
  workforceReadiness: string;

  // Overview
  welcomeUser: string;
  commandSubtitle: string;
  viewWorkforce: string;
  createWorker: string;
  totalWorkforce: string;
  activeOnSite: string;
  complianceScore: string;
  requiresAttention: string;
  credentialCoverage: string;
  expiryHorizon: string;
  priorityQueue: string;
  sendAlert: string;
  openRegistry: string;

  // Records & Filters
  allWorkers: string;
  expiredPasses: string;
  expiringSoon: string;
  workPermit: string;
  sPass: string;
  active: string;
  pending: string;
  mainCon: string;
  subCon: string;
  table: string;
  cards: string;
  searchPlaceholder: string;
  importRecords: string;
  sampleExcelTemplate: string;
  exportCsv: string;
  columns: string;
  filter: string;

  // Import Modal
  importTitle: string;
  importDescription: string;
  sampleTemplateNote: string;
  downloadSampleTemplate: string;
  uploadAreaText: string;
  supportedFormats: string;
  previewRows: string;
  confirmImport: string;
  cancel: string;

  // Detail Drawer & Pass
  workerDossier: string;
  digitalPass: string;
  printPass: string;
  contactIdentity: string;
  complianceCredentials: string;
  documentFiles: string;
  editWorker: string;
  close: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: "Workforce",
    brandSub: "Command Suite",
    operationsPortal: "Operations Portal",
    portalSubtitle: "Sign in to access your organization's workforce records, safety credentials, and verification dashboard.",
    welcomeBack: "Welcome back",
    signIn: "Sign into Command Center",
    signingIn: "Authenticating...",
    signOut: "Sign Out",
    quickDemo: "Instant Demo Profile",
    workEmail: "Work Email",
    password: "Password",
    rememberSession: "Remember session",
    forgotPassword: "Forgot password?",
    biometricLogin: "Biometric Passkey / Windows Hello",
    orAuthWith: "Or authenticate with",

    overview: "Overview Command",
    employeeRecords: "Employee Records",
    expiryCalendar: "Expiry Calendar",
    complianceMatrix: "Compliance Matrix",
    subcontractors: "Subcontractors",
    exportAudit: "Export Audit Dossier",
    operationsCore: "Operations Core",
    managementAudits: "Management & Audits",
    workforceReadiness: "Workforce Readiness",

    welcomeUser: "Welcome back, Alex Morgan",
    commandSubtitle: "Personnel compliance readiness index is live. Monitor credential milestones and safety permits.",
    viewWorkforce: "View Workforce",
    createWorker: "Create Worker",
    totalWorkforce: "TOTAL WORKFORCE",
    activeOnSite: "ACTIVE ON SITE",
    complianceScore: "COMPLIANCE READINESS",
    requiresAttention: "REQUIRES ATTENTION",
    credentialCoverage: "Statutory Credential Coverage",
    expiryHorizon: "Expiry Horizon Radar",
    priorityQueue: "Priority Action Queue",
    sendAlert: "Send Alert",
    openRegistry: "Open Complete Employee Registry",

    allWorkers: "All Workers",
    expiredPasses: "Expired Passes",
    expiringSoon: "Expiring ≤ 30d",
    workPermit: "Work Permit",
    sPass: "S Pass",
    active: "Active",
    pending: "Pending",
    mainCon: "Main-Con Personnel (MC)",
    subCon: "Subcontractor Workforce (SC)",
    table: "Table",
    cards: "Cards",
    searchPlaceholder: "Omnisearch: Name, Code, Passport, FIN, Permit No, Designation...",
    importRecords: "Import Records",
    sampleExcelTemplate: "Sample Excel Template",
    exportCsv: "Export CSV",
    columns: "Columns",
    filter: "Filters",

    importTitle: "Import Employee Records",
    importDescription: "Bulk import personnel details using our verified spreadsheet template format.",
    sampleTemplateNote: "Before importing, ensure your spreadsheet has the required column headers. Download our pre-formatted template below:",
    downloadSampleTemplate: "Download Sample Template (.CSV / Excel)",
    uploadAreaText: "Drag and drop your filled spreadsheet here, or click to browse",
    supportedFormats: "Supports .CSV and .XLSX files with UTF-8 encoding",
    previewRows: "Verified records ready to import",
    confirmImport: "Confirm & Import Records",
    cancel: "Cancel",

    workerDossier: "Worker Profile & ID Pass",
    digitalPass: "SAFETY & WORKFORCE DIGITAL PASS",
    printPass: "Print Pass",
    contactIdentity: "Contact & Identity",
    complianceCredentials: "Compliance Credentials",
    documentFiles: "Document Verification Files",
    editWorker: "Edit Worker Record",
    close: "Close",
  },

  zh: {
    brandName: "劳工管理",
    brandSub: "企业指挥系统",
    operationsPortal: "运营管理门户",
    portalSubtitle: "登录以管理组织的人员档案、安全资质和合规性验证。",
    welcomeBack: "欢迎回来",
    signIn: "进入管理中心",
    signingIn: "验证中...",
    signOut: "退出登录",
    quickDemo: "快速演示身份",
    workEmail: "工作邮箱",
    password: "登录密码",
    rememberSession: "记住本次登录",
    forgotPassword: "忘记密码？",
    biometricLogin: "生物识别通行密钥 / Windows Hello",
    orAuthWith: "或者通过其他方式验证",

    overview: "概览控制台",
    employeeRecords: "员工档案",
    expiryCalendar: "到期日历",
    complianceMatrix: "合规矩阵",
    subcontractors: "分包商管理",
    exportAudit: "导出审计档案",
    operationsCore: "核心运营",
    managementAudits: "管理与审计",
    workforceReadiness: "人员就绪合规率",

    welcomeUser: "欢迎回来，Alex Morgan",
    commandSubtitle: "实时员工合规率指数。随时监控证件到期和安全施工许可。",
    viewWorkforce: "查看全体人员",
    createWorker: "登记新工人",
    totalWorkforce: "劳动力总数",
    activeOnSite: "在岗活跃人员",
    complianceScore: "合规达标率",
    requiresAttention: "急需跟进事项",
    credentialCoverage: "证件资质覆盖情况",
    expiryHorizon: "证件到期雷达预测",
    priorityQueue: "优先处理队列",
    sendAlert: "发送预警",
    openRegistry: "打开完整人员名册",

    allWorkers: "全部人员",
    expiredPasses: "已过期证件",
    expiringSoon: "30天内到期",
    workPermit: "工作准证 (WP)",
    sPass: "技术准证 (S Pass)",
    active: "在职正常",
    pending: "审核中",
    mainCon: "主承包商员工 (MC)",
    subCon: "分包商队伍 (SC)",
    table: "表格视图",
    cards: "卡片视图",
    searchPlaceholder: "全局搜索：姓名、工号、护照、FIN准证号、职位...",
    importRecords: "批量导入",
    sampleExcelTemplate: "下载 Excel 模板",
    exportCsv: "导出表格",
    columns: "显示列",
    filter: "筛选条件",

    importTitle: "批量导入员工数据",
    importDescription: "通过标准表格模板，快速大批量录入工人与合规证件信息。",
    sampleTemplateNote: "导入前请确保文件格式与表头符合规范。请点击下方下载标准模板：",
    downloadSampleTemplate: "下载标准表格模板 (.CSV / Excel)",
    uploadAreaText: "拖放填写好的表格至此处，或点击浏览文件",
    supportedFormats: "支持 UTF-8 编码的 .CSV 与 .XLSX 格式文件",
    previewRows: "解析成功，准备导入的人员记录",
    confirmImport: "确认并批量录入系统",
    cancel: "取消",

    workerDossier: "人员档案与电子通行证",
    digitalPass: "电子施工安全通行证",
    printPass: "打印通行证",
    contactIdentity: "联系方式与身份信息",
    complianceCredentials: "合规证件与到期日",
    documentFiles: "上传的资质文件",
    editWorker: "修改员工信息",
    close: "关闭",
  },

  ta: {
    brandName: "பணியாளர்",
    brandSub: "கமாண்ட் சூட்",
    operationsPortal: "செயல்பாட்டு போர்டல்",
    portalSubtitle: "பணியாளர் பதிவுகள் மற்றும் பாதுகாப்பு சான்றிதழ்களை நிர்வகிக்க உள்நுழையவும்.",
    welcomeBack: "மீண்டும் வருக",
    signIn: "கட்டளை மையத்தில் நுழையவும்",
    signingIn: "உள்நுழைகிறது...",
    signOut: "வெளியேறு",
    quickDemo: "மாதிரி சுயவிவரம்",
    workEmail: "மின்னஞ்சல் முகவரி",
    password: "கடவுச்சொல்",
    rememberSession: "என்னை நினைவில் கொள்",
    forgotPassword: "கடவுச்சொல் மறந்ததா?",
    biometricLogin: "கைரேகை / விண்டோஸ் ஹலோ",
    orAuthWith: "அல்லது இதன் மூலம் உள்நுழையவும்",

    overview: "கண்ணோட்டம்",
    employeeRecords: "பணியாளர் பதிவுகள்",
    expiryCalendar: "காலாவதி நாட்காட்டி",
    complianceMatrix: "பாதுகாப்பு சான்றிதழ் நிலை",
    subcontractors: "துணை ஒப்பந்ததாரர்கள்",
    exportAudit: "அறிக்கை பதிவிறக்கு",
    operationsCore: "முக்கிய செயல்பாடுகள்",
    managementAudits: "மேலாண்மை",
    workforceReadiness: "பணியாளர் தயார்நிலை",

    welcomeUser: "வணக்கம், Alex Morgan",
    commandSubtitle: "நிகழ்நேர பணியாளர் சான்றிதழ் நிலை மற்றும் காலாவதி கண்காணிப்பு.",
    viewWorkforce: "பணியாளர்களைக் காண்க",
    createWorker: "புதிய தொழிலாளர் சேர்க்க",
    totalWorkforce: "மொத்த தொழிலாளர்கள்",
    activeOnSite: "பணியில் உள்ளவர்கள்",
    complianceScore: "சான்றிதழ் தயார்நிலை",
    requiresAttention: "கவனம் தேவைப்படுபவை",
    credentialCoverage: "சான்றிதழ் பாதுகாப்பு நிலை",
    expiryHorizon: "காலாவதி கணிப்பு",
    priorityQueue: "முன்னுரிமை பட்டியல்",
    sendAlert: "எச்சரிக்கை அனுப்பு",
    openRegistry: "முழு பதிவேட்டைத் திறக்க",

    allWorkers: "அனைத்து தொழிலாளர்கள்",
    expiredPasses: "காலாவதியான அனுமதி",
    expiringSoon: "30 நாளில் முடிபவை",
    workPermit: "வொர்க் பர்மிட்",
    sPass: "எஸ் பாஸ்",
    active: "செயலில் உள்ளது",
    pending: "நிலுவையில் உள்ளது",
    mainCon: "முக்கிய ஒப்பந்ததாரர் (MC)",
    subCon: "துணை ஒப்பந்ததாரர் (SC)",
    table: "அட்டவணை",
    cards: "கார்டு வடிவம்",
    searchPlaceholder: "தேடு: பெயர், எண், பாஸ்போர்ட், FIN, பதவி...",
    importRecords: "பதிவேற்றம்",
    sampleExcelTemplate: "மாதிரி எக்செல் கோப்பு",
    exportCsv: "பதிவிறக்கு",
    columns: "நெடுவரிசைகள்",
    filter: "வடிகட்டிகள்",

    importTitle: "தொழிலாளர் பதிவுகளைப் பதிவேற்றவும்",
    importDescription: "எக்செல் மாதிரி கோப்பைப் பயன்படுத்தி பல தொழிலாளர்களை ஒரே நேரத்தில் சேர்க்கலாம்.",
    sampleTemplateNote: "பதிவேற்றும் முன், சரியான எக்செல் மாதிரியைப் பதிவிறக்கி நிரப்பவும்:",
    downloadSampleTemplate: "மாதிரி எக்செல் டெம்ப்ளேட்டை பதிவிறக்கவும் (.CSV)",
    uploadAreaText: "நிரப்பப்பட்ட கோப்பை இங்கே இழுத்து விடவும் அல்லது கிளிக் செய்யவும்",
    supportedFormats: ".CSV மற்றும் .XLSX கோப்புகளை ஆதரிக்கிறது",
    previewRows: "பதிவேற்ற தயாராக உள்ள பதிவுகள்",
    confirmImport: "உறுதிப்படுத்தி சேர்க்கவும்",
    cancel: "ரத்து செய்",

    workerDossier: "தொழிலாளர் அடையாள அட்டை",
    digitalPass: "டிஜிட்டல் பாதுகாப்பு பாஸ்",
    printPass: "அச்சிடுக",
    contactIdentity: "தொடர்பு மற்றும் அடையாளம்",
    complianceCredentials: "காலாவதி சான்றிதழ்கள்",
    documentFiles: "ஆவணக் கோப்புகள்",
    editWorker: "திருத்து",
    close: "மூடு",
  },

  bn: {
    brandName: "ওয়ার্কফোর্স",
    brandSub: "কমান্ড স্যুট",
    operationsPortal: "অপারেশনস পোর্টাল",
    portalSubtitle: "কর্মীদের রেকর্ড, সুরক্ষা পারমিট এবং ডকুমেন্টস পরিচালনা করতে সাইন ইন করুন।",
    welcomeBack: "স্বাগতম",
    signIn: "কমান্ড সেন্টারে প্রবেশ করুন",
    signingIn: "যাচাই করা হচ্ছে...",
    signOut: "লগ আউট",
    quickDemo: "ডেমো প্রোফাইল",
    workEmail: "কাজের ইমেইল",
    password: "পাসওয়ার্ড",
    rememberSession: "সেশন মনে রাখুন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    biometricLogin: "বায়োমেট্রিক পাসকি / উইন্ডোজ হ্যালো",
    orAuthWith: "অথবা এর মাধ্যমে প্রবেশ করুন",

    overview: "ওভারভিউ",
    employeeRecords: "কর্মীদের রেকর্ড",
    expiryCalendar: "মেয়াদোত্তীর্ণ ক্যালেন্ডার",
    complianceMatrix: "কমপ্লায়েন্স মেট্রিক্স",
    subcontractors: "সাবকন্ট্রাক্টর",
    exportAudit: "অডিট রিপোর্ট ডাউনলোড",
    operationsCore: "মূল কার্যক্রম",
    managementAudits: "ব্যবস্থাপনা",
    workforceReadiness: "কমপ্লায়েন্স স্কোর",

    welcomeUser: "স্বাগতম, Alex Morgan",
    commandSubtitle: "রিয়েল-টাইম ওয়ার্কফোর্স কমপ্লায়েন্স ও নিরাপত্তা পারমিট পর্যবেক্ষণ।",
    viewWorkforce: "কর্মী তালিকা দেখুন",
    createWorker: "নতুন কর্মী যুক্ত করুন",
    totalWorkforce: "মোট কর্মী",
    activeOnSite: "কাজে কর্মরত কর্মী",
    complianceScore: "কমপ্লায়েন্স স্কোর",
    requiresAttention: "জরুরি মনোযোগ প্রয়োজন",
    credentialCoverage: "ডকুমেন্টস স্ট্যাটাস",
    expiryHorizon: "মেয়াদোত্তীর্ণের পূর্বাভাস",
    priorityQueue: "অগ্রাধিকার তালিকা",
    sendAlert: "অ্যালার্ট পাঠান",
    openRegistry: "সম্পূর্ণ কর্মী তালিকা খুলুন",

    allWorkers: "সকল কর্মী",
    expiredPasses: "মেয়াদ শেষ হয়েছে",
    expiringSoon: "৩০ দিনের মধ্যে মেয়াদ শেষ",
    workPermit: "ওয়ার্ক পারমিট",
    sPass: "এস পাস",
    active: "সক্রিয়",
    pending: "অপেক্ষমান",
    mainCon: "মেইন-কন কর্মী (MC)",
    subCon: "সাব-কন কর্মী (SC)",
    table: "টেবিল ভিউ",
    cards: "কার্ড ভিউ",
    searchPlaceholder: "সার্চ করুন: নাম, কোড, পাসপোর্ট, FIN নম্বর, পদবি...",
    importRecords: "ইমপোর্ট করুন",
    sampleExcelTemplate: "নমুনা এক্সেল ফাইল",
    exportCsv: "এক্সপোর্ট CSV",
    columns: "কলাম",
    filter: "ফিল্টার",

    importTitle: "কর্মীদের রেকর্ড ইমপোর্ট করুন",
    importDescription: "এক্সেল বা সিএসভি ফাইল ব্যবহার করে একসাথে অনেক কর্মী যুক্ত করুন।",
    sampleTemplateNote: "ফাইল আপলোড করার আগে নিশ্চিত করুন যে সঠিক কলাম ফরম্যাট ব্যবহার করছেন। নমুনা টেমপ্লেট ডাউনলোড করুন:",
    downloadSampleTemplate: "নমুনা এক্সেল/সিএসভি টেমপ্লেট ডাউনলোড করুন",
    uploadAreaText: "পূরণ করা ফাইলটি এখানে ড্র্যাগ করুন অথবা ব্রাউজ করুন",
    supportedFormats: ".CSV এবং .XLSX ফাইল সমর্থিত",
    previewRows: "যাচাইকৃত রেকর্ড যা সিস্টেমে যুক্ত হবে",
    confirmImport: "নিশ্চিত করুন এবং যুক্ত করুন",
    cancel: "বাতিল",

    workerDossier: "কর্মী প্রোফাইল ও আইডি পাস",
    digitalPass: "ডিজিটাল সেফটি ওয়ার্কার পাস",
    printPass: "প্রিন্ট করুন",
    contactIdentity: "যোগাযোগ ও পরিচয়",
    complianceCredentials: "ডকুমেন্টস ও সার্টিফিকেশন",
    documentFiles: "সংযুক্ত ডকুমেন্টস",
    editWorker: "তথ্য পরিবর্তন করুন",
    close: "বন্ধ করুন",
  },

  ms: {
    brandName: "Workforce",
    brandSub: "Sistem Pengurusan",
    operationsPortal: "Portal Operasi",
    portalSubtitle: "Log masuk untuk memantau rekod kakitangan, permit keselamatan, dan kepatuhan.",
    welcomeBack: "Selamat Kembali",
    signIn: "Log Masuk ke Pusat Kawalan",
    signingIn: "Mengesahkan...",
    signOut: "Log Keluar",
    quickDemo: "Profil Demo Pantas",
    workEmail: "Emel Kerja",
    password: "Kata Laluan",
    rememberSession: "Ingat sesi ini",
    forgotPassword: "Lupa kata laluan?",
    biometricLogin: "Kunci Laluan Biometrik / Windows Hello",
    orAuthWith: "Atau sahkan dengan",

    overview: "Gambaran Keseluruhan",
    employeeRecords: "Rekod Kakitangan",
    expiryCalendar: "Kalendar Tamat Tempoh",
    complianceMatrix: "Matriks Kepatuhan",
    subcontractors: "Subkontraktor",
    exportAudit: "Eksport Laporan Audit",
    operationsCore: "Teras Operasi",
    managementAudits: "Pengurusan & Audit",
    workforceReadiness: "Kesiapsiagaan Tenaga Kerja",

    welcomeUser: "Selamat kembali, Alex Morgan",
    commandSubtitle: "Indeks kepatuhan masa nyata bagi permit dan pensijilan keselamatan.",
    viewWorkforce: "Lihat Semua Pekerja",
    createWorker: "Daftar Pekerja Baru",
    totalWorkforce: "JUMLAH PEKERJA",
    activeOnSite: "AKTIF DI TAPAK",
    complianceScore: "SKOR KEPATUHAN",
    requiresAttention: "PERLU TINDAKAN",
    credentialCoverage: "Liputan Kelayakan Berkanun",
    expiryHorizon: "Radar Tamat Tempoh",
    priorityQueue: "Giliran Tindakan Utama",
    sendAlert: "Hantar Amaran",
    openRegistry: "Buka Pendaftaran Penuh",

    allWorkers: "Semua Pekerja",
    expiredPasses: "Permit Tamat Tempoh",
    expiringSoon: "Tamat ≤ 30 Hari",
    workPermit: "Permit Kerja (WP)",
    sPass: "S Pass",
    active: "Aktif",
    pending: "Dalam Proses",
    mainCon: "Kakitangan Utama (MC)",
    subCon: "Tenaga Subkontraktor (SC)",
    table: "Jadual",
    cards: "Kad",
    searchPlaceholder: "Carian: Nama, Kod, Pasport, No FIN, Jawatan...",
    importRecords: "Import Rekod",
    sampleExcelTemplate: "Templat Contoh Excel",
    exportCsv: "Eksport CSV",
    columns: "Lajur",
    filter: "Penapis",

    importTitle: "Import Rekod Pekerja",
    importDescription: "Import pekerja secara pukal menggunakan templat fail hamparan piawai.",
    sampleTemplateNote: "Sila muat turun templat contoh sebelum mengimport fail anda:",
    downloadSampleTemplate: "Muat Turun Templat Contoh (.CSV / Excel)",
    uploadAreaText: "Tarik & lepas fail di sini atau klik untuk mencari",
    supportedFormats: "Menyokong format fail .CSV dan .XLSX",
    previewRows: "Rekod yang bersedia untuk diimport",
    confirmImport: "Sahkan & Import Pekerja",
    cancel: "Batal",

    workerDossier: "Profil Pekerja & Pas ID",
    digitalPass: "PAS KESELAMATAN DIGITAL PEKERJA",
    printPass: "Cetak Pas",
    contactIdentity: "Maklumat Perhubungan & Identiti",
    complianceCredentials: "Kelayakan Kepatuhan",
    documentFiles: "Fail Dokumen Disahkan",
    editWorker: "Kemaskini Rekod",
    close: "Tutup",
  },
};
