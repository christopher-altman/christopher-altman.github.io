// Repository Data
const repositories = [
  {
    id: 'qml-verification-lab',
    title: 'Quantum Machine Learning (QML) Verification Lab',
    url: 'https://github.com/christopher-altman/qml-verification-lab',
    shortDesc: 'QML verification harness: when accuracy holds but epistemic metrics collapse under noise.',
    heroLight: 'assets/figures/qml-verification-lab/hero_light.png',
    heroDark: 'assets/figures/qml-verification-lab/hero_dark.png',
    methods: [
      'Canonical battery: noise × depth verification landscape',
      'Metric registry: identifiability + curvature proxies',
      'Backend plugins: template backend + drop-in extensibility',
      'Reports: deterministic runs + CI-ready artifacts'
    ],
    finding: 'Accuracy can persist while identifiability and curvature collapse—verification needs epistemic metrics, not accuracy alone.',
    tags: ['Quantum ML', 'Verification', 'Identifiability', 'Reproducibility'],
    longDesc: 'A reproducible verification harness for quantum ML that measures when models stay accurate but become epistemically fragile under noise. Ships a canonical battery, a metric registry, backend plugins, and deterministic report outputs.'
  },
  {
    id: 'wigners-friend-branch-transfer',
    title: 'Wigner\'s Friend: Inter-Branch Communication on IBM Quantum Hardware',
    url: 'https://arxiv.org/abs/2601.16004',
    shortDesc: 'Reproducible benchmark suite implementing many-worlds inter-branch “message-transfer” circuit primitives.',
    heroLight: 'assets/branch.jpg',
    heroDark: 'assets/branch.jpg',
    methods: [
      'IBM 156-qubit Heron, 20,000 shots per experiment',
      'Coherence witnesses W_X/W_Y parity correlators; phase-robust C = 1.167 ± 0.004',
      'Collapse-channel constraint: detectability threshold γ ≈ 0.05 (20k shots)'
    ],
    finding: 'Hardware visibility (V=0.877) backend-matched simulation (V=0.938); coherence magnitude C=1.167. Coherence witnesses detect dephasing at gamma=0.05 where visibility remains unchanged, providing complementary observables for constraining collapse-model parameter space.',
    tags: ['Quantum Foundations', 'Wigner\'s Friend', 'Many-Worlds', 'Inter-Branch Communication', 'Benchmarks', 'IBM Quantum', 'Superconducting Qubits', 'Qiskit', 'Reproducibility', 'Noise Modeling'],
    longDesc: 'Benchmarks Wigner’s-friend circuit on superconducting quantum hardware to estimate operational inter-branch communication witnesses from classical measurement correlations. Implements a five-qubit, branch-conditioned message-transfer protocol on IBM hardware with full provenance. Uses coherence witnesses to probe dephasing beyond visibility. Ships full reproducibility bundle: hardware + simulation artifacts, calibration snapshots, figures, manifest with SHA256. arXiv: 2601.16004.',
    paperUrl: 'https://arxiv.org/abs/2601.16004',
    repoUrl: 'https://github.com/christopher-altman/ibm-qml-kernel'
  },
  {
    id: 'sat-qkd-security-curves',
    title: 'Satellite Quantum Key Distribution (QKD)',
    url: 'https://github.com/christopher-altman/sat-qkd-security-curves',
    shortDesc: 'Security-rate vs distance curves for satellite QKD under realistic loss/noise, with reproducible sweep figures.',
    heroLight: 'assets/figures/sat-qkd-security-curves/hero_light.png',
    heroDark: 'assets/figures/sat-qkd-security-curves/hero_dark.png',
    methods: [
      'Security curves: key rate vs distance under loss + background',
      'Parameter sweeps: link budget regimes and breakpoints',
      'Reproducible figures: deterministic plot generation'
    ],
    finding: 'Security rate collapses across identifiable distance/noise thresholds—curves expose operational margins, not just point estimates.',
    tags: ['Quantum', 'Security', 'QKD', 'Satellite', 'Reproducibility'],
    longDesc: 'A reproducible mini-lab for generating satellite QKD security-rate curves across realistic link conditions. Focuses on operational thresholds, parameter regimes, and figure-first validation.'
  },
  {
    id: 'autodidactic-qml',
    title: 'Autodidactic Quantum Machine Learning Loop Falsifier',
    url: 'https://github.com/christopher-altman/autodidactic-qml',
    shortDesc: 'Falsification testbed for local functional recoverability in neural networks',
    methods: [
      'Matrix-to-RNN pipeline with Hermitian Langevin dynamics',
      'Constrained recovery under multiple proxy families (weight proximity, spectral moments, representation similarity)',
      'Deterministic PRE→POST→RECOVER protocol with Gaussian perturbations',
      'Mutual-information proxy for self-reconstruction training'
    ],
    finding: 'Restoring local geometry does not restore function—proxy metrics improve but behavior fails to return; parameter/representation/function distance decouple',
    tags: ['Alignment', 'Recoverability', 'Neural Networks', 'Falsification'],
    longDesc: 'Implements a falsification testbed for local functional recoverability in neural networks. Minimal matrix-to-RNN pipeline: Hermitian matrix evolves via Langevin dynamics, deterministically mapped into a cyclic RNN trained on self-reconstruction with a mutual-information proxy. After training: perturb weights with Gaussian noise; perform one constrained recovery step under different proxy families using a deterministic PRE→POST→RECOVER pipeline. Challenges locality assumptions in model editing/alignment; highlights functional aliasing.'
  },
  {
    id: 'ibm-qml-kernel',
    title: 'Quantum Kernel Estimation with IBM Hardware Noise',
    url: 'https://github.com/christopher-altman/ibm-qml-kernel',
    shortDesc: 'Validated quantum kernel methods under realistic 2026 IBM hardware noise.',
    heroLight: 'assets/figures/ibm-qml-kernel/hero_light.png',
    heroDark: 'assets/figures/ibm-qml-kernel/hero_dark.png',
    methods: [
      'Production-ready QML workflow with hardware-calibrated parameters from 127-qubit Eagle processors',
      'Kernel alignment metrics (0.85–0.95) quantifying agreement between quantum and classical kernels',
      'Noise impact quantification under realistic IBM hardware noise channels',
      'Full IBM Quantum Platform integration with Qiskit runtime'
    ],
    finding: 'Kernel alignment 0.85–0.95 maintained under 2026 IBM Eagle hardware noise—validates kernel methods for NISQ deployment where theoretical noise models diverge from actual hardware.',
    tags: ['Quantum ML', 'IBM Quantum', 'Kernels', 'Hardware Noise', 'NISQ', 'Calibration'],
    longDesc: 'Production-ready QML workflow with hardware-calibrated parameters from 127-qubit Eagle processors. Demonstrates kernel alignment metrics (0.85–0.95), noise impact quantification, and full IBM Quantum Platform integration. Critical for NISQ-era deployment where theoretical noise models diverge from actual hardware.'
  },
  {
    id: 'noise-aware-qnn-identifiability',
    title: 'Noise-Aware Quantum Neural Networks (QNN) Identifiability',
    url: 'https://github.com/christopher-altman/noise-aware-qnn-identifiability',
    shortDesc: 'Accuracy does not guarantee recoverability. Under noise, performance can survive while recoverability collapses.',
    methods: [
      'Minimal QNN-style testbed: 2-qubit variational circuit with depolarizing noise and amplitude damping',
      'Dense parameter grid sweeps (16×16, 256 points) over noise probability p and readout noise σ',
      'Enhanced identifiability metrics: Hessian curvature, Fisher Information conditioning, effective rank',
      'Deterministic experiments with YAML/JSON configuration and automated plotting'
    ],
    finding: 'ρ(acc, identifiability) ≈ 0.04 — accuracy decouples from recoverability; acc ≈ 0.887 at ident ≈ 0.000 demonstrates non-identifiable regime',
    tags: ['Quantum ML', 'Identifiability', 'Noise', 'Verification'],
    longDesc: 'This project demonstrates a concrete verification failure mode in noisy quantum (and quantum-inspired) learning systems: models can retain high predictive accuracy even as the underlying parameters become fundamentally unidentifiable. Using a minimal, fully reproducible QNN-style setup, the study shows how noise flattens the information geometry—measured via Hessian curvature and Fisher Information—destroying parameter recoverability without visibly harming task performance. The repository provides a complete research harness: command-line experiments, YAML/JSON configurations, enhanced identifiability metrics, automated plotting, and full test coverage. All results are deterministic, auditable, and easy to extend. Takeaway: accuracy alone is insufficient for verification. Identifiability must be measured explicitly if learned structure is meant to be trusted.'
  },
  {
    id: 'sqnt-hardware-demo',
    title: 'Hardware Implementation of Superposed Quantum Network Topologies (SQNT)',
    url: 'https://github.com/christopher-altman/sqnt-hardware-demo',
    shortDesc: 'Deterministic SQNT demo: ground-truth mixture recovery + topology sweeps with reproducible figures',
    methods: [
      'Ground-truth mixture generator (controlled interpolation across topology regimes)',
      'Alpha-sweep experiments with deterministic seeds and reproducible figures',
      'Per-layer topology composition diagnostics (structure vs performance coupling)',
      'One-command full run producing figures (numpy/matplotlib only)'
    ],
    finding: 'Mixture recovery is measurable: performance varies smoothly with topology mixing (alpha), enabling falsifiable structure-to-behavior claims in a small, repeatable testbed.',
    tags: ['Quantum ML', 'Adaptive Networks', 'Topology', 'Reproducibility'],
    longDesc: 'A compact, deterministic demonstration of Superposed Quantum Network Topologies (SQNT). The repo is built as a review-proof artifact: known ground-truth mixtures, systematic alpha sweeps, per-layer topology diagnostics, and generated figures from a single full-run script.'
  },
  {
    id: 'qkernel-telemetry',
    title: 'Quantum Kernel Telemetry Anomaly Detection',
    url: 'https://github.com/christopher-altman/qkernel-telemetry-anomaly',
    shortDesc: 'Reproducible anomaly detection in telemetry using quantum kernel methods',
    methods: [
      'Entanglement-based quantum kernels vs classical baselines (RBF-SVM, Isolation Forest)',
      'Data reuploading with ZZ entanglement and IQP rotations',
      'One-class SVM with quantum feature maps',
      'Kernel diagnostics: eigenspectra, effective dimension, conditioning'
    ],
    finding: 'Modest but consistent ROC-AUC gains for quantum kernels in low-data + structured anomaly regimes',
    tags: ['Quantum ML', 'Anomaly Detection', 'Kernels', 'Telemetry'],
    longDesc: 'Reproducible anomaly detection in telemetry using quantum kernel methods. Controlled testbed comparing entanglement-based quantum kernels vs strong classical kernels under realistic constraints (limited labels, manifold geometry, structured anomalies). Synthetic telemetry from a phase-coupled dynamical model with injected drifts/dropouts. Encode features into quantum feature maps to produce states; define kernel via state fidelity; detect anomalies with one-class SVM. Emphasizes reproducibility (fixed seeds, saved artifacts) and hardware roadmap.'
  },
  {
    id: 'bqnn-benchmark',
    title: 'Benchmarks for Binarized Quantum Neural Networks (BQNNs)',
    url: 'https://github.com/christopher-altman/bqnn-benchmark',
    shortDesc: 'Benchmark harness for Binarized Quantum Neural Networks mixing binary classical layers with quantum circuits',
    methods: [
      'Binary classical layers + quantum circuits with quantumness parameter α',
      'RX encodings with trainable RZ phase layers and optional ring entanglement',
      'Pauli-X expectation measurements with classical head',
      'Trainer with clipping, LR scheduling, early stopping'
    ],
    finding: 'Parity accuracy 52.3% vs classical 46.1% (+6.2%); advantage appears on structured nonlinearly separable tasks',
    tags: ['Quantum ML', 'Binarized Networks', 'Benchmarking', 'MNIST'],
    longDesc: 'Benchmark harness for Binarized Quantum Neural Networks (BQNNs) mixing binary classical layers with quantum circuits, interpolating via a quantumness parameter. Tasks: parity and binary MNIST (0 vs 1). Results: parity accuracy 52.3% vs classical binarized 46.1% (+6.2%); MNIST both 60.3% (no advantage). Concludes "advantage" appears on structured nonlinearly separable tasks; without entanglement the quantum layer behaves like a tanh-like nonlinearity.'
  },
  {
    id: 'quantum-decision-flow',
    title: 'Hamiltonian Topology Augmentation: A Quantum-Inspired Geometric Transformation Toolkit',
    url: 'https://github.com/christopher-altman/quantum-decision-flow',
    shortDesc: 'Dynamics-as-augmentation: apply Hamiltonian time evolution to classical datasets',
    methods: [
      'Two-qubit state encoding with Hamiltonian time evolution',
      'Multiple Hamiltonians: ZZ_X, Heisenberg, Ising Transverse, XXZ',
      'Expectation value decoding for topology-aware deformations',
      'kNN-based topology preservation metrics'
    ],
    finding: 'Hamiltonians yield distinct deformation signatures; Heisenberg ~0.828 preservation; correlation between ZZ_X and Heisenberg ~−0.064 (uncorrelated behaviors)',
    tags: ['Quantum Dynamics', 'Data Augmentation', 'Hamiltonian Evolution', 'Manifold Learning'],
    longDesc: 'Applies Hamiltonian time evolution to classical datasets as augmentation. Encode each point into a two-qubit state, evolve under chosen Hamiltonian, decode via expectation values to produce deformed coordinates and vector fields. Vary evolution time and Hamiltonian to generate topology-aware deformations for manifold learning. Shows dynamics choice controls diversity vs topology retention.'
  },
  {
    id: 'quantum-kernel-expressivity',
    title: 'Quantum Kernel Expressivity: Measuring Inductive Bias and Feature Complexity in Quantum Kernel Methods',
    url: 'https://github.com/christopher-altman/quantum-kernel',
    shortDesc: 'Studies how quantum-kernel expressivity affects inductive bias and generalization',
    methods: [
      'Multiple quantum kernel estimators in PennyLane/PyTorch',
      'Circuit depth/width/entanglement layout variation',
      'Spectral properties: rank, eigenvalue distribution, trace norms',
      'Effective dimensionality and margin separation metrics'
    ],
    finding: 'Increased depth/entanglement increases expressivity but can shift inductive bias; spectrum decay and separation metrics identify benefit vs overfitting regimes',
    tags: ['Quantum ML', 'Kernels', 'Expressivity', 'Inductive Bias'],
    longDesc: 'Studies how quantum-kernel expressivity affects inductive bias and generalization. Implements multiple quantum kernel estimators with expressivity metrics; varies circuit depth/width/entanglement layout; measures spectral properties, effective dimensionality, trace norms, margin separation. Highlights: increased depth/entanglement often increases expressivity but can shift inductive bias.'
  },
  {
    id: 'scqubits-fork',
    title: 'Superconducting Flux Qubits: Transmon Anharmonicity vs EJ/EC Ratio',
    url: 'https://github.com/christopher-altman/scqubits',
    shortDesc: 'Open-source Python library for superconducting qubit simulation',
    heroLight: 'assets/figures/scqubits/IBM-Q_Coupler-Topology.jpg',
    heroDark: 'assets/figures/scqubits/IBM-Q_Coupler-Topology.jpg',
    methods: [
      'Qubit energy spectra and Hamiltonian matrix elements',
      'QuTiP integration for open-system and dynamical simulations',
      'Parameter sweep analysis for qubit design exploration',
      'Validates adiabatic flux ramps using Landau–Zener transition heuristics',
      'Tracks dressed-state identity across avoided crossings using eigenstate overlap and Hungarian assignment',
    ],
    finding: 'Extended utilities include sweep tooling with reliable adiabatic ramp validation and dressed-state continuity tracking, enabling physically meaningful parameter sweeps that maintain state identity through avoided crossings and flag diabatic risk using Landau–Zener gap/rate diagnostics.',
    tags: ['Superconducting Qubits', 'Simulation', 'QuTiP', 'Transmons'],
    longDesc: 'Open-source Python library for superconducting qubit simulation and sweep-based design analysis. This fork adds adiabatic ramp validation and dressed-state tracking for robust parameter sweep analysis.'
  }
];

