import type {
  Faq,
  ServiceCategory,
  SiteSettings,
  SubService,
  WorkPhoto,
} from "./types";
import { APPROVED_IMAGES, GALLERY_ORDER } from "./images";

/**
 * Seed content — PRD §14. Copy is generic, factual and non-promissory:
 * no prices, no time guarantees, no invented reviews/awards. Every item
 * is editable later from the admin CMS (Phase 4+ writes to Supabase;
 * this module remains the fallback).
 */

export const seedCategories: ServiceCategory[] = [
  {
    slug: "ac",
    name: { ar: "خدمات التكييف", en: "AC Services" },
    shortDescription: {
      ar: "إصلاح وتنظيف وتركيب وصيانة جميع أنواع المكيفات.",
      en: "Repair, cleaning, installation and maintenance for all AC types.",
    },
    longDescription: {
      ar: "نوفر خدمة منزلية متكاملة للمكيفات في جميع أحياء الرياض: إصلاح الأعطال، التنظيف الدوري، التركيب، والصيانة الوقائية. تشمل خدمتنا فحص الجهاز وتشخيص المشكلة قبل البدء بأي عمل، والتأكد من عمل المكيف بكفاءة بعد الانتهاء.",
      en: "Complete home service for air conditioners across Riyadh: fault repair, seasonal cleaning, installation and preventive maintenance. Our technician inspects the unit, diagnoses the problem before starting any work, and confirms the AC is working properly before leaving.",
    },
    problemsCovered: [
      { ar: "المكيف لا يبرد", en: "AC not cooling" },
      { ar: "تسريب مياه من المكيف", en: "AC water leakage" },
      { ar: "صوت مزعج من المكيف", en: "AC making noise" },
      { ar: "مشاكل غاز التبريد", en: "Refrigerant / gas problems" },
      { ar: "رائحة غير طبيعية", en: "Unusual smell from the unit" },
      { ar: "ضعف تدفق الهواء", en: "Weak airflow" },
    ],
    technicianChecks: [
      { ar: "فحص درجة برودة الهواء الخارج من المكيف", en: "Check the outlet air temperature" },
      { ar: "فحص مستوى الغاز وضغط الدائرة", en: "Check refrigerant level and circuit pressure" },
      { ar: "فحص حساسات التشغيل والمروحة والكومبروسر", en: "Inspect sensors, fan and compressor" },
      { ar: "فحص مجاري تصريف المياه", en: "Inspect the drainage lines" },
      { ar: "فحص نظيفة الفلاتر والملفات", en: "Check filters and coils cleanliness" },
    ],
    icon: "ac",
    order: 1,
    status: "published",
    seo: {
      title: {
        ar: "صيانة وتنظيف وتركيب المكيفات في الرياض",
        en: "AC Repair, Cleaning & Installation in Riyadh",
      },
      description: {
        ar: "خدمة منزلية للمكيفات في جميع أحياء الرياض: إصلاح وتنظيف وتركيب وصيانة. اتصل أو راسل واتساب لمعرفة التفاصيل.",
        en: "Home AC service across Riyadh: repair, cleaning, installation and maintenance. Call or WhatsApp us for details.",
      },
    },
  },
  {
    slug: "refrigerator",
    name: { ar: "خدمات الثلاجات", en: "Refrigerator Services" },
    shortDescription: {
      ar: "إصلاح وصيانة الثلاجات والفريزرات.",
      en: "Repair and maintenance for refrigerators and freezers.",
    },
    longDescription: {
      ar: "خدمة منزلية لإصلاح وصيانة الثلاجات والفريزرات في الرياض. نفحص الجهاز ونحدد المشكلة قبل بدء الإصلاح، ونبلغك بما يحتاجه الجهاز قبل تنفيذ أي عمل.",
      en: "Home service for refrigerator and freezer repair and maintenance in Riyadh. The technician inspects the appliance, identifies the fault, and confirms with you what the unit needs before starting any work.",
    },
    problemsCovered: [
      { ar: "الثلاجة لا تبرد", en: "Fridge not cooling" },
      { ar: "تسريب مياه من الثلاجة", en: "Fridge water leakage" },
      { ar: "تكوّن الثلج بشكل مبالغ فيه", en: "Excess ice build-up" },
      { ar: "صوت مرتفع أثناء التشغيل", en: "Loud noise while running" },
      { ar: "الفريزر لا يجمد", en: "Freezer not freezing" },
    ],
    technicianChecks: [
      { ar: "فحص درجة التبريد في الكابينة والفريزر", en: "Check cabinet and freezer temperatures" },
      { ar: "فحص الغاز وضغط منظومة التبريد", en: "Check refrigerant and system pressure" },
      { ar: "فحص العزل وحرارة الكومبروسر", en: "Inspect insulation and compressor temperature" },
      { ar: "فحص مروحة التبريد ومجاري التصريف", en: "Check the cooling fan and drainage" },
    ],
    icon: "refrigerator",
    order: 2,
    status: "published",
    seo: {
      title: {
        ar: "إصلاح وصيانة الثلاجات في الرياض",
        en: "Refrigerator Repair in Riyadh",
      },
      description: {
        ar: "إصلاح الثلاجات والفريزرات في منزلك بجميع أحياء الرياض. اتصل أو راسل واتساب لمعرفة التفاصيل.",
        en: "Refrigerator and freezer repair at your home across Riyadh. Call or WhatsApp us for details.",
      },
    },
  },
  {
    slug: "washing-machine",
    name: { ar: "خدمات الغسالات", en: "Washing Machine Services" },
    shortDescription: {
      ar: "إصلاح وصيانة جميع أنواع الغسالات.",
      en: "Repair and maintenance for all washing machine types.",
    },
    longDescription: {
      ar: "خدمة منزلية لإصلاح وصيانة الغسالات في الرياض: أعطال التشغيل، مشاكل المياه والتصريف، الأصوات المزعجة، وغيرها. نفحص الغسالة في منزلك ونحدد العطل قبل بدء أي إصلاح.",
      en: "Home service for washing machine repair and maintenance in Riyadh: start-up faults, water and drainage problems, unusual noises and more. The technician inspects the machine at your home and identifies the fault before any repair begins.",
    },
    problemsCovered: [
      { ar: "الغسالة لا تعمل", en: "Washing machine not working" },
      { ar: "الغسالة لا تسحب المياه", en: "Machine not taking in water" },
      { ar: "تسريب مياه من الغسالة", en: "Water leaking from the machine" },
      { ar: "عدم التصريف أو الطرد", en: "Not draining or spinning" },
      { ar: "صوت مزعج أثناء الغسل", en: "Loud noise during the cycle" },
    ],
    technicianChecks: [
      { ar: "فحص لوحة التحكم وبرنامج الغسيل", en: "Check the control board and cycle program" },
      { ar: "فحص صمام الدخول ومضخة التصريف", en: "Inspect inlet valve and drain pump" },
      { ar: "فحص المحرك والحزام والمحامل", en: "Check motor, belt and bearings" },
      { ar: "فحص خراطيم المياه والتوصيلات", en: "Inspect hoses and connections" },
    ],
    icon: "washing-machine",
    order: 3,
    status: "published",
    seo: {
      title: {
        ar: "إصلاح وصيانة الغسالات في الرياض",
        en: "Washing Machine Repair in Riyadh",
      },
      description: {
        ar: "إصلاح الغسالات في منزلك بجميع أحياء الرياض: أعطال التشغيل والمياه والتصريف. اتصل أو راسل واتساب لمعرفة التفاصيل.",
        en: "Washing machine repair at your home across Riyadh: start-up, water and drainage faults. Call or WhatsApp us for details.",
      },
    },
  },
  {
    slug: "emergency",
    name: { ar: "خدمات الطوارئ", en: "Emergency Services" },
    shortDescription: {
      ar: "حلول عاجلة للمكيفات والثلاجات والغسالات — يوميًا 10 ص – 11 م.",
      en: "Urgent AC, refrigerator and washing machine help — daily 10 AM–11 PM.",
    },
    longDescription: {
      ar: "نستقبل بلاغات الطوارئ يوميًا من 10 صباحًا حتى 11 مساءً لجميع أحياء الرياض: توقف مفاجئ للمكيف، تلف في الثلاجة، أو عطل في الغسالة. تواصل معنا هاتفيًا أو عبر واتساب وسنرتب زيارة الفني في أقرب وقت ممكن خلال ساعات العمل.",
      en: "We receive emergency reports daily from 10 AM to 11 PM across Riyadh: a sudden AC breakdown, a failing refrigerator or a faulty washing machine. Call or WhatsApp us and we will arrange the nearest possible technician visit within working hours.",
    },
    problemsCovered: [
      { ar: "توقف مفاجئ للمكيف", en: "Sudden AC breakdown" },
      { ar: "توقف الثلاجة عن التبريد", en: "Refrigerator stopped cooling" },
      { ar: "تسريب مياه يحتاج تدخلًا سريعًا", en: "Water leak needing quick attention" },
      { ar: "غسالة متوقفة عن العمل", en: "Washing machine stopped working" },
    ],
    technicianChecks: [
      { ar: "تشخيص سريع للعطل عبر الهاتف قبل الزيارة", en: "Quick phone diagnosis before the visit" },
      { ar: "تحديد الأولوية حسب طبيعة العطل", en: "Prioritisation based on the fault" },
      { ar: "تنسيق أقرب موعد زيارة خلال ساعات العمل", en: "Arranging the nearest visit within working hours" },
    ],
    icon: "emergency",
    order: 4,
    status: "published",
    seo: {
      title: {
        ar: "خدمة طوارئ التبريد والتكييف في الرياض",
        en: "Emergency AC & Appliance Repair in Riyadh",
      },
      description: {
        ar: "بلاغات طوارئ للمكيفات والثلاجات والغسالات يوميًا من 10 صباحًا حتى 11 مساءً في الرياض. اتصل الآن.",
        en: "Emergency AC, refrigerator and washing machine service daily 10 AM–11 PM across Riyadh. Call now.",
      },
    },
  },
];

