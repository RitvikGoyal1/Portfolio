# React + TypeScript + Vite
# Portfolio Website

Welcome to my portfolio website! 🚀

## Current Status
The main structure of the website is almost complete! 🎉 I'm now working on:
- Adding more information about my **experiences**, **projects**, and other details.
- Fixing minor issues with **dark mode**.

Deploying the site to GitHub Pages took some effort, but I finally got it working! 😭

## Features
- **Dark Mode Support** (in progress)
- **Modern Design**
- Responsive layout for mobile and desktop users

## Next Steps
1. Populate the website with content (experiences, projects, etc.).
2. Fine-tune dark mode for a seamless experience.
3. Add any finishing touches for polish.

## Deployment
This project is hosted on **GitHub Pages**. You can check it out [here](INSERT-YOUR-LINK).

---

Feedback and suggestions are always welcome! 😊


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
