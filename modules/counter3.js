const mongoose = require('mongoose');

const counterSchema3={
    id:{
        type: String,
        default: 'employeeid'
  
    },
    sequence_value:{
        type: Number,
        default: 0
    }
  }
  
  const countermodel3 = mongoose.model("counter3", counterSchema3)
  module.exports=countermodel3;