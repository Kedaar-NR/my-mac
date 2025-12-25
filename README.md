# macOS Portfolio Website

An interactive macOS-inspired portfolio website built with Next.js, TypeScript, and Tailwind CSS. My project recreates the macOS desktop experience in a web browser, complete with draggable windows, a functional dock, and authentic UI elements.

<img width="1432" height="1382" alt="image" src="https://github.com/user-attachments/assets/13bcff04-f927-479c-baf4-56eb1c3a1b8b" />

<img width="1455" height="1406" alt="image" src="https://github.com/user-attachments/assets/86feeb87-6127-44bd-b721-67c463acc237" />

<img width="1453" height="1407" alt="image" src="https://github.com/user-attachments/assets/ae73d900-bdf0-4332-932c-31598af71b86" />


## Overview

This portfolio website mimics the macOS interface to create an engaging and memorable user experience. Visitors can interact with desktop folders, open windows, browse essays, and learn more about my background and projects—all within a familiar desktop environment.

## Features

### Desktop Environment
- **Authentic macOS UI**: Recreates the look and feel of macOS with a custom menu bar, dock, and desktop icons
- **Custom wallpaper**: Beautiful background image that sets the aesthetic tone
- **Interactive folders**: Click on desktop folders to open finder windows with different content sections

### Window Management
- **Draggable windows**: All windows can be dragged and repositioned anywhere on the screen
- **Resizable windows**: Windows can be resized with proper constraints
- **Window controls**: Functional red (close), yellow (minimize), and green (maximize) buttons
- **Z-index management**: Windows properly layer on top of each other when clicked
- **Minimize to dock**: Minimized windows appear in the dock and can be restored by clicking

### Dock
- **Smooth animations**: Icons magnify on hover with spring physics
- **Active indicators**: Small dots under running applications
- **Minimized windows**: Shows minimized windows between the separator and trash
- **Authentic design**: Frosted glass effect with proper spacing and styling

### Content Sections

#### About Me
- Typing animation that cycles through different roles
- Social links (LinkedIn, GitHub, Twitter)
- Email contact
- Link to UC Berkeley M.E.T. program
- Streak counters for personal habits (calorie tracking, typing, pushups, GitHub commits)

#### Essays
- File browser interface with a realistic macOS finder layout
- Three placeholder markdown files (web_dev.md, systems.md, what_to_work_on.md)
- Columns for Name, Date Modified, Size, and Kind
- Clickable files that open in new windows

#### Projects, Venture, Research
- Placeholder sections ready for future content

### Technical Features
- **Server-side rendering**: Built with Next.js App Router for optimal performance
- **TypeScript**: Fully typed for better developer experience and fewer bugs
- **State management**: Zustand for efficient window state management
- **Animations**: Framer Motion for smooth, performant animations
- **Responsive design**: Tailwind CSS for styling
- **Production ready**: Builds successfully with no errors or warnings

## Tech Stack

- **Framework**: Next.js 15.5.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Window Management**: react-rnd
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd new-personal
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── Desktop.tsx         # Main desktop container
│   ├── DesktopIcons.tsx    # Desktop folder icons
│   ├── Dock.tsx            # macOS dock component
│   ├── FinderWindow.tsx    # Finder window with all content
│   ├── MailWindow.tsx      # Mail window component
│   ├── MenuBar.tsx         # Top menu bar
│   └── PortfolioWindow.tsx # Portfolio window component
└── store/
    └── windowStore.ts      # Zustand store for window management
```

## Customization

### Adding New Folders
Edit `src/components/DesktopIcons.tsx` to add new folders to the desktop:

```typescript
const folders = [
  {
    label: "Your Folder Name",
    onClick: () => openWindow({
      title: "Your Folder Name",
      type: "finder",
      content: "your-content-key"
    }),
  },
  // ... more folders
];
```

### Adding New Content
Add new cases to the `getContent()` function in `src/components/FinderWindow.tsx`:

```typescript
case "your-content-key":
  return (
    <div className="p-6">
      {/* Your content here */}
    </div>
  );
```

### Updating Personal Information
Edit the "about" case in `src/components/FinderWindow.tsx` to update:
- Name and bio
- Social links
- Streak counters
- Personal interests

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy

Vercel will automatically detect the Next.js configuration and deploy your site.


## Performance

- **First Load JS**: 179 KB (optimized)
- **Static Generation**: All pages are pre-rendered at build time
- **Lighthouse Score**: Optimized for performance, accessibility, and SEO

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Future Enhancements

- Add actual essay content
- Implement project showcase
- Add venture capital portfolio section
- Include research publications
- Create more interactive elements
- Add keyboard shortcuts
- Improve accessibility features

## Acknowledgments

Built with inspiration from the macOS design language and user interface patterns.

Note: This project is actively maintained.

Happy holidays!

## License

MIT License - feel free to use this project as a template for your own portfolio.

Built with ❤️

<!-- Time traveler was here -->