const methods = [
  'Quantum kernels',
  'One-class SVM',
  'Hamiltonian evolution',
  'Recoverability falsification',
  'Binarized networks',
  'Adiabatic validation',
  'Identifiability metrics'
];

// State
let searchTerm = '';
let selectedTags = [];
let selectedMethod = null;
let expandedRepoId = null;
let lastActiveSection = 'repo'; // Track which section was last interacted with

// Repo collapse state per view mode
function getRepoCollapseState() {
  const stored = localStorage.getItem('repoCollapseState');
  return stored ? JSON.parse(stored) : { cards: {}, list: {} };
}

function setRepoCollapseState(state) {
  localStorage.setItem('repoCollapseState', JSON.stringify(state));
}

function isRepoCollapsed(repoId, viewMode) {
  const state = getRepoCollapseState();
  return state[viewMode]?.[repoId] || false;
}

function toggleRepoCollapse(repoId, viewMode) {
  const state = getRepoCollapseState();
  if (!state[viewMode]) state[viewMode] = {};
  state[viewMode][repoId] = !state[viewMode][repoId];
  setRepoCollapseState(state);
}

// Get all unique tags
const allTags = [...new Set(repositories.flatMap(r => r.tags))].sort();

// Define subject tags (first tag of each repo - only one can be active at a time)
const subjectTags = new Set(['Alignment', 'Quantum ML', 'Quantum Dynamics', 'Superconducting Qubits', 'Quantum Foundations']);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeMethodsChips();
  initializeTagFilters();
  initializeSearch();
  renderRepositories();
  updateCurrentYear();
  initializeThemeToggle();
  initializeHeroImageSwap();
  initializeViewToggles();
  initializeKeyboardShortcuts();
  initializeTouchFeedback();
  initializePointerHover();
});

