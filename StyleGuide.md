# Text Styles

Text styles bundle all essential typography settings, including font family, weight, size, and line height, into ready-to-use presets ranging from xs to 5xl. They help maintain consistent typography across all components and sections without manually adjusting individual values.

## Typography System

The four largest styles use dynamic typography variables instead of fixed values. This allows large headlines to scale automatically across breakpoints for improved readability on smaller devices.

All text styles use **Plus Jakarta Sans**, a modern geometric sans-serif font designed for clean and contemporary interfaces.

---

# Font Family

**Plus Jakarta Sans**

ABCDEFGHIJKLMNOPQRSTUVWXYZ  
abcdefghijklmnopqrstuvwxyz  
0123456789!@#$%&/*().,

---

# Text Style Variables

| Name | Font Size | Line Height |
|---|---|---|
| `xs-regular` | 12px | 16px |
| `xs-semibold` | 12px | 16px |
| `sm-regular` | 14px | 20px |
| `sm-semibold` | 14px | 20px |
| `md-regular` | 16px | 24px |
| `md-semibold` | 16px | 24px |
| `lg-regular` | 18px | 32px |
| `lg-semibold` | 18px | 32px |
| `xl-regular` | 20px | 28px |
| `xl-semibold` | 20px | 28px |
| `2xl-light` | `2xl-font-size` | `2xl-line-height` |
| `2xl-semibold` | `2xl-font-size` | `2xl-line-height` |
| `3xl-semibold` | `3xl-font-size` | `3xl-line-height` |
| `4xl-semibold` | `4xl-font-size` | `4xl-line-height` |
| `5xl-semibold` | `5xl-font-size` | `5xl-line-height` |

---

# Style Usage Guidelines

## xs Regular
The smallest text size in the system, subtle and space-saving, ideal for labels, metadata, and low-priority information.

## xs Semibold
A stronger version of xs regular used for emphasis and clearer hierarchy.

## sm Regular
Used for supporting text, short descriptions, and compact UI areas where space is limited.

## sm Semibold
Provides stronger emphasis while maintaining compact readability.

## md Regular
The default body text size used throughout the interface for general content.

## md Semibold
Used when body text requires stronger emphasis or importance.

## lg Regular
Designed for long-form reading experiences such as blogs or detailed descriptions with improved readability.

## lg Semibold
A stronger version of lg regular used for highlighted reading sections.

## xl Regular
Ideal for subheadings, highlights, and content that should stand out more prominently.

## xl Semibold
Used for emphasized subheadings and stronger visual hierarchy.

## 2xl Light
An elegant light-weight style designed for refined subheadlines and balanced visual presentation.

## 2xl Semibold
The smallest true headline style used for strong statements and impactful section titles.

## 3xl Semibold
A bold oversized style used for high-level headings and standout visual elements.

## 4xl Semibold
Reserved for major headlines and key visual focal points across layouts.

## 5xl Semibold
The largest display style in the system, primarily used for hero sections and high-impact design moments.




# Typography Variables

Typography variables control the dynamic font sizes and line heights used in the system’s largest text styles. Instead of fixed values, these variables scale automatically across breakpoints and ensure that large headlines remain readable and visually balanced on smaller screens.

| Variable Name | Desktop & Tablet | Mobile |
|---|---|---|
| `2xl-font-size` | 24px | 20px |
| `2xl-line-height` | 32px | 28px |
| `3xl-font-size` | 32px | 24px |
| `3xl-line-height` | 40px | 32px |
| `4xl-font-size` | 40px | 32px |
| `4xl-line-height` | 48px | 40px |
| `5xl-font-size` | 48px | 40px |
| `5xl-line-height` | 56px | 48px |

## Notes

- Typography variables are responsive and scale automatically across breakpoints.
- Larger text styles are optimized for readability on smaller devices.
- These variables help maintain visual consistency across the application.
- Recommended for headings, hero sections, banners, and dashboard titles.








# Color System Documentation

# Base Colors

The color system defines all base colors used throughout the design system, including brand colors, neutral palettes, and functional colors such as success, warning, and error states.

These palettes provide flexibility for backgrounds, borders, text, highlights, UI states, and interactive components while maintaining visual consistency across both light and dark themes.

---

# Brand Colors

| Shade | Hex |
|---|---|
| 50 | #EAF2FF |
| 100 | #CCE1FF |
| 200 | #A3C8FF |
| 300 | #79AFFF |
| 400 | #5097FF |
| 500 | #2A80FF |
| 600 | #246DD9 |
| 700 | #1E5BB5 |
| 800 | #184991 |
| 900 | #133A73 |
| 950 | #0A1D3A |

---

# Neutral Colors

| Shade | Hex |
|---|---|
| 0 | #FFFFFF |
| 50 | #FAFAFA |
| 100 | #F5F5F5 |
| 200 | #E9EAEB |
| 300 | #D5D7DA |
| 400 | #A4A7AE |
| 500 | #7A7D85 |
| 600 | #5E626C |
| 700 | #3F434B |
| 800 | #22262F |
| 900 | #15181E |
| 950 | #0C0E12 |

