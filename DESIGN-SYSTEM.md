# AIoli Design System
## The Obsidian System - Dark Mode Premium

Ett precisionsinstrument. Mörkt, knivskarp och tyst.

---

## Design Tokens

### Core Backgrounds

| Token | Värde | Beskrivning | Användning |
|-------|-------|-------------|------------|
| `--bg-void-main` | `#050505` | Djupaste svarta | Huvudbakgrunden för hela sidan |
| `--bg-void-surface` | `#0F0F10` | Något ljusare svart | Bakgrund för kort (Cards) och input-fält |
| `--bg-white-solid` | `#FFFFFF` | Rent vitt | Bakgrund för primär "Analysera"-knapp |

### Text & Borders

| Token | Värde | Beskrivning | Användning |
|-------|-------|-------------|------------|
| `--text-primary` | `#FFFFFF` | Rent vitt | Huvudrubriker, logotyp, knapptext |
| `--text-secondary` | `#A1A1AA` | Ljusgrå (Cool Gray) | Underrubriker, navigeringslänkar, status-text |
| `--text-muted` | `#71717A` | Mörkare grå | Hjälptext, timestamps |
| `--border-subtle` | `#1F1F22` | Mycket mörk grå | Inaktiva ramar runt kort och input-fält |

### Accents & Glows

| Token | Värde | Beskrivning | Användning |
|-------|-------|-------------|------------|
| `--accent-plasma` | `#2D5BFF` | Intensiv blå | Glödande ram vid hover, subtil glow bakom knapp |
| `--accent-plasma-glow` | `rgba(45, 91, 255, 0.15)` | Blå glow | Bakgrundsglöd för accent-element |

### Score Colors

| Token | Värde | Beskrivning |
|-------|-------|-------------|
| `--score-great` | `#10B981` | Grön - Utmärkt (80-100) |
| `--score-good` | `#F59E0B` | Amber - Bra (60-79) |
| `--score-okay` | `#F97316` | Orange - Okej (40-59) |
| `--score-poor` | `#EF4444` | Röd - Dålig (0-39) |

---

## Typography

### Font Stack
```css
font-family: var(--font-geist-sans), system-ui, sans-serif;
```

### Scale

| Klass | Storlek | Användning |
|-------|---------|------------|
| `text-6xl` | 3.75rem | Hero headline |
| `text-4xl` | 2.25rem | Page titles |
| `text-xl` | 1.25rem | Card headings |
| `text-lg` | 1.125rem | Section titles |
| `text-sm` | 0.875rem | Body text |
| `text-xs` | 0.75rem | Labels, captions |

### Font Weights

| Klass | Vikt |
|-------|------|
| `font-bold` | 700 |
| `font-semibold` | 600 |
| `font-medium` | 500 |

---

## Spacing

### Containers
- Max width: `max-w-7xl` (1280px)
- Padding: `px-6` (1.5rem)

### Section Spacing
- Between major sections: `mb-14` / `mt-20`
- Between cards: `gap-8`
- Inside cards: `p-8`

---

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons | `4px` |
| Inputs | `4px` |
| Cards | `6px` - `8px` |
| Badges | `4px` |

---

## Components

### Primary Button (`.btn-primary`)
```css
.btn-primary {
  background: var(--bg-white-solid);
  color: var(--bg-void-main);
  font-weight: 600;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}
```

### Glass Card (`.card`)
```css
.card {
  background: rgba(15, 15, 16, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
```

### Score Card (`.score-card`)
```css
.score-card {
  background: rgba(15, 15, 16, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

/* Gradient line at top */
.score-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
}
```

### Dark Input (`.input`)
```css
.input {
  background: var(--bg-void-main);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-primary);
}

.input:focus {
  border-color: var(--accent-plasma);
  box-shadow: 0 0 0 2px var(--accent-plasma-glow);
}

.input::placeholder {
  color: var(--text-muted);
}
```

### Glass Header (`.header`)
```css
.header {
  background: rgba(5, 5, 5, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}
```

---

## Gradient Background

```css
.gradient-bg {
  background:
    radial-gradient(
      ellipse 80% 50% at 50% -20%,
      rgba(45, 91, 255, 0.08),
      transparent
    ),
    var(--bg-void-main);
}
```

---

## Shadows

| Typ | Värde | Användning |
|-----|-------|------------|
| Glow (button) | `0 0 20px rgba(255,255,255,0.15)` | Primary CTA |
| Glow (hover) | `0 0 30px rgba(255,255,255,0.25)` | Button hover |
| Header | `0 4px 30px rgba(0,0,0,0.3)` | Sticky header |
| Subtle | `0 0 20px rgba(255,255,255,0.03)` | URL badge |

---

## Animation

### Transitions
```css
/* Standard */
transition: all 0.2s ease;

/* Premium (cards) */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover Effects
- Cards: `transform: translateY(-2px)`
- Buttons: `transform: translateY(-1px)`

---

## Usage Examples

### Score Badge
```jsx
<span className="badge badge-great">85</span>
<span className="badge badge-good">65</span>
<span className="badge badge-okay">45</span>
<span className="badge badge-poor">25</span>
```

### Feature Card
```jsx
<div className="feature-card">
  <div className="icon-container icon-container-cyan mb-4">
    {/* SVG icon */}
  </div>
  <h3 style={{ color: "var(--text-primary)" }}>Title</h3>
  <p style={{ color: "var(--text-secondary)" }}>Description</p>
</div>
```

---

## Design Principles

1. **Mörkt & Knivskarp** - Använd djupa svarta toner, skarp kontrast
2. **Tyst** - Minimal visuell störning, låt innehållet tala
3. **Precision** - Strama border-radius (4-6px), exakt spacing
4. **Glass Morphism** - Subtil backdrop-blur på kort och header
5. **Fokus** - Den vita CTA-knappen är sidans ljuspunkt

> *"AIoli är inte en leksak – det är ett precisionsinstrument."*
