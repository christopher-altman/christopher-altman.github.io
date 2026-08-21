const fs = require('fs');
const path = require('path');
const { TextDecoder, TextEncoder } = require('util');

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const { JSDOM } = require('jsdom');


const root = path.join(__dirname, '..');
const homeHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const bioHtml = fs.readFileSync(path.join(root, 'bio', 'index.html'), 'utf8');
const bioCss = fs.readFileSync(path.join(root, 'bio', 'bio.css'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');


test('biography is a canonical, indexable profile page', () => {
  const document = new JSDOM(bioHtml).window.document;

  expect(document.title).toBe('Christopher Altman — Physicist, Frontier AI Researcher & Quantum Scientist');
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
  const biographyLinks = [...document.querySelectorAll('a')]
    .filter((link) => link.textContent.trim() === 'Biography');

  expect(biographyLinks.length).toBeGreaterThanOrEqual(2);
  expect(biographyLinks.every((link) => link.getAttribute('href') === 'bio/')).toBe(true);
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
    'In 2004, representing the Quantum Information Science and Technology (QuIST) Project, he attended the invitation-only Gordon Research Conference on Quantum Information Science in Ventura, California.'
  );
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
  const siftedSource = document.querySelector('#ref-27 a');
  expect(starlab.querySelector('a[href="#ref-27"]')).not.toBeNull();
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

  expect(quantum.querySelector('a[href="#ref-22"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-24"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-25"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-23"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-12"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-17"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-21"]')).not.toBeNull();
  expect(document.querySelector('#ref-22').textContent).toContain('NASA NSPIRES');
  expect(document.querySelector('#ref-24 a').href).toBe('https://thpedia.org/wiki/Quiness');
  expect(document.querySelector('#ref-25 a').href).toBe('https://www.darpa.mil/research/programs/quiness');
  expect(document.querySelector('#ref-23').textContent).toContain('QUINESS Underwater Laser');
  expect(document.querySelector('#ref-12 a').href).toBe(
    'https://www.grc.org/quantum-information-science-conference/2004/'
  );
  expect(document.querySelectorAll('#ref-12 a')[1].getAttribute('href')).toBe(
    '../assets/documents/gordon-research-conference-quantum-information-science-2004.pdf'
  );
  expect(document.querySelector('#ref-17 a').href).toBe(
    'https://www.christopheraltman.com/2008/08/progress-in-quantum-computing-iqsa-lt25.html'
  );
  expect(document.querySelector('#ref-21 a').href).toBe(
    'https://www.christopheraltman.com/2010/'
  );
  expect(document.querySelectorAll('#ref-21 a')[1].getAttribute('href')).toBe(
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

test('institutional research assessments identify their documented recipients and roadmap influence', () => {
  const document = new JSDOM(bioHtml).window.document;
  const leadership = document.querySelector('#leadership');
  const leadershipWithoutCitations = leadership.cloneNode(true);
  leadershipWithoutCitations.querySelectorAll('sup').forEach(citation => citation.remove());
  const assessmentSource = document.querySelector('#ref-42');
  const collinsSource = document.querySelector('#ref-43');
  const roadmapSource = document.querySelector('#ref-44');
  const conferenceSource = document.querySelector('#ref-45');
  const meetingSource = document.querySelector('#ref-46');
  const ursinSource = document.querySelector('#ref-47');

  expect(leadershipWithoutCitations.textContent).toContain(
    'From 2003 to 2004, while based in Tokyo with the Asian Technology Information Program’s Quantum Information Science and Technology project, Altman prepared national-level assessments of East Asian quantum-information research for senior figures across U.S. policy, scientific, and research-funding institutions, including Dean Collins, director of the Advanced Research and Development Activity (ARDA), and Richard J. Hughes of Los Alamos National Laboratory, who chaired the Technology Experts Panel for the 2004 QIST Quantum Cryptography Roadmap. Altman and Hughes first met in person during the 2013 IEEE Photonics Society Summer Topical Meeting on Quantum Photonics and Communications in Waikoloa, Hawaiʻi. In extended discussions, Hughes described Altman’s reports as a formative influence on the U.S. national quantum roadmap. Throughout that week, Altman continued discussions with NIAC collaborator Rupert Ursin on free-space quantum communication toward satellites, in settings ranging from Mauna Kea to Hawaiʻi Island’s rainforest, beaches, and volcanic coast.'
  );
  expect(leadership.textContent).not.toContain(
    'senior leadership at U.S. policy, scientific, and research-funding agencies'
  );
  expect(leadershipWithoutCitations.textContent).toContain(
    'In 2004 Altman received the European Information Security Award'
  );
  expect(leadershipWithoutCitations.textContent).not.toContain(
    'In 2004 he received the European Information Security Award'
  );
  expect(assessmentSource.querySelector('a').getAttribute('href')).toBe(
    '../assets/documents/korean-quantum-information-research.pdf'
  );
  expect(collinsSource.querySelector('a[href="https://www.nationalacademies.org/read/13540/chapter/5"]')).not.toBeNull();
  expect(roadmapSource.querySelector('a[href="https://qist.lanl.gov/pdfs/whole_roadmap.pdf"]')).not.toBeNull();
  expect(conferenceSource.querySelector('a[href="https://web.archive.org/web/20130209212255/http://www.sum-ieee.org/"]')).not.toBeNull();
  expect(ursinSource.querySelector('a[href="https://www.christopheraltman.com/2013/07/l-istening-to-rupert-ursin-s-closing.html"]')).not.toBeNull();
  expect(meetingSource.querySelector('a[href="https://www.christopheraltman.com/2013/08/"]')).not.toBeNull();
});

test('research leadership includes current OASA teaching and mentorship', () => {
  const document = new JSDOM(bioHtml).window.document;
  const leadership = document.querySelector('#leadership');
  const oasaSource = document.querySelector('#ref-39');

  expect(leadership.textContent).toContain(
    'Alongside his research, Altman serves on the International Council of Advisors of the Orion Astropreneur Space Academy in Hong Kong, teaching and mentoring students and aspiring space-sector professionals in commercial astronautics and the future of human spaceflight.'
  );
  expect(leadership.querySelector('a[href="#ref-39"]')).not.toBeNull();
  expect(oasaSource.querySelector('a[href="https://www.oasahk.org/team-oasa"]')).not.toBeNull();
  expect(oasaSource.querySelector('a[href="https://www.oasahk.org/summer-boot-camp2025"]')).not.toBeNull();
});

test('education records undergraduate research leadership and the Salishan fellowship cohort', () => {
  const document = new JSDOM(bioHtml).window.document;
  const leadership = document.querySelector('#leadership');
  const salishanSource = document.querySelector('#ref-50');

  expect(leadership.textContent).toContain(
    'Altman studied philosophy at the Pierre Laclede Honors College of the University of Missouri–St. Louis. As an undergraduate honors research fellow, he co-directed experimental neuroscience studies supported by National Science Foundation funding, contributing original study designs and supervising undergraduate and graduate research assistants.'
  );
  expect(leadership.textContent).toContain(
    'In April 2001, Altman was selected as one of three student fellows for the invitation-only Salishan Conference on High-Speed Computing, alongside MIT Media Lab doctoral researchers H. Shrikumar and Bill Butera.'
  );
  expect(leadership.querySelector('a[href="#ref-49"]')).not.toBeNull();
  expect(leadership.querySelector('a[href="#ref-50"]')).not.toBeNull();
  expect(salishanSource.querySelector('a').href).toBe(
    'https://www.christopheraltman.com/2001/05/salishan.html'
  );
});

test('opening biography lede and metadata use a consistent frontier-AI presentation', () => {
  const document = new JSDOM(bioHtml).window.document;
  const title = 'Christopher Altman — Physicist, Frontier AI Researcher & Quantum Scientist';
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
  expect(document.querySelector('#ref-21').textContent)
    .toContain('Traunkirchen — Quantum Physics and the Nature of Reality');
});

test('opening profile closes its professional link row with Hugging Face', () => {
  const document = new JSDOM(bioHtml).window.document;
  const professionalLinks = [...document.querySelectorAll('.bio-primary-links a')];
  const topNavigationLabels = [...document.querySelectorAll('.bio-nav a')]
    .map((link) => link.textContent.trim());
  const huggingFace = professionalLinks.at(-1);

  expect(huggingFace.textContent.trim()).toBe('Hugging Face');
  expect(huggingFace.href).toBe('https://huggingface.co/cohaerence');
  expect(topNavigationLabels).not.toContain('Hugging Face');
});

test('page header identifies the research biography and uses a compact lab label', () => {
  const document = new JSDOM(bioHtml).window.document;
  const tagline = document.querySelector('.bio-home-link .tagline');
  const labLink = document.querySelector('.bio-nav a[href="../"]');

  expect(tagline.textContent.trim()).toBe('Research biography');
  expect(labLink.textContent.trim()).toBe('Frontier Lab');
});

test('opening name uses the second quarter reduction without wrapping', () => {
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*max-width:\s*none;/s);
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*font-size:\s*clamp\(1\.828125rem,\s*5\.0625vw,\s*4\.21875rem\);/s);
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*letter-spacing:\s*0\.045em;/s);
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*white-space:\s*nowrap;/s);
});