---

# Neutral Transparencies

| Name | Value |
|---|---|
| Neutral 0 60% | rgba(255,255,255,0.6) |
| Neutral 0 0% | rgba(255,255,255,0) |
| Neutral 950 60% | rgba(12,14,18,0.6) |
| Neutral 950 0% | rgba(12,14,18,0) |

---

# Success Colors

| Shade | Hex |
|---|---|
| 50 | #EDFAEE |
| 100 | #D4F3D5 |
| 200 | #B2EAB4 |
| 300 | #8EE191 |
| 400 | #6BD870 |
| 500 | #4BCF51 |
| 600 | #40B045 |
| 700 | #35933A |
| 800 | #2B762E |
| 900 | #225D24 |
| 950 | #112F12 |

---

# Warning Colors

| Shade | Hex |
|---|---|
| 50 | #FFF6E7 |
| 100 | #FFEAC6 |
| 200 | #FFD99A |
| 300 | #FFC86A |
| 400 | #FFB73D |
| 500 | #FFA713 |
| 600 | #D98E10 |
| 700 | #B5770D |
| 800 | #915F0B |
| 900 | #734B09 |
| 950 | #3A2605 |

---

# Error Colors

| Shade | Hex |
|---|---|
| 50 | #FEF1F1 |
| 100 | #FAD2D1 |
| 200 | #F5A8A8 |
| 300 | #F17E7E |
| 400 | #EC5756 |
| 500 | #E72D2C |
| 600 | #C82423 |
| 700 | #AA1E1D |
| 800 | #871717 |
| 900 | #6D1313 |
| 950 | #390A0A |

---

# Color Variables

Color variables act as the semantic layer of the design system. Instead of directly using raw palette colors, components reference semantic variables like background, text, border, success, warning, and error.

These variables automatically adapt between light and dark themes, allowing the entire UI to switch themes consistently without changing component-level styling.

---

# Background Variables

| Variable | Dark Mode | Light Mode |
|---|---|---|
| `bg-primary` | neutral-950 | neutral-0 |
| `bg-primary-transparent` | neutral-950 0% | neutral-0 0% |
| `bg-primary-backdrop` | neutral-950 80% | neutral-0 80% |
| `bg-secondary` | neutral-900 | neutral-50 |
| `bg-tertiary` | neutral-800 | neutral-100 |
| `bg-quaternary` | neutral-700 | neutral-200 |
| `bg-invert` | neutral-0 | neutral-950 |
| `bg-invert-hover` | neutral-400 | neutral-700 |
| `bg-brand` | brand-950 | brand-50 |
| `bg-brand-hover` | brand-900 | brand-100 |
| `bg-brand-solid` | brand-500 | brand-500 |
| `bg-brand-solid-hover` | brand-700 | brand-700 |
| `bg-success` | success-950 | success-50 |
| `bg-success-solid` | success-500 | success-500 |
| `bg-warning` | warning-950 | warning-50 |
| `bg-warning-solid` | warning-500 | warning-500 |
| `bg-error` | error-950 | error-50 |
| `bg-error-solid` | error-500 | error-500 |
| `bg-backdrop` | neutral-950 80% | neutral-950 80% |

---

# Border Variables

| Variable | Dark Mode | Light Mode |
|---|---|---|
| `border-subtle` | neutral-800 | neutral-200 |
| `border-primary` | neutral-700 | neutral-300 |
| `border-strong` | neutral-600 | neutral-400 |
| `border-invert` | neutral-0 | neutral-950 |
| `border-brand` | brand-800 | brand-200 |
| `border-brand-solid` | brand-500 | brand-500 |
| `border-success` | success-800 | success-200 |
| `border-warning` | warning-800 | warning-200 |
| `border-error` | error-800 | error-200 |

---

# Text Variables

| Variable | Dark Mode | Light Mode |
|---|---|---|
| `text-primary` | neutral-100 | neutral-800 |
| `text-secondary` | neutral-400 | neutral-600 |
| `text-subtle` | neutral-600 | neutral-400 |
| `text-light` | neutral-100 | neutral-100 |
| `text-dark` | neutral-800 | neutral-800 |
| `text-invert` | neutral-800 | neutral-100 |
| `text-brand` | brand-500 | brand-600 |
| `text-brand-hover` | brand-700 | brand-800 |
| `text-success` | success-500 | success-600 |
| `text-warning` | warning-500 | warning-600 |
| `text-error` | error-500 | error-600 |

---

# Design Notes

- Brand colors define the personality and visual identity of the product.
- Neutral palettes are used for backgrounds, borders, and text layers.
- Success, warning, and error colors communicate system states and feedback.
- Semantic variables simplify theme switching and improve scalability.
- The entire system is optimized for both light mode and dark mode interfaces.
- Variables ensure consistency across components, layouts, dashboards, and marketing pages.












