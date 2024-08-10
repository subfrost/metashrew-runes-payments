import { Block } from "metashrew-as/assembly/blockdata/block";
import { RunesBlock } from "metashrew-runes/assembly/indexer/RunesBlock";
import { RunestoneMessage } from "metashrew-runes/assembly/indexer/RunestoneMessage";
import { RunesTransaction } from "metashrew-runes/assembly/indexer/RunesTransaction";
import { OUTPOINT_TO_RUNES } from "metashrew-runes/assembly/indexer/constants";
import { BalanceSheet } from "metashrew-runes/assembly/indexer/BalanceSheet";
import { RUNES_PAYMENTS_TABLE } from "../tables/tables";

export class RunesPayment extends RunestoneMessage {
    indexBlock(height: u32, block: Block): void {
        // possibly run indexOutpoints beforehand to get the outpoint table
        for(let i = 0; i < block.transactions.length; i++) {
            let tx = block.transactions[i];
            // process the current transaction to get the runes balances for each output
            let balancesByOutput= super.process(RunesTransaction.from(tx), tx.txid(), height, i);
            let currBalance = this.loadBalanceSheet(RunesTransaction.from(tx));
            for(let j = 0; j < tx.ins.length; j++) {
                let input = tx.ins[j];
                let prev = input.previousOutput();
                let ptr = OUTPOINT_TO_RUNES.select(prev.toArrayBuffer());
                let balance = BalanceSheet.load(ptr);
                for (let k = 0; k < balance.runes.length; k++) {
                    let rune = balance.runes[k];
                    // format for rune payment is /runespayments/runeid/height/recipient/sender/amt
                    const runePtr = RUNES_PAYMENTS_TABLE.select(rune).selectValue<u32>(height).keyword("/");
                }
                // need to check is the edict specifies who recipient is meant to be


                // the rune edict will specify the output on the transaction where it is being sent
            }
        }
    }

}