// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card";
// import { SolanaQRCode } from "@/src/app/components/qr-code";
// import { Button } from "@/src/app/components/ui/button";
// import Link from "next/link";
// import { siteConfig } from "@/src/config/site";
// import { useEffect, useState } from "react";

// export default function Pages() {
//   const apiPath = "/api/actions/transfer-spl";
//   const [apiEndpoint, setApiEndpoint] = useState("");

//   useEffect(() => {
//     setApiEndpoint(new URL(apiPath, window.location.href).toString());

//     return () => {
//       setApiEndpoint(new URL(apiPath, window.location.href).toString());
//     };
//   }, []);

//   return (
//     <section
//       id="action"
//       className={
//         "container space-y-12 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
//       }
//     >
//       <center>
//       <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center">
//         <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
//           transfer dean tokens
//         </h2>
//         <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
//           the following example demonstrates how to transfer spl tokens using an
//           action and the spl token program.
//         </p>
//       </div>

//       <Card className="group-hover:border-primary size-[400px] rounded overflow-hidden text-center flex items-center justify-center w-min mx-auto">
//         <SolanaQRCode
//           url={apiPath}
//           color="white"
//           background="black"
//           size={400}
//           className="rounded-lg overflow-clip min-w-[400px]"
//         />
//       </Card>

//       {/* <div className="mx-auto text-center md:max-w-[58rem]">
//         <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
//           view the{" "}
//           <Button variant={"link"} asChild>
//             <Link
//               href={${siteConfig.links.oggithub}/src/app${apiPath}/route.ts}
//               target="_blank"
//             >
//               source code for this sample action
//             </Link>
//           </Button>{" "}
//           on github.
//         </p>
//       </div> */}

//       <Card className="group-hover:border-primary">
//         <CardHeader>
//           <CardTitle className="space-y-3">action endpoint</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <p className="text-muted-foreground">
//             <Link
//               href={apiEndpoint}
//               target="_blank"
//               className="underline hover:text-primary"
//             >
//               {apiEndpoint}
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//       </center>
//     </section>
//   );
// }