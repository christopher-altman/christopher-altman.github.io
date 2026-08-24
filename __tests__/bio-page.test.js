const fs = require('fs');
const path = require('path');
const { TextDecoder, TextEncoder } = require('util');

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const { JSDOM } = require('jsdom');


const root = path.join(__dirname, '..');
const homeHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const bioHtml = fs.readFileSync(path.join(root, 'bio', 'index.html'), 'utf8');
const homeCss = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const bioCss = fs.readFileSync(path.join(root, 'bio', 'bio.css'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');


test('biography is a canonical, indexable profile page', () => {
  const document = new JSDOM(bioHtml).window.document;

  expect(document.title).toBe('Christopher Altman — Frontier AI Evaluation & Quantum Information');
  expect(document.querySelector('link[rel="canonical"]').href)
    .toBe('https://lab.christopheraltman.com/bio/');
  expect(document.querySelector('meta[name="robots"]').content).toBe('index,follow');
  expect(document.querySelector('meta[property="og:url"]').content)
    .toBe('https://lab.christopheraltman.com/bio/');

  const schema = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  const profilePage = schema['@graph'].find((node) => node['@type'] === 'ProfilePage');
  const person = schema['@graph'].find((node) => node['@type'] === 'Person');
  expect(profilePage.url).toBe('https://lab.christopheraltman.com/bio/');
  expect(person.url).toBe('https://lab.christopheraltman.com/bio/');
  expect(person.sameAs).toContain('https://www.christopheraltman.com');
});


test('lab homepage points semantic biography links to the first-party route', () => {
  const document = new JSDOM(homeHtml).window.document;
  const biographyLink = document.querySelector('.hero-link-actions a[href="bio/"]');

  expect(biographyLink.textContent.trim()).toBe('Research Biography');
  expect(homeHtml).not.toContain('www.th-pedia.org/wiki/Christopher_Altman');
});

test('first-party documents and photographs are served from repository assets', () => {
  const pdfAssets = [
    'spacetime-from-quantum-topology.pdf',
    'accelerated-training-convergence-in-superposed-quantum-networks.pdf',
    'astronaut-development-and-deployment-of-a-secure-quantum-space-channel-prototype.pdf',
    'quantum-information-science-and-technology-project-atip.pdf',
    'gordon-research-conference-quantum-information-science-2004.pdf',
    'korean-quantum-information-research.pdf',
  ];

  for (const filename of pdfAssets) {
    const assetPath = path.join(root, 'assets', 'documents', filename);
    const contents = fs.readFileSync(assetPath);
    expect(contents.length).toBeGreaterThan(0);
    expect(contents.subarray(0, 5).toString('ascii')).toBe('%PDF-');
  }

  const photoPath = path.join(
    root,
    'assets',
    'photos',
    'daniel-greenberger-traunkirchen-2010.jpg'
  );
  const photo = fs.readFileSync(photoPath);
  expect(photo.length).toBeGreaterThan(0);
  expect([...photo.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);

  for (const filename of pdfAssets.slice(0, 4)) {
    expect(homeHtml).toContain(`assets/documents/${filename}`);
  }
  expect(bioHtml).toContain(
    '../assets/documents/gordon-research-conference-quantum-information-science-2004.pdf'
  );
  expect(bioHtml).toContain('../assets/documents/korean-quantum-information-research.pdf');
  expect(bioHtml).toContain('../assets/photos/daniel-greenberger-traunkirchen-2010.jpg');
  const ucipFigurePath = path.join(root, 'assets', 'ucip-bipartition-entropy.webp');
  expect(fs.statSync(ucipFigurePath).size).toBeGreaterThan(0);
  expect(bioHtml).toContain('../assets/ucip-bipartition-entropy.webp');
  expect(bioHtml).not.toContain('../assets/ucip-entanglement.webp');

  expect(homeHtml).not.toContain('drive.google.com');
  expect(bioHtml).not.toContain('drive.google.com');
  expect(bioHtml).not.toContain('flickr.com');
  expect(bioHtml).not.toContain('academia.edu');
  expect(homeHtml).toContain('https://doi.org/10.5281/zenodo.18426410');
  expect(bioHtml).toContain('https://www.grc.org/quantum-information-science-conference/2004/');
});


test('sitemap exposes the canonical biography route', () => {
  expect(sitemap).toContain('<loc>https://lab.christopheraltman.com/bio/</loc>');
});

test('homepage and biography resolve to one canonical Person identity', () => {
  const canonicalPersonId = 'https://lab.christopheraltman.com/bio/#person';
  const homeDocument = new JSDOM(homeHtml).window.document;
  const bioDocument = new JSDOM(bioHtml).window.document;
  const homeSchema = JSON.parse(
    homeDocument.querySelector('script[type="application/ld+json"]').textContent
  );
  const bioSchema = JSON.parse(
    bioDocument.querySelector('script[type="application/ld+json"]').textContent
  );
  const homeNodes = homeSchema['@graph'] || [homeSchema];
  const bioNodes = bioSchema['@graph'] || [bioSchema];
  const personDeclarations = [...homeNodes, ...bioNodes]
    .filter((node) => node['@type'] === 'Person');
  const profilePage = bioNodes.find((node) => node['@type'] === 'ProfilePage');
  const person = personDeclarations[0];

  expect(homeSchema['@type']).toBe('WebSite');
  expect(homeSchema['@id']).toBe('https://lab.christopheraltman.com/#website');
  expect(homeSchema.author).toEqual({ '@id': canonicalPersonId });
  expect(personDeclarations).toHaveLength(1);
  expect(person['@id']).toBe(canonicalPersonId);
  expect(profilePage.mainEntity).toEqual({ '@id': canonicalPersonId });
  expect(person.name).toBe('Christopher Altman');
  expect(person.url).toBe('https://lab.christopheraltman.com/bio/');
  expect(person.jobTitle).toBe('Founder and Principal Investigator, Continuation Observatory');
  expect(person.affiliation).toEqual({
    '@type': 'Organization',
    name: 'Continuation Observatory',
    url: 'https://continuationobservatory.org/',
  });
  expect(person.sameAs).toEqual([
    'https://www.christopheraltman.com',
    'https://scholar.google.com/citations?user=tvwpCcgAAAAJ',
    'https://arxiv.org/a/altman_c_1.html',
    'https://github.com/christopher-altman',
    'https://huggingface.co/cohaerence',
  ]);
});

test('canonical URLs, Open Graph URLs, and sitemap entries agree per page', () => {
  const pages = [
    [homeHtml, 'https://lab.christopheraltman.com/'],
    [bioHtml, 'https://lab.christopheraltman.com/bio/'],
  ];
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1]);

  expect(sitemapUrls).toEqual(pages.map(([, url]) => url));
  for (const [html, expectedUrl] of pages) {
    const document = new JSDOM(html).window.document;
    expect(document.querySelector('link[rel="canonical"]').href).toBe(expectedUrl);
    expect(document.querySelector('meta[property="og:url"]').content).toBe(expectedUrl);
    expect(sitemapUrls).toContain(expectedUrl);
  }
});

test('biography uses direct factual framing without defensive disclaimers', () => {
  const defensivePhrases = [
    'does not establish that a frontier model is conscious',
    'without silently becoming a claim about model intent or welfare',
    'not a metaphysical conclusion',
    'not as a funded NASA mission',
    "does not imply selection into NASA's astronaut corps",
    'rather than present affiliations',
    'independently administered encyclopedia profile',
    'This first-party page remains canonical',
    'evidentiary basis for substantive claims',
  ];

  for (const phrase of defensivePhrases) {
    expect(bioHtml).not.toContain(phrase);
  }

  expect(bioHtml).toContain('The controlled experiments establish a structural separation between terminal and instrumental continuation.');
  expect(bioHtml).toContain('with every claim tied to inspectable evidence and explicit failure criteria');
});

test('application-domain sentence closes the frontier-AI evaluation section', () => {
  const document = new JSDOM(bioHtml).window.document;
  const frontierParagraphs = [...document.querySelectorAll('#frontier-ai > p')];

  expect(frontierParagraphs.at(-1).textContent.trim()).toBe(
    'The resulting measurement infrastructure has direct application to frontier-lab safety evaluation, national-security analysis, and assurance of autonomous systems, where surface compliance cannot substitute for structural evidence.'
  );
});

test('biography presents the research arc without overstating institutional scope or technical lineage', () => {
  const document = new JSDOM(bioHtml).window.document;
  const overview = document.querySelector('#overview');
  const quantum = document.querySelector('#quantum');
  const starlab = document.querySelector('#starlab');
  const astronautics = document.querySelector('#astronautics');

  expect(overview.textContent).toContain(
    'Christopher Altman is an American physicist and frontier AI researcher.'
  );
  expect(overview.textContent).toContain(
    'a live public research platform that publishes and tracks structural measurements of continuation behavior across successive model generations'
  );
  expect(overview.textContent).toContain(
    'built on the expectation that rigorously designed and calibrated instruments will become increasingly critical as capabilities advance'
  );
  const overviewStarlabLink = [...overview.querySelectorAll('a')]
    .find((link) => link.textContent.trim() === 'Starlab');
  expect(overviewStarlabLink.href).toBe('https://youtu.be/0X_HDSQXMI0');
  expect(overview.textContent).not.toContain('more instruments will be needed as capabilities advance');
  expect(overview.textContent).not.toContain('national-security benchmarking');
  expect(quantum.textContent).toContain(
    "Although UCIP is computed classically, its use of density-matrix formalism has a methodological antecedent in Altman’s earlier quantum-information research."
  );
  expect(document.querySelector('#frontier-ai').textContent).toContain(
    'The protocol encodes agent trajectories with a quantum Boltzmann machine—a Hamiltonian-based model whose thermal states are represented by density matrices—and measures the von Neumann entropy of the reduced density matrix induced by a hidden-unit bipartition.'
  );
  expect(document.querySelector('#frontier-ai').textContent).toContain(
    'The underlying computation is classical; the quantum formalism supplies the representation.'
  );
  expect(document.querySelector('#frontier-ai').textContent)
    .not.toContain('a classical model built on density-matrix formalism');
  expect(document.querySelector('#frontier-ai').textContent)
    .not.toContain('Every computation is classical');
  expect(document.querySelector('#frontier-ai').textContent)
    .not.toContain('The implementation is classical');
  const ucipFigure = document.querySelector('#frontier-ai .bio-figure');
  expect(ucipFigure.querySelector('img').getAttribute('alt')).toContain('QBM bipartition entropy');
  expect(ucipFigure.querySelector('figcaption').textContent).toContain('QBM bipartition entropy under UCIP');
  expect(ucipFigure.textContent).not.toContain('Entanglement entropy under UCIP');
  expect(quantum.textContent).toContain('the clearest methodological precursor to his present work');
  expect(quantum.textContent).not.toContain('the closest precursor to his present work');
  expect(quantum.textContent).toContain(
    'In 2004, representing the Quantum Information Science and Technology (QuIST) Project, he attended the Gordon Research Conference on Quantum Information Science in Ventura, California—a two-hundred-seat meeting, with admission by application to the conference chair, held off the record to permit discussion of unpublished work.'
  );
  expect(quantum.textContent).not.toContain('invitation-only Gordon Research Conference');
  expect(quantum.textContent).not.toContain('2003 Gordon Research Conference');
  expect(quantum.textContent).toContain(
    'At Quantum Structures ’08 in Sopot, Altman continued developing adaptive quantum networks with Zapatrin while discussing quantum information theory with Lev Levitin over walks along the Baltic coast.'
  );
  expect(quantum.textContent).not.toContain('spent much of the week in extended discussions');
  expect(quantum.textContent).not.toContain('During the Traunkirchen residency');
  expect(quantum.textContent).not.toContain('Časlav Brukner');
  expect(quantum.textContent).toContain(
    'That work extended into companion quantum-communications proposals for NASA Innovative Advanced Concepts (NIAC) and an invited DARPA Quiness submission. Altman was principal investigator and program lead on the NIAC Phase I proposal'
  );
  expect(quantum.textContent).toContain(
    'The design built on the European collaborators’ 144-kilometer Canary Islands free-space demonstration by making astronaut setup and calibration of a continuous-variable quantum terminal part of the Hawaiʻi lunar-analogue field test, explicitly echoing Apollo 11’s deployment of the Lunar Laser Ranging Retroreflector Array during humanity’s first crewed lunar landing.'
  );
  expect(quantum.textContent).toContain(
    'The companion Quiness proposal called for a global, multimodal quantum-communications network: an intercontinental fiber backbone joined to a satellite constellation, free-space nodes aboard autonomous drones, high-altitude blimps, and weather balloons, and underwater optical links between U.S. Navy submarines.'
  );
  expect(quantum.textContent).toContain(
    "Altman’s role had two parts: SCUBA-supported installation and field testing of a blue-green underwater laser coupled to QuintessenceLabs transmitter-and-receiver hardware for the submarine links, and provision of PISCES access, facilities, support, and logistics for a Hawaiʻi Island–Maui free-space demonstration."
  );
  expect(quantum.textContent).toContain(
    'Following the Quiness submission, discussions continued toward experimental implementation using QuintessenceLabs quantum-cryptography hardware at Boeing.'
  );
  expect(quantum.textContent).not.toContain("Altman's proposed role centered both");
  expect(quantum.textContent).toContain(
    "NASA referred the proposal to its Office of the Chief Technologist."
  );
  expect(quantum.textContent).not.toContain('NASA NIAC/OCT');
  expect(quantum.textContent).not.toMatch(/program lead[^.]*Quiness|Quiness[^.]*program lead/i);
  expect(quantum.textContent).not.toContain('on both of which he was principal investigator');
  expect(quantum.textContent).not.toMatch(/principal investigator[^.]*Quiness|Quiness[^.]*principal investigator/i);
  expect(quantum.textContent).not.toContain('carried the same architecture into two proposals');

  expect(starlab.textContent).toContain(
    'Recruited in 2000, Altman joined the CAM-Brain project at Starlab, the multidisciplinary “Deep Future” research institute outside Brussels.'
  );
  const siftedSource = document.querySelector('#ref-31 a');
  expect(starlab.querySelector('a[href="#ref-31"]')).not.toBeNull();
  expect(siftedSource.href).toBe(
    'https://sifted.eu/articles/starlab-deeptech-university-spinouts-europe'
  );
  expect(siftedSource.closest('li').textContent).toContain(
    'Independent retrospective on Starlab’s Brussels institute, research culture, and alumni.'
  );
  const starlabImage = starlab.querySelector('.bio-figure img');
  expect(starlabImage.getAttribute('src')).toBe('../assets/Starlab-Composite.webp');
  expect(starlabImage.getAttribute('alt')).toBe(
    'Starlab composite showing the “Deep Future” facade inscription, Starlab wordmark, and Brussels headquarters.'
  );
  expect(starlabImage.getAttribute('width')).toBe('1500');
  expect(starlabImage.getAttribute('height')).toBe('300');
  expect(starlabImage.getAttribute('src')).not.toContain('Starlab-Space-3k2k.webp');
  expect(starlab.textContent).toContain('the program’s flagship experimental platform');
  expect(starlab.textContent).toContain(
    'Altman originated the idea of placing distinct network topologies in quantum superposition and training the topology itself—not only its transition functions—and further developed the resulting adaptive quantum-network formalism with Roman R. Zapatrin.'
  );
  expect(starlab.textContent).not.toContain('originated the idea of treating network topology itself');
  expect(starlab.textContent).toContain('Superpositional Quantum Network Topologies');
  expect(starlab.textContent).toContain('Accelerated Training Convergence in Superposed Quantum Networks');
  expect(starlab.textContent).toContain('Backpropagation Training in Adaptive Quantum Networks');
  expect(starlab.textContent).not.toContain('first met at Starlab');
  expect(starlab.textContent).not.toContain('remotely');
  expect(starlab.textContent).not.toContain('April 2001');
  expect(starlab.textContent).not.toContain('November');
  expect(astronautics.textContent).toContain(
    'The NIAC proposal drew on a parallel line of work: Altman trained as a scientist-astronaut and conducted human-spaceflight research in lunar and Mars analogue environments.'
  );
  expect(astronautics.textContent).not.toContain('worked in analogue-field research');
  expect(astronautics.textContent).toContain(
    'From 2009 to 2013 he was a senior research scientist with the Pacific International Space Center for Exploration Systems (PISCES), a University of Hawaiʻi program for lunar- and Mars-analogue research and astronaut field training.'
  );
  expect(astronautics.textContent).toContain(
    'Its Mauna Kea lunar-analogue site—terrain NASA had used for Apollo-era field-geology training—was proposed for the quantum-communications tests.'
  );
  expect(astronautics.textContent).not.toContain('Its Mauna Kea analogue site');

  expect(quantum.querySelector('a[href="#ref-26"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-28"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-29"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-27"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-16"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-21"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-25"]')).not.toBeNull();
  expect(document.querySelector('#ref-26').textContent).toContain('NASA NSPIRES');
  expect(document.querySelector('#ref-28 a').href).toBe('https://thpedia.org/wiki/Quiness');
  expect(document.querySelector('#ref-29 a').href).toBe('https://www.darpa.mil/research/programs/quiness');
  expect(document.querySelector('#ref-27').textContent).toContain('QUINESS Underwater Laser');
  expect(document.querySelector('#ref-16 a').href).toBe(
    'https://www.grc.org/quantum-information-science-conference/2004/'
  );
  expect(document.querySelectorAll('#ref-16 a')[1].getAttribute('href')).toBe(
    '../assets/documents/gordon-research-conference-quantum-information-science-2004.pdf'
  );
  expect(document.querySelector('#ref-21 a').href).toBe(
    'https://www.christopheraltman.com/2008/08/progress-in-quantum-computing-iqsa-lt25.html'
  );
  expect(document.querySelector('#ref-25 a').href).toBe(
    'https://www.christopheraltman.com/2010/'
  );
  expect(document.querySelectorAll('#ref-25 a')[1].getAttribute('href')).toBe(
    '../assets/photos/daniel-greenberger-traunkirchen-2010.jpg'
  );

  expect(homeHtml).toContain('<div class="pub-title">Backpropagation Training in Adaptive Quantum Networks</div>');
  expect(homeHtml).not.toContain('<div class="pub-title">Backpropagation in Adaptive Quantum Networks</div>');
  expect(homeHtml).toContain(
    "companion quantum-communications proposal materials for NASA Innovative Advanced Concepts (NIAC) and DARPA Quiness (Macroscopic Quantum Communications); the NIAC proposal was subsequently referred to NASA's Office of the Chief Technologist"
  );
  expect(homeHtml).not.toContain('NASA NIAC/OCT');
  expect(homeHtml).toContain('<i>Principal Investigator and Program Lead, NIAC proposal</i>');
});

test('technology assessment is promoted between frontier-AI evaluation and quantum research', () => {
  const document = new JSDOM(bioHtml).window.document;
  const frontierAi = document.querySelector('#frontier-ai');
  const technologyAssessment = document.querySelector('#technology-assessment');
  const quantum = document.querySelector('#quantum');
  const leadership = document.querySelector('#leadership');
  const assessmentWithoutCitations = technologyAssessment.cloneNode(true);
  assessmentWithoutCitations.querySelectorAll('sup').forEach(citation => citation.remove());
  const paragraphs = assessmentWithoutCitations.querySelectorAll('p');
  const assessmentSource = document.querySelector('#ref-11');
  const collinsSource = document.querySelector('#ref-12');
  const distributionSource = document.querySelector('#ref-13');
  const roadmapSource = document.querySelector('#ref-14');

  expect(document.querySelector('.bio-index a[href="#technology-assessment"]')).not.toBeNull();
  expect(frontierAi.compareDocumentPosition(technologyAssessment) & 4).toBeTruthy();
  expect(technologyAssessment.compareDocumentPosition(quantum) & 4).toBeTruthy();
  const assessmentHeading = technologyAssessment.querySelector('h2');
  expect(assessmentHeading.textContent).toBe(
    'Disruptive technology assessment for U.S. government sponsors'
  );
  expect(assessmentHeading.querySelector('.bio-heading-qualifier').textContent).toBe(
    'for U.S. government sponsors'
  );
  expect(bioCss).toMatch(/\.bio-heading-qualifier\s*\{[^}]*white-space:\s*nowrap;/s);
  expect(bioCss).toMatch(/@media \(max-width:\s*420px\)[\s\S]*?\.bio-heading-qualifier\s*\{[^}]*white-space:\s*normal;/s);

  expect(paragraphs[0].textContent).toContain(
    'From 2003 to 2004, Altman was based in Tokyo with the Asian Technology Information Program’s Quantum Information Science and Technology project, where he conducted recurring assessments of quantum-information research across Japan and Korea.'
  );
  expect(paragraphs[0].textContent).toContain(
    'Those findings were reported to Dean Collins, director of the Advanced Research and Development Activity (ARDA), and to DARPA QuIST program managers, then disseminated to scientists and researchers across U.S. government agencies and national laboratories, including Los Alamos, the institutional home of the U.S. national roadmap initiative.'
  );
  expect(paragraphs[1].textContent).toBe(
    'A National Academies volume documents Collins’s leadership of ARDA and its quantum-information-science effort. Altman’s reports were produced contemporaneously with the 2004 QIST quantum-cryptography roadmap.'
  );
  expect(technologyAssessment.textContent).not.toContain('Stuart Wolf');
  expect(technologyAssessment.textContent).not.toContain('Michael Foster');
  expect(technologyAssessment.textContent).not.toContain('independently documents');
  expect(paragraphs[2].textContent).toBe(
    'The requirement was recurring and specific: assess a fast-moving field on the ground and deliver findings program managers could act on—which programs merited attention, where capability was concentrating, and how the regional effort compared with U.S. work then being consolidated into the national roadmap. The engagement placed Altman inside the assessment cycle at precisely the moment the U.S. government was deciding how to measure, fund, and track an emerging technology it did not yet understand or control.'
  );
  expect(paragraphs[3].textContent).toBe(
    'That same institutional problem now frames Altman’s frontier-AI work: institutions must again build the instruments before they can govern systems whose emerging capabilities they do not yet fully understand and whose continued controllability cannot be assumed.'
  );
  expect(bioHtml).not.toContain('Richard J. Hughes');
  expect(bioHtml).not.toContain('formative influence');
  expect(leadership.textContent).not.toContain(
    'From 2003 to 2004, Altman was based in Tokyo with the Asian Technology Information Program’s Quantum Information Science and Technology project'
  );
  expect(leadership.textContent).not.toContain(
    'During the 2013 IEEE Photonics Society Summer Topical Meeting on Quantum Photonics and Communications in Waikoloa'
  );
  expect(bioHtml).toContain('<!-- Deferred until the Hughes roadmap attribution is approved and restored:');
  expect(bioHtml).toContain('https://web.archive.org/web/20130209212255/http://www.sum-ieee.org/');
  expect(bioHtml).toContain('https://www.christopheraltman.com/2013/07/l-istening-to-rupert-ursin-s-closing.html');
  expect(leadership.textContent).not.toContain(
    'senior leadership at U.S. policy, scientific, and research-funding agencies'
  );
  expect(leadership.textContent).toContain(
    'In 2004 Altman received the European Information Security Award'
  );
  expect(leadership.textContent).not.toContain(
    'In 2004 he received the European Information Security Award'
  );
  expect(assessmentSource.querySelector('a').getAttribute('href')).toBe(
    '../assets/documents/korean-quantum-information-research.pdf'
  );
  expect(collinsSource.querySelector('a[href="https://www.nationalacademies.org/read/13540/chapter/5"]')).not.toBeNull();
  expect(roadmapSource.querySelector('a[href="https://qist.lanl.gov/pdfs/whole_roadmap.pdf"]')).not.toBeNull();
  expect(distributionSource.textContent).toContain('report-submission and distribution records');
  expect(distributionSource.textContent).toContain('On file, available on request.');
});

test('research leadership includes current OASA teaching and mentorship', () => {
  const document = new JSDOM(bioHtml).window.document;
  const leadership = document.querySelector('#leadership');
  const oasaSource = document.querySelector('#ref-44');

  expect(leadership.textContent).toContain(
    'Alongside his research, Altman serves on the International Council of Advisors of the Orion Astropreneur Space Academy in Hong Kong, teaching and mentoring students and aspiring space-sector professionals in commercial astronautics and the future of human spaceflight.'
  );
  expect(leadership.querySelector('a[href="#ref-44"]')).not.toBeNull();
  expect(oasaSource.querySelector('a[href="https://www.oasahk.org/team-oasa"]')).not.toBeNull();
  expect(oasaSource.querySelector('a[href="https://www.oasahk.org/summer-boot-camp2025"]')).not.toBeNull();
});

test('education records undergraduate research leadership and the Salishan fellowship cohort', () => {
  const document = new JSDOM(bioHtml).window.document;
  const leadership = document.querySelector('#leadership');
  const academicSource = document.querySelector('#ref-49');
  const salishanSource = document.querySelector('#ref-50');

  expect(leadership.textContent).toContain(
    'Altman studied philosophy at the Pierre Laclede Honors College of the University of Missouri–St. Louis. As an undergraduate honors research fellow, he co-directed experimental neuroscience studies supported by National Science Foundation funding, contributing original study designs and supervising undergraduate and graduate research assistants.'
  );
  expect(leadership.textContent).toContain(
    'In April 2001, Altman was selected as one of three student fellows for the invitation-only Salishan Conference on High-Speed Computing, alongside MIT Media Lab doctoral researchers H. Shrikumar and Bill Butera.'
  );
  expect(leadership.querySelector('a[href="#ref-48"]')).not.toBeNull();
  expect(leadership.querySelector('a[href="#ref-49"]')).not.toBeNull();
  expect(leadership.querySelector('a[href="#ref-17"]')).not.toBeNull();
  expect(leadership.querySelector('a[href="#ref-50"]')).not.toBeNull();
  expect(document.querySelector('#ref-17 a').href).toBe(
    'https://web.archive.org/web/20050213045521/http://qt.tn.tudelft.nl/~altman/'
  );
  expect(academicSource.textContent).toContain(
    'academic and scholarship records on file, available on request.'
  );
  expect(academicSource.querySelector(
    'a[href="https://web.archive.org/web/20011031105458/http://www.umsl.edu/~altmanc/"]'
  )).not.toBeNull();
  expect(academicSource.textContent).not.toContain('THPedia');
  expect(salishanSource.querySelector('a').href).toBe(
    'https://www.christopheraltman.com/2001/05/salishan.html'
  );
});

test('opening biography lede and metadata use a consistent frontier-AI presentation', () => {
  const document = new JSDOM(bioHtml).window.document;
  const title = 'Christopher Altman — Frontier AI Evaluation & Quantum Information';
  const structuredData = JSON.parse(
    document.querySelector('script[type="application/ld+json"]').textContent
  );
  const profilePage = structuredData['@graph'].find(entry => entry['@type'] === 'ProfilePage');

  expect(document.title).toBe(title);
  expect(document.querySelector('meta[property="og:title"]').content).toBe(title);
  expect(document.querySelector('meta[name="twitter:title"]').content).toBe(title);
  expect(profilePage.name).toBe(title);
  expect(bioCss).toMatch(
    /\.bio-prose #overview > p:first-of-type\s*\{[^}]*font-size:\s*1\.14rem;[^}]*line-height:\s*1\.88;/s
  );
});

test('biography narrative uses closed em dashes while preserving title typography', () => {
  const document = new JSDOM(bioHtml).window.document;
  const narrative = [
    document.querySelector('.bio-deck'),
    ...document.querySelectorAll('.bio-prose > section:not(#sources)'),
  ].map((element) => element.textContent).join('\n');

  expect(narrative).not.toContain(' — ');
  expect(document.title).toContain(' — ');
  expect(document.querySelector('#ref-25').textContent)
    .toContain('Traunkirchen — Quantum Physics and the Nature of Reality');
});

test('opening profile retains only the three compact evidence links', () => {
  const document = new JSDOM(bioHtml).window.document;
  const professionalLinks = [...document.querySelectorAll('.bio-primary-links a')];
  expect(professionalLinks.map((link) => link.textContent.trim())).toEqual([
    'Google Scholar',
    'arXiv',
    'GitHub',
  ]);
  expect(professionalLinks.map((link) => link.href)).toEqual([
    'https://scholar.google.com/citations?user=tvwpCcgAAAAJ',
    'https://arxiv.org/a/altman_c_1.html',
    'https://github.com/christopher-altman',
  ]);
});

test('Tier 1 site bar is identical and separate from page-specific section navigation', () => {
  const homeDocument = new JSDOM(homeHtml).window.document;
  const bioDocument = new JSDOM(bioHtml).window.document;
  const normalizeMarkup = (element) => element.outerHTML.replace(/\s+/g, ' ').trim();
  const homeHeader = homeDocument.querySelector('.site-header');
  const bioHeader = bioDocument.querySelector('.site-header');
  const homePropertyLinks = [...homeHeader.querySelectorAll('.site-nav a')];
  const homeSectionLinks = [...homeDocument.querySelectorAll('.home-section-nav a')];
  const bioSectionLinks = [...bioDocument.querySelectorAll('.bio-index nav a')];

  expect(normalizeMarkup(homeHeader)).toBe(normalizeMarkup(bioHeader));
  expect(homeHeader.querySelector('.site-wordmark .tagline').innerHTML).toBe(
    'Frontier AI Evaluation · Alignment · Quantum Machine Learning<br>Space Telemetry Anomaly Detection · Superconducting Qubits'
  );
  expect(homeHeader.querySelector('.site-wordmark .tagline-secondary').textContent.trim()).toBe(
    'Founder, Continuation Observatory · Structural AI Evaluation · Quantum Information'
  );
  expect(homeCss).toMatch(/\.site-wordmark \.avatar\s*\{[^}]*width:\s*96px;[^}]*height:\s*96px;/s);
  expect(homeCss).toMatch(/\.site-wordmark \.name\s*\{[^}]*font-size:\s*1\.5rem;/s);
  expect(homeCss).toMatch(/\.avatar\s*\{[^}]*background:\s*#fff url\("assets\/Christopher_Altman\.jpeg"\) center \/ cover no-repeat;/s);
  expect(homePropertyLinks.map((link) => link.textContent.trim())).toEqual([
    'Lab',
    'Observatory',
    'Personal',
  ]);
  expect(homePropertyLinks.map((link) => link.href)).toEqual([
    'https://lab.christopheraltman.com/',
    'https://continuationobservatory.org/',
    'https://www.christopheraltman.com/',
  ]);
  expect(homePropertyLinks.every((link) => !link.getAttribute('href').startsWith('#'))).toBe(true);
  expect(homeSectionLinks.every((link) => link.getAttribute('href').startsWith('#'))).toBe(true);
  expect(bioSectionLinks.every((link) => link.getAttribute('href').startsWith('#'))).toBe(true);
  expect(bioDocument.querySelector('.bio-primary-links a[href="https://continuationobservatory.org/"]')).toBeNull();
});

test('homepage section navigation and strengthened research actions remain responsive', () => {
  const document = new JSDOM(homeHtml).window.document;
  const sectionLinks = [...document.querySelectorAll('.home-section-nav a')];
  const actions = [...document.querySelectorAll('.hero-link-actions a')];

  expect(sectionLinks.map((link) => link.textContent.trim())).toEqual([
    'Research',
    'Collaborations',
    'Publications',
    'Projects',
    'Themes',
  ]);
  sectionLinks.forEach((link) => {
    expect(document.querySelector(link.getAttribute('href'))).not.toBeNull();
  });
  expect(homeHtml).not.toMatch(/<p[^>]*>\s*<p\b/);
  expect(document.querySelectorAll('main h1')).toHaveLength(1);
  expect(actions.map((link) => link.textContent.trim())).toEqual([
    'Continuation Observatory',
    'Research Biography',
    'UCIP Paper',
    'UCIP Code',
    'UCIP Patent Status',
  ]);
  expect(actions.every((link) => link.className === 'hero-link-button')).toBe(true);
  expect(homeHtml).not.toContain('hero-link-primary');
  expect(homeCss).not.toContain('.hero-link-primary');
  expect(homeCss).toMatch(/\.home-section-nav\s*\{[^}]*position:\s*sticky;[^}]*top:\s*9rem;/s);
  expect(homeCss).toMatch(/@media \(max-width:\s*640px\)[\s\S]*?\.home-section-nav\s*\{[^}]*position:\s*static;/s);
});