const sub = (
  categorySlug: SubService["categorySlug"],
  slug: string,
  ar: string,
  en: string,
  arDesc: string,
  enDesc: string,
  isProblem: boolean,
  order: number
): SubService => ({
  categorySlug,
  slug,
  name: { ar, en },
  shortDescription: { ar: arDesc, en: enDesc },
  isProblem,
  order,
  status: "published",
});

export const seedSubServices: SubService[] = [
  // AC
  sub("ac", "ac-repair", "إصلاح المكيفات", "AC Repair",
    "تشخيص وإصلاح أعطال المكيفات المنزلية والسبليت.",
    "Diagnosis and repair of home and split AC faults.", false, 1),
  sub("ac", "ac-cleaning", "تنظيف المكيفات", "AC Cleaning",
    "تنظيف الفلاتر والملفات ومجاري التصريف لتحسين التبريد.",
    "Cleaning filters, coils and drainage to restore cooling performance.", false, 2),
  sub("ac", "ac-installation", "تركيب المكيفات", "AC Installation",
    "تركيب المكيفات السبليت والشباك مع الاختبار والتشغيل.",
    "Split and window AC installation with testing and start-up.", true, 3),
  sub("ac", "ac-maintenance", "صيانة المكيفات", "AC Maintenance",
    "صيانة دورية وقائية للمكيفات قبل موسم الصيف.",
    "Seasonal preventive maintenance before the summer peak.", true, 4),
  sub("ac", "ac-not-cooling", "المكيف لا يبرد", "AC Not Cooling",
    "فحص أسباب ضعف التبريد وإصلاحها.",
    "Inspecting and fixing the causes of weak cooling.", true, 5),
  sub("ac", "ac-water-leakage", "تسريب مياه من المكيف", "AC Water Leakage",
    "معالجة تسريب المياه من الوحدة الداخلية.",
    "Fixing water leaks from the indoor unit.", true, 6),
  sub("ac", "ac-noise", "صوت مزعج من المكيف", "AC Making Noise",
    "تشخيص الأصوات المزعجة أثناء التشغيل.",
    "Diagnosing unusual noises during operation.", true, 7),
  sub("ac", "ac-gas", "مشاكل غاز التبريد", "AC Gas / Cooling Problems",
    "فحص الغاز وشحن الدائرة عند الحاجة.",
    "Refrigerant check and recharge when needed.", false, 8),
  // Refrigerator
  sub("refrigerator", "refrigerator-repair", "إصلاح الثلاجات", "Refrigerator Repair",
    "إصلاح أعطال الثلاجات والفريزرات المنزلية.",
    "Repair of home refrigerator and freezer faults.", false, 1),
  sub("refrigerator", "fridge-not-cooling", "الثلاجة لا تبرد", "Fridge Not Cooling",
    "تشخيص ضعف التبريد في الكابينة أو الفريزر.",
    "Diagnosing weak cooling in the cabinet or freezer.", true, 2),
  sub("refrigerator", "fridge-water-leakage", "تسريب مياه من الثلاجة", "Fridge Water Leakage",
    "معالجة تجمع المياه أسفل الثلاجة أو داخلها.",
    "Fixing water pooling under or inside the fridge.", true, 3),
  sub("refrigerator", "fridge-ice", "تكوّن الثلج ومشاكل التبريد", "Ice / Cooling Problems",
    "معالجة تكوّن الثلج المبالغ فيه ومشاكل التبريد.",
    "Fixing excess ice build-up and cooling issues.", false, 4),
  sub("refrigerator", "refrigerator-maintenance", "صيانة الثلاجات", "Refrigerator Maintenance",
    "صيانة دورية تحافظ على كفاءة الثلاجة.",
    "Routine maintenance to keep the fridge efficient.", false, 5),
  // Washing machine
  sub("washing-machine", "washing-machine-repair", "إصلاح الغسالات", "Washing Machine Repair",
    "إصلاح أعطال الغسالات الأوتوماتيك والعادية.",
    "Repair of automatic and standard washing machines.", true, 1),
  sub("washing-machine", "machine-not-working", "الغسالة لا تعمل", "Machine Not Working",
    "تشخيص توقف الغسالة عن العمل أو التشغيل.",
    "Diagnosing machines that will not start or run.", true, 2),
  sub("washing-machine", "machine-water-problems", "مشاكل المياه في الغسالة", "Water Problems",
    "معالجة دخول المياه وتسريبها والتصريف.",
    "Fixing fill, leak and drainage problems.", true, 3),
  sub("washing-machine", "washing-machine-maintenance", "صيانة الغسالات", "Washing Machine Maintenance",
    "صيانة دورية للغسالات لتفادي الأعطال.",
    "Routine maintenance to prevent breakdowns.", false, 4),
  // Emergency
  sub("emergency", "emergency-ac-repair", "صيانة طارئة للمكيفات", "Emergency AC Repair",
    "بلاغات عاجلة لأعطال المكيفات خلال ساعات العمل.",
    "Urgent AC fault reports during working hours.", false, 1),
  sub("emergency", "emergency-refrigerator-repair", "صيانة طارئة للثلاجات", "Emergency Refrigerator Repair",
    "بلاغات عاجلة لأعطال الثلاجات خلال ساعات العمل.",
    "Urgent refrigerator fault reports during working hours.", false, 2),
  sub("emergency", "emergency-washing-machine-repair", "صيانة طارئة للغسالات", "Emergency Washing Machine Repair",
    "بلاغات عاجلة لأعطال الغسالات خلال ساعات العمل.",
    "Urgent washing machine fault reports during working hours.", false, 3),
];

