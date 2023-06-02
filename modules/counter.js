const mongoose = require('mongoose');

const counterSchema={
    id:{
        type: String,
        default: 'employeeid'
  
    },
    sequence_value:{
        type: Number,
        default: 0
    }
  }
  
  const countermodel = mongoose.model("counter", counterSchema)
  module.exports=countermodel;