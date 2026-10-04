const PHONE = "+966535757650";
const WA = "966535757650";

const path = location.pathname.replace(/\/+$/, "") || "/";
const isAR = document.documentElement.lang === "ar";

document.body.classList.toggle("rtl", isAR);

/* =========================
   WhatsApp
========================= */

function waLink(message) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll("[data-wa]").forEach((a) => {
  const base =
    a.getAttribute("data-wa") ||
    (isAR
      ? "السلام عليكم، أحتاج خدمة من للتبريد والتكييف."
      : "Hello, I need a service from للتبريد والتكييف.");

  a.href = waLink(base);
  a.target = "_blank";
  a.rel = "noopener";
});

/* =========================
   Phone / Call
========================= */

document.querySelectorAll("[data-call]").forEach((a) => {
  a.href = `tel:${PHONE}`;
});

/* =========================
   Mobile Menu
========================= */

const menuBtn = document.querySelector(".mobile-menu");
const drawer = document.querySelector(".drawer");

if (menuBtn && drawer) {
  const setMenuState = (open) => {
    drawer.classList.toggle("open", open);

    menuBtn.setAttribute(
      "aria-expanded",
      String(open)
    );

    menuBtn.setAttribute(
      "aria-label",
      open
        ? isAR
          ? "إغلاق القائمة"
          : "Close menu"
        : isAR
        ? "فتح القائمة"
        : "Open menu"
    );
  };

  setMenuState(false);

  menuBtn.addEventListener("click", () => {
    setMenuState(
      !drawer.classList.contains("open")
    );
  });

  drawer.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      setMenuState(false);
    });
  });
}

/* =========================
   FAQ Accordion
========================= */

document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.setAttribute("aria-expanded", "false");

  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");

    if (!item) return;

    const open = item.classList.toggle("open");

    btn.setAttribute(
      "aria-expanded",
      String(open)
    );
  });
});

/* =========================
   Problem / Service Finder
========================= */

document.querySelectorAll("[data-problem]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.problem || "";

    const service =
      document.querySelector("#service");

    const details =
      document.querySelector("#details");

    if (service) {
      const serviceMap = [
        [/مكيف|مكيفات|تكييف|ac/i, "صيانة المكيفات"],
        [/ثلاج|refrigerator|fridge/i, "إصلاح الثلاجات"],
        [/غسال|washing/i, "إصلاح الغسالات"],
        [/عاجل|طوارئ|urgent|emergency/i, "خدمة عاجلة"],
      ];

      const mapped = serviceMap.find(
        ([pattern]) => pattern.test(val)
      );

      const desired = mapped
        ? mapped[1]
        : val;

      const option = [
        ...service.options,
      ].find(
        (o) =>
          o.textContent.trim() === desired ||
          o.value === desired
      );

      if (option) {
        service.value = option.value;
      }
    }

    if (details) {
      details.value = details.value
        ? `${details.value}\n${val}`
        : val;
    }

    document
      .querySelector("#booking")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  });
});

/* =========================
   Booking Form
========================= */

const form =
  document.querySelector("#bookingForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);

    const name = String(
      data.get("name") || ""
    ).trim();

    const service = String(
      data.get("service") || ""
    ).trim();

    const area = String(
      data.get("area") || ""
    ).trim();

    const preferred = String(
      data.get("preferred") || ""
    ).trim();

    const details = String(
      data.get("details") || ""
    ).trim();

    const msg = isAR
      ? [
          "السلام عليكم، أريد حجز خدمة من للتبريد والتكييف.",
          `الاسم: ${name}`,
          `الخدمة: ${service}`,
          `الحي/الموقع: ${area}`,
          `الوقت المفضل: ${
            preferred || "لم يحدد"
          }`,
          `التفاصيل: ${
            details || "لا توجد تفاصيل إضافية"
          }`,
        ].join("\n")
      : [
          "Hello, I would like to book a service from للتبريد والتكييف.",
          `Name: ${name}`,
          `Service: ${service}`,
          `Area/location: ${area}`,
          `Preferred time: ${
            preferred || "Not specified"
          }`,
          `Details: ${
            details || "No additional details"
          }`,
        ].join("\n");

    /*
      encodeURIComponent() happens only once
      inside waLink(), so WhatsApp line breaks
      and Arabic text are encoded correctly.
    */

    window.location.href = waLink(msg);
  });
}

/* =========================
   Lightbox / Gallery
========================= */

const lb =
  document.querySelector(".lightbox");

document
  .querySelectorAll("[data-lightbox]")
  .forEach((img) => {
    img.addEventListener("click", () => {
      if (!lb) return;

      const target =
        lb.querySelector("img");

      if (!target) return;

      target.src =
        img.currentSrc || img.src;

      target.alt = img.alt || "";

      lb.classList.add("open");

      document.body.style.overflow =
        "hidden";
    });
  });

if (lb) {
  const closeLightbox = () => {
    lb.classList.remove("open");

    document.body.style.overflow =
      "";
  };

  lb.addEventListener("click", (e) => {
    if (
      e.target === lb ||
      e.target.classList.contains(
        "close-light"
      )
    ) {
      closeLightbox();
    }
  });

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    }
  );
}

/* =========================
   Current Year
========================= */

const year =
  document.querySelector("[data-year]");

if (year) {
  year.textContent =
    String(new Date().getFullYear());
}

/* =========================
   Arabic / English Switch
========================= */

const langLink =
  document.querySelector(
    "[data-lang-switch]"
  );

if (langLink) {
  let target;

  /*
    Root:
    /
    goes to Arabic homepage.
  */

  if (path === "/") {
    target = "/ar/";
  }

  /*
    Arabic page:
    /ar/
    /ar/services/
    /ar/services/ac-repair/
    
    becomes:
    /en/
    /en/services/
    /en/services/ac-repair/
  */

  else if (
    path === "/ar" ||
    path.startsWith("/ar/")
  ) {
    target =
      "/en" +
      (path.slice(3) || "/");
  }

  /*
    English page:
    /en/
    /en/services/
    /en/services/ac-repair/
    
    becomes:
    /ar/
    /ar/services/
    /ar/services/ac-repair/
  */

  else if (
    path === "/en" ||
    path.startsWith("/en/")
  ) {
    target =
      "/ar" +
      (path.slice(3) || "/");
  }

  /*
    Any other page:
    fallback to opposite language homepage.
  */

  else {
    target = isAR
      ? "/en/"
      : "/ar/";
  }

  langLink.href =
    target.endsWith("/")
      ? target
      : `${target}/`;
}
