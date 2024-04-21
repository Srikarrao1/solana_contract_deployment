
import { Connection, PublicKey, TransactionInstruction, Signer,  Keypair, sendAndConfirmTransaction, SystemProgram, Transaction,    } from '@solana/web3.js';
import { createAccount, createAssociatedTokenAccount, createMint, getAccount, mintToChecked, transferChecked, burnChecked,closeAccount, setAuthority,approveChecked, revoke, TOKEN_PROGRAM_ID, burn, createBurnCheckedInstruction, MintLayout, TokenInstruction, TokenAccountNotFoundError, TokenError, getMint, NATIVE_MINT, getMinimumBalanceForRentExemptAccount, createInitializeAccountInstruction, createTransferInstruction, createCloseAccountInstruction } from '@solana/spl-token';


// 1) use build-in function
async function main() {
    const connection = new Connection("https:// api.devnet.solana.com", "confirmed");

    const feePayer = Keypair.generate();

    const mintAuthority = Keypair.generate();

    const randomGuy = Keypair.generate();



    let mintPublicKey = await createMint(connection, feePayer, mintAuthority.publicKey, mintAuthority.publicKey, 8)


    console.log("Mint PubKey", mintPublicKey.toBase58()) // Print the MINT pubkey

    let mintAccount = await getAccount(connection, mintPublicKey);

    let ata = await createAssociatedTokenAccount(
        connection,
        feePayer,
        mintPublicKey,
        mintAuthority.publicKey
    )

    let tokenAccountPubkey = ata;

    let tokenAccount = await getAccount(connection, tokenAccountPubkey);

    let tokenAmount = await connection.getTokenAccountBalance(tokenAccount.address);


    let txhash = await mintToChecked (
        connection,
        feePayer,
        mintPublicKey,
        tokenAccountPubkey,
        mintAuthority,
        1e8,
        8

    );

    txhash = await transferChecked(
        connection,
        feePayer,
        tokenAccountPubkey,
        mintPublicKey,
        tokenAccountPubkey,
        mintAuthority,
        1e8,
        8

    );

    txhash = await burnChecked(
        connection,
        feePayer,
        tokenAccountPubkey,
        mintPublicKey,
        mintAuthority,
        1e8,
        8
    );

    txhash = await closeAccount(
        connection,
        feePayer,
        tokenAccountPubkey,
        mintAuthority.publicKey,
        mintAuthority
    );

    txhash = await setAuthority(
        connection,
        feePayer,
        mintPublicKey,
        mintAuthority.publicKey,
        'Mint Tokens',
        randomGuy.publicKey
    )

    txhash = await approveChecked(
        connection,
        feePayer,
        mintPublicKey,
        tokenAccountPubkey,
        randomGuy.publicKey,
        mintAuthority,
        1e8,
        8
    );

    txhash = await revoke(
        connection,
        feePayer,
        tokenAccountPubkey,
        mintAuthority.publicKey
    );

    const auxAccount = Keypair.generate();
    const ACCOUNT_SIZE = 165;
    const amount = 100000000;


    let tx = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: mintAuthority.publicKey,
            newAccountPubkey: auxAccount.publicKey,
            space: ACCOUNT_SIZE,
            lamports: 
               (await getMinimumBalanceForRentExemptAccount(connection)) + amount,
               programId: TOKEN_PROGRAM_ID,


        }),

        createInitializeAccountInstruction(
            auxAccount.publicKey,
            NATIVE_MINT,
            mintAuthority.publicKey
        ),

        createTransferInstruction(
            auxAccount.publicKey, ata, mintAuthority.publicKey, amount
        ),

        createCloseAccountInstruction(
            auxAccount.publicKey,
            mintAuthority.publicKey,
            mintAuthority.publicKey
        )
    );

    let response = await connection.getParsedTokenAccountsByOwner(mintAuthority.publicKey, {
        mint: mintPublicKey,
    });
    
    console.log("Before:\n",response);


    
}

main().then(() => console.log("Done")).catch((err) => console.log(err));


