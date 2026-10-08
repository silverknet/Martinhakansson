<script lang="ts">
  import type { Education } from '../cv';
  import Entry from './Entry.svelte';

  let { entries }: { entries: Education[] } = $props();
</script>

<ul class="entries" role="list">
  {#each entries as entry (entry.institution + entry.degree)}
    <li>
      <Entry title={entry.institution} subtitle={entry.degree} period={entry.period}>
        <p>{entry.description}</p>
      </Entry>
    </li>
  {/each}
</ul>

<style>
  .entries {
    display: grid;
    gap: 1.75rem;
    list-style: none;
  }

  @media print {
    .entries {
      gap: 4.5mm;
    }
  }
</style>
