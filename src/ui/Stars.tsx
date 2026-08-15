export function Stars({ rating, label }: { rating: number; label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={label ?? `${rating} 顆星，滿分 5 顆星`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 ${i < rating ? 'fill-brass-400' : 'fill-ivory-200'}`}
        >
          <path d="M10 1.6l2.6 5.2 5.8.85-4.2 4.1.99 5.75L10 14.8l-5.19 2.7.99-5.75-4.2-4.1 5.8-.85z" />
        </svg>
      ))}
    </span>
  )
}