test('professional profile footer row is identical on both pages', () => {
  const homeDocument = new JSDOM(homeHtml).window.document;
  const bioDocument = new JSDOM(bioHtml).window.document;
  const normalizeMarkup = (element) => element.outerHTML.replace(/\s+/g, ' ').trim();
  const homeFooter = homeDocument.querySelector('.footer-links');
  const bioFooter = bioDocument.querySelector('.footer-links');
  const links = [...homeFooter.querySelectorAll('a')];
  const labels = links.map((link) => link.getAttribute('aria-label'));

  expect(normalizeMarkup(homeFooter)).toBe(normalizeMarkup(bioFooter));
  expect(labels).toEqual([
    'Google Scholar',
    'arXiv',
    'GitHub',
    'Hugging Face',
    'LinkedIn',
    'X',
    'Bluesky',
    'Email',
  ]);
  expect(links.every((link) => link.textContent.trim() === '')).toBe(true);
  expect(links.every((link) => link.querySelector('svg[aria-hidden="true"]'))).toBe(true);
  const scholarIcon = homeFooter.querySelector('a[aria-label="Google Scholar"] svg.scholar-icon');
  expect(scholarIcon.getAttribute('width')).toBe('32');
  expect(scholarIcon.querySelectorAll('path')).toHaveLength(2);
  expect(scholarIcon.querySelectorAll('line')).toHaveLength(2);
  expect(scholarIcon.querySelector('g[transform="matrix(0.83 0 0 0.83 12 12)"]')).not.toBeNull();
  expect(homeFooter.querySelector('a[aria-label="Hugging Face"] svg path')).not.toBeNull();
});

