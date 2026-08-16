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

  expect(bioHtml).toContain('The result defines a falsifiable structural hypothesis in a controlled regime.');
  expect(bioHtml).toContain("preserving each result's protocol, metric version, and falsification context");
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
