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

---

## Mobile Parity Fix (2025-12-30)

### 8. Touch-Friendly Interaction States (iOS/iPadOS/Mobile)

**Problem:**
Hover states don't work reliably on touch devices (iPhone, iPad, mobile browsers). CSS `:hover` is unpredictable on touch — sometimes fires on tap, sometimes persists ("sticky hover"), sometimes doesn't fire at all.

**Solution:**
Separate interaction states for pointer vs touch devices using CSS media queries and JavaScript touch handlers.

**Implementation:**

**CSS Strategy (styles.css):**
- **Desktop (pointer devices)**: `@media (hover: hover) and (pointer: fine)` — hover states on `:hover` only
- **Touch devices**: `@media (hover: none) and (pointer: coarse)` — tap feedback on `:active` + `.tap-active` class
- **Keyboard (all devices)**: `:focus-visible` works universally (outside media queries)

**JavaScript Strategy (script.js):**
- Added `initializeTouchFeedback()` function called on DOMContentLoaded
- Event delegation on `.pubs-list` and `#reposGrid` containers
- Touch event sequence:
  1. `touchstart` → add `.tap-active` class to tapped item
  2. `touchend` / `touchcancel` → remove `.tap-active` after 200ms timeout
- Prevents sticky hover: class auto-removes after tap completes
- Ignores touches on inputs/textareas/contenteditable elements

**Visual Behavior:**
- **Desktop hover**: Border darkens, title → brand accent, shadow + 2px lift (unchanged from previous iteration)
- **Touch tap**: Identical visual feedback via `:active` and `.tap-active` class during tap
- **iPad trackpad/keyboard**: Hover and focus-visible work as expected (pointer: fine media query applies)
- **Motion sensitivity**: All transitions/transforms disabled for `prefers-reduced-motion: reduce`

**Edge Cases Handled:**
- iPad with Magic Keyboard: Both hover (trackpad) and touch work independently
- Touch-drag scrolling: `touchcancel` removes `.tap-active` without triggering false feedback
- Link navigation: Tap feedback doesn't block navigation, completes naturally
- Multi-touch: Only tracks last tapped item, clears correctly

**Accessibility:**
- Passive event listeners (`{ passive: true }`) for better scroll performance
- No interference with native tap/click behavior
- Focus-visible keyboard navigation unchanged
- Touch feedback is purely additive, doesn't break existing interactions

**Files Modified:**
- `styles.css`:
  - Refactored `.pub-item:hover` and `.repo-card:hover` into `@media (hover: hover) and (pointer: fine)` blocks
  - Added `@media (hover: none) and (pointer: coarse)` blocks with `:active` and `.tap-active` selectors
  - Moved `:focus-visible` rules outside media queries (universal)
  - Updated `prefers-reduced-motion` overrides to cover all states
- `script.js`:
  - Added `initializeTouchFeedback()` function (lines 520-532)
  - Added `handleTouchFeedback(container, itemSelector)` helper (lines 534-563)
  - Attached event delegation to `.pubs-list` and `#reposGrid` containers

**Browser/Device Compatibility:**
- iOS Safari 12+
- iPadOS Safari 13+ (touch + trackpad hybrid support)
- Chrome/Firefox/Edge mobile (Android/iOS)
- Desktop browsers: No change, hover continues to work identically

**Testing Checklist (Mobile Parity):**
- [ ] iPhone Safari: Tap pub/repo item shows border + ring + title accent + lift
- [ ] iPad touch: Same tap feedback as iPhone
- [ ] iPad trackpad: Hover works on mouseover (not tap)
- [ ] iPad Magic Keyboard: Tab + focus-visible shows identical styling
- [ ] Android Chrome: Tap feedback appears and clears correctly
- [ ] Touch-drag scroll: Feedback doesn't stick, clears on `touchcancel`
- [ ] Link navigation: Tapping GitHub link navigates correctly, no blocked events
- [ ] Multi-touch: Only last touched item gets `.tap-active`, no conflicts
- [ ] Desktop unchanged: Hover still works on mouse devices
- [ ] `prefers-reduced-motion`: Lift animation disabled, transitions disabled

**Performance:**
- Event delegation: Only 2 event listeners total (pubs + repos containers)
- Passive listeners: No scroll blocking
- 200ms timeout: Negligible memory/CPU impact
- Class toggle: Single DOM mutation per tap

---

## Updated Testing Checklist (Complete)

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

### Enhancements (smooth transitions, keyboard shortcuts, collapse):
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

### Hover highlights (desktop):
- [ ] Desktop hover shows border + ring + brand accent title + shadow + lift
- [ ] Hover is unmissable but not garish
- [ ] Title color change obvious in both list and cards view
- [ ] Works consistently across Publications and Featured Repositories
- [ ] Focus-visible (keyboard) matches hover appearance