test('opening name uses the second quarter reduction without wrapping', () => {
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*max-width:\s*none;/s);
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*font-size:\s*clamp\(1\.828125rem,\s*5\.0625vw,\s*4\.21875rem\);/s);
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*letter-spacing:\s*0\.045em;/s);
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*white-space:\s*nowrap;/s);
});

test('long biography headings use the full prose width before wrapping', () => {
  expect(bioCss).toMatch(
    /#technology-assessment > h2,\s*#starlab > h2,\s*#astronautics > h2,\s*#leadership > h2\s*\{[^}]*max-width:\s*none;/s
  );
});

test('citation anchors clear the sticky header at responsive navigation heights', () => {
  expect(bioCss).toMatch(
    /\.bio-sources li\[id\^="ref-"\]\s*\{[^}]*scroll-margin-top:\s*9\.5rem;/s
  );
  expect(bioCss).toMatch(
    /@media \(max-width: 900px\)[\s\S]*?\.bio-sources li\[id\^="ref-"\]\s*\{[^}]*scroll-margin-top:\s*10\.5rem;/
  );
  expect(bioCss).toMatch(
    /@media \(max-width: 640px\)[\s\S]*?\.bio-sources li\[id\^="ref-"\]\s*\{[^}]*scroll-margin-top:\s*13rem;/
  );
});

