"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../app/components/ui/card";
import { SolanaQRCode } from "../app/components/qr-code";
import { Button } from "../app/components/ui/button";
import Link from "next/link";
import { siteConfig } from "../config/site";
import { useEffect, useState } from "react";

export default function Pages() {
  const apiPath = "/api/actions/transfer-sol";
  const [apiEndpoint, setApiEndpoint] = useState("");

  useEffect(() => {
    setApiEndpoint(new URL(apiPath, window.location.href).toString());

    return () => {
      setApiEndpoint(new URL(apiPath, window.location.href).toString());
    };
  }, []);

  return (
    <section
      id="action"
      className={
        "container space-y-12 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      }
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          donate sol to solo
        </h2>
      </div>

      <Card className="group-hover:border-primary size-[400px] rounded overflow-hidden text-center flex items-center justify-center w-min mx-auto">
        <SolanaQRCode
          url={apiPath}
          color="white"
          background="black"
          size={400}
          className="rounded-lg overflow-clip min-w-[400px]"
        />
      </Card>

      <div className="mx-auto text-center md:max-w-[58rem]">
      </div>

      <Card className="group-hover:border-primary">
        <CardHeader>
          <CardTitle className="space-y-3">action endpoint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-muted-foreground">
            <Link
              href={apiEndpoint}
              target="_blank"
              className="underline hover:text-primary"
            >
              {apiEndpoint}
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
