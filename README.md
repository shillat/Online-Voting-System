# React Playground: First Project 🚀

This repository hosts my very first React application, **"React Playground,"** which was bootstrapped with Create React App.

The primary goal of this project is to learn and practice fundamental React concepts, including components, state, props, and routing with React Router.

## 🔗 Live Application Link

The application has been successfully deployed and is hosted directly on GitHub Pages.

**View Live App Here:**
➡️ **`https://shillat.github.io/first-project/`**

-----

## 🛠️ Technologies Used

  * **React:** v18.3.1 (Core framework)
  * **React DOM:** v18.3.1 (Renderer)
  * **React Router DOM:** v6.x (For client-side routing)
  * **Create React App (CRA):** v5.0.1 (Base environment)
  * **gh-pages:** Used for deployment

-----

## ⚙️ Installation and Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/shillat/first-project.git
    cd first-project
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
    The application will open in your browser, likely at `http://localhost:3000` (or `http://localhost:3002` if other ports are in use).

-----

## 🚀 Deployment Process (GitHub Pages)

This project uses the `gh-pages` package to automate deployment from the `main` branch to the `gh-pages` branch, which GitHub Pages serves.

### Key Configuration

  * **`package.json`** was configured with the `homepage` field and `predeploy`/`deploy` scripts.
  * **Routing Fix:** The `BrowserRouter` in `src/App.js` uses `basename="/first-project"` to ensure correct routing on the GitHub Pages subdirectory.

### Deployment Command

To rebuild and redeploy the latest changes:

```bash
npm run deploy
```

-----

## 📝 Learning Journey Notes

This project's setup journey involved critical troubleshooting steps, including:

  * **Resolving the "Invalid hook call" Error:** This was fixed by enforcing a single, consistent version of React (v18.3.1) across all dependencies using the `overrides` field in `package.json`.
  * **Fixing Deployment Failures:** Solved networking issues (`ECONNRESET`, `early EOF`) by increasing the Git buffer size and resolving DNS issues to successfully install `gh-pages`.
  * **Addressing Blank Page on Deploy:** Solved by adding the crucial `basename="/first-project"` prop to the `<BrowserRouter>` component.
