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
  expect(quantum.textContent).toContain('the clearest methodological precursor to his present work');
  expect(quantum.textContent).not.toContain('the closest precursor to his present work');
  expect(quantum.textContent).toContain(
    'In 2004, representing the Quantum Information Science and Technology (QuIST) Project, he attended the invitation-only Gordon Research Conference on Quantum Information Science in Ventura, California.'
  );
  expect(quantum.textContent).not.toContain('2003 Gordon Research Conference');
  expect(quantum.textContent).toContain(
    'At Quantum Structures ’08 in Sopot, Altman spent much of the week in extended discussions on quantum information theory with Lev Levitin during walks along the Baltic coast, while continuing the development of adaptive quantum networks with Zapatrin.'
  );
  expect(quantum.textContent).toContain(
    'During the Traunkirchen residency, he held extended discussions on quantum foundations with Daniel Greenberger, Anton Zeilinger, Rupert Ursin, Časlav Brukner, and other fellows and researchers.'
  );
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
    'Altman originated the idea of treating network topology itself — not only its parameters — as a trainable variable and further developed the resulting adaptive quantum-network formalism with Roman R. Zapatrin.'
  );
  expect(starlab.textContent).toContain('Superpositional Quantum Network Topologies');
  expect(starlab.textContent).toContain('Accelerated Training Convergence in Superposed Quantum Networks');
  expect(starlab.textContent).toContain('Backpropagation Training in Adaptive Quantum Networks');
  expect(starlab.textContent).not.toContain('first met at Starlab');
  expect(starlab.textContent).not.toContain('remotely');
  expect(starlab.textContent).not.toContain('April 2001');
  expect(starlab.textContent).not.toContain('November');
  expect(astronautics.textContent).toContain(
    'From 2009 to 2013 he was a senior research scientist with the Pacific International Space Center for Exploration Systems, a University of Hawaiʻi program for lunar- and Mars-analogue research and astronaut field training.'
  );
  expect(astronautics.textContent).toContain(
    'Its Mauna Kea analogue site—terrain NASA had used for Apollo-era field-geology training—was proposed for the quantum-communications tests.'
  );

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
  expect(document.querySelector('#ref-17 a').href).toBe(
    'https://www.christopheraltman.com/2008/08/progress-in-quantum-computing-iqsa-lt25.html'
  );
  expect(document.querySelector('#ref-21 a').href).toBe(
    'https://www.christopheraltman.com/2010/'
  );

  expect(homeHtml).toContain(
    "companion quantum-communications proposal materials for NASA Innovative Advanced Concepts (NIAC) and DARPA Quiness (Macroscopic Quantum Communications); the NIAC proposal was subsequently referred to NASA's Office of the Chief Technologist"
  );
  expect(homeHtml).not.toContain('NASA NIAC/OCT');
  expect(homeHtml).toContain('<i>Principal Investigator and Program Lead, NIAC proposal</i>');
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

test('page header identifies the profile as a research biography', () => {
  const document = new JSDOM(bioHtml).window.document;
  const tagline = document.querySelector('.bio-home-link .tagline');

  expect(tagline.textContent.trim()).toBe('Research biography');
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

test('patent status has a dedicated source and the career narrative returns to UCIP', () => {
  const document = new JSDOM(bioHtml).window.document;
  const patentSource = document.querySelector('#ref-3 a');
  const frontierAi = document.querySelector('#frontier-ai');
  const leadership = document.querySelector('#leadership');
  const publications = document.querySelector('#publications');

  expect(patentSource.href).toBe('https://continuationobservatory.org/ucip/patent/');
  expect(document.querySelector('a[href="#ref-3"]')).not.toBeNull();
  expect(frontierAi.textContent).toContain('Each model generation becomes another observation point');
  expect(leadership.textContent).toContain('Continuation Observatory brings these threads together');
  expect(leadership.textContent).toContain('the methodological undercurrent running through Altman’s career');
  expect(leadership.textContent).toContain('where it becomes operational');
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
    'The objective is to establish the necessary instrumentation before AI-mediated research acceleration substantially compresses the interval between capability gain, evaluation, and deployment—when surface compliance and retrospective diagnosis become least reliable.'
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
    'His experimental and applied work runs from quantum-optical entanglement and coherence in superconducting devices to satellite quantum-key-distribution security analysis that models live quantum links under real-world atmospheric and orbital constraints in support of ongoing entangled-photon experiments'
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
