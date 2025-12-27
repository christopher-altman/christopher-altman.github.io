// Repository Data
const repositories = [
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
    methods: [
      'Energy spectra and matrix element calculations',
      'QuTiP integration for quantum dynamics',
      'Transmon anharmonicity vs EJ/EC ratio analysis',
      'Parameter sweep demonstrations for design trade-offs'
    ],
    finding: 'Enhanced with anharmonicity analysis script demonstrating transmon parameter design space exploration',
    tags: ['Superconducting Qubits', 'Simulation', 'QuTiP', 'Transmons'],
    longDesc: 'Open-source Python library for superconducting qubit simulation (energy spectra, matrix elements, plotting; integrates with QuTiP). Adds a new example script plotting transmon anharmonicity vs EJ/EC ratio (log-scale), demonstrating parameter sweeps and design trade-offs.'
  }
];

const methods = [
  'Quantum kernels',
  'One-class SVM',
  'Hamiltonian evolution',
  'Recoverability falsification',
  'Binarized networks',
  'scqubits/transmon'
];

// State
let searchTerm = '';
let selectedTags = [];
let selectedMethod = null;
let expandedRepoId = null;

// Get all unique tags
const allTags = [...new Set(repositories.flatMap(r => r.tags))].sort();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeMethodsChips();
  initializeTagFilters();
  initializeSearch();
  renderRepositories();
  updateCurrentYear();
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
  if (selectedTags.includes(tag)) {
    selectedTags = selectedTags.filter(t => t !== tag);
  } else {
    selectedTags.push(tag);
  }
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
      (selectedMethod === 'Quantum kernels' && (repo.id === 'qkernel-telemetry' || repo.id === 'quantum-kernel-expressivity')) ||
      (selectedMethod === 'One-class SVM' && repo.id === 'qkernel-telemetry') ||
      (selectedMethod === 'Hamiltonian evolution' && repo.id === 'quantum-decision-flow') ||
      (selectedMethod === 'Recoverability falsification' && repo.id === 'autodidactic-qml') ||
      (selectedMethod === 'Binarized networks' && repo.id === 'bqnn-benchmark') ||
      (selectedMethod === 'scqubits/transmon' && repo.id === 'scqubits-fork');
    
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
  
  const isExpanded = expandedRepoId === repo.id;
  
  card.innerHTML = `
    <div class="repo-header">
      <h4 class="repo-title">${repo.title}</h4>
      <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="repo-link" aria-label="View repository on GitHub">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </div>
    
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
    
    <button class="expand-btn ${isExpanded ? 'expanded' : ''}" data-repo-id="${repo.id}" aria-expanded="${isExpanded}">
      <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
      ${isExpanded ? 'Show less' : 'Read more'}
    </button>
    
    ${isExpanded ? `<div class="repo-long-desc">${repo.longDesc}</div>` : ''}
  `;
  
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