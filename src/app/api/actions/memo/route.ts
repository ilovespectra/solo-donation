import { NextRequest, NextResponse } from 'next/server';
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

// Helper function to handle CORS
const handleCors = (res: NextResponse) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
};

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl;
  const payload: ActionGetResponse = {
    icon: new URL("/solo.png", url.origin).toString(),
    label: "solo memo",
    description: "this is a memo action for solo",
    title: "memo action",
  };

  const res = NextResponse.json(payload);
  handleCors(res);
  return res;
};

export const POST = async (req: NextRequest) => {
  try {
    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      const res = new NextResponse('invalid "account" provided', {
        status: 400,
      });
      handleCors(res);
      return res;
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
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const res = NextResponse.json(payload);
    handleCors(res);
    return res;
  } catch (err) {
    const res = new NextResponse("an unknown error occurred", {
      status: 500,
    });
    handleCors(res);
    return res;
  }
};

export const OPTIONS = async (req: NextRequest) => {
  const res = new NextResponse(null, {
    status: 200,
  });
  handleCors(res);
  return res;
};