test('patent status has a dedicated source and the career narrative returns to UCIP', () => {
  const document = new JSDOM(bioHtml).window.document;
  const patentSource = document.querySelector('#ref-3 a');
  const frontierAi = document.querySelector('#frontier-ai');
  const leadership = document.querySelector('#leadership');
  const closingParagraph = [...leadership.querySelectorAll('p')].at(-1);
  const publications = document.querySelector('#publications');

  expect(patentSource.href).toBe('https://continuationobservatory.org/ucip/patent/');
  expect(document.querySelector('a[href="#ref-3"]')).not.toBeNull();
  expect(frontierAi.textContent).toContain('Each model generation becomes another observation point');
  expect(leadership.textContent).toContain('Continuation Observatory brings these threads together');
  expect(leadership.textContent).toContain('the methodological undercurrent running through Altman’s career');
  expect(leadership.textContent).toContain('where it becomes operational');
  expect(closingParagraph.textContent.trim()).toBe(
    'The wider aim follows from the same logic. As autonomous systems gain the capacity to recursively accelerate their own research and development—and with it the pace of scientific progress—the instruments for measuring them must advance on the same curve. Instruments are what keep human judgment decisive.'
  );
  expect(closingParagraph.textContent).not.toContain('capacity to both accelerate');
  expect(leadership.compareDocumentPosition(publications) & 4).toBeTruthy();
});

