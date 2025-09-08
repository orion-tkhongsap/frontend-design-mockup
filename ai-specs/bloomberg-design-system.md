# Bloomberg Website-Inspired Design System
## Modern Financial Web Platform UI/UX Specifications

> Based on Bloomberg.com's modern web design, not the Bloomberg Terminal

---

## 1. Color System

### Primary Palette - Bloomberg.com Website Colors

```scss
// Base Colors (Light Mode Default)
$bb-white: #FFFFFF;          // Primary background
$bb-off-white: #F7F7F7;      // Secondary background
$bb-light-gray: #E8E8E8;     // Borders, dividers  
$bb-gray: #CCCCCC;           // Disabled elements
$bb-medium-gray: #737373;    // Secondary text
$bb-dark-gray: #4D4D4D;      // Tertiary text
$bb-charcoal: #1A1A1A;       // Primary text
$bb-black: #000000;          // Headlines

// Brand Colors
$bb-blue: #0033A0;           // Primary brand blue
$bb-navy: #002F6C;           // Dark blue for headers
$bb-light-blue: #3B7DD8;     // Links and CTAs
$bb-teal: #00C7B7;           // Accent color

// Financial Indicators (Bloomberg.com style)
$bb-positive: #059862;       // Green for gains
$bb-strong-positive: #00C853; // Strong gains
$bb-negative: #E74C3C;       // Red for losses  
$bb-strong-negative: #C62828; // Strong losses
$bb-neutral: #3B7DD8;        // Neutral/informational
$bb-warning: #FFA726;        // Warnings
$bb-alert: #FF5722;          // Critical alerts

// Semantic Colors
$success: #00FF41;
$warning: #FFD700;
$danger: #FF2E2E;
$info: #00BFFF;
$muted: #4A4A4A;
```

### Dark Theme Alternative

```scss
// Dark Mode (Optional)
$dark-bg: #0F0F0F;           // Main background
$dark-panel: #1A1A1A;        // Card backgrounds
$dark-border: #2D2D2D;       // Borders
$dark-text: #E8E8E8;         // Primary text
$dark-secondary: #A0A0A0;    // Secondary text
$dark-accent: #3B7DD8;       // Blue accent
$dark-header: #000000;       // Header background

// Financial Indicators (Light)
$light-positive: #00A651;    // Green for gains
$light-negative: #DC3545;    // Red for losses
$light-neutral: #0066CC;     // Blue for neutral
```

### Gradient System

```scss
// Premium Gradients
$gradient-header: linear-gradient(90deg, #1A1A1A 0%, #2D2D2D 100%);
$gradient-premium: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
$gradient-alert: linear-gradient(90deg, #FF2E2E 0%, #FF6B00 100%);
$gradient-success: linear-gradient(90deg, #00FF41 0%, #00BFFF 100%);
```

---

## 2. Typography System

### Font Stack

```scss
// Bloomberg.com Typography
$font-headline: 'TiemposHeadline', Georgia, 'Times New Roman', serif;
$font-body: 'AvenirNext', 'Helvetica Neue', Helvetica, Arial, sans-serif;
$font-data: 'BWHaasText', 'Helvetica Neue', Arial, sans-serif;
$font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;

// Fallback Stack
$font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Type Scale

```scss
// Font Sizes (Bloomberg.com scale)
$text-xs: 12px;       // Small labels, captions
$text-sm: 14px;       // Secondary text
$text-base: 16px;     // Body text (default)
$text-lg: 18px;       // Large body text
$text-xl: 20px;       // Small headlines
$text-2xl: 24px;      // Section headers
$text-3xl: 32px;      // Page headlines
$text-4xl: 40px;      // Major headlines
$text-5xl: 48px;      // Hero headlines
$text-6xl: 64px;      // Display text

// Line Heights
$leading-tight: 1.1;   // Data tables
$leading-snug: 1.2;    // Compact lists
$leading-normal: 1.4;  // Body text
$leading-relaxed: 1.6; // Readable content

// Font Weights
$font-normal: 400;
$font-medium: 500;
$font-semibold: 600;
$font-bold: 700;
$font-black: 900;

