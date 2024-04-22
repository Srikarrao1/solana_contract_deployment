"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
function main() {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function () {
        function getTokensBalanceSpl(connection, tokenAccountPubkey) {
            var _a, _b, _c, _d, _e, _f, _g;
            return __awaiter(this, void 0, void 0, function () {
                var tokenAccount;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0: return [4 /*yield*/, connection.getParsedTokenAccountsByOwner(tokenAccountPubkey, {
                                programId: spl_token_1.TOKEN_PROGRAM_ID,
                            })];
                        case 1:
                            tokenAccount = _h.sent();
                            if (!(tokenAccount === null || tokenAccount === void 0 ? void 0 : tokenAccount.value) || !tokenAccount.value.length) {
                                throw new Error('No Token Account Founf');
                            }
                            return [2 /*return*/, (_g = (_f = (_e = (_d = (_c = (_b = (_a = tokenAccount.value[0]) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.parsed) === null || _d === void 0 ? void 0 : _d.info) === null || _e === void 0 ? void 0 : _e.tokenAmount) === null || _f === void 0 ? void 0 : _f.uiAmount) !== null && _g !== void 0 ? _g : 0];
                    }
                });
            });
        }
        var connection, feePayer, mintAuthority, randomGuy, mintPublicKey, mintAccount, ata, tokenAccountPubkey, tokenAccount, balance, txhash, auxAccount, ACCOUNT_SIZE, amount, tx, _h, _j, _k, _l, response;
        var _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    connection = new web3_js_1.Connection("https://api.devnet.solana.com", "confirmed");
                    return [4 /*yield*/, web3_js_1.Keypair.generate()];
                case 1:
                    feePayer = _o.sent();
                    mintAuthority = web3_js_1.Keypair.generate();
                    console.log("Author address is : ", mintAuthority.publicKey);
                    randomGuy = web3_js_1.Keypair.generate();
                    return [4 /*yield*/, (0, spl_token_1.createMint)(connection, feePayer, mintAuthority.publicKey, mintAuthority.publicKey, 8)];
                case 2:
                    mintPublicKey = _o.sent();
                    console.log("Creating Token Mint ... ", mintPublicKey);
                    console.log("Mint PubKey", mintPublicKey.toBase58()); // Print the MINT pubkey
                    return [4 /*yield*/, (0, spl_token_1.getAccount)(connection, mintPublicKey)];
                case 3:
                    mintAccount = _o.sent();
                    return [4 /*yield*/, (0, spl_token_1.createAssociatedTokenAccount)(connection, feePayer, mintPublicKey, mintAuthority.publicKey)];
                case 4:
                    ata = _o.sent();
                    tokenAccountPubkey = ata;
                    return [4 /*yield*/, connection.getParsedTokenAccountsByOwner(mintAuthority.publicKey, {
                            programId: spl_token_1.TOKEN_PROGRAM_ID,
                        })];
                case 5:
                    tokenAccount = _o.sent();
                    if (!(tokenAccount === null || tokenAccount === void 0 ? void 0 : tokenAccount.value) || !tokenAccount.value.length) {
                        throw 'No Token Account Found';
                    }
                    console.log('Token Account', tokenAccount.value[0].pubkey.toBase58());
                    balance = (_g = (_f = (_e = (_d = (_c = (_b = (_a = tokenAccount.value[0]) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.parsed) === null || _d === void 0 ? void 0 : _d.info) === null || _e === void 0 ? void 0 : _e.tokenAmount) === null || _f === void 0 ? void 0 : _f.uiAmount) !== null && _g !== void 0 ? _g : 0;
                    console.log("Balance: ".concat(balance));
                    return [4 /*yield*/, (0, spl_token_1.mintToChecked)(connection, feePayer, mintPublicKey, tokenAccountPubkey, mintAuthority, 1e8, 8)];
                case 6:
                    txhash = _o.sent();
                    console.log("Minted tokens to associated token account: ", txhash);
                    if (!(balance >= 1e8)) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, spl_token_1.transferChecked)(connection, feePayer, tokenAccountPubkey, mintPublicKey, tokenAccountPubkey, mintAuthority, 1e8, 8)];
                case 7:
                    txhash = _o.sent();
                    console.log("Transferred tokens: ", txhash);
                    return [3 /*break*/, 9];
                case 8:
                    console.log("Insufficient balance");
                    _o.label = 9;
                case 9: return [4 /*yield*/, (0, spl_token_1.burnChecked)(connection, feePayer, tokenAccountPubkey, mintPublicKey, mintAuthority, 1e8, 8)];
                case 10:
                    txhash = _o.sent();
                    return [4 /*yield*/, (0, spl_token_1.closeAccount)(connection, feePayer, tokenAccountPubkey, mintAuthority.publicKey, mintAuthority)];
                case 11:
                    txhash = _o.sent();
                    return [4 /*yield*/, (0, spl_token_1.setAuthority)(connection, feePayer, mintPublicKey, mintAuthority.publicKey, spl_token_1.AuthorityType.MintTokens, randomGuy.publicKey)];
                case 12:
                    txhash = _o.sent();
                    return [4 /*yield*/, (0, spl_token_1.approveChecked)(connection, feePayer, mintPublicKey, tokenAccountPubkey, randomGuy.publicKey, mintAuthority, 1e8, 8)];
                case 13:
                    txhash = _o.sent();
                    return [4 /*yield*/, (0, spl_token_1.revoke)(connection, feePayer, tokenAccountPubkey, mintAuthority.publicKey)];
                case 14:
                    txhash = _o.sent();
                    auxAccount = web3_js_1.Keypair.generate();
                    ACCOUNT_SIZE = 165;
                    amount = 100000000;
                    getTokensBalanceSpl(connection, tokenAccount.value).catch(function (err) { return console.log(err); });
                    _j = (_h = new web3_js_1.Transaction()).add;
                    _l = (_k = web3_js_1.SystemProgram).createAccount;
                    _m = {
                        fromPubkey: mintAuthority.publicKey,
                        newAccountPubkey: auxAccount.publicKey,
                        space: ACCOUNT_SIZE
                    };
                    return [4 /*yield*/, (0, spl_token_1.getMinimumBalanceForRentExemptAccount)(connection)];
                case 15:
                    tx = _j.apply(_h, [_l.apply(_k, [(_m.lamports = (_o.sent()) + amount,
                                _m.programId = spl_token_1.TOKEN_PROGRAM_ID,
                                _m)]),
                        (0, spl_token_1.createInitializeAccountInstruction)(auxAccount.publicKey, spl_token_1.NATIVE_MINT, mintAuthority.publicKey),
                        (0, spl_token_1.createTransferInstruction)(auxAccount.publicKey, ata, mintAuthority.publicKey, amount),
                        (0, spl_token_1.createCloseAccountInstruction)(auxAccount.publicKey, mintAuthority.publicKey, mintAuthority.publicKey)]);
                    return [4 /*yield*/, connection.getParsedTokenAccountsByOwner(mintAuthority.publicKey, {
                            mint: mintPublicKey,
                        })];
                case 16:
                    response = _o.sent();
                    console.log("Before:\n", response);
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function () { return console.log("Done"); }).catch(function (err) { return console.log(err); });
