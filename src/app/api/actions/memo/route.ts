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
  import { NextApiRequest, NextApiResponse } from 'next';
  
  // Helper function to handle CORS
  const handleCors = (res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  };
  
  const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    handleCors(res);
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    } else if (req.method === 'GET') {
      return handleGet(req, res);
    } else if (req.method === 'POST') {
      return await handlePost(req, res);
    } else {
      res.setHeader('Allow', 'GET, POST, OPTIONS');
      return res.status(405).end('Method Not Allowed');
    }
  };
  
  const handleGet = (req: NextApiRequest, res: NextApiResponse) => {
    const url = req.url ? new URL(req.url, `http://${req.headers.host}`) : new URL('http://example.com');
    const payload: ActionGetResponse = {
      icon: new URL("/solo.png", url.origin).toString(),
      label: "solo memo",
      description: "this is a memo action for solo",
      title: "memo action",
    };
  
    return res.status(200).json(payload);
  };
  
  const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const body: ActionPostRequest = req.body;
  
      let account: PublicKey;
      try {
        account = new PublicKey(body.account);
      } catch (err) {
        return res.status(400).json('invalid "account" provided');
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
  
      return res.status(200).json(payload);
    } catch (err) {
      return res.status(500).json("an unknown error occurred");
    }
  };
  
  export default handler;
  