// Methods Chips
function initializeMethodsChips() {
  const container = document.getElementById('methodsChips');
  methods.forEach(method => {
    const chip = document.createElement('button');
    chip.className = 'method-chip';
    chip.textContent = method;
    chip.setAttribute('data-method', method);
    chip.addEventListener('click', () => toggleMethod(method));
    container.appendChild(chip);
  });
}

function toggleMethod(method) {
  selectedMethod = selectedMethod === method ? null : method;
  updateMethodChips();
  renderRepositories();
}

function updateMethodChips() {
  document.querySelectorAll('.method-chip').forEach(chip => {
    const method = chip.getAttribute('data-method');
    if (method === selectedMethod) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

// Tag Filters
function initializeTagFilters() {
  const container = document.getElementById('tagFilters');
  allTags.forEach(tag => {
    const button = document.createElement('button');
    button.className = 'tag-filter';
    button.textContent = tag;
    button.setAttribute('data-tag', tag);
    button.addEventListener('click', () => toggleTag(tag));
    container.appendChild(button);
  });
}

function toggleTag(tag) {
  // Treat the tag row as true "radio" behavior:
  // - clicking an inactive tag selects ONLY that tag
  // - clicking the active tag clears the tag filter
  selectedTags = (selectedTags.length === 1 && selectedTags[0] === tag) ? [] : [tag];

  updateTagFilters();
  renderRepositories();
}

function updateTagFilters() {
  document.querySelectorAll('.tag-filter').forEach(button => {
    const tag = button.getAttribute('data-tag');
    if (selectedTags.includes(tag)) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

// Search
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderRepositories();
  });
}

// Filter Repositories
function getFilteredRepositories() {
  return repositories.filter(repo => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      repo.title.toLowerCase().includes(searchTerm) ||
      repo.shortDesc.toLowerCase().includes(searchTerm) ||
      repo.longDesc.toLowerCase().includes(searchTerm) ||
      repo.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    
    // Tag filter
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => repo.tags.includes(tag));
    
    // Method filter
    const matchesMethod = !selectedMethod ||
      (selectedMethod === 'Quantum kernels' && (repo.id === 'qkernel-telemetry' || repo.id === 'quantum-kernel-expressivity' || repo.id === 'ibm-qml-kernel')) ||
      (selectedMethod === 'One-class SVM' && repo.id === 'qkernel-telemetry') ||
      (selectedMethod === 'Hamiltonian evolution' && repo.id === 'quantum-decision-flow') ||
      (selectedMethod === 'Recoverability falsification' && repo.id === 'autodidactic-qml') ||
      (selectedMethod === 'Binarized networks' && repo.id === 'bqnn-benchmark') ||
      (selectedMethod === 'Adiabatic validation' && repo.id === 'scqubits-fork') ||
      (selectedMethod === 'Identifiability metrics' && (repo.id === 'noise-aware-qnn-identifiability' || repo.id === 'qml-verification-lab'));
    
    return matchesSearch && matchesTags && matchesMethod;
  });
}

// Render Repositories
function renderRepositories() {
  const container = document.getElementById('reposGrid');
  const noResults = document.getElementById('noResults');
  const filtered = getFilteredRepositories();
  
  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }
  
  container.style.display = 'grid';
  noResults.style.display = 'none';
  
  filtered.forEach(repo => {
    const card = createRepoCard(repo);
    container.appendChild(card);
  });
}

