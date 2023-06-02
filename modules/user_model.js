const mongoose = require('mongoose');
const countermodel = require('./counter')


const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    pinkSlip: {
        type: [{
            id:{
                type: Number
            },
            department: {
                type: String,
            },
            date: {
                type: Date,
                default:() => Date.now() + 7*24*60*60*1000
            },
            submitted_by: {
                type: String
            },
            activity_details: {
                type: String
            },
            description: {
                type: String
            },
            slip_status: {
                type: String,
                enum: ['accepted', 'rejected', 'pending'],
                default: 'pending'
            },
        }],
    },
    psRemarks:{
        type:[{
            id:{
                type: Number
            },
            requestType:{
                type: String
            },
            remark:{
                type: String
            },
            accepted_by:{
                type: String
            }
        }]
    },
    proforma:{
        type:[{
            id:{
                type: Number
            },
            name: {
                type: String
            },
            equipment:{
                type: String
            },
            specification:{
                type: String
            },
            vendor_name:{
                type: String
            },
            vendor_address:{
                type: String
            },
            vendor_name1:{
                type: String
            },
            vendor_address1:{
                type: String
            },
            vendor_name2:{
                type: String
            },
            vendor_address2:{
                type: String
            },
            cost:{
                type: String
            },
            justification:{
                type: String
            },
            member_name:{
                type: String
            },
            member_name1:{
                type: String
            },
            member_name2:{
                type: String
            },
            meeting:{
                type: Date
            },
            submitted_to:{
                type: String
            },
            registrar:{
                type: String
            },
            principal:{
                type: String
            },
            slip_status: {
                type: String,
                enum: ['accepted', 'rejected', 'pending'],
                default: 'pending'
            }
        }]
    },
    pRemarks:{
        type:[{
            id:{
                type: Number
            },
            requestType:{
                type: String
            },
            remark:{
                type: String
            },
            accepted_by:{
                type: String
            }
        }]
    },
    compStat: {
        type: [{
            id:{
                type: Number
            },
            department: {
                type: String,
            },
            for: {
                type: String,
            },
            date: {
                type: Date,
            },
            particulars: {
                type: String,
            },
            particulars1: {
                type: String,
            },
            particulars2: {
                type: String,
            },
            particulars3: {
                type: String,
            },
            quantity: {
                type: String,
            },
            quantity1: {
                type: String,
            },
            quantity2: {
                type: String,
            },
            quantity3: {
                type: String,
            },
            vendor:{
                type: String,
            },
            price:{
                type: String,
            },
            price1:{
                type: String,
            },
            price2:{
                type: String,
            },
            price3:{
                type: String,
            },
            vendor1:{
                type: String,
            },
            prices:{
                type: String,
            },
            prices1:{
                type: String,
            },
            prices2:{
                type: String,
            },
            prices3:{
                type: String,
            },
            vendor2:{
                type: String,
            },
            pricess:{
                type: String,
            },
            pricess1:{
                type: String,
            },
            pricess2:{
                type: String,
            },
            pricess3:{
                type: String,
            },
            slip_status: {
                type: String,
                enum: ['accepted', 'rejected', 'pending'],
                default: 'pending'
            },
        }],
    },
    cRemarks:{
        type:[{
            id:{
                type: Number
            },
            requestType:{
                type: String
            },
            remark:{
                type: String
            },
            accepted_by:{
                type: String
            }
        }]
    },
    pdfSlips: {
        type: [{
            id:{
                type: Number
            },
            department: {
                type: String,
            },
            date: {
                type: Date,
                default:() => Date.now() + 7*24*60*60*1000
            },
            submitted_by: {
                type: String
            },
            activity_details: {
                type: String
            },
            description: {
                type: String
            },
            slip_status: {
                type: String,
                enum: ['accepted', 'rejected', 'pending'],
                default: 'pending'
            },
        }],
    },
    pdfSlipsRemark:{
        type: [{
            id:{
                type: Number
            },
            requestType:{
                type: String
            },
            remark:{
                type: String
            },
        }]
    },
    pdfPro:{
        type:[{
            id:{
                type: Number
            },
            equipment:{
                type: String
            },
            specification:{
                type: String
            },
            vendor_name:{
                type: String
            },
            vendor_address:{
                type: String
            },
            vendor_name1:{
                type: String
            },
            vendor_address1:{
                type: String
            },
            vendor_name2:{
                type: String
            },
            vendor_address2:{
                type: String
            },
            cost:{
                type: String
            },
            justification:{
                type: String
            },
            member_name:{
                type: String
            },
            member_name1:{
                type: String
            },
            member_name2:{
                type: String
            },
            meeting:{
                type: Date
            },
            submitted_to:{
                type: String
            },
            registrar:{
                type: String
            },
            principal:{
                type: String
            },
            slip_status: {
                type: String,
                enum: ['accepted', 'rejected', 'pending'],
                default: 'pending'
            }
        }]
    },
    pdfProRemarks:{
        type:[{
            id:{
                type: Number
            },
            requestType:{
                type: String
            },
            remark:{
                type: String
            },
        }]
    },
    pdfComp: {
        type: [{
            id:{
                type: Number
            },
            department: {
                type: String,
            },
            for: {
                type: String,
            },
            date: {
                type: Date,
            },
            particulars: {
                type: String,
            },
            particulars1: {
                type: String,
            },
            particulars2: {
                type: String,
            },
            particulars3: {
                type: String,
            },
            quantity: {
                type: String,
            },
            quantity1: {
                type: String,
            },
            quantity2: {
                type: String,
            },
            quantity3: {
                type: String,
            },
            vendor:{
                type: String,
            },
            price:{
                type: String,
            },
            price1:{
                type: String,
            },
            price2:{
                type: String,
            },
            price3:{
                type: String,
            },
            vendor1:{
                type: String,
            },
            prices:{
                type: String,
            },
            prices1:{
                type: String,
            },
            prices2:{
                type: String,
            },
            prices3:{
                type: String,
            },
            vendor2:{
                type: String,
            },
            pricess:{
                type: String,
            },
            pricess1:{
                type: String,
            },
            pricess2:{
                type: String,
            },
            pricess3:{
                type: String,
            },
            slip_status: {
                type: String,
                enum: ['accepted', 'rejected', 'pending'],
                default: 'pending'
            },
        }],
    },
    pdfStatsRemarks:{
        type:[{
            id:{
                type: Number
            },
            requestType:{
                type: String
            },
            remark:{
                type: String
            },
        }]
    },
})


const User = mongoose.model('User', UserSchema);
module.exports=User;
