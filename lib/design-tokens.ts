/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              SERVIO — Design System Tokens                  ║
 * ║                                                              ║
 * ║  Premium SaaS design system for digital menu platform        ║
 * ║  Inspired by: warm minimalism, calm luxury, modern SaaS      ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ─── COLOR PALETTE ──────────────────────────────────────────────
 *
 * BACKGROUNDS (warm neutrals):
 *   sand-50  #FDFCFA   → Page background (light)
 *   sand-100 #FAF8F5   → Primary background
 *   sand-200 #F5F0EB   → Muted surface / hover states
 *   sand-300 #EDE6DD   → Borders / dividers
 *   cream-50 #FFFEFB   → Card surfaces
 *
 * PRIMARY ACCENT (muted sage green):
 *   sage-500 #6B9A6B   → Primary buttons, links
 *   sage-600 #537A53   → Hover state
 *   sage-700 #436143   → Active / pressed
 *   sage-100 #E8EFE8   → Light variant / badges
 *
 * SECONDARY ACCENT (warm forest):
 *   forest-500 #557D5E  → Secondary actions
 *   forest-600 #42634A  → Hover
 *
 * WARM ACCENT (terracotta):
 *   terracotta-400 #E8946F → Highlights
 *   terracotta-500 #DF7A4F → Warm CTAs, notifications
 *   terracotta-100 #FBEBE4 → Light badges
 *
 * TEXT:
 *   charcoal-950 #1A1A1A → Headings
 *   charcoal-900 #2A2A2A → Primary text
 *   charcoal-600 #5D5D5D → Secondary text
 *   charcoal-400 #888888 → Tertiary / placeholder
 *   charcoal-300 #B0B0B0 → Muted / disabled
 *
 * ─── TYPOGRAPHY ─────────────────────────────────────────────────
 *
 * Font Families:
 *   Display: DM Sans (headings, titles)
 *   Body:    Inter (body text, UI elements)
 *
 * Scale:
 *   display-2xl  4.5rem / 1.1    → Hero
 *   display-xl   3.75rem / 1.1   → Page titles
 *   display-lg   3rem / 1.15     → Section titles
 *   display-md   2.25rem / 1.2   → Card titles
 *   display-sm   1.875rem / 1.25 → Subsections
 *   display-xs   1.5rem / 1.3    → Small headings
 *   body-xl      1.25rem / 1.6   → Lead text
 *   body-lg      1.125rem / 1.6  → Large body
 *   body-md      1rem / 1.6      → Default body
 *   body-sm      0.875rem / 1.5  → Secondary body / labels
 *   body-xs      0.75rem / 1.5   → Captions / meta
 *
 * ─── SPACING ────────────────────────────────────────────────────
 *
 * Base scale: 4px (Tailwind default)
 * Key gaps:
 *   4    = 1rem   → Tight element gap
 *   6    = 1.5rem → Standard gap
 *   8    = 2rem   → Section gap
 *   12   = 3rem   → Large section gap
 *   16   = 4rem   → Page sections
 *   24   = 6rem   → Major sections
 *
 * ─── RADIUS ─────────────────────────────────────────────────────
 *
 *   sm   = 8px   → Small elements (inputs, badges)
 *   md   = 12px  → Medium elements
 *   lg   = 16px  → Cards, panels
 *   xl   = 20px  → Large cards
 *   2xl  = 24px  → Prominent cards
 *   full = 9999px → Pills, avatars
 *
 * ─── SHADOWS (soft warm) ────────────────────────────────────────
 *
 *   soft-xs  → Subtle resting state
 *   soft-sm  → Default card shadow
 *   soft-md  → Elevated elements
 *   soft-lg  → Hover / focus states
 *   soft-xl  → Modals, dropdowns
 *   soft-2xl → Overlays
 *
 * ─── MOTION ─────────────────────────────────────────────────────
 *
 *   Duration: 200ms (micro) / 300ms (standard) / 500ms (page)
 *   Easing:   cubic-bezier(0.22, 1, 0.36, 1) — ease-premium
 *   Approach: Subtle, never flashy. Calm confidence.
 */

export const designTokens = {
  colors: {
    bg: {
      primary: "bg-sand-100",
      secondary: "bg-sand-50",
      surface: "bg-white",
      muted: "bg-sand-200",
    },
    text: {
      primary: "text-charcoal-900",
      secondary: "text-charcoal-600",
      tertiary: "text-charcoal-400",
      muted: "text-charcoal-300",
    },
    accent: {
      primary: "text-sage-600",
      warm: "text-terracotta-500",
    },
  },
  radius: {
    card: "rounded-2xl",
    button: "rounded-xl",
    pill: "rounded-full",
    input: "rounded-xl",
  },
  shadow: {
    card: "shadow-soft-sm",
    elevated: "shadow-soft-md",
    hover: "shadow-soft-lg",
    modal: "shadow-soft-xl",
  },
} as const;
