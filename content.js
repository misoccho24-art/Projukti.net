/* =========================================================
   CONTENT LOADER
   ---------------------------------------------------------
   Loads editable site content from Firestore and applies it
   to any element carrying a data-edit="path.to.field"
   attribute. If Firestore is unreachable or a field hasn't
   been edited yet, the page simply keeps whatever text is
   already hardcoded in the HTML — nothing breaks.

   Used by index.html, contact.html, timeline.html, and
   admin.html.
   ========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const CONTENT_DOC = doc(db, "site", "content");

// Default content = exactly what's currently hardcoded on the pages.
// This is the fallback used until the client saves their first edit.
export const DEFAULT_CONTENT = {
  site: {
    brandName: "Dr. Robiul Islam (Rony)",
    brandTag: "ENT & Head-Neck Surgeon"
  },
  hero: {
    ratingBadge: "5.0 Rating — 25 Google Reviews",
    eyebrow: "Sherpur's Experienced ENT Specialist",
    title: "Precise Care for Your Wellbeing",
    role: "Dr. Md. Robiul Islam (Rony) — MBBS, DLO (ENT, BSMMU), Assistant Professor, Department of ENT & Head-Neck Surgery, Kumudini Women's Medical College & Hospital",
    sub: "Nearly 10 years of experience — specializing in head-neck cancer surgery, micro-ear surgery, facial cosmetic surgery, and sleep apnea surgery.",
    ctaPrimary: "Call to Book Appointment",
    ctaSecondary: "View Services"
  },
  qualifications: [
    "MBBS",
    "DLO (ENT, BSMMU)",
    "Nearly 10 Years of Experience"
  ],
  servicesSection: {
    eyebrow: "Services",
    heading: "Our Services"
  },
  services: [
    "Nasal Blockage Treatment",
    "Ear Wax Removal",
    "Tinnitus Treatment",
    "Snoring & Sleep Apnea Consultation",
    "Children's ENT Care",
    "Facial Cosmetics Surgery",
    "Thyroid Surgery",
    "Parotid Surgery",
    "Head-Neck Cancer Surgery",
    "Ear Surgery",
    "FESS Surgery",
    "Head-Neck Reconstruction Surgery",
    "UPPP (Sleep Surgery)",
    "ENT Consultation",
    "Ear Infection Treatment",
    "Tonsil Treatment",
    "Hearing Loss Evaluation",
    "Voice Disorder Treatment",
    "Nasal Allergy Treatment",
    "Throat Pain Treatment",
    "Head & Neck Surgery Consultation",
    "Vertigo & Dizziness Treatment"
  ],
  scheduleSection: {
    eyebrow: "Availability",
    heading: "Schedule & Chamber",
    locationLine: "Hospital Road, Sadar, Sherpur-2100",
    ctaText: "Call to Book Appointment"
  },
  contact: {
    phone: "01710-258974",
    email: "ronykyamc@gmail.com",
    hours: "Daily 11:00 AM - 8:00 PM",
    address: "Hospital Road, Sadar, Sherpur"
  },
  contactPage: {
    heroTitle: "Contact",
    heroSub: "Contact us for appointments or any information."
  },
  timelinePage: {
    eyebrow: "Journey",
    title: "Life Journey & Achievements",
    sub: "From student life to today — the journey of becoming a doctor."
  },
  schedule: [
    { day: "Saturday", time: "2:00 PM - 8:00 PM", location: "Proyukti Diagnostic Center" },
    { day: "Sunday", time: "2:00 PM - 8:00 PM", location: "Proyukti Diagnostic Center" },
    { day: "Monday", time: "4:00 PM - 8:00 PM", location: "Uttara Specialized Hospital, Savar" },
    { day: "Tuesday", time: "10:00 AM", location: "Jamalpur Uchcharas Hospital" },
    { day: "Tuesday", time: "8:00 PM", location: "Kumudini Women's Medical College & Hospital" },
    { day: "Wednesday", time: "10:00 AM", location: "Jamalpur Uchcharas Hospital" },
    { day: "Wednesday", time: "2:00 PM - 8:00 PM", location: "Proyukti Diagnostic Center" },
    { day: "Thursday", time: "10:00 AM", location: "Jamalpur Uchcharas Hospital" },
    { day: "Friday", time: "Closed", location: "Weekly Off" }
  ],
  timeline: [
    { year: 1988, type: "birth", title: "Birth", description: "Born in Shitol Kursha village, Jamalpur district.", image: "", estimated: false },
    { year: 2005, type: "education", title: "Passed SSC", description: "Passed the SSC examination from Jamalpur Zilla School.", image: "", estimated: false },
    { year: 2007, type: "education", title: "Passed HSC", description: "Completed HSC from Government Ashek Mahmud College.", image: "", estimated: false },
    { year: 2013, type: "education", title: "Completed MBBS", description: "Completed MBBS degree from Khwaja Yunus Ali Medical College, under Rajshahi University.", image: "", estimated: true },
    { year: 2014, type: "career", title: "Joined as Medical Officer", description: "Began his career as a Medical Officer in the Orthopedics department.", image: "", estimated: true },
    { year: 2015, type: "education", title: "Began Higher Studies — ENT", description: "Enrolled at Sir Salimullah Medical College for higher studies in ENT (Ear, Nose & Throat).", image: "", estimated: true },
    { year: 2017, type: "career", title: "Joined as Registrar", description: "Joined as Registrar at Kumudini Women's Medical College, Tangail.", image: "", estimated: false },
    { year: 2019, type: "career", title: "Joined as ENT Specialist", description: "Joined Khwaja Yunus Ali Medical College as an ENT Specialist.", image: "", estimated: false },
    { year: 2021, type: "career", title: "Joined as Assistant Professor", description: "Rejoined Kumudini Women's Medical College, Tangail, as Assistant Professor.", image: "", estimated: false }
  ],
  footer: {
    quickLinksLabel: "Quick Links",
    contactLabel: "Contact",
    followLabel: "Follow",
    copyright: "© 2026 | Developed by M I"
  }
};

function getByPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// Deep-merge saved content over the defaults, so a page never
// ends up missing a field just because it wasn't edited yet.
function mergeContent(base, saved) {
  const out = JSON.parse(JSON.stringify(base));
  if (!saved) return out;

  if (saved.site) Object.assign(out.site, saved.site);
  if (saved.hero) Object.assign(out.hero, saved.hero);
  if (Array.isArray(saved.qualifications)) out.qualifications = saved.qualifications;
  if (saved.servicesSection) Object.assign(out.servicesSection, saved.servicesSection);
  if (Array.isArray(saved.services)) out.services = saved.services;
  if (saved.scheduleSection) Object.assign(out.scheduleSection, saved.scheduleSection);
  if (saved.contact) Object.assign(out.contact, saved.contact);
  if (saved.contactPage) Object.assign(out.contactPage, saved.contactPage);
  if (saved.timelinePage) Object.assign(out.timelinePage, saved.timelinePage);
  if (Array.isArray(saved.schedule)) out.schedule = saved.schedule;
  if (Array.isArray(saved.timeline)) out.timeline = saved.timeline;
  if (saved.footer) Object.assign(out.footer, saved.footer);

  return out;
}

export async function loadContent() {
  try {
    const snap = await getDoc(CONTENT_DOC);
    return mergeContent(DEFAULT_CONTENT, snap.exists() ? snap.data() : null);
  } catch (err) {
    console.warn("Could not reach Firestore, using page defaults.", err);
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(content) {
  await setDoc(CONTENT_DOC, content);
}

// Applies simple text fields (data-edit="hero.title" etc.) to the DOM.
// Call this after loadContent() on the public-facing pages.
export function applyTextFields(content) {
  document.querySelectorAll("[data-edit]").forEach(el => {
    const value = getByPath(content, el.getAttribute("data-edit"));
    if (value !== undefined) el.textContent = value;
  });
}