export const seedFaqs: Faq[] = [
  {
    id: "faq-areas",
    question: { ar: "ما المناطق التي تخدمونها؟", en: "Which areas do you serve?" },
    answer: {
      ar: "نخدم المنازل في جميع أنحاء الرياض. اتصل بنا أو أرسل موقعك على واتساب للتأكيد.",
      en: "We serve homes across Riyadh. Call us or message us your location on WhatsApp to confirm.",
    },
    order: 1,
    status: "published",
  },
  {
    id: "faq-booking",
    question: { ar: "كيف أحجز الخدمة؟", en: "How do I book?" },
    answer: {
      ar: "اتصل بنا أو راسلنا على واتساب أو استخدم زر «احجز الخدمة»، وسيتواصل معك الفني.",
      en: "Call us, message us on WhatsApp, or use Book Service — a technician will contact you.",
    },
    order: 2,
    status: "published",
  },
  {
    id: "faq-hours",
    question: { ar: "ما ساعات العمل؟", en: "What are your working hours?" },
    answer: {
      ar: "يوميًا من 10:00 صباحًا حتى 11:00 مساءً.",
      en: "Every day from 10:00 AM to 11:00 PM.",
    },
    order: 3,
    status: "published",
  },
  {
    id: "faq-pricing",
    question: { ar: "كم تكلفة الخدمة؟", en: "How much does a service cost?" },
    answer: {
      ar: "تعتمد التكلفة على المشكلة. تواصل معنا هاتفيًا أو عبر واتساب لمعرفة التفاصيل.",
      en: "It depends on the problem. Call or WhatsApp us for details.",
    },
    order: 4,
    status: "published",
  },
  {
    id: "faq-appliances",
    question: { ar: "ما الأجهزة التي تصلحونها؟", en: "Which appliances do you repair?" },
    answer: {
      ar: "المكيفات والثلاجات والغسالات.",
      en: "Air conditioners, refrigerators and washing machines.",
    },
    order: 5,
    status: "published",
  },
  // Category-specific (factual)
  {
    id: "faq-ac-frequency",
    question: { ar: "كم مرة يحتاج المكيف إلى تنظيف؟", en: "How often should an AC be cleaned?" },
    answer: {
      ar: "يُنصح بالتنظيف الدوري قبل موسم الصيف، وعند ملاحظة ضعف التبريد. يمكن للفني تحديد الفترة الأنسب حسب حالة الجهاز.",
      en: "Seasonal cleaning before summer is recommended, and whenever cooling weakens. The technician can advise the right interval for your unit.",
    },
    categorySlug: "ac",
    order: 6,
    status: "published",
  },
  {
    id: "faq-fridge-food",
    question: { ar: "هل أفصل الثلاجة قبل زيارة الفني؟", en: "Should I unplug the fridge before the visit?" },
    answer: {
      ar: "اتركها تعمل بشكل طبيعي إن أمكن، ليتمكن الفني من فحصها أثناء التشغيل، وسيرشدك عند الحاجة لأي إجراء.",
      en: "Leave it running normally if possible so the technician can inspect it in operation; they will guide you if anything else is needed.",
    },
    categorySlug: "refrigerator",
    order: 7,
    status: "published",
  },
  {
    id: "faq-washer-models",
    question: { ar: "هل تصلحون جميع أنواع الغسالات؟", en: "Do you repair all washing machine types?" },
    answer: {
      ar: "نعمل على الأنواع الشائعة من الغسالات الأوتوماتيك والعادية. أخبرنا بنوع الغسالة ومشكلتها عند الحجز.",
      en: "We service common automatic and standard washing machines. Tell us the type and the problem when booking.",
    },
    categorySlug: "washing-machine",
    order: 8,
    status: "published",
  },
  {
    id: "faq-emergency-scope",
    question: { ar: "ما الذي تشمله خدمة الطوارئ؟", en: "What does the emergency service cover?" },
    answer: {
      ar: "نستقبل البلاغات العاجلة للمكيفات والثلاجات والغسالات خلال ساعات العمل اليومية من 10 صباحًا حتى 11 مساءً.",
      en: "We receive urgent reports for ACs, refrigerators and washing machines during daily working hours, 10 AM–11 PM.",
    },
    categorySlug: "emergency",
    order: 9,
    status: "published",
  },
];

