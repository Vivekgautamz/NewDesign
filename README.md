# Client Dashboard Template – STAGE 3 Final

Professional, responsive dashboard template for managing and previewing client web projects.

---

## 🚀 Quick Start

1. **Duplicate the folder**: Copy the entire `intelligence-main` folder and rename it for each client (e.g., `client-acme`, `client-xyz`).
2. **Open `index.html`** in any modern browser.
3. **No hardcoding required**: All data is entered via editable fields and saved locally.
4. **Remove this README** before sharing with clients.

---

## ✨ Features

### Information Management
- **Editable client name** – displays prominently in the header; updates automatically
- **Brand colors** – three colour pickers (Primary, Secondary, Accent) with **live theming**
- **Colour swatches** – visual display below the header for quick reference
- **Client logo** – drag & drop or upload, stored locally
- **Editable notes** – capture important project details
- **Project checklist** – create and track tasks with checkboxes

### Document & Preview
- **Document upload** – file picker with simulated progress bar
- **Live site preview** – enter any URL and preview in an embedded iframe
- **Save/load clients** – all data (including colours) persists in browser storage (localStorage)

### 🎨 Dynamic Brand Color Theming
**The entire dashboard instantly updates when you change brand colours!**
- Change the Primary colour → all primary buttons, borders, accents update
- Change the Secondary colour → headings, text, gradients update
- Change the Accent colour → highlights, hover effects, swatches update
- Colour combinations create elegant gradients on buttons
- Saved colour schemes auto-apply when loading a client profile

### Design & Responsiveness
- **Modern card-based UI** – clean, professional grey/white base + brand colours
- **Fully responsive** – optimised for desktop, tablet, and mobile
- **Touch-friendly** – buttons ≥44px for comfortable mobile interaction
- **Consistent typography** – Inter font, clear hierarchy
- **Smooth animations** – subtle hover effects, colour transitions, shadows

---

## 📱 Responsive Breakpoints

| Screen Size | Layout |
|---|---|
| **≥1024px** | Two-column: narrow left panel (360px), wide preview panel |
| **768–1024px** | Tablet: panels stack vertically, full width |
| **<768px** | Mobile: compact spacing, reduced font sizes, touch-optimized buttons |
| **<480px** | Small mobile: minimal padding, stacked controls |

---

## 💾 Data Storage

All client information is stored **locally in the browser** using `localStorage`:
- Save client profiles with a unique name
- Load previously saved clients from the dropdown
- Data persists across browser sessions
- **No server or backend required**

---

## 🎨 Customization

### Colours (CSS Variables)
Edit `styles.css` `:root` section to change defaults:
```css
--color-primary: #007bff;     /* Links, buttons, borders */
--color-secondary: #333;      /* Text, headings */
--color-accent: #ffc107;      /* Highlights */
--color-bg: #f5f5f5;          /* Page background */
```

### Spacing & Typography
- `--spacing: 20px` – base spacing unit
- `--radius: 12px` – border radius
- `--font-family` – Inter (default), easily swappable

### Extending Functionality
- `script.js` contains all interactivity; add new event listeners as needed
- `applyBrandColors(primary, secondary, accent)` – dynamically theme the entire dashboard
- `updateClientList()` – refreshes the client dropdown
- `refreshHeader()` – syncs header & swatches with current data
- `simulateUpload()` – handles progress bar animation

### Dynamic Theme System
The dashboard colour theme is fully controlled via CSS variables in `:root`. When you use the colour pickers:
1. User selects new colours in the dashboard
2. `applyBrandColors()` updates CSS custom properties
3. Entire page instantly re-themes (buttons, borders, text, accents)
4. Changes are saved with the client profile
5. Re-load the client to restore the theme

**Key variables controlled by user colours:**
- `--color-primary` – buttons, links, borders, primary accents
- `--color-secondary` – headings, text, gradients
- `--color-accent` – highlights, progress bars, hover states
- `--color-primary-light` – subtle backgrounds, section accents

---

## 📋 Template Checklist

- ✅ **No hardcoded client data** – truly reusable for any client
- ✅ **Professional design** – modern, clean, suitable for client sharing
- ✅ **Fully responsive** – tested on all screen sizes
- ✅ **Consistent spacing** – CSS variables ensure alignment
- ✅ **Accessible** – legible fonts, touch-friendly buttons, clear labels
- ✅ **Offline capable** – all data stored locally, no internet required
- ✅ **Documentation** – clear README, comments in code

---

## ⚠️ Before Sharing with Clients

1. **Remove this README** or replace with client-specific instructions
2. **Remove the HTML template comment** at the top of `index.html` (lines 12–19)
3. Optional: add client logo/branding to the template if desired
4. Test in the client's browser(s) to confirm compatibility

---

## 📝 Version Info

- **Stage**: 3 (Template Finalisation & Responsiveness)
- **Created**: February 2026
- **Status**: Production-ready