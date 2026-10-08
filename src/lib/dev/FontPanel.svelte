<!--
  Dev-only font preset switcher (loaded only by `npm run dev`, never in the build or PDF).
  Flip through presets to preview; Save writes the choice to src/lib/typography.json.
-->
<script lang="ts">
  import { fonts, isFontName } from '../fonts';
  import { roleVars, savedPreset } from '../typography';
  import { formatConfig, presetNames, presets, roleKeys, type PresetName } from '../typography-presets';

  const OPEN_KEY = 'cv-font-panel-open';

  let open = $state(readOpen());
  let saved: PresetName = $state(savedPreset);
  let current: PresetName = $state(savedPreset);
  let status = $state('');
  /** Shown when the clipboard is unavailable, so the JSON can be copied by hand. */
  let manualCopy = $state('');

  const index = $derived(presetNames.indexOf(current));
  const dirty = $derived(current !== saved);

  // Preview the preset by overriding the saved values with inline custom properties on <html>.
  $effect(() => {
    const root = document.documentElement;
    const preset = presets[current];
    const applied = roleKeys.flatMap((role) => roleVars(role, preset[role]));
    for (const [name, value] of applied) root.style.setProperty(name, value);
    return () => {
      for (const [name] of applied) root.style.removeProperty(name);
    };
  });

  $effect(() => {
    try {
      localStorage.setItem(OPEN_KEY, open ? '1' : '0');
    } catch {
      // Storage unavailable; the panel just won't remember being open.
    }
  });

  function readOpen(): boolean {
    try {
      return localStorage.getItem(OPEN_KEY) === '1';
    } catch {
      return false;
    }
  }

  function select(name: PresetName) {
    current = name;
    status = '';
    manualCopy = '';
  }

  function step(delta: number) {
    select(presetNames[(index + delta + presetNames.length) % presetNames.length]);
  }

  /** The preset's name font, so each button previews its own style. */
  function nameFont(name: PresetName): string {
    const font = presets[name].name.font;
    return isFontName(font) ? fonts[font].stack : 'inherit';
  }

  function onKeydown(event: KeyboardEvent) {
    if (!open || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select')) return;
    if (event.key === 'ArrowLeft') step(-1);
    else if (event.key === 'ArrowRight') step(1);
    else return;
    event.preventDefault();
  }

  async function save() {
    status = 'Saving…';
    try {
      const response = await fetch('/__typography', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset: current }),
      });
      if (!response.ok) throw new Error(await response.text());
      saved = current;
      status = 'Saved to src/lib/typography.json';
    } catch (error) {
      status = `Save failed: ${error instanceof Error ? error.message : error}`;
    }
  }

  async function copyJson() {
    const json = formatConfig(current);
    try {
      await navigator.clipboard.writeText(json);
      manualCopy = '';
      status = 'JSON copied to clipboard';
    } catch {
      manualCopy = json;
      status = 'Copy the JSON below';
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="font-panel no-print">
  {#if open}
    <section class="panel" aria-labelledby="font-panel-title">
      <header>
        <h2 id="font-panel-title">Font presets</h2>
        <button type="button" class="close" onclick={() => (open = false)} aria-label="Close font panel">×</button>
      </header>

      <div class="stepper">
        <button type="button" onclick={() => step(-1)} aria-label="Previous preset">‹</button>
        <p aria-live="polite">
          <strong>{current}</strong>
          <span>{index + 1} / {presetNames.length}</span>
        </p>
        <button type="button" onclick={() => step(1)} aria-label="Next preset">›</button>
      </div>

      <ul class="presets">
        {#each presetNames as name (name)}
          <li>
            <button
              type="button"
              class:active={name === current}
              aria-pressed={name === current}
              onclick={() => select(name)}
            >
              <span class="preview" style:font-family={nameFont(name)}>{name}</span>
              {#if name === saved}<span class="saved-tag">saved</span>{/if}
            </button>
          </li>
        {/each}
      </ul>

      <p class="hint">Dev only. ← → flips presets. Save makes it the site's font.</p>

      {#if manualCopy}
        <textarea class="manual-copy" readonly rows="3" value={manualCopy} onfocus={(e) => e.currentTarget.select()}
        ></textarea>
      {/if}

      <footer>
        <p class="status" role="status">{status || (dirty ? 'Not saved yet' : 'This is the saved preset')}</p>
        <button type="button" onclick={copyJson}>Copy JSON</button>
        <button type="button" class="primary" onclick={save} disabled={!dirty}>Save</button>
      </footer>
    </section>
  {:else}
    <button type="button" class="toggle" onclick={() => (open = true)}>Aa&nbsp; Fonts</button>
  {/if}
</div>

<style>
  /* Fixed UI font so the panel itself doesn't change while you experiment. */
  .font-panel {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 1000;
    font: 400 13px/1.4 system-ui, -apple-system, 'Segoe UI', sans-serif;
    font-style: normal;
    color: #1b1a18;
  }

  button,
  textarea {
    font: inherit;
    color: inherit;
  }

  button {
    padding: 0.4rem 0.75rem;
    border: 1px solid #c9c2b5;
    background: #fff;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .toggle,
  .primary {
    border-color: #1b1a18;
    background: #1b1a18;
    color: #fff;
    font-weight: 600;
  }

  .toggle {
    padding: 0.55rem 0.9rem;
    box-shadow: 0 2px 10px rgb(0 0 0 / 0.15);
  }

  .panel {
    width: min(18rem, calc(100vw - 2rem));
    border: 1px solid #1b1a18;
    background: #fff;
    box-shadow: 0 8px 30px rgb(0 0 0 / 0.18);
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0.75rem 0.4rem;
  }

  h2 {
    font-size: 14px;
    font-weight: 700;
  }

  .close {
    padding: 0 0.5rem;
    border: 0;
    font-size: 20px;
    line-height: 1;
  }

  .stepper {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.75rem 0.6rem;
  }

  .stepper button {
    width: 2.25rem;
    padding: 0.25rem 0;
    font-size: 18px;
    line-height: 1;
  }

  .stepper p {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
  }

  .stepper strong {
    font-size: 15px;
  }

  .stepper span {
    color: #6b665e;
    font-variant-numeric: tabular-nums;
  }

  .presets {
    display: grid;
    border-top: 1px solid #e4dfd5;
    list-style: none;
  }

  .presets button {
    display: flex;
    width: 100%;
    align-items: baseline;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border: 0;
    border-bottom: 1px solid #efebe4;
    text-align: left;
  }

  .presets button:hover {
    background: #f8f6f1;
  }

  .presets button.active {
    background: #1b1a18;
    color: #fff;
  }

  .preview {
    font-size: 18px;
    line-height: 1.2;
  }

  .saved-tag {
    font-size: 11px;
    opacity: 0.7;
  }

  .hint {
    padding: 0.5rem 0.75rem 0;
    color: #6b665e;
  }

  .manual-copy {
    display: block;
    width: calc(100% - 1.5rem);
    margin: 0.5rem 0.75rem 0;
    padding: 0.4rem;
    border: 1px solid #c9c2b5;
    font: 11px/1.4 ui-monospace, Menlo, monospace;
    resize: vertical;
  }

  footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 0.75rem;
  }

  .status {
    flex: 1 1 100%;
    color: #6b665e;
  }
</style>
