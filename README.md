# TODO List - Windows 98 Style

A nostalgic TODO list desktop application built with Electron and React, featuring authentic Windows 98 styling and UI elements.

![Windows 98 TODO List](https://img.shields.io/badge/Windows-98-blue)
![Electron](https://img.shields.io/badge/Electron-28.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- ✨ **Authentic Windows 98 UI**: Classic gray borders, blue gradient title bar, and retro styling
- ✅ **Task Management**: Add, edit, delete, and complete tasks
- 🔍 **Search**: Search through your tasks
- 📊 **Priority Levels**: Set priority (Low, Normal, Medium, High) for each task
- 📅 **Due Dates**: Add due dates to tasks
- 🎨 **Filtering**: Filter tasks by All, Active, Completed, or High Priority
- 💾 **Persistent Storage**: Todos are saved automatically using localStorage
- 🪟 **Custom Title Bar**: Fully customized Windows 98-style title bar with minimize, maximize, and close buttons
- 🎯 **Fixed Window Size**: Non-resizable window with fixed dimensions for authentic feel

## Screenshots

The application features:
- Classic Windows 98 blue gradient title bar
- Authentic gray interface with proper borders and shadows
- Menu bar with File, Edit, View, and Help options
- Search functionality
- Priority indicators and due date display
- Status bar showing task statistics

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository or download the source code
2. Install dependencies:

```bash
npm install
```

## Usage

### Running the Application

To run the application in development mode:

```bash
npm start
```

### Building for Production

To build the application for Windows:

```bash
npm run build
```

This will create a distributable installer in the `dist` folder.

## Project Structure

```
kyujin/
├── app.js          # Main React component with TODO logic
├── main.js         # Electron main process
├── preload.js      # Electron preload script for IPC
├── index.html      # HTML entry point
├── cardfile-1.ico  # Application icon
└── package.json    # Project configuration
```

## Technology Stack

- **Electron**: Cross-platform desktop application framework
- **React**: UI library (via CDN)
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Babel Standalone**: JSX transpilation in the browser

## Features in Detail

### Task Management
- Add new tasks with text input
- Mark tasks as completed with checkboxes
- Edit tasks by double-clicking or using the Edit button
- Delete tasks with confirmation
- Clear completed tasks

### Priority System
Tasks can have one of four priority levels:
- Low Priority ⬇️
- Normal (default)
- Medium Priority ⚠️
- High Priority ❗

### Filtering and Search
- Filter by: All Tasks, Active Tasks, Completed Tasks, High Priority
- Search through task text in real-time
- Combined filtering and search for precise results

### Data Persistence
- Todos are automatically saved to localStorage
- Data persists between application sessions
- No server or database required

## Customization

The application uses:
- **MS Sans Serif** font for authentic Windows 98 appearance
- Custom Windows 98-style borders and shadows
- Classic color scheme (#c0c0c0 gray, #008080 teal background)

## Development

### Window Controls

The application uses a custom frameless window with:
- Custom title bar with drag functionality
- Minimize, maximize, and close buttons
- IPC communication between renderer and main process

### LocalStorage Key

Todos are stored in localStorage with the key: `win98-todos`

## License

MIT License - see LICENSE file for details

## Author

**Vamerlen Madoucha**

## Acknowledgments

- Inspired by the classic Windows 98 operating system
- Built with love for retro computing aesthetics

---

Enjoy your nostalgic TODO list experience! 📝