test('why-now framing connects present capability thresholds to operational measurement', () => {
  const document = new JSDOM(bioHtml).window.document;
  const whyNow = document.querySelector('#frontier-ai .bio-why-now');
  const expectedSources = new Map([
    ['7', 'https://metr.org/time-horizons/'],
    ['8', 'https://openai.com/index/updating-our-preparedness-framework/'],
    ['9', 'https://www.anthropic.com/responsible-scaling-policy/roadmap'],
    ['10', 'https://deepmind.google/blog/strengthening-our-frontier-safety-framework/'],
  ]);

  expect(whyNow.querySelector('strong').textContent).toBe('Why this matters now.');
  expect(whyNow.textContent).toContain(
    'The objective is to establish the necessary instrumentation before AI-mediated research acceleration compresses the interval from capability gain through evaluation to deployment—when surface compliance and retrospective diagnosis become least reliable.'
  );
  expect(whyNow.textContent).not.toContain('recursive operational loop');
  expectedSources.forEach((href, reference) => {
    expect(whyNow.querySelector(`a[href="#ref-${reference}"]`)).not.toBeNull();
    expect(document.querySelector(`#ref-${reference} a`).href).toBe(href);
  });
  expect(bioCss).toMatch(/\.bio-prose \.bio-why-now\s*\{[^}]*border-left:\s*2px solid var\(--color-accent\);/s);
});

