import { hydrate, mount } from 'svelte';
import './app.css';
import App from './App.svelte';

const target = document.getElementById('app')!;

// Production HTML is prerendered by scripts/build.js, so hydrate it.
// The dev server serves an empty shell, so mount from scratch.
const app = target.firstElementChild ? hydrate(App, { target }) : mount(App, { target });

export default app;