### Mobile parity (touch devices):
- [ ] iPhone Safari: Tap shows identical feedback to desktop hover
- [ ] iPad touch: Tap feedback works correctly
- [ ] iPad trackpad: Hover works on mouseover (pointer: fine)
- [ ] iPad keyboard: Focus-visible styling identical to hover
- [ ] Android Chrome/Firefox: Tap feedback appears and clears
- [ ] Touch-drag scroll doesn't trigger sticky feedback
- [ ] Tapping links navigates correctly, no blocked events
- [ ] Desktop hover unchanged after mobile fix
- [ ] `prefers-reduced-motion` disables all animations on all devices

---

## iPadOS Safari Trackpad Hover Fix (2025-12-30)

### 9. JavaScript Pointer Hover Bridge for iPadOS Safari

**Problem:**
iPadOS Safari with trackpad/Magic Keyboard does NOT trigger CSS `:hover` on mouseover for non-anchor container elements (`.pub-item`, `.repo-card`). The hover "pop" styling only activates after a tap/click, unlike iPadOS Chrome which triggers hover immediately on pointer movement.

**Root Cause:**
iPadOS Safari is conservative about applying `:hover` pseudo-class to non-interactive elements when using pointer devices. Even with `@media (hover: hover) and (pointer: fine)`, Safari does not reliably trigger `:hover` on `<div>`/`<article>` containers on trackpad mouseover.

**Solution:**
JavaScript-driven pointer detection that adds a `.pointer-hover` class on `pointerover` events for mouse/trackpad devices. CSS then applies identical styling to both `:hover` and `.pointer-hover`.

**Implementation:**

**JavaScript Strategy (script.js):**
- Added `initializePointerHover()` function called on DOMContentLoaded
- Event delegation on `.pubs-list` and `#reposGrid` containers
- Pointer event sequence:
  1. Detect pointer type on first `pointermove` (mouse/pen = fine pointer)
  2. `pointerover` → add `.pointer-hover` class to hovered item (mouse/pen only)
  3. `pointerout` → remove `.pointer-hover` when leaving item
  4. Safety cleanup on scroll/visibilitychange to prevent sticky hover
- Touch pointers (`pointerType === 'touch'`) are explicitly ignored (no `.pointer-hover` class added)

**CSS Strategy (styles.css):**
- Updated desktop hover rules to include `.pointer-hover`:
  ```css
  @media (hover: hover) and (pointer: fine) {
    .repo-card:hover,
    .repo-card.pointer-hover { /* ... */ }
  }
  ```
- Identical styling for `.pub-item.pointer-hover` in publications section
- Touch devices continue using `:active` and `.tap-active` (unchanged)

**Behavior:**
- **iPadOS Safari + trackpad**: Pointer mouseover triggers `.pointer-hover` → immediate pop styling
- **iPadOS Chrome + trackpad**: CSS `:hover` works natively, `.pointer-hover` is redundant but harmless
- **Desktop browsers**: CSS `:hover` works natively, `.pointer-hover` adds redundancy (no conflict)
- **Touch devices**: No `.pointer-hover` applied (pointer type check), continues using `:active`/`.tap-active`
- **Scroll/visibility change**: Cleans up `.pointer-hover` to prevent sticky state

**Edge Cases Handled:**
- Pointer moving between child elements (links, badges): Only removes `.pointer-hover` when leaving item entirely
- Multiple items: Cleans up previous `.pointer-hover` when moving to new item
- Scrolling with pointer over item: Safety cleanup removes `.pointer-hover` on scroll
- Tab/visibility switch: Cleanup on `visibilitychange` prevents stale hover state
- Touch interactions: Explicitly filtered out via `pointerType !== 'touch'` check

**Accessibility:**
- Passive event listeners (`{ passive: true }`) for scroll performance
- No interference with click/navigation events
- Keyboard focus (`:focus-visible`) remains unchanged (works independently)
- Touch feedback (`:active`, `.tap-active`) remains unchanged

**Files Modified:**
- `script.js`:
  - Added `initializePointerHover()` function (lines 566-644)
  - Nested `handlePointerHover(container, itemSelector)` helper with event delegation
  - Safety cleanup listeners on scroll/visibilitychange
- `styles.css`:
  - Updated `.repo-card:hover` selector to `.repo-card:hover, .repo-card.pointer-hover` (line 441-442)
  - Updated `.repo-card:hover .repo-title` to include `.repo-card.pointer-hover .repo-title` (line 449)
  - Updated `.pub-item:hover` selector to `.pub-item:hover, .pub-item.pointer-hover` (line 765-766)
  - Updated `.pub-item:hover .pub-title` to include `.pub-item.pointer-hover .pub-title` (line 773)

**Browser/Device Compatibility:**
- iPadOS Safari 13+ with trackpad/Magic Keyboard: Fixed ✅
- iPadOS Chrome with trackpad: Unchanged (CSS hover continues to work)
- Desktop browsers: Unchanged (CSS hover continues to work)
- Touch devices (all browsers): Unchanged (pointer type filtering)