function createRepoCard(repo) {
  const card = document.createElement('div');
  card.className = 'repo-card';

  const reposSection = document.querySelector('.repos-section');
  const currentView = reposSection?.dataset.view || 'list';
  const isCollapsed = isRepoCollapsed(repo.id, currentView);

  card.dataset.repoId = repo.id;
  card.dataset.collapsed = isCollapsed;

  const currentTheme = document.documentElement.dataset.theme || 'light';
  const heroImageSrc = repo.heroDark && repo.heroLight
    ? (currentTheme === 'dark' ? repo.heroDark : repo.heroLight)
    : null;

  card.innerHTML = `
    <div class="repo-header">
      <div class="repo-header-left">
        <h4 class="repo-title">
          <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="repo-title-link">${repo.title}</a>
        </h4>
        <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="repo-link" aria-label="View repository on GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
      <button class="collapse-btn" aria-label="${isCollapsed ? 'Expand details' : 'Collapse details'}" aria-expanded="${!isCollapsed}">
        <svg class="collapse-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>

    <div class="repo-details">
      ${heroImageSrc ? `
      <figure class="repo-hero-figure">
        <a href="${repo.url}" target="_blank" rel="noopener noreferrer" aria-label="View ${repo.title} repository on GitHub">
          <img
            class="repo-hero-img"
            src="${heroImageSrc}"
            alt="${repo.title} hero image"
            data-hero-light="${repo.heroLight}"
            data-hero-dark="${repo.heroDark}"
            decoding="async"
          />
        </a>
      </figure>
      ` : ''}

      ${repo.paperUrl || repo.repoUrl ? `
      <div class="repo-cta-links">
        ${repo.paperUrl ? `<a href="${repo.paperUrl}" target="_blank" rel="noopener noreferrer" class="repo-cta-link">→ arXiv</a>` : ''}
        ${repo.repoUrl ? `<a href="${repo.repoUrl}" target="_blank" rel="noopener noreferrer" class="repo-cta-link">→ Repository</a>` : ''}
      </div>
      ` : ''}

      <p class="repo-short-desc">${repo.shortDesc}</p>

      <div class="repo-methods">
        <h5>Methods</h5>
        <ul>
          ${repo.methods.map(method => `<li>${method}</li>`).join('')}
        </ul>
      </div>

      <div class="repo-finding">
        <p><strong>Key finding:</strong> ${repo.finding}</p>
      </div>

      <div class="repo-tags">
        ${repo.tags.map(tag => `<span class="repo-tag">${tag}</span>`).join('')}
      </div>

      <button class="expand-btn ${expandedRepoId === repo.id ? 'expanded' : ''}" data-repo-id="${repo.id}" aria-expanded="${expandedRepoId === repo.id}">
        <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        ${expandedRepoId === repo.id ? 'Show less' : 'Read more'}
      </button>

      ${expandedRepoId === repo.id ? `<div class="repo-long-desc">${repo.longDesc}</div>` : ''}
    </div>
  `;

  const collapseBtn = card.querySelector('.collapse-btn');
  collapseBtn.addEventListener('click', () => {
    const newCollapsed = !isRepoCollapsed(repo.id, currentView);
    toggleRepoCollapse(repo.id, currentView);
    card.dataset.collapsed = newCollapsed;
    collapseBtn.setAttribute('aria-label', newCollapsed ? 'Expand details' : 'Collapse details');
    collapseBtn.setAttribute('aria-expanded', !newCollapsed);
  });

  const expandBtn = card.querySelector('.expand-btn');
  expandBtn.addEventListener('click', () => toggleExpand(repo.id));

  return card;
}

