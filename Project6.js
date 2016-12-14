/**
 *   @author Bloswick, Mackenzie (bloswickm@student.ncmich.edu)
 *   @version 0.5.1
 *   @summary Project 6 || created: 12.06.2016
 *   @todo
 */

"use strict";
const IO = require(`fs`);

let masterFile = [], transactionFile = [], matchingIDNums = [];

function main() {
    populateMasterFile();
    populateTransactionFile();
    setTotalsSpentThisYear();
    printNewMasterFile();
    printErrorReport();
    printCoupons();
    writeNewMasterFile();
}

main();

function populateMasterFile() {
    let fileContents = IO.readFileSync(`master.csv`, 'utf8');
    let lines = fileContents.toString().split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        masterFile.push(lines[i].toString().split(/,/));
    }
}

function populateTransactionFile() {
    let fileContents = IO.readFileSync(`transaction.csv`, 'utf8');
    let lines = fileContents.toString().split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
       transactionFile.push(lines[i].toString().split(/,/));
    }
}

function setTotalsSpentThisYear() {
    let idNumsColumn = 0,
        yearlyTotalColumn = 3,
        weeklyTotalColumn = 2;
    for (let i = 0; i < masterFile.length; i++) {
        for (let j = 0; j < transactionFile.length; j++) {
            if (masterFile[i][idNumsColumn] == transactionFile[j][idNumsColumn]) {
                masterFile[i][yearlyTotalColumn] = parseFloat(masterFile[i][yearlyTotalColumn]) + parseFloat(transactionFile[j][weeklyTotalColumn]);
                matchingIDNums[j] = masterFile[i][idNumsColumn];
            }
        }
    }
}

function printNewMasterFile() {
    const COLUMNS = 4;
    for (let i = 0; i < masterFile.length; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            if (j == 3) {
                console.log(`$${masterFile[i][j]}`);
            }
            else {
                console.log(masterFile[i][j]);
            }
        }
        console.log(`\n`);
    }
}

function printErrorReport() {
    let idNumsColumn = 0;
    console.log(`\nERROR REPORT:\nThe following ID numbers in the transaction file are new, and do not exist in the master file: `);
    for (let i = 0; i < transactionFile.length; i++) {
        if (matchingIDNums[i] == null) {
            console.log(`\nID Number: ${transactionFile[i][idNumsColumn]}`);
        }
    }
}

function printCoupons() {
    let yearlyTotalColumn = 3;
    for (let i = 0; i < masterFile.length; i++) {
        if (masterFile[i][yearlyTotalColumn] > 750) {
            console.log(`\n\t____________________________________\n\tCongratulations ${masterFile[i][1]} ${masterFile[i][2]}!`);
            console.log(`\n\tYou have surpassed $750 in purchases at the Curl Up and Dye Beauty Salon!\n\tRedeem this coupon at any point for a free hair cut.`);
            console.log(`\n\tExpires: Tomorrow.\n\tThank you for your business!\n\t____________________________________`);
        }
    }
}

function writeNewMasterFile() {
    const COLUMNS = 4;
    for (let i = 0; i < masterFile.length; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            if (j < COLUMNS - 1) {
                IO.appendFileSync(`newMaster.csv`, `${masterFile[i][j]},`, 'utf8');
            } else {
                IO.appendFileSync(`newMaster.csv`, masterFile[i][j], 'utf8');
            }
        }
        IO.appendFileSync(`newMaster.csv`, "\n", 'utf8');
    }
}