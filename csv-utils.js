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

/**
 * Fetches in JSON format, the record retrieved with the associated content
 * @param {*} table Table to fetch from
 * @param {*} field Field from the table to query
 * @param {*} content Content of the query
 * @param {*} callback On data fetched/errored
 */
export const queryFetch = (table, field, content, callback) => {
    let responses = [];
    fs.readFile(tableDir + table, (err, data) => {
        if(err) {
            callback(queryStatus.fail, 'Could not retrieve table data');
        } else {

        }
    });
}