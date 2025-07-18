# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## Notes:

  - fragments <div>  => <> : Create elements without the extra div.
  - Spread operator : ...
  - With React, do not use the DOM manually. It might interfere with React.
  - Lift state up, use props to pass variables.
  - Controlled inputs.
  - State is not updated immediately, it is updated after all the code is finished.

### Command line: 

  - npm install supersimpledev : Install packages into node_modules
  - Enter the chatbot-project :
    - npm run dev : Look inside the scripts section of package.json, find a key called dev, and run whatever command is assigned to it.