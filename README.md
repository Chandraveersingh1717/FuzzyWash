# FuzzyWash: Interactive Fuzzy Logic Washing Machine Simulator

FuzzyWash is an interactive web-based educational tool designed to demystify fuzzy logic control systems through a real-world engineering problem: an automated washing machine controller. 

Instead of reading abstract equations, students and researchers can manipulate sensor inputs, modify membership function geometries, observe Mamdani rule firing, and watch how defuzzification directly drives a physical digital twin in real time.

---

## Why Fuzzy Logic for Washing Machines?

Conventional appliances rely on rigid threshold logic (e.g., `if dirt > 30% then wash_time = 30 min`). This causes several engineering issues:
- **Boundary Chattering:** A reading hovering between 29.9% and 30.1% can cause drastic, inefficient cycle jumps.
- **Sensor Noise:** Optical turbidity sensors and conductivity meters produce continuous, noisy analog readings that do not naturally map to boolean categories.
- **Resource Waste:** Over-washing lightly soiled clothes wastes electricity and water; under-washing heavily soiled loads leaves stains.

Fuzzy logic models partial truth through membership degrees between 0.0 and 1.0, enabling continuous, smooth transitions across multi-variable trade-offs.

---

## System Architecture

The simulation runs entirely in the client's browser with no backend dependency. The core fuzzy inference engine is written in pure TypeScript, fully decoupled from the UI layer.

```
Crisp Sensor Telemetry (5 Inputs)
         │
         ▼
[1. Fuzzification]
    ├── Triangular & Trapezoidal Membership Functions
    └── Degree of Membership Vectors: μ(x) ∈ [0, 1]
         │
         ▼
[2. Mamdani Rule Evaluation]
    ├── 5 Independent Sub-Controllers (81 Expert Rules)
    └── Conjunction (AND): α = min(μ_1, μ_2, ...)
         │
         ▼
[3. Rule Implication & Aggregation]
    ├── Consequent Slicing: μ_clipped(z) = min(α, μ_consequent(z))
    └── Pointwise Union (OR): μ_agg(z) = max(μ_clipped_1, μ_clipped_2, ...)
         │
         ▼
[4. Defuzzification]
    ├── Numerical Integration: 300 steps across universe
    └── Center of Gravity (Centroid): z* = ∫ z·μ(z) dz / ∫ μ(z) dz
         │
         ▼
[5. Actuator Command Generation]
    ├── Hardware Safety Overrides (Fabric Protection Capping)
    └── Physical Digital Twin Actuation (RPM, Liters, ml, °C, Minutes)
```

---

## Modular Sub-Controllers

To prevent combinatorial explosion (which would require $3^5 = 243$ rules in a monolithic table), the decision space is decomposed into five independent controllers:

1. **Wash Duration Controller (27 rules):**
   - Inputs: Dirtiness $\times$ Greasiness $\times$ Load Weight
   - Outputs: Very Short, Short, Medium, Long, Very Long (0–60 min)
2. **Water Intake Controller (9 rules):**
   - Inputs: Load Weight $\times$ Fabric Robustness
   - Outputs: Low, Medium, High (15–60 L)
3. **Detergent Dosage Controller (27 rules):**
   - Inputs: Dirtiness $\times$ Greasiness $\times$ Water Hardness
   - Outputs: Small, Medium, Large (10–100 ml)
4. **Water Temperature Controller (9 rules):**
   - Inputs: Fabric Robustness $\times$ Greasiness
   - Outputs: Cold, Warm, Hot (20–80 °C)
5. **Spin Speed Controller (9 rules):**
   - Inputs: Fabric Robustness $\times$ Load Weight
   - Outputs: Gentle, Normal, High (400–1400 RPM)

---

## Mathematical Formulations

### Triangular Membership Function
$$\mu(x) = \max\left(0, \min\left(\frac{x - a}{b - a}, \frac{c - x}{c - b}\right)\right)$$
Where $a$ is the left foot, $b$ is the peak ($\mu=1$), and $c$ is the right foot.

### Trapezoidal Membership Function
$$\mu(x) = \max\left(0, \min\left(\frac{x - a}{b - a}, 1, \frac{d - x}{d - c}\right)\right)$$
Where $a$ and $d$ are feet, and $[b, c]$ represents the plateau where $\mu=1$.

### Centroid Defuzzification (Center of Gravity)
$$z^* = \frac{\int_{z_{\min}}^{z_{\max}} z \cdot \mu_{\text{agg}}(z) \, dz}{\int_{z_{\min}}^{z_{\max}} \mu_{\text{agg}}(z) \, dz}$$
Implemented via trapezoidal numerical quadrature over 300 discrete intervals. If $\int \mu(z) \, dz \approx 0$ (no rules fire), the engine defaults to the midpoint $\frac{z_{\min} + z_{\max}}{2}$.

---

## Key Features

- **Interactive Digital Twin:** Realistic SVG/CSS washing machine where drum rotation speed, water intake level, bubble foam lather, and ambient thermal glow match calculated outputs.
- **VisuAlgo-Inspired Time Machine:** Step forward and backward through all 8 inference stages with playback speed controls (0.5x, 1x, 2x).
- **Membership Function Laboratory:** Interactive curve editor with sliders for vertices $a, b, c, d$. Edits immediately propagate through the inference engine.
- **What-If Scenario Comparison:** Run Scenario A and Scenario B concurrently with side-by-side delta charts.
- **Fuzzy vs. Traditional Benchmark:** Sweep dirtiness across 0–100% to visualize the contrast between discontinuous step thresholds and smooth fuzzy curves.
- **Learning Academy:** 13 educational modules with interactive quizzes and real-world industrial case studies.
- **Validation Laboratory:** Automated mathematical unit tests verifying slope continuity, Mamdani AND/OR operations, symmetric centroid integration, and hardware output limits.
- **Behind the Calculation:** Expandable mathematical audit drawer with one-click JSON report export and clipboard copying.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fuzzywash.git
cd fuzzywash

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## Tech Stack

- **Framework:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, Glassmorphism design system
- **Animations:** Framer Motion
- **Visualizations:** Recharts (dynamic membership curves, aggregation plots, and comparison bar charts)
- **State Management:** Zustand
- **Icons:** Lucide React

---

## Academic References

1. Zadeh, L. A. (1965). *Fuzzy sets*. Information and Control, 8(3), 338-353.
2. Mamdani, E. H., & Assilian, S. (1975). *An experiment in linguistic synthesis with a fuzzy logic controller*. International Journal of Man-Machine Studies, 7(1), 1-13.
3. Sugeno, M. (1985). *Industrial applications of fuzzy control*. Elsevier Science Inc.
