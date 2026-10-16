/**
 * English UI strings. Copy comes from the PRD (§7.2, §14.1) — never invented.
 * This file defines the Dictionary shape that ar.ts must satisfy.
 */
const en = {
  nav: {
    services: "Services",
    work: "Work / Photos",
    blogs: "Blogs",
    areas: "Areas",
    about: "About",
    contact: "Contact",
  },
  legal: {
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
  },
  cta: {
    callNow: "CALL NOW",
    whatsapp: "WHATSAPP",
    bookService: "BOOK SERVICE",
  },
  hero: {
    pill: "Home service · All Riyadh",
    h1: {
      pre: "Your AC, Fridge & Washer — ",
      accent: "Repaired",
      post: " at Home.",
    },
    sub: "Home service across all of Riyadh for AC repair, cleaning and installation, plus refrigerator and washing machine repair. Call now — we'll take it from there.",
  },
  trust: [
    "Since 2013",
    "Riyadh",
    "Home service",
    "Emergency service",
    "Daily 10 AM–11 PM",
  ],
  home: {
    services: {
      title: "Our Services",
      subtitle:
        "AC, refrigerator and washing machine services at your home — anywhere in Riyadh.",
      viewAll: "View all services",
      items: [
        {
          id: "ac",
          title: "AC Services",
          desc: "Repair, cleaning, installation and maintenance for all AC types.",
          subs: [
            "AC Repair",
            "AC Cleaning",
            "AC Installation",
            "AC Maintenance",
          ],
        },
        {
          id: "refrigerator",
          title: "Refrigerator Services",
          desc: "Repair and maintenance for refrigerators and freezers.",
          subs: [
            "Refrigerator Repair",
            "Fridge Not Cooling",
            "Fridge Water Leakage",
            "Refrigerator Maintenance",
          ],
        },
        {
          id: "washing-machine",
          title: "Washing Machine Services",
          desc: "Repair and maintenance for all washing machine types.",
          subs: [
            "Washing Machine Repair",
            "Machine Not Working",
            "Water Problems",
            "Washing Machine Maintenance",
          ],
        },
        {
          id: "emergency",
          title: "Emergency Service",
          desc: "Urgent AC, refrigerator and washing machine help — daily 10 AM–11 PM.",
          subs: [
            "Emergency AC Repair",
            "Emergency Refrigerator Repair",
            "Emergency Washing Machine Repair",
          ],
        },
      ],
    },
    finder: {
      title: "What do you need help with?",
      subtitle: "Pick your problem and book — a technician will contact you.",
      chips: [
        "AC Not Cooling",
        "AC Water Leakage",
        "AC Cleaning",
        "AC Installation",
        "Fridge Not Cooling",
        "Fridge Water Leakage",
        "Washing Machine Problems",
      ],
    },
    emergency: {
      title: "Sudden breakdown?",
      text: "Don't sweat it — call or message us on WhatsApp. We receive emergency reports daily from 10 AM to 11 PM, across all Riyadh.",
      call: "Emergency Call",
    },
    whyUs: {
      title: "Why Choose Us?",
      items: [
        {
          icon: "clock",
          title: "Since 2013",
          text: "Serving Riyadh homes for over a decade.",
        },
        {
          icon: "award",
          title: "16+ Years Experience",
          text: "Technicians with long hands-on experience in cooling and appliances.",
        },
        {
          icon: "map",
          title: "All Riyadh Areas",
          text: "We come to you, wherever you are in Riyadh.",
        },
        {
          icon: "house",
          title: "Home Service",
          text: "Repairs done at your home — no need to move the appliance.",
        },
        {
          icon: "siren",
          title: "Emergency Service",
          text: "Urgent help during daily working hours.",
        },
        {
          icon: "zap",
          title: "Fast Response",
          text: "Call or WhatsApp and we'll arrange the visit.",
        },
        {
          icon: "message",
          title: "WhatsApp Booking",
          text: "Book in seconds with a WhatsApp message.",
        },
        {
          icon: "calendar",
          title: "Daily 10 AM–11 PM",
          text: "Every day, from 10 in the morning until 11 at night.",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      steps: [
        { title: "Call or WhatsApp", text: "Reach us by phone or WhatsApp." },
        { title: "Tell us the service", text: "Describe what needs fixing." },
        { title: "Technician contacts you", text: "We assign and coordinate the visit." },
        { title: "Home service", text: "The repair happens at your home." },
      ],
    },
    gallery: {
      title: "Our Work",
      subtitle: "Real photos from our jobs and shop — added by the owner soon.",
      placeholderNote: "Photo placeholder",
    },
    about: {
      title: "About Us",
      paragraphs: [
        "للتبريد والتكييف is a Riyadh home-service business for air conditioners, refrigerators and washing machines — serving homes across Riyadh since 2013.",
        "We come to your home: AC repair, cleaning, installation and maintenance, refrigerator and washing machine repair, plus emergency service during daily working hours (10 AM–11 PM).",
      ],
      frameNote: "Photo placeholder",
    },
    areas: {
      title: "Service Areas",
      text: "We serve homes across all of Riyadh. More areas are added by the owner over time.",
      allRiyadh: "All Riyadh areas",
      addressLabel: "Address",
      getDirections: "Get Directions",
      mapTitle: "Shop location on Google Maps",
    },
    finalCta: {
      title: "Need a technician in Riyadh?",
      text: "Call or WhatsApp us now — daily 10 AM–11 PM.",
    },
  },
  book: {
    title: "Book Service",
    note: "The booking form is being prepared. For now, call us or message us on WhatsApp directly.",
    steps: {
      service: "Service",
      subService: "Sub-service (optional)",
      location: "Location",
      problem: "Problem details",
      time: "Preferred time",
      details: "Your details",
      review: "Review",
    },
    location: {
      title: "Where is the appliance?",
      manual: "District, street, landmark",
      manualLabel: "Describe your location",
      useMine: "Use my current location",
      detecting: "Getting location…",
      denied: "Location unavailable — you can type it instead.",
    },
    problem: {
      title: "What is the problem?",
      hint: "Optional — helps the technician prepare.",
      placeholder: "e.g. AC runs but does not cool the room",
    },
    time: {
      title: "When should the technician come?",
      asap: "As soon as possible",
      today: "Today",
      pick: "Pick date & time",
      date: "Date",
      timeLabel: "Time (10:00–23:00)",
    },
    details: {
      title: "Your details",
      name: "Name",
      phone: "Phone / WhatsApp",
      phoneHint: "05xxxxxxxx, +9665xxxxxxxx or +92…",
      notes: "Extra notes (optional)",
      invalidPhone: "Please enter a valid mobile number, e.g. 05xxxxxxxx or +92 3xx xxxxxxx.",
      required: "This field is required.",
    },
    review: {
      title: "Review your booking",
      edit: "Edit",
      send: "Send via WhatsApp",
      sending: "Redirecting to WhatsApp…",
      previewTitle: "Message that will open in WhatsApp",
    },
    success: {
      title: "Booking sent!",
      body: "If WhatsApp did not open, use the buttons below.",
      openAgain: "Open WhatsApp",
      copy: "Copy message",
      copied: "Copied",
      callInstead: "Call us instead",
    },
    chooseService: "Please choose a service to continue.",
    pickDateTime: "Please pick a date and time.",
    back: "Back",
    next: "Next",
    skip: "Skip",
  },
  pages: {
    services: {
      title: "Our Services",
      subtitle:
        "AC, refrigerator and washing machine services at your home — anywhere in Riyadh.",
      problemsTitle: "Problem-based services",
      processTitle: "How the service works",
      viewCategory: "Explore",
    },
    category: {
      subServicesTitle: "Services",
      problemsTitle: "Common problems we handle",
      processTitle: "How it works",
      faqTitle: "Frequently asked questions",
    },
    detail: {
      problemsTitle: "Problems covered",
      checksTitle: "What the technician checks",
      processTitle: "How the service works",
      relatedTitle: "Related problems",
      faqTitle: "Service FAQ",
    },
    work: {
      title: "Work / Shop Photos",
      subtitle: "Real photos from our jobs and shop.",
      empty: "Photos are coming soon — the gallery fills once the owner publishes real work photos.",
      filters: { all: "All", ac: "AC", refrigerator: "Refrigerators", "washing-machine": "Washing machines", shop: "Shop" },
    },
    blog: {
      title: "Blog",
      subtitle: "Notes and tips from our work.",
      empty: "No posts yet — new articles are coming soon.",
      readMore: "Read more",
      back: "Back to blog",
      prev: "Previous post",
      next: "Next post",
      fallbackNotice: "This article is shown in its original language.",
    },
    areas: {
      title: "Service Areas",
      subtitle: "We serve homes across all of Riyadh.",
      empty: "Detailed area list is coming soon — we cover all of Riyadh.",
    },
    about: {
      title: "About Us",
    },
    contact: {
      title: "Contact Us",
      subtitle: "Call is the fastest way to reach us.",
      callTitle: "Call us now",
      copyNumber: "Copy number",
      copied: "Copied",
      hoursTitle: "Working hours",
      hoursValue: "Daily · 10:00 AM – 11:00 PM",
      addressTitle: "Address",
      servicesTitle: "Services",
      emergencyTitle: "Emergency",
      emergencyText: "Urgent AC, refrigerator or washing machine problems — call or WhatsApp during working hours.",
    },
    legal: {
      tocTitle: "On this page",
    },
  },
  notFound: {
    code: "404",
    title: "Page not found",
    text: "The page you are looking for doesn't exist or has moved.",
    home: "Home",
    services: "Services",
  },
  openNow: "Open now · 10 AM – 11 PM",
  a11y: {
    skipToContent: "Skip to content",
    switchLabel: "العربية",
    switchAria: "التبديل إلى العربية",
    mobileActions: "Quick actions",
    expandService: "Show sub-services",
  },
  footer: {
    navTitle: "Site",
    contactTitle: "Contact",
    hours: "Daily 10 AM – 11 PM",
  },
  meta: {
    title: "AC, Fridge & Washer Repair in Riyadh | للتبريد والتكييف",
    description:
      "Home service across all of Riyadh for AC, refrigerator and washing machine repair. Since 2013. Call or WhatsApp us — daily 10 AM–11 PM.",
  },
};

export type Dictionary = typeof en;
export default en;