test('numbered references are contiguous and follow first-appearance order', () => {
  const document = new JSDOM(bioHtml).window.document;
  const definitions = [...document.querySelectorAll('#sources li[id^="ref-"]')];
  const citations = [...document.querySelectorAll('article section:not(#sources) a[href^="#ref-"]')];
  const definitionNumbers = definitions.map(({ id }) => Number(id.slice(4)));
  const citationNumbers = citations.map(link => Number(link.getAttribute('href').slice(5)));
  const firstAppearance = [...new Set(citationNumbers)];
  const expected = Array.from({ length: definitions.length }, (_, index) => index + 1);

  expect(definitionNumbers).toEqual(expected);
  expect(firstAppearance).toEqual(expected);
  citations.forEach(link => {
    expect(document.querySelector(link.getAttribute('href'))).not.toBeNull();
  });
});

test('THPedia profile is presented only as an understated numbered source', () => {
  const document = new JSDOM(bioHtml).window.document;
  const thpediaSource = document.querySelector('#ref-48');
  const profileLink = thpediaSource.querySelector(
    'a[href="https://thpedia.org/wiki/Christopher_Altman"]'
  );

  expect(document.querySelector('#leadership a[href="#ref-48"]')).not.toBeNull();
  expect(profileLink).not.toBeNull();
  expect(thpediaSource.textContent).toContain('Biographical source compilation.');
  expect(thpediaSource.textContent).not.toContain('University of Missouri');
  expect(thpediaSource.textContent).not.toContain('Academic and scholarship records');
  expect(document.querySelector('.bio-source-note')).toBeNull();
});

