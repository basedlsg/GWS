# The Great Work Suite

A comprehensive manifestation and productivity platform consisting of four integrated applications: **Transmute**, **Distillation**, **Projection**, and **Culmination**.

## Overview

The Great Work Suite is a single-page React application designed to help you transform your goals into reality through four powerful tools:

1. **Transmute** - Transform plain text code into beautifully styled, presentation-ready code blocks with cyberpunk aesthetics
2. **Distillation** - Convert abstract goals into concrete, actionable tasks with AI coaching
3. **Projection** - Practice future scenarios through simulated conversations and meetings
4. **Culmination** - Visualize and document your achievements through mock portfolios and success narratives

## Features

- **100% Client-Side** - No backend, no authentication, complete privacy
- **localStorage Persistence** - All your data stays on your device
- **Optional AI** - Works great without API keys, enhanced with Gemini 2.5 Pro
- **Text-to-Speech** - Native browser TTS for scenario practice
- **Export Everything** - Download your work in multiple formats
- **Aurora Gradient UI** - Professional laboratory aesthetic with smooth animations

## Tech Stack

- **React 18.3+** with TypeScript (strict mode)
- **Vite 5+** for blazing-fast development
- **Tailwind CSS** + **shadcn/ui** for styling
- **React Router** for navigation
- **Gemini API** (optional) for AI features
- **Web Speech API** for text-to-speech

## Prerequisites

- Node.js 18.x or 20.x
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GWS
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── features/           # Feature-based organization
│   ├── transmute/     # Code styling application
│   ├── distillation/  # Goal breakdown application
│   ├── projection/    # Scenario simulation application
│   ├── culmination/   # Achievement visualization application
│   └── landing/       # Home/dashboard page
├── shared/            # Shared across features
│   ├── components/    # Reusable UI components
│   │   └── ui/       # shadcn/ui components
│   ├── hooks/        # Custom React hooks
│   ├── context/      # Global context providers
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript type definitions
├── lib/              # Third-party integrations
├── styles/           # Global styles and themes
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

### Adding Your Gemini API Key (Optional)

The Great Work Suite works perfectly without an API key using intelligent fallbacks. To enable AI-powered features:

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open the app and navigate to Settings
3. Enter your API key
4. Your key is stored locally in your browser only

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or 20.x

## Architecture

See `.claude/CLAUDE.md` for comprehensive architectural documentation including:

- Design decisions and rationale
- Code style guide
- Component patterns
- State management strategy
- API integration patterns
- Testing requirements

## Privacy

The Great Work Suite is completely client-side:

- No user accounts or authentication
- No data sent to any servers (except Gemini API if you provide a key)
- All data stored locally in your browser
- Export your data anytime
- No tracking or analytics

## Browser Support

Works on all modern browsers that support:

- ES2020 JavaScript features
- Web Speech API (for text-to-speech in Projection)
- localStorage
- CSS Grid and Flexbox

## Contributing

This project follows strict TypeScript and code quality standards. Before contributing:

1. Read `.claude/CLAUDE.md` for architectural guidelines
2. Ensure TypeScript strict mode compliance
3. Follow the established component patterns
4. Add tests for new features

## License

[Add your license here]

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for manifestation and productivity**
