"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../app/components/ui/card";
import { SolanaQRCode } from "../app/components/qr-code";
import { Button } from "../app/components/ui/button";
import Link from "next/link";
import { siteConfig } from "../config/site";
import { useEffect, useState } from "react";
import { SiteFooter } from "./components/site-footer";

export default function Pages() {
  const apiPath = "/api/actions/donate";
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
      <center>
      <br></br>
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center">
          <h1 className="font-heading text-3xl mt-5 mb-5 leading-[1.1] sm:text-3xl md:text-6xl">
            sol for solo
          </h1>
          <br></br>
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

        <div className="mx-auto text-center md:max-w-[58rem]"></div>

        <Card className="group-hover:border-primary">
          <CardHeader>
            <CardTitle className="space-y-3 mb-5">action endpoint:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              <Link href={apiEndpoint} target="_blank" className="underline hover:text-primary">
                {apiEndpoint}
              </Link>
            </p>
          </CardContent>
          <br></br>
          <div className="mx-auto text-center md:max-w-[58rem]">
            <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              {" "}
              <Button variant={"link"} asChild>
                <Link href={siteConfig.links.github} target="_blank" className="underline text-gray-500">
                click here the full source code for this action on github
                </Link>
              </Button>{" "}
              <br></br>
              <br></br>
            </p>
          </div>
        </Card>
        <SiteFooter />
      </center>
    </section>
  );
}