test('satellite-QKD security analysis cites its framework and mission context', () => {
  const document = new JSDOM(bioHtml).window.document;
  const satelliteQkdSource = document.querySelector('#ref-5 a');
  const speqtralMissionSource = document.querySelector(
    '#ref-6 a[href="https://speqtralquantum.com/newsroom/its-time-to-secure-the-worlds-communications-from-the-quantum-computing-threat"]'
  );
  const overview = document.querySelector('#overview');

  expect(satelliteQkdSource.href)
    .toBe('https://github.com/christopher-altman/sat-qkd-security-curves');
  expect(overview.textContent).toContain(
    'His experimental and applied contributions range from quantum-optical entanglement and coherence in superconducting devices to satellite quantum-key-distribution security analysis that models live quantum links under real-world atmospheric and orbital constraints.'
  );
  expect(overview.textContent).not.toContain('in support of ongoing entangled-photon experiments');
  expect(overview.textContent).not.toContain('independent satellite quantum-key-distribution');
  expect(speqtralMissionSource.href).toBe(
    'https://speqtralquantum.com/newsroom/its-time-to-secure-the-worlds-communications-from-the-quantum-computing-threat'
  );
  expect(document.querySelectorAll('#ref-6 a')).toHaveLength(1);
  expect(document.querySelector('#ref-5').textContent).not.toContain('SpeQtral');
  expect([...overview.querySelectorAll('a')]
    .some((link) => link.textContent.trim() === 'live quantum links')).toBe(false);
  expect(overview.textContent).not.toContain('ongoing live entangled-photon experiments');
  expect(overview.textContent).toContain(
    'Each turns a structural question into a measurement, and each rehearses the problem UCIP now addresses'
  );
  expect(overview.textContent).not.toContain('His experimental and applied work ran from');
  expect(overview.textContent).not.toContain('Each turned a structural question');
  expect(overview.textContent).not.toContain('each rehearsed the problem UCIP now addresses');
  expect(overview.textContent).not.toContain('space-deployable quantum-communication architectures');
  expect(overview.querySelector('a[href="#ref-5"]')).not.toBeNull();
  expect(overview.querySelector('a[href="#ref-6"]')).not.toBeNull();
});

