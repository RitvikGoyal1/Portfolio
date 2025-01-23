React + TypeScript + Vite
Portfolio Website
Hey there! Welcome to my portfolio site! 🚀 This is my little website, built to showcase who I am, what I’ve done, and what I’m all about. It’s still a work in progress, but I’m getting there, one bug at a time.

🎯 What I Built and Why
This portfolio is a reflection of me: modern, responsive, and (eventually) polished. I wanted to create a space where I could present my projects, experiences, and skills in a way that feels both professional and personal.

🛠️ How I Built It
Frameworks & Tools: React, TypeScript, and Vite for a smooth, fast dev experience.
Design: A modern, responsive layout that adapts seamlessly across devices. Dark mode? Of course. (It's still a little glitchy)
Deployment: GitHub Pages gave me a hard time. But I made it work!
✨ Features
Dark Mode Support (almost there—minor bugs still being squashed).
Modern Design to showcase my work in a clean, professional way.
Responsive Layout for both mobile and desktop users, so it looks great no matter where you’re visiting from.
🛠️ Next Steps
This site is almost ready for the world. Here's what’s next:
Fill it out with my experiences, projects, and other fun facts.
Fine-tune dark mode so it works perfectly.
Polish the design, add finishing touches, and make everything pop.

🎥 What I Watched While Building This
Nothing really...

🎉 Who It’s For
Potential employers or collaborators who want to get to know me and my work.

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