/**
 * Approved work photos (from the project assets review) — they fill the
 * home bento and the /work gallery. Only real work photos of the business's
 * own trade are seeded; nothing staged or other-brand.
 */
const tagByKey = {
  acIndoor: "ac",
  acTeam: "ac",
  refrigerator: "refrigerator",
  acOutdoor: "ac",
} as const;

export const seedPhotos: WorkPhoto[] = GALLERY_ORDER.map((key, i) => {
  const img = APPROVED_IMAGES[key];
  return {
    id: `img-${key}`,
    url: img.src,
    caption: img.alt,
    tag: tagByKey[key],
    order: i + 1,
    status: "published",
  } satisfies WorkPhoto;
});

export const seedSettings: SiteSettings = {  businessName: "للتبريد والتكييف",
  phone: "+966535757650",
  whatsapp: "966535757650",
  address: {
    ar: "RQFP+H7C، المونسية، الرياض، المملكة العربية السعودية",
    en: "RQFP+H7C, Al Munsiah, Riyadh, Saudi Arabia",
  },
  mapsLink: "https://www.google.com/maps/dir/?api=1&destination=RQFP%2BH7C%20Al%20Munsiyah%20Riyadh",
  emergencyEnabled: true,
  defaultWhatsappMessage: {
    ar: "السلام عليكم، أحتاج خدمة:",
    en: "Hello, I need a service:",
  },
  whatsappMessageMode: "current",
  emergencyWhatsappMessage: {
    ar: "السلام عليكم، لدي حالة طارئة:",
    en: "Hello, I have an emergency:",
  },
  seoTitle: {
    ar: "للتبريد والتكييف | صيانة مكيفات وثلاجات وغسالات في الرياض",
    en: "للتبريد والتكييف | AC, Fridge & Washer Repair in Riyadh",
  },
  seoDescription: {
    ar: "خدمة منزلية في جميع أحياء الرياض لصيانة المكيفات والثلاجات والغسالات منذ 2013. اتصل أو راسلنا واتساب — يوميًا من 10 صباحًا حتى 11 مساءً.",
    en: "Home service across Riyadh for AC, refrigerator and washing machine repair. Since 2013. Call or WhatsApp us — daily 10 AM–11 PM.",
  },
};
