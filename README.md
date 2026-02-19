# TraceLab

Interactive sorting & searching algorithm visualizer with real-time pseudocode highlighting, complexity analysis, and AI insights — built with React & TypeScript.

## ✨ Features

- **6 Sorting Algorithms** — Bubble, Selection, Insertion, Merge, Quick, and Heap Sort
- **Real-Time Visualization** — Color-coded bar graph showing compare, swap, overwrite, and sorted states
- **Live Pseudocode Highlighting** — Tracks the active line of execution as the algorithm runs
- **Complexity Dashboard** — Time & space complexity breakdowns with a live operations counter
- **AI Analysis** — On-demand algorithm explanations powered by Google Gemini
- **Adjustable Speed & Size** — Control array size and animation speed in real-time
- **Aurora Background** — Animated Northern Lights effect using OGL WebGL shaders
- **Smooth Transitions** — Framer Motion entrance animations throughout

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
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
# Create a .env file with: VITE_GEMINI_API_KEY=your_key_here

# Start dev server
npm run dev
```

## 📂 Project Structure

```
TraceLab/
├── App.tsx                  # Main app — layout, state, sorting logic
├── index.tsx                # Entry point
├── index.html               # HTML shell + global styles
├── types.ts                 # Shared types & enums
├── components/
│   ├── Aurora.tsx            # WebGL aurora background
│   ├── BarGraph.tsx          # Sorting visualization bars
│   ├── Controls.tsx          # Algorithm picker, play/pause, sliders
│   ├── ComplexityInfo.tsx    # Complexity cards + pseudocode + AI
│   └── Footer.tsx            # Footer with socials
└── services/
    ├── sortingAlgorithms.ts  # Generator-based sorting implementations
    └── geminiService.ts      # Gemini API integration
```

## 📄 License

MIT © [Manish R Shetty](https://manishshetty.dev)
