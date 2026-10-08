<script lang="ts">
  import type { Period } from '../cv';
  import { formatDate } from '../format';

  let { period }: { period: Period } = $props();
</script>

<time datetime={period.start}>{formatDate(period.start)}</time>{#if period.end === 'present'}
  {' – Present'}
{:else if period.end}
  {' – '}<time datetime={period.end}>{formatDate(period.end)}</time>
{/if}
