import {
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
} from "@solana/actions";
import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Transaction,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
    getAssociatedTokenAddress,
    createTransferCheckedInstruction,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "../../api/actions/donate/const";

// Define the SPL Token Mint Address
const SPL_TOKEN_MINT_ADDRESS = new PublicKey("Ds52CDgqdWbTWsua1hgT3AuSSy4FNx2Ezge1br3jQ14a");

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...ACTIONS_CORS_HEADERS,
};

export const GET = async (req: Request) => {
    try {
        const requestUrl = new URL(req.url);
        const { toPubkey } = validatedQueryParams(requestUrl);

        const baseHref = new URL(
            `/api/actions/transfer-spl?to=${toPubkey.toBase58()}`,
            requestUrl.origin
        ).toString();

        const payload: ActionGetResponse = {
            title: "transfer dean tokens",
            icon: new URL("/senddean.png", requestUrl.origin).toString(),
            description: "transfer dean tokens to solo.",
            label: "transfer",
            links: {
                actions: [
                    {
                        label: "send $dean",
                        href: `${baseHref}&amount={amount}`,
                        parameters: [
                            {
                                name: "amount",
                                label: "custom amount",
                                required: true,
                            },
                        ],
                    },
                ],
            },
        };

        return new Response(JSON.stringify(payload), {
            headers: CORS_HEADERS,
        });
    } catch (err) {
        console.error(err);
        let message = "an unknown error occurred";
        if (typeof err == "string") message = err;
        return new Response(message, {
            status: 400,
            headers: CORS_HEADERS,
        });
    }
};

// Ensure CORS preflight requests are handled
export const OPTIONS = (req: Request) => {
    return new Response(null, {
        headers: CORS_HEADERS,
    });
};

export const POST = async (req: Request) => {
    try {
        const requestUrl = new URL(req.url);
        const { amount, toPubkey } = validatedQueryParams(requestUrl);

        const body: ActionPostRequest = await req.json();

        // validate the client provided input
        let account: PublicKey;
        try {
            account = new PublicKey(body.account);
        } catch (err) {
            return new Response('invalid "account" provided', {
                status: 400,
                headers: CORS_HEADERS,
            });
        }

        const connection = new Connection(
            process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("mainnet-beta")
        );

        const transaction = new Transaction();
        transaction.feePayer = account;

        // Get the associated token addresses
        const fromTokenAddress = await getAssociatedTokenAddress(SPL_TOKEN_MINT_ADDRESS, account);
        const toTokenAddress = await getAssociatedTokenAddress(SPL_TOKEN_MINT_ADDRESS, toPubkey);

        // Add the transfer instruction
        transaction.add(
            createTransferCheckedInstruction(
                fromTokenAddress,
                SPL_TOKEN_MINT_ADDRESS,
                toTokenAddress,
                account,
                amount,
                5, // assuming 5 decimal places for the SPL token
                [],
                TOKEN_PROGRAM_ID
            )
        );

        transaction.recentBlockhash = (
            await connection.getLatestBlockhash()
        ).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: `Send ${amount} tokens to ${toPubkey.toBase58()}`,
            },
        });

        return new Response(JSON.stringify(payload), {
            headers: CORS_HEADERS,
        });
    } catch (err) {
        console.error(err);
        let message = "an unknown error occurred";
        if (typeof err == "string") message = err;
        return new Response(message, {
            status: 400,
            headers: CORS_HEADERS,
        });
    }
};

function validatedQueryParams(requestUrl: URL) {
    let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
    let amount: number = DEFAULT_SOL_AMOUNT;

    try {
        if (requestUrl.searchParams.get("to")) {
            toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
        }
    } catch (err) {
        throw "invalid input query parameter: to";
    }

    try {
        if (requestUrl.searchParams.get("amount")) {
            amount = parseFloat(requestUrl.searchParams.get("amount")!);
        }

        if (amount <= 0) throw "amount is too small";
    } catch (err) {
        throw "invalid input query parameter: amount";
    }

    return {
        amount,
        toPubkey,
    };
}
