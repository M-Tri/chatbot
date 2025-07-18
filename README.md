-----

# Chatbot Project

This project is a React-based chatbot application.

-----

## Getting Started

To set up and run the project locally, follow these steps:

### Prerequisites

Ensure you have Node.js and npm installed on your system.

### Installation

1.  Navigate to the `chatbot-project` directory.
2.  Install the necessary dependencies:
  ```bash
  npm install
  ```

### Running the Application

To start the development server, run the following command from within the `chatbot-project` directory:

```bash
npm run dev
```

This command executes the `dev` script defined in the `scripts` section of `package.json`, which typically starts a local development server and opens the application in your browser.

-----

## Key React Concepts learned:

Here are some important React concepts applied in this project:

| Concept             | Description                                                                  |
| :------------------ | :--------------------------------------------------------------------------- |
| **Fragments (`<>`)** | Allows you to group multiple elements without adding an extra `<div>` to the DOM. |
| **Spread Operator (`...`)** | Used for easily copying or merging arrays and objects.                      |
| **DOM Manipulation** | Avoid direct manual DOM manipulation; it can conflict with React's rendering. |
| **Lifting State Up** | Centralize state in a common ancestor component and pass it down via props.  |
| **Controlled Inputs** | Form elements (inputs, textareas, selects) whose values are controlled by React state. |
| **Asynchronous State Updates** | React state updates are not immediate; they are batched and applied after the current code execution finishes. |

-----
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