function toggleExpand(repoId) {
  expandedRepoId = expandedRepoId === repoId ? null : repoId;
  renderRepositories();
}

// Update current year in footer
function updateCurrentYear() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// Hero Image Theme Swap (JPEG only for sharp text)
function initializeHeroImageSwap() {
  const heroFigure = document.getElementById('heroFigure');

  const updateHeroImage = () => {
    const currentTheme = document.documentElement.dataset.theme || 'light';
    const variant = currentTheme === 'dark' ? 'dark' : 'light';

    // Update main hero figure (JPEG only for sharp text)
    if (heroFigure) {
      heroFigure.src = `assets/accuracy-vs-identifiability-${variant}.jpeg`;
      heroFigure.alt = `Accuracy vs Identifiability (${variant} mode)`;
    }

    // Update repo card hero images
    document.querySelectorAll('.repo-hero-img').forEach(img => {
      const lightSrc = img.dataset.heroLight;
      const darkSrc = img.dataset.heroDark;
      if (lightSrc && darkSrc) {
        img.src = variant === 'dark' ? darkSrc : lightSrc;
      }
    });
  };

  // Set initial images based on current theme
  updateHeroImage();

  // Watch for theme changes via MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        updateHeroImage();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

// Theme Toggle
function initializeThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const updateToggleLabel = () => {
    const currentTheme = document.documentElement.dataset.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    toggle.setAttribute('aria-label', `Switch to ${newTheme} mode`);
  };

  updateToggleLabel();

  toggle.addEventListener('click', () => {
    // Enable transitions after first click
    document.documentElement.classList.add('theme-transitions');

    const currentTheme = document.documentElement.dataset.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateToggleLabel();
  });
}