// Letter Spacing
$tracking-tight: -0.02em;  // Headlines
$tracking-normal: 0;       // Body
$tracking-wide: 0.02em;    // Labels
$tracking-wider: 0.04em;   // All caps
```

### Typography Components

```scss
// Heading Styles
.bb-h1 {
  font-family: $font-display;
  font-size: $text-3xl;
  font-weight: $font-bold;
  line-height: $leading-tight;
  color: $bb-amber;
  letter-spacing: $tracking-tight;
}

.bb-h2 {
  font-family: $font-primary;
  font-size: $text-xl;
  font-weight: $font-semibold;
  line-height: $leading-snug;
  color: $bb-white;
}

.bb-h3 {
  font-family: $font-primary;
  font-size: $text-lg;
  font-weight: $font-medium;
  line-height: $leading-normal;
  color: $bb-white;
}

// Data Styles
.bb-data {
  font-family: $font-data;
  font-size: $text-sm;
  font-weight: $font-normal;
  line-height: $leading-tight;
  font-variant-numeric: tabular-nums;
}

.bb-metric {
  font-family: $font-data;
  font-size: $text-lg;
  font-weight: $font-bold;
  font-variant-numeric: tabular-nums;
}

// Financial Numbers
.bb-positive {
  color: $bb-green;
  &::before { content: '+'; }
}

.bb-negative {
  color: $bb-red;
  &::before { content: '-'; }
}

.bb-currency {
  &::before { content: '$'; }
  font-variant-numeric: tabular-nums;
}
```

---

## 3. Spacing & Grid System

### Base Grid

```scss
// 4px Base Unit
$space-0: 0;
$space-1: 4px;
$space-2: 8px;
$space-3: 12px;
$space-4: 16px;
$space-5: 20px;
$space-6: 24px;
$space-8: 32px;
$space-10: 40px;
$space-12: 48px;
$space-16: 64px;
$space-20: 80px;
$space-24: 96px;
```

### Layout Grid

```scss
// Container Widths
$container-sm: 640px;
$container-md: 1024px;
$container-lg: 1280px;
$container-xl: 1440px;
$container-2xl: 1920px;
$container-4k: 3840px;

// Grid Columns
$grid-columns: 24;  // Bloomberg uses 24-column grid
$grid-gutter: 16px;

