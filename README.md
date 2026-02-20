# TraceLab

Interactive algorithm visualizer with real-time step tracing, live pseudocode highlighting, complexity analysis, and AI-powered insights — built with React & TypeScript.

## ✨ Features

### 🏠 Homepage

- **Launcher Dashboard** — Sleek card-based homepage to pick between Sorting and Searching visualizers
- **Hash-Based Routing** — Client-side navigation (`#sorting`, `#searching`) with no page reloads
- **Aurora Background** — Animated Northern Lights effect using OGL WebGL shaders

### 📊 Sorting Visualizer

- **6 Algorithms** — Bubble, Selection, Insertion, Merge, Quick, and Heap Sort
- **Bar Graph Visualization** — Color-coded bars showing compare, swap, overwrite, and sorted states
- **Live Pseudocode Highlighting** — Tracks the active line of execution as the algorithm runs
- **Complexity Dashboard** — Time & space complexity breakdowns with a live operations counter
- **AI Analysis** — On-demand algorithm explanations powered by Google Gemini
- **Adjustable Speed & Size** — Control array size and animation speed in real-time

### 🔍 Search Visualizer

- **4 Algorithms** — Linear, Binary, Jump, and Exponential Search
- **Cell-Based Visualization** — Color-coded cells highlighting checking, found, eliminated, and target states
- **Target Input** — Specify the value to search for in the generated array
- **Live Pseudocode Highlighting** — Step-by-step execution tracing for each search algorithm
- **Complexity Dashboard** — Time & space complexity breakdowns with a live operations counter
- **AI Analysis** — On-demand algorithm explanations powered by Google Gemini

### 🎨 Design & UX

- **Smooth Transitions** — Framer Motion entrance animations throughout
- **Glassmorphism UI** — Frosted-glass cards with subtle gradients and glow effects
- **Responsive Layout** — Works across desktop and mobile screens
- **Footer with Socials** — Links to GitHub, LinkedIn, and more

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Background | OGL (WebGL) |
| AI | Google Gemini API |
| Icons | Lucide React |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/ManishRShetty/TraceLab.git
cd TraceLab

# Install dependencies
npm install

# Add your Gemini API key
# Create a .env.local file with: VITE_GEMINI_API_KEY=your_key_here

# Start dev server
npm run dev
```

## 📂 Project Structure

```
TraceLab/
├── App.tsx                          # Homepage launcher + hash-based routing
├── SortApp.tsx                      # Sorting visualizer — layout, state, sorting logic
├── SearchApp.tsx                    # Search visualizer — layout, state, search logic
├── types.ts                         # Shared types & enums (sort + search)
├── index.tsx                        # Entry point
├── index.html                       # HTML shell + global styles
├── components/
│   ├── Aurora.tsx                   # WebGL aurora background
│   ├── BarGraph.tsx                 # Sorting visualization bars
│   ├── Controls.tsx                 # Sorting — algorithm picker, play/pause, sliders
│   ├── ComplexityInfo.tsx           # Sorting — complexity cards + pseudocode + AI
│   ├── SearchBarGraph.tsx           # Search visualization cells
│   ├── SearchControls.tsx           # Search — algorithm picker, target input, controls
│   ├── SearchComplexityInfo.tsx     # Search — complexity cards + pseudocode + AI
│   └── Footer.tsx                   # Footer with socials
└── services/
    ├── sortingAlgorithms.ts         # Generator-based sorting implementations
    ├── searchingAlgorithms.ts       # Generator-based search implementations
    └── geminiService.ts             # Gemini API integration
```

## 📄 License

MIT © [Manish R Shetty](https://manishshetty.dev)