// View Toggles
function initializeViewToggles() {
  // Publications view toggle
  const pubsSection = document.getElementById('publications');
  if (pubsSection) {
    const savedPubView = localStorage.getItem('pubView') || 'list';
    pubsSection.dataset.view = savedPubView;
    updateViewButtons(pubsSection, savedPubView);

    pubsSection.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        lastActiveSection = 'pub';
        const view = btn.dataset.view;
        pubsSection.dataset.view = view;
        localStorage.setItem('pubView', view);
        updateViewButtons(pubsSection, view);
      });
    });

    // Track focus for keyboard shortcuts
    pubsSection.addEventListener('focusin', () => {
      lastActiveSection = 'pub';
    });
  }

  // Repositories view toggle
  const reposSection = document.querySelector('.repos-section');
  if (reposSection) {
    const savedRepoView = localStorage.getItem('repoView') || 'list';
    reposSection.dataset.view = savedRepoView;
    updateViewButtons(reposSection, savedRepoView);

    reposSection.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        lastActiveSection = 'repo';
        const view = btn.dataset.view;
        reposSection.dataset.view = view;
        localStorage.setItem('repoView', view);
        updateViewButtons(reposSection, view);
      });
    });

    // Track focus for keyboard shortcuts
    reposSection.addEventListener('focusin', () => {
      lastActiveSection = 'repo';
    });
  }
}

