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
    padding-top: 0.9rem;
  }

  .section-title {
    margin-bottom: 1.5rem;
    font-family: var(--section-title-font);
    font-weight: var(--section-title-weight);
    font-style: var(--section-title-style);
    font-size: clamp(1.25rem, 2vw, 1.375rem);
    line-height: 1.2;
    letter-spacing: -0.015em;
    text-wrap: balance;
    color: var(--ink);
  }

  @media print {
    .section {
      padding-top: 2mm;
    }

    .section-title {
      margin-bottom: 3.5mm;
      font-size: 13pt;
      break-after: avoid;
    }
  }
</style>
