import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { TriangleAlertIcon } from "lucide-react";

export function DevnetAlert() {
  return (
    <Alert variant={"caution"}>
      <TriangleAlertIcon className="size-5" />
      <AlertTitle>devnet only</AlertTitle>
      <AlertDescription>
        this example action is configured to run on Solana&apos;s devnet. Make
        your your wallet is selected to devnet when testing this transaction.
      </AlertDescription>
    </Alert>
  );
}