function updateViewButtons(section, activeView) {
  section.querySelectorAll('.view-btn').forEach(btn => {
    const isActive = btn.dataset.view === activeView;
    btn.setAttribute('aria-pressed', isActive);
  });
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ignore shortcuts when typing in inputs
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
                     e.target.isContentEditable;
    if (isTyping) return;

    const pubsSection = document.getElementById('publications');
    const reposSection = document.querySelector('.repos-section');

    // 'v' - Toggle view for last active section
    if (e.key === 'v' && !e.shiftKey) {
      e.preventDefault();
      const section = lastActiveSection === 'pub' ? pubsSection : reposSection;
      if (section) {
        const currentView = section.dataset.view;
        const newView = currentView === 'list' ? 'cards' : 'list';
        section.dataset.view = newView;
        localStorage.setItem(lastActiveSection === 'pub' ? 'pubView' : 'repoView', newView);
        updateViewButtons(section, newView);
      }
    }

    // 'V' (Shift+v) - Toggle both sections together
    if (e.key === 'V' && e.shiftKey) {
      e.preventDefault();
      const newView = (pubsSection?.dataset.view === 'list' && reposSection?.dataset.view === 'list')
        ? 'cards' : 'list';

      if (pubsSection) {
        pubsSection.dataset.view = newView;
        localStorage.setItem('pubView', newView);
        updateViewButtons(pubsSection, newView);
      }
      if (reposSection) {
        reposSection.dataset.view = newView;
        localStorage.setItem('repoView', newView);
        updateViewButtons(reposSection, newView);
      }
    }

    // 'l' - Set list view for last active section
    if (e.key === 'l' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const section = lastActiveSection === 'pub' ? pubsSection : reposSection;
      if (section && section.dataset.view !== 'list') {
        section.dataset.view = 'list';
        localStorage.setItem(lastActiveSection === 'pub' ? 'pubView' : 'repoView', 'list');
        updateViewButtons(section, 'list');
      }
    }

    // 'g' - Set cards/grid view for last active section
    if (e.key === 'g') {
      e.preventDefault();
      const section = lastActiveSection === 'pub' ? pubsSection : reposSection;
      if (section && section.dataset.view !== 'cards') {
        section.dataset.view = 'cards';
        localStorage.setItem(lastActiveSection === 'pub' ? 'pubView' : 'repoView', 'cards');
        updateViewButtons(section, 'cards');
      }
    }
  });
}

