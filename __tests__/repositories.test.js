/**
 * Unit tests for repository data and filtering functionality
 */

const fs = require('fs');
const path = require('path');

// Load the script.js file and extract the data
const scriptPath = path.join(__dirname, '..', 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Extract repositories array from script.js
const repositoriesMatch = scriptContent.match(/const repositories = (\[[\s\S]*?\n\]);/);
const repositories = eval(repositoriesMatch[1]);

// Extract methods array from script.js
const methodsMatch = scriptContent.match(/const methods = (\[[\s\S]*?\]);/);
const methods = eval(methodsMatch[1]);

// Extract getFilteredRepositories function
const getFilteredRepositoriesMatch = scriptContent.match(/function getFilteredRepositories\(\) \{[\s\S]*?\n\}/);
const getFilteredRepositoriesFn = getFilteredRepositoriesMatch[0];

// Mock the global state variables needed by getFilteredRepositories
let searchTerm = '';
let selectedTags = [];
let selectedMethod = null;

// Evaluate the function in this context
eval(getFilteredRepositoriesFn);

describe('Repositories Data', () => {
  test('noise-aware-qnn-identifiability repository is correctly added to the list', () => {
    // Find the repository by id
    const repo = repositories.find(r => r.id === 'noise-aware-qnn-identifiability');
    
    // Assert the repository exists
    expect(repo).toBeDefined();
    
    // Verify key properties
    expect(repo.title).toBe('Noise-Aware QNN Identifiability');
    expect(repo.url).toBe('https://github.com/christopher-altman/noise-aware-qnn-identifiability');
    expect(repo.shortDesc).toBe('Accuracy is not evidence of learning. Under noise, performance can survive while recoverability collapses.');
    
    // Verify methods array contains expected methods
    expect(repo.methods).toContain('Minimal QNN-style testbed: 2-qubit variational circuit with depolarizing noise and amplitude damping');
    expect(repo.methods).toContain('Dense parameter grid sweeps (16×16, 256 points) over noise probability p and readout noise σ');
    expect(repo.methods).toContain('Enhanced identifiability metrics: Hessian curvature, Fisher Information conditioning, effective rank');
    expect(repo.methods).toContain('Deterministic experiments with YAML/JSON configuration and automated plotting');
    
    // Verify tags
    expect(repo.tags).toEqual(['Quantum ML', 'Identifiability', 'Noise', 'Verification']);
    
    // Verify finding
    expect(repo.finding).toContain('ρ(acc, identifiability) ≈ 0.04');
    expect(repo.finding).toContain('accuracy decouples from recoverability');
    
    // Verify longDesc exists and contains key information
    expect(repo.longDesc).toBeDefined();
    expect(repo.longDesc).toContain('verification failure mode');
    expect(repo.longDesc).toContain('identifiability');
  });
});

describe('Methods Array', () => {
  test('Identifiability metrics method is correctly added to the list', () => {
    // Assert the method exists in the methods array
    expect(methods).toContain('Identifiability metrics');
    
    // Verify it's in the correct position (last in the array based on script.js)
    expect(methods[methods.length - 1]).toBe('Identifiability metrics');
    
    // Verify the full methods array structure
    expect(methods).toEqual([
      'Quantum kernels',
      'One-class SVM',
      'Hamiltonian evolution',
      'Recoverability falsification',
      'Binarized networks',
      'Adiabatic validation',
      'Identifiability metrics'
    ]);
  });
});

describe('getFilteredRepositories Function', () => {
  beforeEach(() => {
    // Reset filters before each test
    searchTerm = '';
    selectedTags = [];
    selectedMethod = null;
  });
  
  test('correctly filters repositories based on Identifiability metrics method', () => {
    // Set the method filter
    selectedMethod = 'Identifiability metrics';
    
    // Call the filtering function
    const filtered = getFilteredRepositories();
    
    // Assert only one repository is returned
    expect(filtered).toHaveLength(1);
    
    // Assert it's the correct repository
    expect(filtered[0].id).toBe('noise-aware-qnn-identifiability');
    expect(filtered[0].title).toBe('Noise-Aware QNN Identifiability');
  });
  
  test('returns all repositories when no method filter is applied', () => {
    // No filter applied
    selectedMethod = null;
    
    const filtered = getFilteredRepositories();
    
    // Should return all repositories
    expect(filtered).toHaveLength(repositories.length);
  });
  
  test('returns empty array when filtering with non-matching method', () => {
    // Set a method that doesn't match any repository
    selectedMethod = 'Non-existent method';
    
    const filtered = getFilteredRepositories();
    
    // Should return empty array (no repositories match)
    expect(filtered).toHaveLength(0);
  });
  
  test('Identifiability metrics filter works with other filters', () => {
    // Apply method filter with tag filter
    selectedMethod = 'Identifiability metrics';
    selectedTags = ['Quantum ML'];
    
    const filtered = getFilteredRepositories();
    
    // Should still return the noise-aware-qnn-identifiability repository
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('noise-aware-qnn-identifiability');
  });
  
  test('Identifiability metrics filter with non-matching tag returns empty', () => {
    // Apply method filter with non-matching tag
    selectedMethod = 'Identifiability metrics';
    selectedTags = ['Non-existent Tag'];
    
    const filtered = getFilteredRepositories();
    
    // Should return empty array
    expect(filtered).toHaveLength(0);
  });
  
  test('search term works with Identifiability metrics filtered repository', () => {
    // Apply method filter with search term
    selectedMethod = 'Identifiability metrics';
    searchTerm = 'noise';
    
    const filtered = getFilteredRepositories();
    
    // Should return the repository
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('noise-aware-qnn-identifiability');
  });
});
