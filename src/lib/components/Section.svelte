<script lang="ts">
  import type { Snippet } from 'svelte';

  let { id, title, children }: { id: string; title: string; children: Snippet } = $props();
</script>

<section class="section" aria-labelledby="{id}-title">
  <h2 class="section-title" id="{id}-title">{title}</h2>
  {@render children()}
</section>

<style>
  .section {
    border-top: 1px solid var(--ink);
    padding-top: 0.85rem;
  }

  .section-title {
    margin-bottom: 1.25rem;
    font-family: var(--section-title-font);
    font-weight: var(--section-title-weight);
    font-style: var(--section-title-style);
    font-size: clamp(1.375rem, 2.6vw, 1.625rem);
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: var(--ink);
  }

  @media print {
    .section {
      padding-top: 2mm;
    }

    .section-title {
      margin-bottom: 3mm;
      font-size: 14pt;
      break-after: avoid;
    }
  }
</style>
