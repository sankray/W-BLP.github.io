const mongoose = require('mongoose');

const counterSchema2={
    id:{
        type: String,
        default: 'employeeid'
  
    },
    sequence_value:{
        type: Number,
        default: 0
    }
  }
  
  const countermodel2 = mongoose.model("counter2", counterSchema2)
  module.exports=countermodel2;