// Touch Feedback for Mobile/iOS
function initializeTouchFeedback() {
  // Event delegation on publications list
  const pubsList = document.querySelector('.pubs-list');
  if (pubsList) {
    handleTouchFeedback(pubsList, '.pub-item');
  }

  // Event delegation on repositories grid
  const reposGrid = document.getElementById('reposGrid');
  if (reposGrid) {
    handleTouchFeedback(reposGrid, '.repo-card');
  }
}

function handleTouchFeedback(container, itemSelector) {
  let activeItem = null;
  let timeout = null;

  container.addEventListener('touchstart', (e) => {
    const item = e.target.closest(itemSelector);
    if (!item) return;

    // Ignore if touching input/textarea/contenteditable
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) {
      return;
    }

    activeItem = item;
    item.classList.add('tap-active');
  }, { passive: true });

  const removeTapActive = () => {
    if (activeItem) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        activeItem.classList.remove('tap-active');
        activeItem = null;
      }, 200);
    }
  };

  container.addEventListener('touchend', removeTapActive, { passive: true });
  container.addEventListener('touchcancel', removeTapActive, { passive: true });
}

// Pointer Hover Detection for iPadOS Safari
// iPadOS Safari doesn't reliably trigger :hover on trackpad mouseover for non-anchor elements
// This JS bridge detects pointer devices (mouse/trackpad) and adds .pointer-hover class
function initializePointerHover() {
  // Publications list hover
  const pubsList = document.querySelector('.pubs-list');
  if (pubsList) {
    handlePointerHover(pubsList, '.pub-item');
  }

  // Repositories grid hover
  const reposGrid = document.getElementById('reposGrid');
  if (reposGrid) {
    handlePointerHover(reposGrid, '.repo-card');
  }

  function handlePointerHover(container, itemSelector) {
    let currentHoverItem = null;

    // Use mouseover/mouseout as fallback for better compatibility
    container.addEventListener('mouseover', (e) => {
      const item = e.target.closest(itemSelector);
      if (!item) return;

      // Remove hover from previous item if different
      if (currentHoverItem && currentHoverItem !== item) {
        currentHoverItem.classList.remove('pointer-hover');
      }

      currentHoverItem = item;
      item.classList.add('pointer-hover');
    });

    container.addEventListener('mouseout', (e) => {
      const item = e.target.closest(itemSelector);
      if (!item) return;

      // Only remove if we're leaving the item entirely (not just entering a child)
      if (!item.contains(e.relatedTarget)) {
        item.classList.remove('pointer-hover');
        if (currentHoverItem === item) {
          currentHoverItem = null;
        }
      }
    });

    // Pointer events as primary
    container.addEventListener('pointerover', (e) => {
      // Only apply to mouse/trackpad pointers
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;

      const item = e.target.closest(itemSelector);
      if (!item) return;

      // Remove hover from previous item if different
      if (currentHoverItem && currentHoverItem !== item) {
        currentHoverItem.classList.remove('pointer-hover');
      }

      currentHoverItem = item;
      item.classList.add('pointer-hover');
    }, { passive: true });

    container.addEventListener('pointerout', (e) => {
      // Only apply to mouse/trackpad pointers
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;

      const item = e.target.closest(itemSelector);
      if (!item) return;

      // Only remove if we're leaving the item entirely (not just entering a child)
      if (!item.contains(e.relatedTarget)) {
        item.classList.remove('pointer-hover');
        if (currentHoverItem === item) {
          currentHoverItem = null;
        }
      }
    }, { passive: true });

    // Safety cleanup on scroll/visibility change (prevents sticky hover)
    const cleanupHover = () => {
      if (currentHoverItem) {
        currentHoverItem.classList.remove('pointer-hover');
        currentHoverItem = null;
      }
      // Also clean up any stray hover classes
      container.querySelectorAll('.pointer-hover').forEach(el => {
        el.classList.remove('pointer-hover');
      });
    };

    window.addEventListener('scroll', cleanupHover, { passive: true });
    document.addEventListener('visibilitychange', cleanupHover);
  }
}