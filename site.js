const PHONE = "+966535757650";
const WA = "966535757650";

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const isAR = document.documentElement.lang === "ar";

document.body.classList.toggle("rtl", isAR);

function waLink(message) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;
}

/* -------------------------
   Call + WhatsApp links
------------------------- */

document.querySelectorAll("[data-wa]").forEach((link) => {
  const message =
    link.getAttribute("data-wa-message") ||
    (isAR
      ? "السلام عليكم، أحتاج خدمة من للتبريد والتكييف."
      : "Hello, I need a service from للتبريد والتكييف.");

  link.href = waLink(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

document.querySelectorAll("[data-call]").forEach((link) => {
  link.href = `tel:${PHONE}`;
});

/* -------------------------
   Mobile navigation
------------------------- */

const menuBtn = document.querySelector(".mobile-menu");
const drawer = document.querySelector(".drawer");

if (menuBtn && drawer) {
  const drawerId = drawer.id || "mobile-navigation";
  drawer.id = drawerId;
  menuBtn.setAttribute("aria-controls", drawerId);

  const setMenuState = (open) => {
    drawer.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));

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
    setMenuState(!drawer.classList.contains("open"));
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("click", (event) => {
    if (
      drawer.classList.contains("open") &&
      !drawer.contains(event.target) &&
      !menuBtn.contains(event.target)
    ) {
      setMenuState(false);
    }
  });
}

/* -------------------------
   FAQ
------------------------- */

document.querySelectorAll(".faq-q").forEach((button) => {
  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");

    if (!item) return;

    const open = item.classList.toggle("open");

    button.setAttribute(
      "aria-expanded",
      String(open)
    );
  });
});

/* -------------------------
   Problem finder
------------------------- */

function getServiceForProblem(value) {
  const text = String(value || "").toLowerCase();

  if (
    /مكيف|مكيفات|تكييف|تنظيف المكيف|تركيب مكيف|غاز|تسريب ماء من المكيف/.test(
      text
    ) ||
    /ac\b|air conditioner|cooling|ac cleaning|ac installation|gas refill|gas leak|ac water leakage/.test(
      text
    )
  ) {
    return isAR
      ? "صيانة المكيفات"
      : "AC repair/service";
  }

  if (
    /ثلاج|refrigerator|fridge/.test(text)
  ) {
    return isAR
      ? "إصلاح الثلاجات"
      : "Refrigerator repair";
  }

  if (
    /غسال|washing machine|washer/.test(text)
  ) {
    return isAR
      ? "إصلاح الغسالات"
      : "Washing machine repair";
  }

  if (
    /عاجل|طوارئ|urgent|emergency|electrical fault|عطل كهربائي/.test(
      text
    )
  ) {
    return isAR
      ? "خدمة عاجلة"
      : "Urgent service";
  }

  return "";
}

function prepareBooking(problem) {
  const bookingForm =
    document.querySelector("#bookingForm");

  if (!bookingForm) {
    const bookingPath = isAR
      ? "/ar/book/"
      : "/en/book/";

    const url = new URL(
      bookingPath,
      window.location.origin
    );

    if (problem) {
      url.searchParams.set(
        "problem",
        problem
      );
    }

    window.location.href =
      url.toString();

    return;
  }

  const service =
    bookingForm.querySelector("#service");

  const details =
    bookingForm.querySelector("#details");

  const desiredService =
    getServiceForProblem(problem);

  if (service && desiredService) {
    const option = [
      ...service.options,
    ].find(
      (option) =>
        option.textContent.trim() ===
          desiredService ||
        option.value === desiredService
    );

    if (option) {
      service.value =
        option.value;
    }
  }

  if (details && problem) {
    details.value = details.value
      ? `${details.value}\n${problem}`
      : problem;
  }

  bookingForm.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  details?.focus({
    preventScroll: true,
  });
}

document
  .querySelectorAll("[data-problem]")
  .forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        prepareBooking(
          button.dataset.problem ||
            button.textContent.trim()
        );
      }
    );
  });

/* -------------------------
   Booking form
------------------------- */

