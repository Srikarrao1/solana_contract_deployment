
import { Connection, PublicKey, TransactionInstruction,  Keypair, sendAndConfirmTransaction, SystemProgram, Transaction,    } from '@solana/web3.js';
import { createAssociatedTokenAccount, createMint, getAccount, mintToChecked, transferChecked, burnChecked,closeAccount, setAuthority,approveChecked, revoke, TOKEN_PROGRAM_ID, burn, createBurnCheckedInstruction, MintLayout, TokenInstruction, TokenAccountNotFoundError, TokenError, getMint, NATIVE_MINT, getMinimumBalanceForRentExemptAccount, createInitializeAccountInstruction, createTransferInstruction, createCloseAccountInstruction, AuthorityType, closeAccountInstructionData } from '@solana/spl-token';
import { Signer } from 'crypto';


async function main() {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");


    // let secret_key = Uint8Array.from([
    //     202, 171, 192, 129, 150, 189, 204, 241, 142, 71, 205, 2, 81, 97, 2, 176, 48,
    //     81, 45, 1, 96, 138, 220, 132, 231, 131, 120, 77, 66, 40, 97, 172, 91, 245, 84,
    //     221, 157, 190, 9, 145, 176, 130, 25, 43, 72, 107, 190, 229, 75, 88, 191, 136,
    //     7, 167, 109, 91, 170, 164, 186, 15, 142, 36, 12, 23,
    // ]);

    // let keyPair = Keypair.fromSecretKey(secret_key);
    // console.log(`Public Key: ${keyPair.publicKey}`);

    const feePayer = await Keypair.generate();

    const mintAuthority = Keypair.generate();
    console.log("Author address is : ", mintAuthority.publicKey);

    const randomGuy = Keypair.generate();



    let mintPublicKey = await createMint(connection, feePayer, mintAuthority.publicKey, mintAuthority.publicKey, 8)

    console.log("Creating Token Mint ... ", mintPublicKey);


    console.log("Mint PubKey", mintPublicKey.toBase58()) // Print the MINT pubkey

    let mintAccount = await getAccount(connection, mintPublicKey);

    let ata = await createAssociatedTokenAccount(
        connection,
        feePayer,
        mintPublicKey,
        mintAuthority.publicKey
    )

    let tokenAccountPubkey = ata;

    const tokenAccount = await connection.getParsedTokenAccountsByOwner(mintAuthority.publicKey, {
        programId: TOKEN_PROGRAM_ID,
    });
    if (!tokenAccount?.value || !tokenAccount.value.length) {
        throw 'No Token Account Found';
    }
    console.log('Token Account', tokenAccount.value[0].pubkey.toBase58());

    const balance = tokenAccount.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0;
    console.log(`Balance: ${balance}`);


    let txhash = await mintToChecked (
        connection,
        feePayer,
        mintPublicKey,
        tokenAccountPubkey,
        mintAuthority,
        1e8,
        8

    );

    console.log("Minted tokens to associated token account: ", txhash);

    


    if (balance >= 1e8) {
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
    console.log("Transferred tokens: ", txhash)
} else {
    console.log("Insufficient balance");
}

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
        AuthorityType.MintTokens,
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

    async function getTokensBalanceSpl(connection, tokenAccountPubkey) {
        // const info = await getAccount(connection, tokenAccount);
        // const amount = Number(info.amount);
        // const mint = await getMint(connection, info.mint);
        // const balance = amount / (10 ** mint.decimals);
        // console.log("Balance using Solana-web3.js", balance);
        // return balance;

        const tokenAccount = await connection.getParsedTokenAccountsByOwner(tokenAccountPubkey, {
            programId: TOKEN_PROGRAM_ID,
        });

        if (!tokenAccount?.value || !tokenAccount.value.length) {
            throw new Error('No Token Account Founf');
        }
        return tokenAccount.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0;

        
    }

    getTokensBalanceSpl(connection, tokenAccount.value).catch(err => console.log(err));



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


