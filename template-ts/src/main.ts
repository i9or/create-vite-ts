import "./global.css";

const appContainer = document.querySelector('#app');
if (appContainer) {
  appContainer.innerHTML = `
  <h1>Hello Vite and TypeScript!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite documentation</a>
`;
} else {
  throw new Error("#app was not found on the page");
}
