/**
 * Loads JSON data and fills the HTML with profile information.
 * Relies on helper utilities for DOM creation and parsing.
 */

import { el, splitCertStrings, parseCertItem } from './helpers.js';

export async function loadData() {
  const [profile, experiencia, formacion, certificaciones] = await Promise.all([
    fetch('profile.json').then(r => r.json()),
    fetch('experiencia.json').then(r => r.json()),
    fetch('formacion.json').then(r => r.json()),
    fetch('certificaciones.json').then(r => r.json())
  ]);

  const sidebar = document.getElementById('sidebar');
  const skillsHtml = Object.entries(profile.skills)
    .map(([cat, items]) => `
      <div>
        <h4 class="font-semibold text-gray-200 mb-2">${cat}:</h4>
        <ul class="space-y-1 pl-2">
          ${items.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  const languagesHtml = Object.entries(profile.languages)
    .map(([lang, lvl]) => `<p class="text-sm"><strong>${lang}:</strong> ${lvl}</p>`)
    .join('');
  sidebar.innerHTML = buildSidebar(profile, skillsHtml, languagesHtml);

  const description = document.getElementById('profileDescription');
  if (description) description.textContent = profile.description;

  document.getElementById('experienceList').innerHTML = experiencia.map(expToHtml).join('');
  document.getElementById('educationList').innerHTML = formacion.map(eduToHtml).join('');

  const certContainer = document.getElementById('certificationGrid');
  certificaciones.forEach(cat => certContainer.appendChild(buildCertCategory(cat)));
}

function buildSidebar(profile, skillsHtml, languagesHtml) {
  return `
    <div class="text-center mb-8">
      <img src="${profile.photoUrl}" alt="Foto de ${profile.name}" crossorigin="anonymous" class="rounded-full w-36 h-36 mx-auto mb-4 border-4 border-white shadow-lg">
      <h1 class="text-3xl font-bold">${profile.name}</h1>
      <h2 class="text-lg font-light text-gray-200">${profile.title}</h2>
    </div>
    <div class="mb-6">
      <h3 class="text-xl font-semibold border-b-2 border-edge-green pb-2 mb-4 text-edge-green">CONTACTO</h3>
      <ul class="space-y-3 text-sm">
        <li><i class="fas fa-envelope fa-fw w-6 icon-cyan"></i> <a href="mailto:${profile.contact.email}?subject=He%20observado%20tu%20hoja%20de%20vida,%20Rayo" class="hover:underline">${profile.contact.email}</a></li>
        <li><i class="fas fa-phone-alt fa-fw w-6 icon-cyan"></i> <a href="tel:${profile.contact.phone.replace(/\s+/g, '')}" class="hover:underline">${profile.contact.phone}</a></li>
        <li><i class="fab fa-whatsapp fa-fw w-6" style="color:#25D366"></i><a href="https://wa.me/573013068968?text=He%20visto%20tu%20hoja%20de%20vida%20y%20deseo%20formularte%20unas%20preguntas" target="_blank" rel="noopener" class="hover:underline">${profile.contact.whatsapp}</a></li>
        <li><i class="fas fa-map-marker-alt fa-fw w-6 icon-cyan"></i> ${profile.contact.location}</li>
      </ul>
    </div>
    <div class="mb-6">
      <h3 class="text-xl font-semibold border-b-2 border-edge-green pb-2 mb-4 text-edge-green">HABILIDADES</h3>
      <div class="text-sm space-y-4">
        ${skillsHtml}
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-xl font-semibold border-b-2 border-edge-green pb-2 mb-4 text-edge-green">IDIOMAS</h3>
      ${languagesHtml}
    </div>
    <div>
      <h3 class="text-xl font-semibold border-b-2 border-edge-green pb-2 mb-4 text-edge-green">INTERESES</h3>
      <ul class="text-sm space-y-1 pl-2">
        ${profile.interests.map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>
  `;
}

function expToHtml(item) {
  return `
    <div class="timeline-item">
      <h4 class="font-semibold text-md text-gray-800">${item.role}</h4>
      <p class="text-xs text-gray-500 mb-1">${item.company} | ${item.period}</p>
      <ul class="text-gray-600 text-sm space-y-1">
        ${item.details.map(d => `<li>${d}</li>`).join('')}
      </ul>
    </div>
  `;
}

function eduToHtml(item) {
  return `<p><strong>${item.program}</strong> – ${item.institution}, ${item.detail}</p>`;
}

function buildCertCategory(cat) {
  const groups = cat.items
    .flatMap(splitCertStrings)
    .map(parseCertItem)
    .filter(Boolean)
    .reduce((acc, info) => {
      const key = `${info.entity}-${info.year}`;
      if (!acc[key]) acc[key] = { entity: info.entity, year: info.year, courses: [] };
      acc[key].courses.push(...info.courses);
      return acc;
    }, {});
  const sorted = Object.values(groups).sort((a, b) => {
    const ya = parseInt(a.year.split('-').pop());
    const yb = parseInt(b.year.split('-').pop());
    return yb - ya;
  });
  const html = `
    <h4 class="font-bold text-gray-700 mb-2 uppercase">${cat.category}</h4>
    ${sorted.map(g => `
      <p class="font-bold text-gray-700">${g.entity} (${g.year})</p>
      <ul class="space-y-1 text-gray-600 ml-4">
        ${g.courses.map(c => `<li>${c}</li>`).join('')}
      </ul>
    `).join('')}
  `;
  return el('div', cat.spanTwo ? 'md:col-span-2' : '', html);
}
