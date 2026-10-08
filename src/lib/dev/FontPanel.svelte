<!--
  Dev-only font editor (loaded only by `npm run dev`, never in the build or PDF).
  Changes preview live; Save writes them to src/lib/typography.json.
-->
<script lang="ts">
  import { fonts, type FontOption } from '../fonts';
  import { roleKeys, roles, roleVars, typography, type Typography } from '../typography';
  import { formatTypography } from '../typography-format';

  const OPEN_KEY = 'cv-font-panel-open';
  const groups: FontOption['group'][] = ['Serif', 'Sans', 'Mono'];
  const fontNames = Object.keys(fonts) as (keyof typeof fonts)[];

  let open = $state(readOpen());
  let saved: Typography = $state(structuredClone(typography));
  let draft: Typography = $state(structuredClone(typography));
  let status = $state('');
  /** Shown when the clipboard is unavailable, so the JSON can be copied by hand. */
  let manualCopy = $state('');

  const dirty = $derived(JSON.stringify(draft) !== JSON.stringify(saved));

  // Preview the draft by overriding the saved values with inline custom properties on <html>.
  $effect(() => {
    const root = document.documentElement;
    const applied = roleKeys.flatMap((role) => roleVars(role, draft[role]));
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

  async function save() {
    status = 'Saving…';
    const snapshot = $state.snapshot(draft);
    try {
      const response = await fetch('/__typography', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot),
      });
      if (!response.ok) throw new Error(await response.text());
      saved = snapshot;
      status = 'Saved to src/lib/typography.json';
    } catch (error) {
      status = `Save failed: ${error instanceof Error ? error.message : error}`;
    }
  }

  async function copyJson() {
    const json = formatTypography($state.snapshot(draft));
    try {
      await navigator.clipboard.writeText(json);
      manualCopy = '';
      status = 'JSON copied to clipboard';
    } catch {
      manualCopy = json;
      status = 'Copy the JSON below';
    }
  }

  function reset() {
    draft = structuredClone($state.snapshot(saved));
    status = '';
  }
</script>

<div class="font-panel no-print">
  {#if open}
    <section class="panel" aria-labelledby="font-panel-title">
      <header>
        <h2 id="font-panel-title">Fonts</h2>
        <button type="button" class="close" onclick={() => (open = false)} aria-label="Close font panel">×</button>
      </header>
      <p class="hint">Dev only. Changes preview live. Save writes them to the config file.</p>

      <div class="rows">
        {#each roleKeys as role (role)}
          <fieldset>
            <legend>{roles[role]}</legend>
            <select bind:value={draft[role].font} aria-label="{roles[role]} font">
              {#each groups as group (group)}
                <optgroup label={group}>
                  {#each fontNames.filter((name) => fonts[name].group === group) as name (name)}
                    <option value={name}>{name}</option>
                  {/each}
                </optgroup>
              {/each}
            </select>
            <label class="weight">
              <input
                type="range"
                min="300"
                max="800"
                step="50"
                bind:value={draft[role].weight}
                aria-label="{roles[role]} weight"
              />
              <output>{draft[role].weight}</output>
            </label>
            <label class="italic">
              <input type="checkbox" bind:checked={draft[role].italic} />
              Italic
            </label>
          </fieldset>
        {/each}
      </div>

      {#if manualCopy}
        <textarea class="manual-copy" readonly rows="6" value={manualCopy} onfocus={(e) => e.currentTarget.select()}
        ></textarea>
      {/if}

      <footer>
        <p class="status" role="status">{status || (dirty ? 'Unsaved changes' : 'Matches saved config')}</p>
        <button type="button" onclick={copyJson}>Copy JSON</button>
        <button type="button" onclick={reset} disabled={!dirty}>Reset</button>
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
  select,
  input {
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
    width: min(23rem, calc(100vw - 2rem));
    max-height: calc(100vh - 2rem);
    display: flex;
    flex-direction: column;
    border: 1px solid #1b1a18;
    background: #fff;
    box-shadow: 0 8px 30px rgb(0 0 0 / 0.18);
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0.75rem 0;
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

  .hint {
    padding: 0.2rem 0.75rem 0.6rem;
    border-bottom: 1px solid #e4dfd5;
    color: #6b665e;
  }

  .rows {
    overflow-y: auto;
    padding: 0.25rem 0.75rem;
  }

  fieldset {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.35rem 0.75rem;
    margin: 0;
    padding: 0.55rem 0;
    border: 0;
    border-bottom: 1px solid #efebe4;
  }

  legend {
    float: left;
    grid-column: 1 / -1;
    padding: 0;
    font-weight: 600;
  }

  select {
    grid-column: 1 / -1;
    padding: 0.3rem;
    border: 1px solid #c9c2b5;
    background: #fff;
  }

  .weight {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .weight input {
    flex: 1;
    min-width: 0;
  }

  output {
    width: 2.25rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  .italic {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .manual-copy {
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
    border-top: 1px solid #e4dfd5;
  }

  .status {
    flex: 1 1 100%;
    color: #6b665e;
  }
</style>
