import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    MEMO_PROGRAM_ID,
    createPostResponse,
  } from "@solana/actions";
  import { Connection } from "@solana/web3.js";
  import { clusterApiUrl } from "@solana/web3.js";
  import {
    ComputeBudgetProgram,
    PublicKey,
    Transaction,
    TransactionInstruction,
  } from "@solana/web3.js";
  
  // Extend Event interface to include FetchEvent properties
  interface FetchEvent extends Event {
    readonly request: Request;
    respondWith(response: Promise<Response> | Response): void;
  }
  
  // AddEventListener function with correct type annotations
  declare function addEventListener(
    type: "fetch",
    listener: (event: FetchEvent) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  
  // Event listener for 'fetch' event
  addEventListener("fetch", (event: FetchEvent) => {
    event.respondWith(handleRequest(event.request));
  });
  
  // HandleRequest function to process incoming requests
  async function handleRequest(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      // Handle preflight requests
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }
  
    if (request.method === "GET") {
      // Handle GET requests
      const payload: ActionGetResponse = {
        icon: new URL("/solo.png", new URL(request.url).origin).toString(),
        label: "solo memo",
        description: "this is a memo action for solo",
        title: "memo action",
      };
  
      return new Response(JSON.stringify(payload), {
        headers: {
          ...ACTIONS_CORS_HEADERS,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  
    if (request.method === "POST") {
      // Handle POST requests
      try {
        const body: ActionPostRequest = await request.json();
  
        let account: PublicKey;
        try {
          account = new PublicKey(body.account);
        } catch (err) {
          return new Response('invalid "account" provided', {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
          });
        }
  
        const transaction = new Transaction();
  
        transaction.add(
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 1000,
          }),
  
          new TransactionInstruction({
            programId: new PublicKey(MEMO_PROGRAM_ID),
            data: Buffer.from("this is a simple message", "utf8"),
            keys: [],
          })
        );
  
        transaction.feePayer = account;
  
        const payload: ActionPostResponse = await createPostResponse({
          fields: {
            transaction,
          },
          // signers: []
        });
  
        const connection = new Connection(clusterApiUrl("devnet"));
        transaction.recentBlockhash = (
          await connection.getLatestBlockhash()
        ).blockhash;
  
        return new Response(JSON.stringify(payload), {
          headers: {
            ...ACTIONS_CORS_HEADERS,
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response("an unknown error occurred", { status: 404 });
      }
    }
  
    // Handle unsupported methods
    return new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
      headers: {
        Allow: "GET, POST, OPTIONS",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  