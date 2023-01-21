// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction,
    SystemProgram,
  } = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        160,  20, 189, 212, 129, 188, 171, 124,  20, 179,  80,
         27, 166,  17, 179, 198, 234,  36, 113,  87,   0,  46,
        186, 250, 152, 137, 244,  15,  86, 127,  77,  97, 170,
         44,  57, 126, 115, 253,  11,  60,  90,  36, 135, 177,
        185, 231,  46, 155,  62, 164, 128, 225, 101,  79,  69,
        101, 154,  24,  58, 214, 219, 238, 149,  86
      ]            
);

  // Create a new keypair
  const newPair = new Keypair();
  
  // Exact the public and private key from the keypair
  const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
  const privateKey = newPair._keypair.secretKey;
  
  // Connect to the Devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
  console.log("Public Key of the generated keypair", publicKey);
  
  // Get the wallet balance from a given private key
  const getWalletBalance = async () => {
    try {
      // Connect to the Devnet
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      // console.log("Connection object is:", connection);
  
      // Make a wallet (keypair) from privateKey and get its balance
      const myWallet = await Keypair.fromSecretKey(privateKey);
      const walletBalance = await connection.getBalance(
        new PublicKey(newPair.publicKey)
      );
      console.log(
        `Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`
      );
    } catch (err) {
      console.log(err);
    }
  };
  
  const airDropSol = async () => {
    try {
      // Connect to the Devnet and make a wallet from privateKey
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const myWallet = await Keypair.fromSecretKey(privateKey);
  
      // Request airdrop of 2 SOL to the wallet
      console.log("Airdropping some SOL to my wallet!");
      const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(myWallet.publicKey),
        2 * LAMPORTS_PER_SOL
      );
      
      await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
      console.log(err);
    }
  };
  
  const theirWallet = async () => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const walletBalance = await connection.getBalance(
        new PublicKey(newPair.publicKey)
      );
  
      const to = Keypair.generate();

      console.log("Airdrop completed for the Sender account");

      // Send money from "from" wallet and into "to" wallet
      var transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey: to.publicKey,
          lamports: walletBalance / 2,
        })
      );
  
      // Sign transaction
      var signature = await sendAndConfirmTransaction(
        connection, 
        transaction, 
        [newPair,]
        
        );

      console.log("Signature is ", signature);
      const theirWalletBalance = await connection.getBalance(
        new PublicKey(to.publicKey)
      );
  
      console.log(`Their wallet balance: ${parseInt(theirWalletBalance) / LAMPORTS_PER_SOL} SOL`
      );
      
    } catch (err) {
      console.log(err);
    }
  };
  
  // Show the wallet balance before and after airdropping SOL
  const mainFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
    await theirWallet();
  };
  
  mainFunction();