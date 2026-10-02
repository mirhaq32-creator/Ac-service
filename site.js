
const PHONE = "+966535757650";
const WA = "966535757650";
const path = location.pathname.replace(/\/+$/,"") || "/";
const isAR = document.documentElement.lang === "ar";
document.body.classList.toggle("rtl", isAR);

function waLink(message){
  return `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;
}
document.querySelectorAll("[data-wa]").forEach(a=>{
  const base=a.getAttribute("data-wa") || (isAR ? "السلام عليكم، أحتاج خدمة من للتبريد والتكييف." : "Hello, I need a service from للتبريد والتكييف.");
  a.href=waLink(base);
});
document.querySelectorAll("[data-call]").forEach(a=>a.href=`tel:${PHONE}`);

const menuBtn=document.querySelector(".mobile-menu");
const drawer=document.querySelector(".drawer");
if(menuBtn && drawer){
  menuBtn.addEventListener("click",()=>drawer.classList.toggle("open"));
  drawer.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>drawer.classList.remove("open")));
}

document.querySelectorAll(".faq-q").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const item=btn.closest(".faq-item");
    item.classList.toggle("open");
  });
});

document.querySelectorAll("[data-problem]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const val=btn.dataset.problem;
    const service=document.querySelector("#service");
    const details=document.querySelector("#details");
    if(service) service.value=val;
    if(details) details.value=(details.value ? details.value+"\n" : "")+val;
    document.querySelector("#booking")?.scrollIntoView({behavior:"smooth"});
  });
});

const form=document.querySelector("#bookingForm");
const toast=document.querySelector(".toast");
if(form){
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const data=new FormData(form);
    const name=data.get("name")||"";
    const service=data.get("service")||"";
    const area=data.get("area")||"";
    const preferred=data.get("preferred")||"";
    const details=data.get("details")||"";
    const msg = isAR
      ? `السلام عليكم، أريد حجز خدمة من للتبريد والتكييف.%0Aالاسم: ${name}%0Aالخدمة: ${service}%0Aالحي/الموقع: ${area}%0Aالوقت المفضل: ${preferred}%0Aالتفاصيل: ${details}`
      : `Hello, I would like to book a service from للتبريد والتكييف.%0AName: ${name}%0AService: ${service}%0AArea/location: ${area}%0APreferred time: ${preferred}%0ADetails: ${details}`;
    window.location.href=`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  });
}

const lb=document.querySelector(".lightbox");
document.querySelectorAll("[data-lightbox]").forEach(img=>{
  img.addEventListener("click",()=>{
    if(!lb) return;
    lb.querySelector("img").src=img.src;
    lb.classList.add("open");
  });
});
if(lb){
  lb.addEventListener("click",e=>{if(e.target===lb || e.target.classList.contains("close-light")) lb.classList.remove("open")});
}

const year=document.querySelector("[data-year]");
if(year) year.textContent=new Date().getFullYear();

const langLink=document.querySelector("[data-lang-switch]");
if(langLink){
  const target=langLink.dataset.target;
  langLink.href=target;
}