test('multi-part biography headings keep subject terms together when wrapping', () => {
  const document = new JSDOM(bioHtml).window.document;
  const groupedHeadings = [
    ['#starlab', 'Starlab and the CAM-Brain program', 'CAM-Brain program'],
    ['#astronautics', 'Astronautics and spaceflight training', 'spaceflight training'],
    ['#leadership', 'Research leadership and institutional work', 'institutional work'],
  ];

  groupedHeadings.forEach(([sectionSelector, fullHeading, groupedTerm]) => {
    const heading = document.querySelector(`${sectionSelector} > h2`);
    expect(heading.textContent).toBe(fullHeading);
    expect(heading.querySelector('.bio-heading-term').textContent).toBe(groupedTerm);
    expect(heading.querySelector('br')).toBeNull();
  });

  expect(bioCss).toMatch(/\.bio-heading-term\s*\{[^}]*white-space:\s*nowrap;/s);
});

test('synthetic validation reports results in evidential order and states sample scope', () => {
  const document = new JSDOM(bioHtml).window.document;
  const frontierAi = document.querySelector('#frontier-ai');
  const label = frontierAi.querySelector('.bio-metrics-label');
  const metrics = frontierAi.querySelector('.bio-metrics');
  const metricLabels = [...metrics.querySelectorAll('dt')]
    .map((element) => element.textContent.trim());
  const note = frontierAi.querySelector('.bio-metrics-note');

  expect(label.textContent.trim()).toBe('Synthetic validation');
  expect(metricLabels).toEqual([
    'Graded tracking',
    'Classical baselines',
    'Entropy gap',
    'Permutation test',
    'Synthetic separation',
  ]);
  expect(metrics.textContent).toContain('r = 0.934');
  expect(metrics.textContent).toContain('0 of 4');
  expect(metrics.textContent).toContain('Δ = 0.381');
  expect(metrics.textContent).toContain('p < 0.001');
  expect(metrics.textContent).toContain('AUC-ROC 1.0');
  expect(bioCss).toMatch(/@media \(max-width:\s*980px\)[\s\S]*?\.bio-metrics > div:last-child:nth-child\(odd\)\s*\{[^}]*grid-column:\s*1 \/ -1;[^}]*align-items:\s*center;[^}]*text-align:\s*center;/s);
  expect(note.textContent).toContain('11 continuation-weight settings with 20 trajectories per setting');
  expect(note.textContent).toContain('n = 30 per class');
  expect(note.textContent).toContain('one seed (42)');
  expect(note.textContent).not.toContain('confidence interval');
});

test('non-public and compilation sources are labeled by evidentiary status', () => {
  const document = new JSDOM(bioHtml).window.document;

  expect(bioHtml).not.toContain('Lifeboat Foundation');
  expect(document.querySelector('#ref-23').textContent).toContain(
    'Templeton International Research Fellowship appointment correspondence'
  );
  expect(document.querySelector('#ref-23').textContent).toContain('On file, available on request.');
  expect(document.querySelector('#ref-26').textContent).toContain('On file, available on request.');
  expect(document.querySelector('#ref-27').textContent).toContain('On file, available on request.');
  expect(document.querySelector('#ref-28').textContent).toContain('Historical source compilation');
  expect(document.querySelector('#ref-36').textContent).toContain(
    'photographic record of the French Sénat presentation on file, available on request.'
  );
  expect(document.querySelector('#ref-41 a[href="https://astradyne.us/team-member/christopher-altman/"]')).not.toBeNull();
  expect(document.querySelector('#ref-41').textContent).not.toContain('VASCO');
  expect(document.querySelector('#ref-42 a[href="https://vascoproject.org/our-team/"]')).not.toBeNull();
  expect(document.querySelector('#ref-42').textContent).not.toContain('Astradyne');
  expect(document.querySelector('#ref-42').textContent).toContain(
    'Official photographic contributor roster; role correspondence on file, available on request.'
  );
});

test('lab naming, personal-site naming, update date, and dual IJTP records stay synchronized', () => {
  const document = new JSDOM(bioHtml).window.document;
  const homeDocument = new JSDOM(homeHtml).window.document;
  const ref15 = document.querySelector('#ref-19');

  expect(document.querySelector('.site-nav a[href="https://www.christopheraltman.com"]').textContent.trim())
    .toBe('Personal');
  expect(document.querySelector('.footer-copyright').textContent).toContain('Updated 24 August 2026');
  expect(homeDocument.querySelector('meta[name="twitter:title"]').content)
    .toBe('Frontier AI Lab | Christopher Altman');
  expect(bioHtml).not.toMatch(/Frontier Lab|Research Lab|Frontier AI Research Lab|Personal site/);
  expect(ref15.textContent).toContain('electronic record, 43(10), 2029–2040');
  expect(ref15.textContent).toContain('print issue, 43(12), 2435–2445');
  expect(homeHtml).toContain('electronic record 43(10), 2029–2040; print issue 43(12), 2435–2445');
});

test('machine-readable backend identifier uses inline code semantics', () => {
  const document = new JSDOM(bioHtml).window.document;
  const backendIdentifier = document.querySelector('#quantum code');

  expect(backendIdentifier.textContent).toBe('ibm_fez');
  expect(bioCss).toMatch(/\.bio-prose code\s*\{[^}]*background:\s*color-mix\(/s);
  expect(bioCss).toMatch(/\.bio-prose code\s*\{[^}]*border-radius:\s*0\.3rem;/s);
});
