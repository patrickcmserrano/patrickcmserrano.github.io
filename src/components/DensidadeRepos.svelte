<script lang="ts">
  import densidade from '../data/densidade.json';

  type Repo = (typeof densidade.repos)[number];

  interface Props {
    /** Altura de cada barra, em unidades do viewBox. */
    barHeight?: number;
    /** Mostra a data do último commit à direita do rótulo. */
    showLast?: boolean;
  }

  let { barHeight = 18, showLast = true }: Props = $props();

  let showDormant = $state(false);

  const gap = 6;
  const padding = { top: 8, right: 12, bottom: 8, left: 8 };

  const labelFont = 12;
  const monospaceRatio = 0.62;

  const width = 900;
  const labelWidth =
    Math.max(...densidade.repos.map((r: Repo) => r.name.length)) *
      labelFont *
      monospaceRatio +
    16;
  const valueWidth = 46;
  const trackX = padding.left + labelWidth;
  const trackWidth = width - trackX - valueWidth - padding.right;

  const sorted = [...densidade.repos].sort(
    (a: Repo, b: Repo) =>
      Number(a.status === 'dormant') - Number(b.status === 'dormant') ||
      b.commits - a.commits
  );

  const visible = $derived(
    showDormant ? sorted : sorted.filter((r: Repo) => r.status !== 'dormant')
  );

  // Escala pelo maior repo ativo; o maior inativo é limitado à largura da trilha.
  const top = $derived(visible[0]);
  const max = $derived(top ? top.commits : 0);

  const height = $derived(
    padding.top +
      visible.length * (barHeight + gap) -
      gap +
      padding.bottom
  );

  const dormantCount = densidade.repos.filter(
    (r: Repo) => r.status === 'dormant'
  ).length;

  const rows = $derived(
    visible.map((repo: Repo, i: number) => ({
      ...repo,
      y: padding.top + i * (barHeight + gap),
      ratio: max > 0 ? Math.min(repo.commits / max, 1) : 0
    }))
  );

  const statusColor: Record<string, string> = {
    active: 'var(--color-primary-500)',
    recent: 'var(--color-primary-300)',
    dormant: '#94a3b8'
  };

  const statusLabel: Record<string, string> = {
    active: 'ativo',
    recent: 'recente',
    dormant: 'dormente'
  };

  const formatDate = (iso: string) =>
    iso.slice(8, 10) + '/' + iso.slice(5, 7) + '/' + iso.slice(0, 4);
</script>

<figure class="densidade">
  <div class="toolbar">
    <button
      type="button"
      class="toggle"
      aria-pressed={showDormant}
      onclick={() => (showDormant = !showDormant)}
    >
      {showDormant ? 'Ocultar inativos' : `Mostrar inativos (${dormantCount})`}
    </button>
  </div>

  <svg
    viewBox={`0 0 ${width} ${height}`}
    role="img"
    aria-label={`Commits por repositório, de ${max} a 1`}
    preserveAspectRatio="xMidYMid meet"
  >
    {#each rows as row (row.name)}
      <g>
        <text
          x={trackX - 10}
          y={row.y + barHeight / 2}
          text-anchor="end"
          dominant-baseline="central"
          class="label"
        >
          {row.name}
        </text>

        <rect
          x={trackX}
          y={row.y}
          width={trackWidth}
          height={barHeight}
          rx="3"
          class="track"
        />

        <rect
          x={trackX}
          y={row.y}
          width={Math.max(row.ratio * trackWidth, row.commits > 0 ? 2 : 0)}
          height={barHeight}
          rx="3"
          fill={statusColor[row.status]}
        >
          <title>{row.name}: {row.commits} commits ({statusLabel[row.status]})</title>
        </rect>

        <text
          x={width - padding.right}
          y={row.y + barHeight / 2}
          text-anchor="end"
          dominant-baseline="central"
          class="value"
        >
          {row.commits}
        </text>

        {#if showLast}
          <text
            x={trackX + trackWidth}
            y={row.y + barHeight / 2}
            text-anchor="end"
            class="meta"
          >
            {formatDate(row.last)}
          </text>
        {/if}
      </g>
    {/each}
  </svg>

  <figcaption class="caption">
    Commits de <strong>{densidade.author}</strong> por repositório, entre
    as três forjas. Contagem absoluta; a barra é proporcional ao maior valor
    ({top?.name}, {max}). Dados de {formatDate(densidade.generatedAt)}.
  </figcaption>
</figure>

<style>
  .densidade {
    margin: 0;
    width: 100%;
  }

  svg {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }

  .label {
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    fill: var(--app-text);
  }

  .value {
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-weight: 600;
    fill: var(--app-text);
  }

  .meta {
    font-size: 9px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    fill: var(--app-text);
    opacity: 0.45;
  }

  .track {
    fill: var(--color-surface-100);
    opacity: 0.5;
  }

  .caption {
    margin-top: 1rem;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--app-text);
    opacity: 0.7;
  }

  .toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.75rem;
  }

  .toggle {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.35rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid var(--color-surface-100);
    background: transparent;
    color: var(--app-text);
    opacity: 0.75;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s ease;
  }

  .toggle:hover {
    opacity: 1;
  }
</style>
