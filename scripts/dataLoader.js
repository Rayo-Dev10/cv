function splitCertStrings(str) {
  const res = [];
  let curr = '';
  let open = 0;
  for (const ch of str) {
    if (ch === '(') open++;
    if (ch === ')') open--;
    if (ch === ',' && open === 0) {
      res.push(curr.trim());
      curr = '';
      continue;
    }
    curr += ch;
  }
  if (curr.trim()) res.push(curr.trim());
  return res;
}

export async function loadData() {
  const [profile, experiencia, formacion, certificaciones] = await Promise.all([
    fetch('profile.json').then(r => r.json()),
    fetch('experiencia.json').then(r => r.json()),
    fetch('formacion.json').then(r => r.json()),
    fetch('certificaciones.json').then(r => r.json())
  ]);

  const sidebar = document.getElementById('sidebar');
  const skillsHtml = Object.entries(profile.skills).map(([cat, items]) => `
        <div>
          <h4 class="font-semibold text-gray-200 mb-2">${cat}:</h4>
          <ul class="space-y-1 pl-2">
            ${items.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>
  `).join('');
  const languagesHtml = Object.entries(profile.languages)
        .map(([lang, lvl]) => `<p class="text-sm"><strong>${lang}:</strong> ${lvl}</p>`).join('');
  sidebar.innerHTML = `
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
            <li><i class="fab fa-whatsapp fa-fw w-6" style="color:#25D366"></i> <a href="https://wa.me/573013068968?text=He%20visto%20tu%20hoja%20de%20vida%20y%20deseo%20formularte%20unas%20preguntas" target="_blank" rel="noopener" class="hover:underline">${profile.contact.whatsapp}</a></li>
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

  const description = document.getElementById('profileDescription');
  if (description) {
    description.textContent = profile.description;
  }

  const expContainer = document.getElementById('experienceList');
  experiencia.forEach(item => {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `
          <h4 class="font-semibold text-md text-gray-800">${item.role}</h4>
          <p class="text-xs text-gray-500 mb-1">${item.company} | ${item.period}</p>
          <ul class="list-disc list-inside text-gray-600 text-sm space-y-1">
            ${item.details.map(d => `<li>${d}</li>`).join('')}
          </ul>
    `;
    expContainer.appendChild(div);
  });

  const eduContainer = document.getElementById('educationList');
  formacion.forEach(item => {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${item.program}</strong> – ${item.institution}, ${item.detail}`;
    eduContainer.appendChild(p);
  });

  const certContainer = document.getElementById('certificationGrid');
  const parseItem = str => {
    const m = str.match(/(.+)\s*\(([^,]+),\s*(\d{4}(?:-\d{4})?)\)$/);
    if (!m) return null;
    return { courses: m[1].split(',').map(c => c.trim()), entity: m[2].trim(), year: m[3].trim() };
  };

  certificaciones.forEach(cat => {
    const groups = {};
    cat.items.forEach(raw => {
      splitCertStrings(raw).forEach(part => {
        const info = parseItem(part);
        if (info) {
          const key = `${info.entity}-${info.year}`;
          if (!groups[key]) groups[key] = { entity: info.entity, year: info.year, courses: [] };
          groups[key].courses.push(...info.courses);
        }
      });
    });

    const sorted = Object.values(groups).sort((a, b) => {
      const ya = parseInt(a.year.split('-').pop());
      const yb = parseInt(b.year.split('-').pop());
      return yb - ya;
    });

    const div = document.createElement('div');
    if (cat.spanTwo) div.classList.add('md:col-span-2');
    div.innerHTML = `
          <h4 class="font-bold text-gray-700 mb-2 uppercase">${cat.category}</h4>
          ${sorted.map(g => `
            <p class="font-medium text-gray-700">${g.entity} (${g.year})</p>
            <ul class="space-y-1 text-gray-600 ml-4">
              ${g.courses.map(c => `<li>${c}</li>`).join('')}
            </ul>
          `).join('')}
    `;
    certContainer.appendChild(div);
  });
}
