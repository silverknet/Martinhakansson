<script lang="ts">
  import type { SkillGroup } from '../cv';

  let { groups }: { groups: SkillGroup[] } = $props();
</script>

<div class="groups">
  {#each groups as group (group.label)}
    <div class="group">
      <h3 class="label">{group.label}</h3>
      <ul role="list">
        {#each group.items as item}
          <li>{item}</li>
        {/each}
      </ul>
    </div>
  {/each}
</div>

<style>
  .groups {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
    gap: 1.75rem 2rem;
  }

  .label {
    margin-bottom: 0.45rem;
    font-family: var(--labels-font);
    font-weight: var(--labels-weight);
    font-style: var(--labels-style);
    font-size: 0.6875rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  ul {
    list-style: none;
    font-size: 0.9375rem;
    line-height: 1.75;
  }

  @media print {
    .groups {
      gap: 4.5mm;
    }

    .group {
      break-inside: avoid;
    }

    .label {
      margin-bottom: 1mm;
      font-size: 7.5pt;
    }

    ul {
      font-size: 9.5pt;
      line-height: 1.6;
    }
  }
</style>
