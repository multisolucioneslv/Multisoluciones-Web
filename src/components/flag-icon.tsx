type FlagIconProps = {
  locale: string;
  className?: string;
};

const US_STRIPES = 13;
const US_STRIPE_HEIGHT = 16 / US_STRIPES;
const US_RED = '#B22234';
const US_BLUE = '#3C3B6E';

const US_STAR_ROWS = [
  { y: 1.15, xs: [0.9, 2.5, 4.1, 5.7, 7.3, 8.9] },
  { y: 2.3, xs: [1.7, 3.3, 4.9, 6.5, 8.1] },
  { y: 3.45, xs: [0.9, 2.5, 4.1, 5.7, 7.3, 8.9] },
  { y: 4.6, xs: [1.7, 3.3, 4.9, 6.5, 8.1] },
  { y: 5.75, xs: [0.9, 2.5, 4.1, 5.7, 7.3, 8.9] }
];

function UnitedStates({ className }: { className: string }) {
  const redStripes = Array.from({ length: US_STRIPES }, (_, index) => index).filter((index) => index % 2 === 0);

  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#FFFFFF" />
      {redStripes.map((index) => (
        <rect key={index} x="0" y={index * US_STRIPE_HEIGHT} width="24" height={US_STRIPE_HEIGHT} fill={US_RED} />
      ))}
      <rect x="0" y="0" width="9.6" height={7 * US_STRIPE_HEIGHT} fill={US_BLUE} />
      {US_STAR_ROWS.flatMap((row) =>
        row.xs.map((x) => <circle key={`${row.y}-${x}`} cx={x} cy={row.y} r="0.42" fill="#FFFFFF" />)
      )}
    </svg>
  );
}

function Mexico({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="8" height="16" fill="#006847" />
      <rect x="8" y="0" width="8" height="16" fill="#FFFFFF" />
      <rect x="16" y="0" width="8" height="16" fill="#CE1126" />
      <circle cx="12" cy="8" r="2.1" fill="none" stroke="#7A5A38" strokeWidth="0.55" />
      <path d="M12 6.4c1.1 0 1.9 0.7 1.9 1.6 0 0.9-0.8 1.6-1.9 1.6s-1.9-0.7-1.9-1.6c0-0.9 0.8-1.6 1.9-1.6z" fill="#006847" />
    </svg>
  );
}

const KR_RED = '#CD2E3A';
const KR_BLUE = '#0047A0';
const KR_BLACK = '#000000';
const KR_DIAGONAL_ANGLE = 33.6900675;
const KR_TRIGRAM_HALF_LENGTH = 2;
const KR_TRIGRAM_BAR = 2 / 3;
const KR_TRIGRAM_GAP = 1 / 3;
const KR_TRIGRAM_TOP = -4 / 3;
const KR_TRIGRAM_STEP = KR_TRIGRAM_BAR + KR_TRIGRAM_GAP;
const KR_TRIGRAM_SPLIT_HALF = (KR_TRIGRAM_HALF_LENGTH * 2 - KR_TRIGRAM_GAP) / 2;

type KrTrigramPattern = [boolean, boolean, boolean];

const KR_TRIGRAMS: { x: number; y: number; rotate: number; split: KrTrigramPattern }[] = [
  { x: 5.899, y: 3.9325, rotate: -56.3099325, split: [false, false, false] },
  { x: 18.101, y: 3.9325, rotate: 56.3099325, split: [true, true, true] },
  { x: 5.899, y: 12.0675, rotate: 56.3099325, split: [true, false, true] },
  { x: 18.101, y: 12.0675, rotate: -56.3099325, split: [false, true, false] }
];

function KrTrigram({ split }: { split: KrTrigramPattern }) {
  return (
    <>
      {split.map((isSplit, index) => {
        const y = KR_TRIGRAM_TOP + index * KR_TRIGRAM_STEP;

        if (!isSplit) {
          return (
            <rect
              key={index}
              x={-KR_TRIGRAM_HALF_LENGTH}
              y={y}
              width={KR_TRIGRAM_HALF_LENGTH * 2}
              height={KR_TRIGRAM_BAR}
              fill={KR_BLACK}
            />
          );
        }

        return (
          <g key={index} fill={KR_BLACK}>
            <rect x={-KR_TRIGRAM_HALF_LENGTH} y={y} width={KR_TRIGRAM_SPLIT_HALF} height={KR_TRIGRAM_BAR} />
            <rect
              x={KR_TRIGRAM_HALF_LENGTH - KR_TRIGRAM_SPLIT_HALF}
              y={y}
              width={KR_TRIGRAM_SPLIT_HALF}
              height={KR_TRIGRAM_BAR}
            />
          </g>
        );
      })}
    </>
  );
}

function SouthKorea({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#FFFFFF" />
      <g transform={`rotate(${KR_DIAGONAL_ANGLE} 12 8)`}>
        <path d="M8 8 A4 4 0 0 1 16 8 A2 2 0 0 0 12 8 A2 2 0 0 1 8 8 Z" fill={KR_RED} />
        <path d="M8 8 A4 4 0 0 0 16 8 A2 2 0 0 1 12 8 A2 2 0 0 0 8 8 Z" fill={KR_BLUE} />
        <circle cx="12" cy="6" r="1" fill={KR_BLUE} />
        <circle cx="12" cy="10" r="1" fill={KR_RED} />
      </g>
      {KR_TRIGRAMS.map((trigram) => (
        <g
          key={`${trigram.x}-${trigram.y}`}
          transform={`translate(${trigram.x} ${trigram.y}) rotate(${trigram.rotate})`}
        >
          <KrTrigram split={trigram.split} />
        </g>
      ))}
    </svg>
  );
}

function Brazil({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#009739" />
      <path d="M12 1.4 L21.8 8 L12 14.6 L2.2 8 Z" fill="#FFDF00" />
      <circle cx="12" cy="8" r="3.5" fill="#002776" />
      <ellipse cx="12" cy="8" rx="3.4" ry="0.95" fill="#FFFFFF" transform="rotate(-11 12 8)" />
    </svg>
  );
}

const FLAGS: Record<string, (props: { className: string }) => React.JSX.Element> = {
  en: UnitedStates,
  es: Mexico,
  ko: SouthKorea,
  pt: Brazil
};

export function FlagIcon({ locale, className = '' }: FlagIconProps) {
  const Flag = FLAGS[locale];

  if (!Flag) {
    return null;
  }

  return <Flag className={`h-4 w-6 shrink-0 rounded-[3px] ring-1 ring-slate-300 dark:ring-slate-600 ${className}`} />;
}
