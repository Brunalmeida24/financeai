import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  emoji: string;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Selo de confiança — usado em landing, login, register, footer.
 * Visual acolhedor para o usuário se sentir seguro ao cadastrar.
 */
export function TrustBadge({
  emoji,
  title,
  description,
  className,
}: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-xl glass",
        className
      )}
    >
      <div className="text-2xl leading-none mt-0.5" aria-hidden>
        {emoji}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
