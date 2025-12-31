# Unit Tests

This directory contains unit tests for the portfolio website.

## Setup

Install dependencies:

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite covers:

1. **Repository Data Tests** - Validates that the `noise-aware-qnn-identifiability` repository is correctly added with all required properties (title, URL, methods, tags, finding, description).

2. **Methods Array Tests** - Ensures the `Identifiability metrics` method is properly added to the available methods list.

3. **Filtering Function Tests** - Verifies that `getFilteredRepositories()` correctly filters repositories when the `Identifiability metrics` method is selected, including:
   - Single method filter
   - Method filter combined with tag filters
   - Method filter combined with search terms
   - Edge cases (non-matching filters, empty results)

## Test Structure

- `repositories.test.js` - Main test file containing all unit tests for repository data and filtering functionality
