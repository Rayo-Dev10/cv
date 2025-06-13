        const openBtn = document.getElementById('exportPdfBtn');
        const overlay = document.getElementById('pdfOverlay');
        const { jsPDF } = window.jspdf;

        openBtn.addEventListener('click', () => {
            overlay.classList.remove('hidden');
        });

        document.querySelectorAll('.pdf-option').forEach(el => {
            el.addEventListener('click', () => {
                overlay.classList.add('hidden');
                exportPdf(el.dataset.size);
            });
        });

        function exportPdf(option) {
            const container = document.querySelector(".max-w-6xl");
            html2canvas(container, {scale: 2, useCORS: true}).then(canvas => {
                const imgData = canvas.toDataURL("image/png");
                let pdfWidth, pdfHeight;
                if (option === "letter") {
                    pdfWidth = 612;
                    pdfHeight = 792;
                } else {
                    pdfWidth = canvas.width * 0.75;
                    pdfHeight = canvas.height * 0.75;
                }
                const doc = new jsPDF({orientation: pdfWidth > pdfHeight ? "landscape" : "portrait", unit: "pt", format: [pdfWidth, pdfHeight]});
                let imgWidth = pdfWidth;
                let imgHeight = canvas.height * pdfWidth / canvas.width;
                if (imgHeight > pdfHeight) {
                    imgHeight = pdfHeight;
                    imgWidth = canvas.width * pdfHeight / canvas.height;
                }
                doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                doc.save("cv.pdf");
            });
        }

        async function loadData() {
            const [profile, experiencia, formacion, certificaciones] = await Promise.all([
                fetch("profile.json").then(r => r.json()),
                fetch("experiencia.json").then(r => r.json()),
                fetch("formacion.json").then(r => r.json()),
                fetch("certificaciones.json").then(r => r.json())
            ]);

            const sidebar = document.getElementById("sidebar");
            const skillsHtml = Object.entries(profile.skills).map(([cat, items]) => `
                <div>
                    <h4 class="font-semibold text-gray-200 mb-2">${cat}:</h4>
                    <ul class="list-disc list-inside space-y-1 pl-2">
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
                        <li><i class="fas fa-envelope fa-fw w-6 icon-cyan"></i> ${profile.contact.email}</li>
                        <li><i class="fas fa-phone-alt fa-fw w-6 icon-cyan"></i> ${profile.contact.phone}</li>
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
                    <ul class="list-disc list-inside text-sm space-y-1 pl-2">
                        ${profile.interests.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
            `;
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
            certificaciones.forEach(cat => {
                const div = document.createElement('div');
                if (cat.spanTwo) div.classList.add('md:col-span-2');
                const ulClass = cat.spanTwo ? 'space-y-1 text-gray-600 columns-2' : 'space-y-1 text-gray-600';
                div.innerHTML = `
                    <h4 class="font-bold text-gray-700 mb-2 uppercase">${cat.category}</h4>
                    <ul class="${ulClass}">
                        ${cat.items.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                `;
                certContainer.appendChild(div);
            });
        }

        window.addEventListener('DOMContentLoaded', loadData);