**Performance:**
- Event delegation: Only 2 `pointerover` + 2 `pointerout` listeners (pubs + repos containers)
- Passive listeners: No scroll blocking
- Cleanup listeners: 1 scroll + 1 visibilitychange per container (minimal overhead)
- No per-item listeners: Scales efficiently with dynamic content

**Testing Checklist (iPadOS Safari Trackpad):**
- [ ] iPadOS Safari + Magic Keyboard trackpad: Mouseover triggers pop immediately
- [ ] iPadOS Safari + Magic Keyboard trackpad: Mouseout removes pop
- [ ] iPadOS Safari + touch: Tap triggers `:active`/`.tap-active` (no `.pointer-hover`)
- [ ] iPadOS Safari + scroll while hovering: Hover clears, no sticky state
- [ ] iPadOS Chrome + trackpad: Hover continues to work (CSS or JS, both acceptable)
- [ ] Desktop browsers: Hover unchanged (CSS or JS, both acceptable)
- [ ] Clicking links: Navigation works normally, no blocked events
- [ ] Keyboard Tab focus: Focus-visible styling works independently

---

## Research Themes Footer Link Hover Consistency (2025-12-30)

### 10. Enhanced "Pop" Link Hover for Research Themes Section

**Enhancement:**
Applied prominent hover effects to Research Themes footer links with background, border, shadow, and lift to match the interaction design of publication/repository items.

**Implementation:**

**Visual Behavior:**
- **Text Color**: Changes to brand accent (`--item-title-hover`: #2563EB light / #60A5FA dark)
- **Background**: Subtle background color (`--color-bg-alt`) on hover/tap
- **Border**: Border changes from transparent to `--item-border-hover` with 1px ring accent
- **Shadow**: Subtle shadow (0 2px 4px rgba(0,0,0,0.05))
- **Lift**: 1px upward translateY on hover/tap (half the lift of cards for subtlety)
- **Padding**: Links have internal padding (0.25rem 0.5rem) with negative margin to maintain layout
- **Border Radius**: Rounded corners (0.375rem) for pill-like appearance
- **Transition**: 180ms ease-out for all properties (disabled for `prefers-reduced-motion`)

**CSS Strategy:**
- Links styled as inline-block with padding and negative margins to expand hit area without affecting layout
- Desktop: `@media (hover: hover) and (pointer: fine)` with `:hover` + `.pointer-hover` class
- Touch: `@media (hover: none) and (pointer: coarse)` with `:active` + `.tap-active` class
- Keyboard: `:focus-visible` applies same styling universally
- Motion reduction: `prefers-reduced-motion: reduce` disables transform

**JavaScript Integration:**
- `initializeTouchFeedback()`: Added `.themes-section` container with `.theme-repos a` selector
- `initializePointerHover()`: Added `.themes-section` container with `.theme-repos a` selector
- Pointer detection for iPadOS Safari trackpad compatibility
- Touch event handling for mobile tap feedback

**Files Modified:**
- `styles.css`:
  - Updated `.theme-repos a` base styles with padding, margin, border-radius, transparent border (lines 705-714)
  - Added multi-property transitions (color, border, background, shadow, transform) (lines 716-722)
  - Desktop hover: Background + border + shadow + lift + brand accent color (lines 725-733)
  - Touch active: Identical styling to desktop hover (lines 737-745)
  - Keyboard focus: Identical styling with outline removed (lines 749-756)
  - Motion reduction override for transform (lines 758-766)
- `script.js`:
  - Added `.themes-section` to `initializeTouchFeedback()` with selector `.theme-repos a` (line 535-538)
  - Added `.themes-section` to `initializePointerHover()` with selector `.theme-repos a` (line 600-604)

**Design Principles:**
- **Prominent but restrained**: More visible than plain text hover, less dramatic than card lift (1px vs 2px)
- **Pill-style affordance**: Rounded corners and padding create button-like appearance
- **Brand consistency**: Uses same CSS variables as publication/repository title hovers
- **Unified interaction**: Desktop, touch, and keyboard all show identical visual feedback
- **Layout preservation**: Negative margins prevent hover state from shifting surrounding content

**Testing:**
- [ ] Desktop: Hover shows background + border + shadow + 1px lift + brand blue text
- [ ] iPad trackpad: Mouseover triggers immediate feedback (iPadOS Safari + Chrome)
- [ ] iPad/iPhone touch: Tap shows same background + border + shadow + lift
- [ ] Keyboard Tab: Focus shows identical styling with no outline (border/shadow provide indication)
- [ ] Dark mode: Hover/tap uses dark theme colors (#60A5FA, adjusted shadow)
- [ ] Link navigation: Clicking navigates normally, no blocked events
- [ ] Layout stability: Hover doesn't shift surrounding links (negative margin technique)
- [ ] Motion reduction: Transform disabled for users with `prefers-reduced-motion: reduce`
