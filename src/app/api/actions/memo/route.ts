import {
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    MEMO_PROGRAM_ID,
    ActionGetResponse,
    ActionPostRequest,
  } from "@solana/actions";
  import {
    clusterApiUrl,
    ComputeBudgetProgram,
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
  } from "@solana/web3.js";
  import { NextRequest, NextResponse } from 'next/server';
  
  export const GET = async (req: NextRequest) => {
    const payload: ActionGetResponse = {
      title: "Actions Example - Simple On-chain Memo",
      icon: new URL("/solana_devs.jpg", req.nextUrl.origin).toString(),
      description: "Send a message on-chain using a Memo",
      label: "Send Memo",
    };
  
    return NextResponse.json(payload);
  };
  
  export const OPTIONS = async (req: NextRequest) => {
    // OPTIONS method is automatically handled by Next.js for CORS, no need to manually set headers
    return NextResponse.json({});
  };
  
  export const POST = async (req: NextRequest) => {
    try {
      const body: ActionPostRequest = await req.json();
  
      let account: PublicKey;
      try {
        account = new PublicKey(body.account);
      } catch (err) {
        return NextResponse.json({ error: 'Invalid "account" provided' }, {
          status: 400,
        });
      }
  
      const connection = new Connection(
        process.env.SOLANA_RPC! || clusterApiUrl("devnet"),
      );
  
      const transaction = new Transaction().add(
        // note: `createPostResponse` requires at least 1 non-memo instruction
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 1000,
        }),
        new TransactionInstruction({
          programId: new PublicKey(MEMO_PROGRAM_ID),
          data: Buffer.from("this is a simple memo message2", "utf8"),
          keys: [],
        }),
      );
  
      // set the end user as the fee payer
      transaction.feePayer = account;
  
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
  
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          message: "Post this memo on-chain",
        },
        // no additional signers are required for this transaction
        // signers: [],
      });
  
      return NextResponse.json(payload);
    } catch (err) {
      console.log(err);
      let message = "An unknown error occurred";
      if (typeof err == "string") message = err;
      return NextResponse.json({ error: message }, {
        status: 400,
      });
    }
  };
  