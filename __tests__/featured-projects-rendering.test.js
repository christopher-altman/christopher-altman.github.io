const fs = require('fs');
const path = require('path');
const { TextDecoder, TextEncoder } = require('util');

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const { JSDOM } = require('jsdom');

const repoRoot = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(repoRoot, 'script.js'), 'utf8');

function bootPage(url = 'http://localhost/') {
  const dom = new JSDOM(html, {
    url,
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  dom.window.matchMedia = dom.window.matchMedia || (() => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }));

  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));
  return dom.window;
}

describe('Featured Projects rendering states', () => {
  test('initial static HTML exposes loading, not the empty-filter message', () => {
    const dom = new JSDOM(html);

    expect(dom.window.document.querySelector('#projectsStatus').textContent).toContain('Loading featured projects');
    expect(dom.window.document.querySelector('#noResults').textContent.trim()).toBe('');
    expect(dom.window.document.body.textContent).not.toContain('No repositories match your current filters');
  });

  test('successful static repository data renders project cards', () => {
    const window = bootPage();

    expect(window.document.querySelectorAll('.repo-card')).toHaveLength(12);
    expect(window.document.querySelector('.repos-section').dataset.projectsState).toBe('loaded');
    expect(window.document.querySelector('#projectsStatus').style.display).toBe('none');
    expect(window.document.querySelector('#noResults').style.display).toBe('none');
  });

  test('delayed repository data keeps loading visible before cards render', () => {
    const window = bootPage();

    window.eval("setRepositoriesLoading({ source: 'mock-delayed' });");
    expect(window.document.querySelector('.repos-section').dataset.projectsState).toBe('loading');
    expect(window.document.querySelector('#projectsStatus').style.display).toBe('block');
    expect(window.document.querySelector('#projectsStatus').textContent).toContain('Loading featured projects');
    expect(window.document.querySelectorAll('.repo-card')).toHaveLength(0);

    window.eval("hydrateRepositories(getFilteredRepositories(), { source: 'static-inline', fallbackUsed: true });");
    expect(window.document.querySelector('.repos-section').dataset.projectsState).toBe('loaded');
    expect(window.document.querySelectorAll('.repo-card')).toHaveLength(12);
  });

  test('empty successful data response shows only the true empty-filter state', () => {
    const window = bootPage();

    window.eval("hydrateRepositories([], { source: 'mock-empty' });");
    expect(window.document.querySelector('.repos-section').dataset.projectsState).toBe('empty');
    expect(window.document.querySelector('#noResults').style.display).toBe('block');
    expect(window.document.querySelector('#noResults').textContent).toBe('No repositories match your current filters.');
    expect(window.document.querySelector('#projectsUnavailable').style.display).toBe('none');
  });

  test('403 and 429-style failures show unavailable state, not empty-filter state', () => {
    const window403 = bootPage();
    window403.eval("failRepositories(new Error('GitHub API 403 rate limit'), { source: 'github-rest', statusCode: 403, rateLimitRemaining: '0' });");
    expect(window403.document.querySelector('.repos-section').dataset.projectsState).toBe('unavailable');
    expect(window403.document.querySelector('#projectsUnavailable').style.display).toBe('block');
    expect(window403.document.querySelector('#projectsUnavailable').textContent).toContain('Featured projects are temporarily unavailable');
    expect(window403.document.querySelector('#noResults').textContent.trim()).toBe('');

    const window429 = bootPage();
    window429.eval("failRepositories(new Error('GitHub API 429'), { source: 'github-rest', statusCode: 429, retryAfter: '60' });");
    expect(window429.document.querySelector('.repos-section').dataset.projectsState).toBe('unavailable');
    expect(window429.document.querySelector('#projectsUnavailable').style.display).toBe('block');
    expect(window429.document.querySelector('#noResults').textContent.trim()).toBe('');
  });

  test('blocked GitHub requests do not affect static featured project cards', () => {
    const dom = new JSDOM(html, {
      url: 'http://localhost/',
      runScripts: 'outside-only',
      pretendToBeVisual: true
    });

    dom.window.fetch = jest.fn(() => Promise.reject(new Error('api.github.com blocked')));
    dom.window.matchMedia = dom.window.matchMedia || (() => ({ matches: false }));
    dom.window.eval(script);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));

    expect(dom.window.fetch).not.toHaveBeenCalled();
    expect(dom.window.document.querySelectorAll('.repo-card')).toHaveLength(12);
    expect(dom.window.document.querySelector('#noResults').textContent.trim()).toBe('');
  });

  test('stale malformed localStorage does not abort card rendering', () => {
    const dom = new JSDOM(html, {
      url: 'http://localhost/',
      runScripts: 'outside-only',
      pretendToBeVisual: true
    });

    dom.window.localStorage.setItem('repoCollapseState', '{bad-json');
    dom.window.matchMedia = dom.window.matchMedia || (() => ({ matches: false }));
    dom.window.eval(script);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));

    expect(dom.window.document.querySelectorAll('.repo-card')).toHaveLength(12);
    expect(dom.window.document.querySelector('.repos-section').dataset.projectsState).toBe('loaded');
  });
});