const form =
  document.querySelector(
    "#bookingForm"
  );

if (form) {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const problem =
    params.get("problem");

  if (problem) {
    const service =
      form.querySelector("#service");

    const details =
      form.querySelector("#details");

    const desiredService =
      getServiceForProblem(problem);

    if (service && desiredService) {
      const option = [
        ...service.options,
      ].find(
        (option) =>
          option.textContent.trim() ===
            desiredService ||
          option.value === desiredService
      );

      if (option) {
        service.value =
          option.value;
      }
    }

    if (
      details &&
      !details.value
    ) {
      details.value =
        problem;
    }
  }

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data =
        new FormData(form);

      const name =
        String(
          data.get("name") || ""
        ).trim();

      const service =
        String(
          data.get("service") || ""
        ).trim();

      const area =
        String(
          data.get("area") || ""
        ).trim();

      const preferred =
        String(
          data.get("preferred") || ""
        ).trim();

      const details =
        String(
          data.get("details") || ""
        ).trim();

      const message = isAR
        ? [
            "السلام عليكم، أريد حجز خدمة من للتبريد والتكييف.",
            `الاسم: ${name}`,
            `الخدمة: ${service}`,
            `الحي/الموقع: ${area}`,
            `الوقت المفضل: ${
              preferred || "لم يحدد"
            }`,
            `التفاصيل: ${
              details ||
              "لا توجد تفاصيل إضافية"
            }`,
          ].join("\n")
        : [
            "Hello, I would like to book a service from للتبريد والتكييف.",
            `Name: ${name}`,
            `Service: ${service}`,
            `Area/location: ${area}`,
            `Preferred time: ${
              preferred ||
              "Not specified"
            }`,
            `Details: ${
              details ||
              "No additional details"
            }`,
          ].join("\n");

      window.location.href =
        waLink(message);
    }
  );
}

/* -------------------------
   Gallery lightbox
------------------------- */

const lightbox =
  document.querySelector(
    ".lightbox"
  );

document
  .querySelectorAll("[data-lightbox]")
  .forEach((image) => {
    image.setAttribute(
      "tabindex",
      "0"
    );

    image.setAttribute(
      "role",
      "button"
    );

    image.setAttribute(
      "aria-label",
      isAR
        ? "فتح الصورة بالحجم الكامل"
        : "Open image full size"
    );

    const openLightbox = () => {
      if (!lightbox) return;

      const target =
        lightbox.querySelector(
          "img"
        );

      if (!target) return;

      target.src =
        image.currentSrc ||
        image.src;

      target.alt =
        image.alt || "";

      lightbox.classList.add(
        "open"
      );

      document.body.style.overflow =
        "hidden";
    };

    image.addEventListener(
      "click",
      openLightbox
    );

    image.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          openLightbox();
        }
      }
    );
  });

if (lightbox) {
  const closeLightbox = () => {
    lightbox.classList.remove(
      "open"
    );

    document.body.style.overflow =
      "";
  };

  lightbox.addEventListener(
    "click",
    (event) => {
      if (
        event.target === lightbox ||
        event.target.classList.contains(
          "close-light"
        )
      ) {
        closeLightbox();
      }
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    }
  );
}

/* -------------------------
   Current year
------------------------- */

const year =
  document.querySelector(
    "[data-year]"
  );

if (year) {
  year.textContent = String(
    new Date().getFullYear()
  );
}

/* -------------------------
   Arabic / English switch
------------------------- */

const langLink =
  document.querySelector(
    "[data-lang-switch]"
  );

if (langLink) {
  let target;

  if (path === "/") {
    target = "/ar/";
  } else if (
    path === "/ar" ||
    path.startsWith("/ar/")
  ) {
    target =
      "/en" +
      (path.slice(3) || "/");
  } else if (
    path === "/en" ||
    path.startsWith("/en/")
  ) {
    target =
      "/ar" +
      (path.slice(3) || "/");
  } else {
    target = isAR
      ? "/en/"
      : "/ar/";
  }

  langLink.href =
    target.endsWith("/")
      ? target
      : `${target}/`;
}
