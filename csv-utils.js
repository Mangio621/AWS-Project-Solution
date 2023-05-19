/*
    Project AWS Solution: Swinburne University of Technology
    Author: Cole P. Mangio 103602247
    File Purpose: An interface for the CSV data to be quiered or inserted via JSON data.
*/

import fs from 'fs';

export const fields = {
    custID: 'Cust_ID',
    assetID: 'Asset_ID',
    custFname: 'Cust_Firstname',
    custLname: 'Cust_Lastname',
    custPhone: 'Cust_Phone',
    custEmail: 'Cust_Email',
    custAge: 'Cust_Age',
    custSalary: 'Cust_Salary',
    custIcon: 'Cust_Profile_Icon',
    assetName: 'Asset_Name',
    assetCat: 'Asset_Category',
    assetPdate: 'Asset_Purchasedate',
    assetSdate: 'Asset_Solddate',
    assetPprice: 'Asset_Purchaseprice',
    assetSprice: 'Asset_Soldprice'
}

export const tables = {
    customer: "customers.csv",
    investments: "investments.csv"
}

export const queryStatus = {
    success: 'success',
    fail: 'fail'
}

const tableDir = './data/';

const customerFields = [
    fields.custID, // 🔑
    fields.custFname,
    fields.custLname,
    fields.custPhone,
    fields.custEmail,
    fields.custAge,
    fields.custSalary,
    fields.custIcon,
];

const investmentFields = [
    fields.assetID, // 🔑
    fields.custID,  // 🔗
    fields.assetName,
    fields.assetCat,
    fields.assetPdate,
    fields.assetSdate,
    fields.assetPprice,
    fields.assetSprice
];

// A line in the csv is not a field if it is a heading row or is empty
const isRecord = (csvLine) => {
    if(csvLine.trim() == '') {
        return false;
    } else {
        if(csvLine.includes(fields.custID)) {
            return false;
        } else {
            return true;
        }
    }
}

const convertCustomerRecordJSON = (
    custID, custFname, custLname, custPhone,
    custEmail, custAge, custSalary, custIcon
) => {
    let jsonObject = {
        custID: custID,
        custFname: custFname,
        custLname: custLname,
        custPhone: custPhone,
        custEmail: custEmail,
        custAge: custAge,
        custSalary: custSalary,
        custIcon: custIcon
    };
    return jsonObject;
}

const convertInvestmentRecordJSON = (
    assetID, custID, assetName, assetCat,
    assetPdate, assetSdate, assetPprice, assetSprice
) => {
    let jsonObject = {
        assetID: assetID,
        custID: custID,
        assetName: assetName,
        assetCat: assetCat,
        assetPdate: assetPdate,
        assetSdate: assetSdate,
        assetPprice: assetPprice,
        assetSprice: assetSprice
    };
    return jsonObject;
}

/**
 * Fetches in JSON format, the record retrieved with the associated content
 * @param {*} table Table to fetch from
 * @param {*} field Field from the table to query
 * @param {*} content Content of the query
 * @param {*} callback On data fetched/errored
 */
export const queryFetch = (table, field, content, callback) => {
    let recordsResponse = [];
    fs.readFile(tableDir + table, (err, data) => {
        if(err) {
            callback(queryStatus.fail, 'Could not retrieve table data');
        } else {
            let array = data.toString().split('\n');
            // Handle Queries for each table
            const tableLayout = table === tables.customer ? customerFields : investmentFields;
            array.forEach(recordStr => {
                if(isRecord(recordStr)) {
                    const fieldData = recordStr.split(',');
                    if(fieldData[tableLayout.indexOf(field)]
                        .toLowerCase()
                        .includes(content.toLowerCase())) {
                        // Found a record with matching content of a field
                        if(table === tables.customer) {
                            recordsResponse.push(convertCustomerRecordJSON(
                                fieldData[0], fieldData[1], fieldData[2], fieldData[3],
                                fieldData[4], fieldData[5], fieldData[6], fieldData[7]
                            ));
                        } else if (table === tables.investments) {
                            recordsResponse.push(convertInvestmentRecordJSON(
                                fieldData[0], fieldData[1], fieldData[2], fieldData[3],
                                fieldData[4], fieldData[5], fieldData[6], fieldData[7]
                            ));
                        }
                    }
                }
            });
            callback(queryStatus.success, recordsResponse);
        }
    });
}

export const queryFetchAll = (table, callback) => {
    let recordsResponse = [];
    fs.readFile(tableDir + table, (err, data) => {
        if(err) {
            callback(queryStatus.fail, 'Could not retrieve table data');
        } else {
            let array = data.toString().split('\n');
            // Handle Queries for each table
            const tableLayout = table === tables.customer ? customerFields : investmentFields;
            array.forEach(recordStr => {
                if(isRecord(recordStr)) {
                    const fieldData = recordStr.split(',');
                    if(table === tables.customer) {
                        recordsResponse.push(convertCustomerRecordJSON(
                            fieldData[0], fieldData[1], fieldData[2], fieldData[3],
                            fieldData[4], fieldData[5], fieldData[6], fieldData[7]
                        ));
                    } else if (table === tables.investments) {
                        recordsResponse.push(convertInvestmentRecordJSON(
                            fieldData[0], fieldData[1], fieldData[2], fieldData[3],
                            fieldData[4], fieldData[5], fieldData[6], fieldData[7]
                        ));
                    }
                }
            });
            callback(queryStatus.success, recordsResponse);
        }
    });
}

const getRandom = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const insertRecordToTable = (table, recordData) => {
    if(table === tables.customer) {
        const id1 = getRandom(10, 99).toString()
        const id2 = getRandom(100000, 999999).toString()
        const id = id1+"-"+id2;
        fs.appendFile(tableDir+tables.customer, '\n'+`
            ${id},${recordData.custFname},${recordData.custLname},${recordData.custPhone},${recordData.custEmail},${recordData.custAge},${recordData.custSalary},${recordData.custIcon}
        `.trim(), (err) => {

        });
    } else if (table === tables.investments) {

    }
}

export const modifyRecordInTable = () => {

}