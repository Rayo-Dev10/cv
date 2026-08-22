/** Loads the resume data and renders accessible, ATS-friendly HTML. */
import { el, parseCertItem } from './helpers.js';

export async function loadData() {
  const [profile, experience, education, certifications] = await Promise.all([
    'profile.json?v=20260822-1',
    'experiencia.json?v=20260822-1',
    'formacion.json?v=20260822-1',
    'certificaciones.json?v=20260822-1'
  ].map(file => fetch(file).then(response => {
    if (!response.ok) throw new Error(`No se pudo cargar ${file.split('?')[0]}`);
    return response.json();
  })));

  document.getElementById('resumeHeader').innerHTML = buildHeader(profile);
  document.getElementById('profileDescription').textContent = profile.description;
  document.getElementById('skillsList').innerHTML = buildSkills(profile.skills);
  document.getElementById('experienceList').innerHTML = experience.map(buildExperience).join('');
  document.getElementById('educationList').innerHTML = education.map(buildEducation).join('');
  document.getElementById('languagesList').innerHTML = Object.entries(profile.languages)
    .map(([language, level]) => `<span><strong>${language}:</strong> ${level}</span>`).join('');
  const list = document.getElementById('certificationList');
  certifications.forEach(category => list.appendChild(buildCertificationCategory(category)));
}

function buildHeader(profile) {
  const phone = profile.contact.phone.replace(/\s+/g, '');
  const whatsapp = profile.contact.whatsapp.replace(/\s+/g, '');
  return `<h1>${profile.name}</h1><p class="professional-title">${profile.title}</p>
    <address class="contact-list"><a href="mailto:${profile.contact.email}">${profile.contact.email}</a><a href="tel:${phone}">${profile.contact.phone}</a><a href="https://wa.me/${whatsapp.replace('+', '')}" target="_blank" rel="noopener">WhatsApp: ${profile.contact.whatsapp}</a><span>${profile.contact.location}, Colombia</span></address>`;
}

function buildSkills(skills) {
  return Object.entries(skills).map(([category, items]) => `<p><strong>${category}:</strong> ${items.join('; ')}.</p>`).join('');
}

function buildExperience(item) {
  return `<article class="entry"><div class="entry-heading"><h3>${item.role} — ${item.company}</h3><p class="date">${item.period}</p></div><ul>${item.details.map(detail => `<li>${detail}</li>`).join('')}</ul></article>`;
}

function buildEducation(item) {
  return `<article class="entry entry-compact"><div class="entry-heading"><h3>${item.program}</h3><p>${item.institution} | ${item.detail}</p></div></article>`;
}

function buildCertificationCategory(category) {
  const items = category.items.map(item => parseCertItem(item)).filter(Boolean);
  return el('article', 'certification-category', `<h3>${category.category}</h3><ul>${items.map(item => `<li>${item.courses.join(', ')} — ${item.entity}, ${item.year}</li>`).join('')}</ul>`);
}