test('long biography headings use the full prose width before wrapping', () => {
  expect(bioCss).toMatch(
    /#starlab > h2,\s*#astronautics > h2,\s*#leadership > h2\s*\{[^}]*max-width:\s*none;/s
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
  const thpediaSource = document.querySelector('#ref-49');
  const profileLink = thpediaSource.querySelector(
    'a[href="https://thpedia.org/wiki/Christopher_Altman"]'
  );

  expect(document.querySelector('#leadership a[href="#ref-49"]')).not.toBeNull();
  expect(profileLink).not.toBeNull();
  expect(thpediaSource.textContent).toContain(
    'Extended biographical profile and historical source compilation.'
  );
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
    'His experimental and applied contributions range from quantum-optical entanglement and coherence in superconducting devices to satellite quantum-key-distribution security analysis that models live quantum links under real-world atmospheric and orbital constraints in support of ongoing entangled-photon experiments'
  );
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

test('machine-readable backend identifier uses inline code semantics', () => {
  const document = new JSDOM(bioHtml).window.document;
  const backendIdentifier = document.querySelector('#quantum code');

  expect(backendIdentifier.textContent).toBe('ibm_fez');
  expect(bioCss).toMatch(/\.bio-prose code\s*\{[^}]*background:\s*color-mix\(/s);
  expect(bioCss).toMatch(/\.bio-prose code\s*\{[^}]*border-radius:\s*0\.3rem;/s);
});
