import * as React from "react";

import { siteConfig } from "../../config/site";
import { cn } from "../lib/utils";
import { Icons } from "../components/icons";
// import { ThemeModeToggle } from "../components/theme-mode-toggle";
import { Button, buttonVariants } from "../components/ui/button";
import Link from "next/link";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            <i>built using {" "}</i>
            <a
              href={siteConfig.links.ogtwitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              <i>@nickfrosty</i>
            </a>
            {" "}
            <a
              href={siteConfig.links.oggithub}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
            <i>&apos;s actions repo</i>
            </a>
            
          </p>
        </div>
        <nav className="flex items-center gap-2">
          <Button asChild>
            <Link
              target="_blank"
              href={siteConfig.links.ogdocs}
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4",
              )}
            >
              <i>actions docs</i>
            </Link>
          </Button>

         
        </nav>
      </div>
    </footer>
  );
}
