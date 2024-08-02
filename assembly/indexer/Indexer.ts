import { Block } from "metashrew-as/assembly/blockdata/block";
import { RunesBlock } from "metashrew-runes/assembly/indexer/RunesBlock";
import { RunestoneMessage } from "metashrew-runes/assembly/indexer/RunestoneMessage";
import { RunesTransaction } from "metashrew-runes/assembly/indexer/RunesTransaction";
import { OUTPOINT_TO_RUNES } from "metashrew-runes/assembly/indexer/constants";

export class RunesPayment extends RunestoneMessage {
    indexBlock(height: u32, block: Block): void {
        // possibly run indexOutpoints beforehand to get the outpoint table
        let runesBlock = changetype<RunesBlock>(block);
        for(let i = 0; i < block.transactions.length; i++) {
            let tx = block.transactions[i];
            // process the current transaction to get the runes balances for each output
            let balancesByOutput= super.process(RunesTransaction.from(tx), tx.txid(), height, i);
            let currBalance = this.loadBalanceSheet(RunesTransaction.from(tx));
            for(let j = 0; j < tx.ins.length; j++) {
                let input = tx.ins[j];
                let prev = input.previousOutput();
                OUTPOINT_TO_RUNES.select(prev.toArrayBuffer());
                // need to check is the edict specifies who recipient is meant to be


                // let input = tx.inputs[j];
                // let outpoint = runesBlock.outpoints.get(input.outpoint);
                // if(outpoint) {
                //     // if the outpoint exists, then we can check the runes balance sheet to see if the 
                //     // rune exists
                //     let rune = runesBlock.runes.get(outpoint.rune);
                //     if(rune) {
                //         // if the rune exists, then we can add the payment to the rune
                //         rune.payments.push({
                //             height: height,
                //             txid: tx.txid,
                //             index: j,
                //             amount: outpoint.amount
                //         });
                //     }
                // }
            }
        }
    }

    processBlock(height: u32, block: Block): void {
        
    }
}