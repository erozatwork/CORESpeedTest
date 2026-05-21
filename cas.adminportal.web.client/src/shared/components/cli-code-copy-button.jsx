import { Button } from "@shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import { Check } from "lucide-react";
import { trackBlockCliCopy } from "@shared/analytics";
import { useConfig } from "@shared/hooks";
import { useCopyToClipboard } from "@shared/hooks";

export function CliCodeCopyButton({ name }) {
  const { copy, copied } = useCopyToClipboard();
  const [config] = useConfig();
  const packageManager = config.packageManager || "pnpm";
  const commands = {
    pnpm: `pnpm dlx shadcn@latest add @reui/${name}`,
    npm: `npx shadcn@latest add @reui/${name}`,
    yarn: `npx shadcn@latest add @reui/${name}`,
    bun: `bunx --bun shadcn@latest add @reui/${name}`,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-7.5 text-muted-foreground w-36 justify-start"
            title="Copy CLI command"
            onClick={() => {
              copy(commands[packageManager]);
              // Track the CLI command copy event
              trackBlockCliCopy(name, packageManager);
            }}
          >
            {copied ? <Check className="text-secondary-foreground" /> : ">_"}
            <span className="truncate">{commands[packageManager]}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{commands[packageManager]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
