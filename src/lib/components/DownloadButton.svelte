<script lang="ts">
  let { fileName, showPrint = true }: { fileName: string; showPrint?: boolean } = $props();

  // The PDF is generated from this page at build time (scripts/build.js),
  // and served on demand by the dev server.
  const href = $derived(`${import.meta.env.BASE_URL}${fileName}`);
</script>

<div class="actions no-print">
  <a class="button primary" {href} download={fileName} type="application/pdf">
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M8 2v8.5M4.5 7 8 10.5 11.5 7M3 13.5h10" />
    </svg>
    Download PDF
  </a>
  {#if showPrint}
    <button class="button secondary" type="button" onclick={() => window.print()}>Print</button>
  {/if}
</div>

<style>
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
  }

  .button {
    display: inline-flex;
    align-items: center;
    gap: 0.55em;
    min-height: 2.75rem;
    padding: 0.55rem 1.1rem;
    border: 1px solid var(--ink);
    border-radius: 0;
    font: inherit;
    font-size: 0.9375rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1.2;
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease;
  }

  .primary {
    background: var(--ink);
    color: var(--paper);
  }

  .primary:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }

  .secondary {
    background: transparent;
    color: var(--ink);
    border-color: var(--rule);
  }

  .secondary:hover {
    border-color: var(--ink);
  }

  svg {
    flex: none;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: square;
  }
</style>
