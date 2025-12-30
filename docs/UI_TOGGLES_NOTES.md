# UI Toggles Implementation Notes

Implementation date: 2025-12-30

## Overview

Three minimal UI enhancements added:
1. Alternating section backgrounds (striped layout)
2. Light/Dark mode toggle
3. Card/List view toggles for Publications and Featured Repositories

## 1. Alternating Section Backgrounds

**Implementation:**
- Wrapped all major sections in a `<main>` element
- Added CSS rule: `main > section:nth-of-type(even) { background: var(--color-stripe); }`
- Introduced `--color-stripe` CSS variable for extremely subtle gray (#FAFAFA light, #0D1117 dark)
- Full-width backgrounds via `width: 100%` on sections, content remains centered in `.container`

**Files modified:**
- `index.html`: Added `<main>` wrapper
- `styles.css`: Added stripe background rules and CSS variables

## 2. Light/Dark Mode Toggle

**Implementation:**
- Minimalist sun icon button in header nav area
- Theme state stored in `document.documentElement.dataset.theme` ("light" | "dark")
- Persistence via `localStorage.setItem('theme', ...)`
- System preference respected on first visit via `prefers-color-scheme` media query
- Flash prevention: inline `<script>` in `<head>` applies saved/system theme before first paint
- Full CSS variable palette for both themes in `:root[data-theme="dark"]`
- Added `color-scheme: light dark;` to `<html>` for native browser chrome adaptation

**Accessibility:**
- `aria-label` dynamically updates ("Switch to dark mode" / "Switch to light mode")
- Visible focus ring via existing global focus styles
- Keyboard navigable

**Files modified:**
- `index.html`: Added inline script and theme toggle button in header
- `styles.css`: Added dark theme CSS variables and theme toggle styles
- `script.js`: Added `initializeThemeToggle()` function

## 3. Card/List View Toggles

**Implementation:**
- Two-button toggle (list icon | grid icon) positioned near section titles via `.section-header` flex layout
- Minimal whisper-level design: 16px SVG icons, subtle border, light gray
- Each section independently controlled:
  - Publications: `localStorage.getItem('pubView')` → "list" | "cards"
  - Repositories: `localStorage.getItem('repoView')` → "list" | "cards"
- State stored in `data-view` attribute on section element
- CSS switches layout via `[data-view="cards"]` selector

**Layout behavior:**
- LIST: Single column, compact stacking, subtle dividers (existing default)
- CARDS: Responsive grid (`auto-fill, minmax(300px, 1fr)` for pubs, `320px` for repos)
- Mobile: Cards collapse to single column below 640px breakpoint

**Edge cases handled:**
- Empty repository state: Toggle UI renders and remains functional
- Long publication titles: Cards use flexbox for consistent heights
- Persistence across page refreshes

**Accessibility:**
- Buttons have `aria-label` ("List view", "Card view")
- `aria-pressed` state reflects active view
- Keyboard navigable with visible focus rings
- Icons-only but clear affordance

**Files modified:**
- `index.html`: Added `.section-header` wrapper and view toggle buttons to Publications and Repositories sections
- `styles.css`: Added view toggle styles, section header layout, and cards grid rules
- `script.js`: Added `initializeViewToggles()` and `updateViewButtons()` functions

## Design Principles Applied

- **Whisper-level controls**: Icons are 16-18px, monochrome, aligned to baseline
- **Subtle stripe**: `#FAFAFA` in light mode is barely perceptible, just enough for visual rhythm
- **No dependencies**: Inline SVG icons only, vanilla JS, no external libraries
- **Minimal markup changes**: Additive edits, no file/function renames
- **Preserved content**: No changes to copy, links, ordering, or existing components
- **Mobile-first**: All toggles remain accessible on small screens, cards stack gracefully

## Browser Compatibility

- Theme system: Modern browsers with CSS custom properties and `dataset` support (IE11+)
- View toggles: Grid layout (modern browsers, graceful degradation to list on older browsers)
- Flash prevention: Inline script executes before first paint in all modern browsers

## Testing Checklist

- [ ] Hard refresh shows no theme flash (test both light→dark and dark→light)
- [ ] Theme persists across page refresh
- [ ] Publications view persists across refresh
- [ ] Repositories view persists across refresh
- [ ] Cards layout adapts to viewport width (test 320px, 768px, 1200px)
- [ ] List view remains readable on mobile
- [ ] All toggles keyboard-accessible (Tab + Enter/Space)
- [ ] Focus rings visible on all interactive elements
- [ ] Contrast acceptable in both light and dark themes (WCAG AA minimum)
- [ ] Empty repository state doesn't break card grid
- [ ] Long publication titles wrap gracefully in cards

## Performance Impact

- Minimal: ~50 lines of vanilla JS, no external requests, no layout thrashing
- localStorage reads are synchronous but execute once on page load
- Theme flash prevention script is tiny (~5 lines) and runs before DOMContentLoaded

---

## Enhancement Update (2025-12-30)

Three additional UX enhancements implemented based on "Future Considerations":

### 4. Smooth Theme Transitions

**Implementation:**
- Theme toggle now includes smooth color transitions (200ms ease-out)
- Transitions apply to: `background-color`, `color`, `border-color`, `box-shadow`
- Class `theme-transitions` added to `<html>` ONLY after first theme toggle click (prevents initial-load flash)
- Fully disabled via `@media (prefers-reduced-motion: reduce)` for accessibility

**Behavior:**
- First page load: No transitions (instant theme application from localStorage/system preference)
- After clicking theme toggle: Subsequent toggles animate smoothly
- Motion-sensitive users: All transitions disabled automatically

**Files modified:**
- `styles.css`: Added `.theme-transitions` class with transition rules and `prefers-reduced-motion` override
- `script.js`: Added `classList.add('theme-transitions')` in theme toggle handler

### 5. Keyboard Shortcuts for View Switching

**Implementation:**
- Shortcuts work globally except when typing in inputs/textareas/contenteditable elements
- Active section tracking: Last interacted section (Publications or Repositories) via click or focus

**Keyboard shortcuts:**
- **`v`** — Toggle view (list ↔ cards) for the last active section
- **`Shift+V`** — Toggle view for BOTH sections simultaneously
- **`l`** — Set list view for the last active section
- **`g`** — Set cards/grid view for the last active section

**Active section logic:**
- Clicking any view toggle button sets that section as active
- Focusing any element within a section sets that section as active
- Default: Repositories section is active on page load

**Files modified:**
- `script.js`:
  - Added `lastActiveSection` state variable
  - Added `initializeKeyboardShortcuts()` function
  - Updated view toggle handlers to track section activity
  - Added `focusin` listeners to both sections

### 6. Persistent Repository Card Collapse (Per View Mode)

**Implementation:**
- Each repository card now has a collapse/expand button (chevron icon, top-right)
- Collapse state persists separately for LIST and CARDS view modes
- Storage schema: `localStorage.repoCollapseState = { cards: { repoId: boolean }, list: { repoId: boolean } }`
- Default: All cards expanded unless previously collapsed by user

**Behavior:**
- Collapsed state hides: description, methods, finding, tags, and "Read more" button
- Only the title row and GitHub link remain visible when collapsed
- Switching between list/cards view loads that view's saved collapse states
- Chevron icon rotates 180° when collapsed
- Independent from the existing "Read more" expand/collapse (which shows long description)

**UI:**
- 16px chevron button with subtle border, aligned to card header
- `aria-label` updates: "Collapse details" / "Expand details"
- `aria-expanded` state reflects current collapse state
- Smooth rotation animation on chevron (0.2s ease)

**Files modified:**
- `script.js`:
  - Added `getRepoCollapseState()`, `setRepoCollapseState()`, `isRepoCollapsed()`, `toggleRepoCollapse()` functions
  - Updated `createRepoCard()` to include collapse button and wrap details in `.repo-details` container
  - Added `data-collapsed` and `data-repo-id` attributes to cards
- `styles.css`:
  - Added `.collapse-btn`, `.collapse-icon`, `.repo-header-left` styles
  - Added `[data-collapsed="true"]` rules to hide `.repo-details`
  - Added chevron rotation transform

**Edge cases:**
- Unknown repo IDs (e.g., after data changes): Default to expanded
- Cleared localStorage: Gracefully resets to all expanded
- Empty repository list: No errors, collapse UI simply not rendered

---

## Updated Testing Checklist

### Original features:
- [ ] Hard refresh shows no theme flash (test both light→dark and dark→light)
- [ ] Theme persists across page refresh
- [ ] Publications view persists across refresh
- [ ] Repositories view persists across refresh
- [ ] Cards layout adapts to viewport width (test 320px, 768px, 1200px)
- [ ] List view remains readable on mobile
- [ ] All toggles keyboard-accessible (Tab + Enter/Space)
- [ ] Focus rings visible on all interactive elements
- [ ] Contrast acceptable in both light and dark themes (WCAG AA minimum)
- [ ] Empty repository state doesn't break card grid
- [ ] Long publication titles wrap gracefully in cards

### New enhancements:
- [ ] Theme toggle animates smoothly AFTER first click (not on initial load)
- [ ] Theme transitions disabled for `prefers-reduced-motion: reduce` users
- [ ] Keyboard shortcut `v` toggles last active section's view
- [ ] Keyboard shortcut `Shift+V` toggles both sections together
- [ ] Keyboard shortcut `l` sets list view for active section
- [ ] Keyboard shortcut `g` sets cards view for active section
- [ ] Shortcuts ignored when typing in inputs/textareas
- [ ] Collapse button appears on each repo card (list and cards view)
- [ ] Collapse state persists separately for list vs cards view
- [ ] Collapsed cards show only title row, hide all details
- [ ] Switching between views loads that view's saved collapse states
- [ ] Chevron rotates smoothly when toggling collapse
- [ ] Collapse button accessible via keyboard (Tab + Enter/Space)
- [ ] Mobile: collapse button remains tappable, no conflicts with links

## Updated Performance Impact

- Smooth transitions: ~4 CSS properties × all elements, triggered only on theme toggle (minimal reflow)
- Keyboard shortcuts: Single document-level `keydown` listener with early-exit guards
- Collapse persistence: localStorage read/write on card interaction (negligible; <1KB JSON)
- Total JS additions: ~100 lines (keyboard shortcuts + collapse state management)

## Keyboard Shortcuts Reference Card

```
View Switching:
  v         Toggle view (list ↔ cards) for active section
  Shift+V   Toggle both sections simultaneously
  l         Set list view for active section
  g         Set cards/grid view for active section

Active section:
  - Last clicked/focused Publications or Repositories section
  - Default: Repositories

Notes:
  - Shortcuts disabled while typing in inputs/textareas
  - Changes persist via localStorage
```

---

## Additional Enhancement (2025-12-30)

### 7. Subtle Hover Highlights (AE Research Style)

**Implementation:**
- Minimal, modern hover states for publication and repository items
- Inspired by https://ae.studio/research interaction patterns
- Works in both list and cards view, both light and dark themes

**Visual behavior:**
- **Border**: Subtle darkening (light mode) or lightening (dark mode) on hover
- **Title**: Text color shifts slightly toward pure black (light) or white (dark)
- **Shadow**: Very slight shadow increase (4px blur, 4% opacity)
- **Transition**: Smooth 160ms ease-out (disabled for `prefers-reduced-motion`)

**Theme-aware variables:**
- Light mode: `--item-border-hover: #D1D5DB`, `--item-title-hover: #000000`
- Dark mode: `--item-border-hover: #4B5563`, `--item-title-hover: #F9FAFB`

**Accessibility:**
- Same styling applies to `:focus-visible` (keyboard navigation)
- No layout shift on hover
- Native focus ring removed (`outline: none`) as border + shadow provide sufficient indication
- Transitions respect `prefers-reduced-motion: reduce`

**Files modified:**
- `styles.css`:
  - Added `--item-border-hover` and `--item-title-hover` to theme variables
  - Added hover/focus-visible styles for `.pub-item` and `.repo-card`
  - Wrapped transitions in `@media (prefers-reduced-motion: no-preference)`

**Design principles:**
- **Whisper-level interaction**: No dramatic lifts, scales, or bounces
- **Theme consistency**: Hover states adapt to light/dark mode automatically
- **Motion-aware**: Animation disabled for users with motion sensitivity
- **Keyboard parity**: Focus-visible state matches hover for equal experience

---

## Enhancement Iteration (2025-12-30)

### Stronger "Pop" Hover States

**Update:** The original hover styling was too subtle. Enhanced to highlight interaction.

**New visual behavior:**
- **Border + Ring**: Stronger border color (#9CA3AF light / #6B7280 dark) PLUS 1px ring via box-shadow (#6B7280 light / #9CA3AF dark)
- **Title Color**: Changes to brand accent on hover (#2563EB light / #60A5FA dark) — clearly visible in both list and cards
- **Shadow**: Increased to 8px blur, 8% opacity (light) / 24% opacity (dark)
- **Lift**: Subtle 2px upward translateY on hover (disabled for `prefers-reduced-motion`)
- **Transition**: Increased to 180ms ease-out for smoother feel

**Updated theme variables:**
- Light mode:
  - `--item-border-hover: #9CA3AF` (stronger gray)
  - `--item-ring-hover: #6B7280` (ring accent)
  - `--item-title-hover: #2563EB` (brand blue)
  - `--item-shadow-hover: 0 8px 16px rgba(0, 0, 0, 0.08)`
- Dark mode:
  - `--item-border-hover: #6B7280` (lighter gray)
  - `--item-ring-hover: #9CA3AF` (lighter ring)
  - `--item-title-hover: #60A5FA` (brand blue)
  - `--item-shadow-hover: 0 8px 16px rgba(0, 0, 0, 0.24)`

**Accessibility updates:**
- `prefers-reduced-motion: reduce` now disables both transitions AND transform
- Focus-visible state matches full hover appearance (ring, shadow, lift, title color)
- No layout shift (transform is visual-only, no padding/margin changes)

**Testing:**
- Hover is now unmissable but not garish
- Title color change is obvious in both list and cards view
- Works consistently across Publications and Featured Repositories
- Lift animation is restrained and professional