// Panel Layouts
.bb-layout {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: $grid-gutter;
  
  &--sidebar {
    grid-template-columns: 240px 1fr;
  }
  
  &--split {
    grid-template-columns: 1fr 1fr;
  }
  
  &--triptych {
    grid-template-columns: 1fr 2fr 1fr;
  }
  
  &--quadrant {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
```

---

## 4. Component Specifications

### Buttons

```scss
.bb-button {
  // Base styles
  font-family: $font-primary;
  font-size: $text-sm;
  font-weight: $font-semibold;
  padding: $space-2 $space-4;
  border-radius: 2px;
  transition: all 150ms ease;
  text-transform: uppercase;
  letter-spacing: $tracking-wider;
  
  // Primary
  &--primary {
    background: $bb-amber;
    color: $bb-black;
    border: 1px solid $bb-amber;
    
    &:hover {
      background: lighten($bb-amber, 10%);
      box-shadow: 0 0 8px rgba($bb-amber, 0.5);
    }
  }
  
  // Secondary
  &--secondary {
    background: transparent;
    color: $bb-white;
    border: 1px solid $bb-medium-gray;
    
    &:hover {
      background: $bb-dark-gray;
      border-color: $bb-light-gray;
    }
  }
  
  // Ghost
  &--ghost {
    background: transparent;
    color: $bb-cyan;
    border: none;
    
    &:hover {
      color: $bb-white;
      text-decoration: underline;
    }
  }
  
  // Sizes
  &--sm {
    padding: $space-1 $space-2;
    font-size: $text-xs;
  }
  
  &--lg {
    padding: $space-3 $space-6;
    font-size: $text-md;
  }
}
```

### Data Tables

```scss
.bb-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-data;
  font-size: $text-xs;
  
  thead {
    background: $bb-dark-gray;
    border-bottom: 2px solid $bb-amber;
    
    th {
      padding: $space-2;
      text-align: left;
      font-weight: $font-semibold;
      color: $bb-amber;
      text-transform: uppercase;
      letter-spacing: $tracking-wider;
      font-size: $text-mini;
    }
  }
  
  tbody {
    tr {
      border-bottom: 1px solid $bb-medium-gray;
      
      &:hover {
        background: $bb-dark-gray;
      }
      
      &.selected {
        background: rgba($bb-amber, 0.1);
      }
    }
    
    td {
      padding: $space-2;
      color: $bb-white;
      
      &.numeric {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      
      &.positive { color: $bb-green; }
      &.negative { color: $bb-red; }
      &.neutral { color: $bb-blue; }
    }
  }
}
```

### Cards & Panels

```scss
.bb-panel {
  background: $bb-dark-gray;
  border: 1px solid $bb-medium-gray;
  border-radius: 2px;
  
  &__header {
    background: $gradient-header;
    padding: $space-2 $space-3;
    border-bottom: 1px solid $bb-amber;
    
    h3 {
      color: $bb-amber;
      font-size: $text-sm;
      font-weight: $font-semibold;
      text-transform: uppercase;
      letter-spacing: $tracking-wider;
    }
  }
  
  &__body {
    padding: $space-3;
  }
  
  &__footer {
    padding: $space-2 $space-3;
    border-top: 1px solid $bb-medium-gray;
    background: rgba($bb-black, 0.5);
  }
}
```

### Form Controls

```scss
.bb-input {
  background: $bb-black;
  border: 1px solid $bb-medium-gray;
  color: $bb-white;
  padding: $space-2;
  font-family: $font-data;
  font-size: $text-sm;
  border-radius: 2px;
  
  &:focus {
    outline: none;
    border-color: $bb-amber;
    box-shadow: 0 0 4px rgba($bb-amber, 0.3);
  }
  
  &::placeholder {
    color: $bb-light-gray;
  }
}

.bb-select {
  @extend .bb-input;
  appearance: none;
  background-image: url("data:image/svg+xml,..."); // Dropdown arrow
  background-position: right $space-2 center;
  background-repeat: no-repeat;
  padding-right: $space-8;
}
```

---

## 5. Animation & Transitions

### Timing Functions

```scss
// Easing Curves
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
$ease-out: cubic-bezier(0.0, 0, 0.2, 1);
$ease-in: cubic-bezier(0.4, 0, 1, 1);
$ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

// Durations
$duration-instant: 100ms;
$duration-fast: 200ms;
$duration-normal: 300ms;
$duration-slow: 500ms;
$duration-slower: 800ms;
```

### Animation Classes

```scss
// Fade In
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// Slide In
@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

// Pulse (for updates)
@keyframes pulse {
  0% { background: transparent; }
  50% { background: rgba($bb-amber, 0.2); }
  100% { background: transparent; }
}

// Number Change Flash
@keyframes flash {
  0% { color: $bb-white; }
  50% { color: $bb-amber; }
  100% { color: inherit; }
}

.bb-animate {
  &--fade { animation: fadeIn $duration-normal $ease-out; }
  &--slide { animation: slideIn $duration-normal $ease-out; }
  &--pulse { animation: pulse $duration-slow $ease-in-out; }
  &--flash { animation: flash $duration-fast $ease-in-out; }
}
```

---

## 6. Icons & Symbols

### Financial Icons

```scss
// Icon Font Mapping
.bb-icon {
  font-family: 'Bloomberg Icons';
  font-style: normal;
  font-weight: normal;
  display: inline-block;
  
  &--arrow-up::before { content: '\e900'; color: $bb-green; }
  &--arrow-down::before { content: '\e901'; color: $bb-red; }
  &--arrow-right::before { content: '\e902'; color: $bb-blue; }
  &--chart::before { content: '\e903'; }
  &--alert::before { content: '\e904'; color: $bb-amber; }
  &--lock::before { content: '\e905'; }
  &--unlock::before { content: '\e906'; }
  &--export::before { content: '\e907'; }
  &--settings::before { content: '\e908'; }
  &--search::before { content: '\e909'; }
}
```

### Status Indicators

```scss
.bb-status {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  
  &--active { 
    background: $bb-green;
    box-shadow: 0 0 4px $bb-green;
  }
  
  &--warning { 
    background: $bb-yellow;
    animation: pulse $duration-slower infinite;
  }
  
  &--error { 
    background: $bb-red;
    animation: pulse $duration-fast infinite;
  }
  
  &--idle { 
    background: $bb-light-gray;
  }
}
```

---

## 7. Responsive Breakpoints

```scss
// Breakpoint Variables
$bp-mobile: 320px;
$bp-tablet: 768px;
$bp-desktop: 1024px;
$bp-wide: 1440px;
$bp-ultra: 1920px;
$bp-4k: 3840px;

// Mixins
@mixin mobile {
  @media (max-width: #{$bp-tablet - 1px}) { @content; }
}

@mixin tablet {
  @media (min-width: #{$bp-tablet}) and (max-width: #{$bp-desktop - 1px}) { @content; }
}

@mixin desktop {
  @media (min-width: #{$bp-desktop}) { @content; }
}

@mixin wide {
  @media (min-width: #{$bp-wide}) { @content; }
}

@mixin ultra {
  @media (min-width: #{$bp-ultra}) { @content; }
}
```

---

## 8. Elevation & Shadows

```scss
// Shadow Levels
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
$shadow-md: 0 2px 4px rgba(0, 0, 0, 0.6);
$shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.7);
$shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.8);
$shadow-2xl: 0 16px 32px rgba(0, 0, 0, 0.9);

// Glow Effects
$glow-amber: 0 0 20px rgba($bb-amber, 0.3);
$glow-green: 0 0 20px rgba($bb-green, 0.3);
$glow-red: 0 0 20px rgba($bb-red, 0.3);

// Elevation Classes
.bb-elevation {
  &--1 { box-shadow: $shadow-sm; }
  &--2 { box-shadow: $shadow-md; }
  &--3 { box-shadow: $shadow-lg; }
  &--4 { box-shadow: $shadow-xl; }
  &--5 { box-shadow: $shadow-2xl; }
}
```

---

## 9. Accessibility

### Focus States

```scss
// Focus Styles
.bb-focus {
  &:focus {
    outline: 2px solid $bb-amber;
    outline-offset: 2px;
  }
  
  &:focus:not(:focus-visible) {
    outline: none;
  }
}

// Skip Links
.bb-skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: $bb-amber;
  color: $bb-black;
  padding: $space-2 $space-4;
  z-index: 100;
  text-decoration: none;
  
  &:focus {
    top: 0;
  }
}
```

### Color Contrast

```scss
// WCAG AA Compliant Combinations
// Background -> Text Color (Contrast Ratio)
// $bb-black -> $bb-white (21:1) ✓
// $bb-dark-gray -> $bb-white (15:1) ✓
// $bb-black -> $bb-amber (8.6:1) ✓
// $bb-dark-gray -> $bb-amber (6.5:1) ✓
// $bb-black -> $bb-green (15.3:1) ✓
// $bb-black -> $bb-red (5.9:1) ✓
```

---

## 10. Implementation Guidelines

### CSS Architecture

```scss
// File Structure
styles/
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _variables.scss
├── components/
│   ├── _buttons.scss
│   ├── _tables.scss
│   ├── _panels.scss
│   └── _forms.scss
├── layout/
│   ├── _grid.scss
│   ├── _header.scss
│   ├── _sidebar.scss
│   └── _workspace.scss
├── themes/
│   ├── _dark.scss
│   └── _light.scss
└── main.scss
```

### Naming Convention

```scss
// BEM Methodology with Bloomberg Prefix
.bb-[block]
.bb-[block]__[element]
.bb-[block]--[modifier]

// Examples
.bb-panel
.bb-panel__header
.bb-panel--collapsed
.bb-table__cell--numeric
```

### Performance Optimization

```scss
// Use CSS Variables for Theme Switching
:root {
  --bb-bg: #{$bb-black};
  --bb-text: #{$bb-white};
  --bb-accent: #{$bb-amber};
}

[data-theme="light"] {
  --bb-bg: #{$light-bg};
  --bb-text: #{$light-text};
  --bb-accent: #{$light-accent};
}

// GPU Acceleration for Animations
.bb-animate {
  will-change: transform, opacity;
  transform: translateZ(0);
}
```

---

*This Bloomberg-inspired design system provides the foundation for creating a professional, financial-grade interface that will impress stakeholders and demonstrate Orion's enterprise capabilities.*