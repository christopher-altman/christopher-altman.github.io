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

  expect(document.title).toBe('Christopher Altman — Physicist, AI Researcher & Quantum Scientist');
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

  expect(overview.textContent).toContain(
    'a live public research platform that publishes and tracks structural measurements of continuation behavior across frontier model generations'
  );
  expect(overview.textContent).not.toContain('national-security benchmarking');
  expect(quantum.textContent).toContain(
    "Although UCIP is computed classically, its use of density-matrix formalism has a methodological antecedent in Altman's earlier quantum-information research."
  );
  expect(quantum.textContent).toContain('the clearest methodological precursor to his present work');
  expect(quantum.textContent).not.toContain('the closest precursor to his present work');
  expect(quantum.textContent).toContain(
    'His applied quantum-information work subsequently extended into companion quantum-communications proposals for NASA Innovative Advanced Concepts (NIAC) and DARPA Quiness. He served as principal investigator and program lead for the NIAC Phase I proposal'
  );
  expect(quantum.textContent).toContain(
    'The companion Quiness proposal called for a global, multimodal quantum-communications network integrating an intercontinental fiber backbone with a satellite constellation; free-space nodes aboard autonomous drones, high-altitude blimps, and weather balloons; and underwater optical links between U.S. Navy submarines.'
  );
  expect(quantum.textContent).toContain(
    "Altman's role centered both on SCUBA-supported installation and field testing of a blue-green underwater laser coupled to QuintessenceLabs transmitter-and-receiver hardware for the submarine links and on providing PISCES access, facilities, support, and logistics for a Hawaiʻi Island–Maui free-space demonstration."
  );
  expect(quantum.textContent).toContain(
    'Following the Quiness submission, discussions continued toward experimental implementation using QuintessenceLabs quantum-cryptography hardware at Boeing.'
  );
  expect(quantum.textContent).not.toContain("Altman's proposed role centered both");
  expect(quantum.textContent).toContain(
    "The NIAC proposal was subsequently referred to NASA's Office of the Chief Technologist."
  );
  expect(quantum.textContent).not.toContain('NASA NIAC/OCT');
  expect(quantum.textContent).not.toMatch(/program lead[^.]*Quiness|Quiness[^.]*program lead/i);
  expect(quantum.textContent).not.toContain('on both of which he was principal investigator');
  expect(quantum.textContent).not.toMatch(/principal investigator[^.]*Quiness|Quiness[^.]*principal investigator/i);
  expect(quantum.textContent).not.toContain('carried the same architecture into two proposals');

  expect(quantum.querySelector('a[href="#ref-34"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-35"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-36"]')).not.toBeNull();
  expect(quantum.querySelector('a[href="#ref-37"]')).not.toBeNull();
  expect(document.querySelector('#ref-34').textContent).toContain('NASA NSPIRES');
  expect(document.querySelector('#ref-35 a').href).toBe('https://thpedia.org/wiki/Quiness');
  expect(document.querySelector('#ref-36 a').href).toBe('https://www.darpa.mil/research/programs/quiness');
  expect(document.querySelector('#ref-37').textContent).toContain('QUINESS Underwater Laser');

  expect(homeHtml).toContain(
    "companion quantum-communications proposal materials for NASA Innovative Advanced Concepts (NIAC) and DARPA Quiness (Macroscopic Quantum Communications); the NIAC proposal was subsequently referred to NASA's Office of the Chief Technologist"
  );
  expect(homeHtml).not.toContain('NASA NIAC/OCT');
  expect(homeHtml).toContain('<i>Principal Investigator and Program Lead, NIAC proposal</i>');
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

test('opening name uses the second quarter reduction without wrapping', () => {
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*max-width:\s*none;/s);
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*font-size:\s*clamp\(1\.828125rem,\s*5\.0625vw,\s*4\.21875rem\);/s);
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*letter-spacing:\s*0\.045em;/s);
  expect(bioCss).toMatch(/\.bio-hero h1\s*\{[^}]*white-space:\s*nowrap;/s);
});

test('patent status has a dedicated source and the career narrative returns to UCIP', () => {
  const document = new JSDOM(bioHtml).window.document;
  const patentSource = document.querySelector('#ref-28 a');
  const frontierAi = document.querySelector('#frontier-ai');
  const leadership = document.querySelector('#leadership');
  const publications = document.querySelector('#publications');

  expect(patentSource.href).toBe('https://continuationobservatory.org/ucip/patent/');
  expect(document.querySelector('a[href="#ref-28"]')).not.toBeNull();
  expect(frontierAi.textContent).toContain('Each model generation becomes another observation point');
  expect(leadership.textContent).toContain('Continuation Observatory brings these threads together');
  expect(leadership.textContent).toContain('the methodological undercurrent running through Altman\'s career');
  expect(leadership.textContent).toContain('where it becomes operational');
  expect(leadership.compareDocumentPosition(publications) & 4).toBeTruthy();
});

test('why-now framing connects present capability thresholds to operational measurement', () => {
  const document = new JSDOM(bioHtml).window.document;
  const whyNow = document.querySelector('#frontier-ai .bio-why-now');
  const expectedSources = new Map([
    ['30', 'https://metr.org/time-horizons/'],
    ['31', 'https://openai.com/index/updating-our-preparedness-framework/'],
    ['32', 'https://www.anthropic.com/responsible-scaling-policy/roadmap'],
    ['33', 'https://deepmind.google/blog/strengthening-our-frontier-safety-framework/'],
  ]);

  expect(whyNow.querySelector('strong').textContent).toBe('Why this matters now.');
  expect(whyNow.textContent).toContain(
    'The objective is to establish such instrumentation before AI-mediated research acceleration substantially compresses the interval between capability gain, evaluation, and deployment.'
  );
  expect(whyNow.textContent).not.toContain('recursive operational loop');
  expectedSources.forEach((href, reference) => {
    expect(whyNow.querySelector(`a[href="#ref-${reference}"]`)).not.toBeNull();
    expect(document.querySelector(`#ref-${reference} a`).href).toBe(href);
  });
  expect(bioCss).toMatch(/\.bio-prose \.bio-why-now\s*\{[^}]*border-left:\s*2px solid var\(--color-accent\);/s);
});

test('space-deployable quantum communications cite the satellite-QKD framework', () => {
  const document = new JSDOM(bioHtml).window.document;
  const satelliteQkdSource = document.querySelector('#ref-29 a');
  const overview = document.querySelector('#overview');

  expect(satelliteQkdSource.href)
    .toBe('https://github.com/christopher-altman/sat-qkd-security-curves');
  expect(overview.textContent).toContain('space-deployable quantum-communication architectures');
  expect(overview.querySelector('a[href="#ref-29"]')).not.toBeNull();
});

test('machine-readable backend identifier uses inline code semantics', () => {
  const document = new JSDOM(bioHtml).window.document;
  const backendIdentifier = document.querySelector('#quantum code');

  expect(backendIdentifier.textContent).toBe('ibm_fez');
  expect(bioCss).toMatch(/\.bio-prose code\s*\{[^}]*background:\s*color-mix\(/s);
  expect(bioCss).toMatch(/\.bio-prose code\s*\{[^}]*border-radius:\s*0\.3rem;/s);
});
