require('dotenv').config();

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const BASE_URL = process.env.BASE_URL;

var bodyParser = require("body-parser")
const pdfkit = require('pdfkit')
const fs = require('fs')
const nodemailer = require('nodemailer');
const path = require("path");

const User = require('./modules/user_model')
const countermodel = require('./modules/counter')
const countermodel2 = require('./modules/counter2')
const countermodel3 = require('./modules/counter3')

const connection = require('./connction')
connection();
const initializePassport = require('./passport-config');
const connction = require('./connction');
const ResponseHandler = require('./response_handler')
const userConstants = require('./user.constants')
const MessageHandler = require('./response_handler');
const { response } = require('express');

app.use(express.static(path.join(__dirname, 'public')))
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: 'something',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))


//REPO
const cd = async (id) => {
  const counterDoc = await countermodel.findOneAndUpdate(
    { id: id },
    { "$inc": { "sequence_value": 1 } },
    { new: true, upsert: true }
  );
  const seqId = counterDoc.sequence_value;
  return seqId;
};

const cd2 = async (id) => {
  const counterDoc = await countermodel2.findOneAndUpdate(
    { id: id },
    { "$inc": { "sequence_value": 1 } },
    { new: true, upsert: true } // add upsert option here
  );
  const seqId2 = counterDoc.sequence_value;
  return seqId2;
};

const cd3 = async (id) => {
  const counterDoc = await countermodel3.findOneAndUpdate(
    { id: id },
    { "$inc": { "sequence_value": 1 } },
    { new: true, upsert: true } // add upsert option here
  );
  const seqId3 = counterDoc.sequence_value;
  return seqId3;
};

const getPendingSlips = async (userId) =>
  User.findOne({ _id: userId }).select("pinkSlip")

const updateRequest = async (slipId, request) => {
  return User.findOneAndUpdate(
    { 'pinkSlip.id': slipId },
    { 'pinkSlip.$.slip_status': request },
    { new: true } // return the updated document
  );
};

const updateRequestPdf = async (slipId, request) => {
  return User.findOneAndUpdate(
    { 'pdfSlips.id': slipId },
    { 'pdfSlips.$.slip_status': request },
    { new: true } // return the updated document
  );
};


const pushRemark = async (slips, remark) =>
  User.findOneAndUpdate({ email: slips.accepted_by },
    {
      $push: {
        psRemarks:
        {
          id: slips.id,
          requestType: slips.requestType,
          remark: slips.remark,
        }
      }
    });

const pushRemarkPdf = async (slips, remark) =>
  User.findOneAndUpdate({ email: slips.accepted_by },
    {
      $push: {
        pdfSlipsRemark:
        {
          id: slips.id,
          requestType: slips.requestType,
          remark: slips.remark,
        }
      }
    });

const getRemark = async (userId) =>
  User.findOne({ _id: userId }).select("pRemarks")

///////////////////////////////////////////////////////////

const getPendingProforma = async (userId) =>
  User.findOne({ _id: userId }).select("proforma")

  const updateProforma = async (slipId, request) => {
    return User.findOneAndUpdate(
      { 'proforma.id': slipId },
      { 'proforma.$.slip_status': request },
      { new: true } // return the updated document
    );
  };

  const updateProformaPdf = async (slipId, request) => {
    return User.findOneAndUpdate(
      { 'pdfPro.id': slipId },
      { 'pdfPro.$.slip_status': request },
      { new: true } // return the updated document
    );
  };

const pushRemarkP = async (slips, remark) =>
  User.findOneAndUpdate({ email: slips.accepted_by },
    {
      $push: {
        pRemarks: {
          id: slips.id,
          requestType: slips.requestType,
          remark: slips.remark,
        }
      }
    })

    const pushRemarkPPdf = async (slips, remark) =>
  User.findOneAndUpdate({ email: slips.accepted_by },
    {
      $push: {
        pdfProRemarks: {
          id: slips.id,
          requestType: slips.requestType,
          remark: slips.remark,
        }
      }
    })

const getremark = async (userId) =>
  User.findOne({ _id: userId }).select("psRemarks").lean();

///////////////////////////////////////////////////////////////

const getPendingStats = async (userId) =>
  User.findOne({ _id: userId }).select("compStat")

const updateRequestCompStat = async (slipId, request) => {
    return User.findOneAndUpdate(
      { 'compStat.id': slipId },
      { 'compStat.$.slip_status': request },
      { new: true } // return the updated document
    );
  }; 
  
  const updateRequestCompStatsPdf = async (slipId, request) => {
    return User.findOneAndUpdate(
      { 'pdfComp.id': slipId },
      { 'pdfComp.$.slip_status': request },
      { new: true } // return the updated document
    );
  };

  const pushRemarkStats = async (slips, remark) =>
  User.findOneAndUpdate({ email: slips.accepted_by },
    {
      $push: {
        cRemarks:
        {
          id: slips.id,
          requestType: slips.requestType,
          remark: slips.remark,
        }
      }
    });

    const pushRemarkStatsPdf = async (slips, remark) =>
  User.findOneAndUpdate({ email: slips.accepted_by },
    {
      $push: {
        pdfStatsRemarks:
        {
          id: slips.id,
          requestType: slips.requestType,
          remark: slips.remark,
        }
      }
    });

    const getremarkStats = async (userId) =>
  User.findOne({ _id: userId }).select("cRemarks").lean();

//SERVICES      

const getSeqId = async () => {
  const seqId = await cd('employeeid');
  return seqId;
};

const getSeqId2 = async () => {
  const seqId2 = await cd2('employeeid');
  return seqId2;
};

const getSeqId3 = async () => {
  const seqId3 = await cd3('employeeid');
  return seqId3;
};

const getAllPendingSlips = async (userId) => {
  try {
    const requests = await getPendingSlips(userId);
    const pendingRequests = requests.pinkSlip.filter((data) => data.slip_status === 'pending');
    return pendingRequests.length === 0 ? userConstants.NO_PENDING_SLIPS : pendingRequests;
  } catch (error) {
    throw userConstants.FAILED
  }
}

const updateSlipStatus = async (slipId, request) => {
  try {
    const updatedDocument = await updateRequest(slipId, request);
    if (updatedDocument) {
      return userConstants.SLIP_ACCEPTED;
    } else {
      return userConstants.FAILED;
    }
  } catch (error) {
    console.log(error);
    throw userConstants.FAILED;
  }
};

const updateSlipStatusPdf = async (slipId, request) => {
  try {
    const updatedDocument = await updateRequestPdf(slipId, request);
    if (updatedDocument) {
      return userConstants.SLIP_ACCEPTED;
    } else {
      return userConstants.FAILED;
    }
  } catch (error) {
    console.log(error);
    throw userConstants.FAILED;
  }
};


const generateRemark = async (slips, remark) => {
  try {
    await pushRemark(slips, remark);
    return userConstants.REMARK_GENERATED
  } catch (error) {
    throw userConstants.FAILED
  }
}

const generateRemarkPdf = async (slips, remark) => {
  try {
    await pushRemarkPdf(slips, remark);
    return userConstants.REMARK_GENERATED
  } catch (error) {
    throw userConstants.FAILED
  }
}

const getremarks = async (userId) => {
  try {
    const requests = await getremark(userId);
    const pendingRequests = requests.psRemarks
    return pendingRequests
  } catch (error) {
    throw userConstants.FAILED
  }
}

////////////////////////////////////////////////////////

const getallPendingProforma = async (userId) => {
  try {
    const requests = await getPendingProforma(userId);
    const pendingRequests = requests.proforma.filter((data) => data.slip_status === 'pending');
    return pendingRequests.length === 0 ? userConstants.NO_PENDING_SLIPS : pendingRequests;
  } catch (error) {
    throw userConstants.FAILED
  }
}

const updateProformaStatus = async (slipId, request) => {
  try {
    const updatedDocument = await updateProforma(slipId, request);
    if (updatedDocument) {
      return userConstants.SLIP_ACCEPTED;
    } else {
      return userConstants.FAILED;
    }
  } catch (error) {
    console.log(error);
    throw userConstants.FAILED;
  }
};

const updateProformaStatusPdf = async (slipId, request) => {
  try {
    const updatedDocument = await updateProformaPdf(slipId, request);
    if (updatedDocument) {
      return userConstants.SLIP_ACCEPTED;
    } else {
      return userConstants.FAILED;
    }
  } catch (error) {
    console.log(error);
    throw userConstants.FAILED;
  }
};

const generateRemarkP = async (slips, remark) => {
  try {
    await pushRemarkP(slips, remark);
    return userConstants.REMARK_GENERATED
  } catch (error) {
    throw userConstants.FAILED
  }
}

const generateRemarkPPdf = async (slips, remark) => {
  try {
    await pushRemarkPPdf(slips, remark);
    return userConstants.REMARK_GENERATED
  } catch (error) {
    throw userConstants.FAILED
  }
}

const getRemarks = async (userId) => {
  try {
    const requests = await getRemark(userId);
    return requests
  } catch (error) {
    throw userConstants.FAILED
  }
}

////////////////////////////////////////////////////////////

const getAllPendingStats = async (userId) => {
  try {
    const requests = await getPendingStats(userId);
    const pendingRequests = requests.compStat.filter((data) => data.slip_status === 'pending');
    return pendingRequests.length === 0 ? userConstants.NO_PENDING_SLIPS : pendingRequests;
  } catch (error) {
    throw userConstants.FAILED
  }
}

const updateStatsStatus = async (slipId, request) => {
  try {
    const updatedDocument = await updateRequestCompStat(slipId, request);
    if (updatedDocument) {
      return userConstants.SLIP_ACCEPTED;
    } else {
      return userConstants.FAILED;
    }
  } catch (error) {
    console.log(error);
    throw userConstants.FAILED;
  }
};

const updateStatsStatusPdf = async (slipId, request) => {
  try {
    const updatedDocument = await updateRequestCompStatsPdf(slipId, request);
    if (updatedDocument) {
      return userConstants.SLIP_ACCEPTED;
    } else {
      return userConstants.FAILED;
    }
  } catch (error) {
    console.log(error);
    throw userConstants.FAILED;
  }
};

const generateRemarkStats = async (slips, remark) => {
  try {
    await pushRemarkStats(slips, remark);
    return userConstants.REMARK_GENERATED
  } catch (error) {
    throw userConstants.FAILED
  }
}

const generateRemarkStatsPdf = async (slips, remark) => {
  try {
    await pushRemarkStatsPdf(slips, remark);
    return userConstants.REMARK_GENERATED
  } catch (error) {
    throw userConstants.FAILED
  }
}

const getremarksStats = async (userId) => {
  try {
    const requests = await getremarkStats(userId);
    const pendingRequests = requests.cRemarks
    return pendingRequests
  } catch (error) {
    throw userConstants.FAILED
  }
}


//ROUTES
app.get('/', checkAuthenticated, (req, res) => {
  try {
    const pinkSlips = req.user.pdfSlips;
    const totalCount = pinkSlips.length;
    const acceptedCount = pinkSlips.filter(slip => slip.slip_status === 'accepted').length;
    const rejectedCount = pinkSlips.filter(slip => slip.slip_status === 'rejected').length;
    const pendingCount = pinkSlips.filter(slip => slip.slip_status === 'pending').length;
    const percentAccepted = totalCount === 0 ? 0 : (acceptedCount / totalCount) * 100;

    const proforma = req.user.pdfPro;
    const totalCountP = proforma.length;
    const acceptedCountP = proforma.filter(slip => slip.slip_status === 'accepted').length;
    const rejectedCountP = proforma.filter(slip => slip.slip_status === 'rejected').length;
    const pendingCountP = proforma.filter(slip => slip.slip_status === 'pending').length;
    const percentAcceptedP = totalCountP === 0 ? 0 : (acceptedCountP / totalCountP) * 100;

    const compStat = req.user.pdfComp;
    const totalCountC = compStat.length;
    const acceptedCountC = compStat.filter(slip => slip.slip_status === 'accepted').length;
    const rejectedCountC = compStat.filter(slip => slip.slip_status === 'rejected').length;
    const pendingCountC = compStat.filter(slip => slip.slip_status === 'pending').length;
    const percentAcceptedC = totalCountC === 0 ? 0 : (acceptedCountC / totalCountC) * 100;
    res.render('index.ejs', { name: req.user.name, acceptedCount, totalCount, percentAccepted, rejectedCount, pendingCount,
      acceptedCountP, rejectedCountP, pendingCountP, percentAcceptedP, totalCountP,
      acceptedCountC, pendingCountC, rejectedCountC, percentAcceptedC, totalCountC})
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    var user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    user.save().then(() => {
      console.log('user saved in db')
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }

})

app.get("/pinkslip", checkAuthenticated, function (req, res) {
  res.render('pinkslip.ejs')
})

app.post("/pinkslip", checkAuthenticated, async (req, res, next) => {

  //NODEMAILER
    const output = `
    <p>You have a new pinkslip request</p>
    <h3>Pink Slip description</h3>
    <ul>  
      <li>Department: ${req.body.department}</li>
      <li>Date: ${req.body.date}</li>
      <li>Submitted by: ${req.body.submitted_by}</li>
      <li>Details: ${req.body.activity_details}</li>
      <li>Description: ${req.body.description}</li>
    </ul>
  `;
    const { email } = req.body;

    let transporter = nodemailer.createTransport({
      // host: 'mail.YOURDOMAIN.com',
      // port: 587,
      // secure: false, // true for 465, false for other ports
      service: "hotmail",
      auth: {
        user: 'sanketnode@outlook.com', // generated ethereal user
        pass: 'qwerty@123456'  // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"W-BLP" <sanketnode@outlook.com>', // sender address
      to: email, // list of receivers
      subject: 'Pinkslip Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', { msg: 'Email has been sent' });
    });


    //PUSHING THE PINKSLIP
  const seqId = await getSeqId();

  var userId = req.user.id;
  const generatePinkSlipPdf = async (slip, submitted_by) => {
    try {

      const pushSlip = async (slip, submitted_by) =>
        User.findOneAndUpdate({ _id: userId },
          {
            $push: {
              pdfSlips:
              {
                id: seqId,
                department: slip.department,
                submitted_by: slip.submitted_by,
                activity_details: slip.activity_details,
                description: slip.description,
              }
            }
          },
          { new: true }
        )
      await pushSlip(slip, submitted_by);
      return userConstants.SLIP_GENERATED
    } catch (error) {
      throw userConstants.FAILED
    }
  }
  try {
    const response = await generatePinkSlipPdf(req.body, userId);
  } catch (error) {
    next(error);
  }

  //Pushing pinkslip to another user   

  const generatePinkSlip = async (slip, submitted_by) => {
    try {
      const pushSlip = async (slip, submitted_by) =>
        User.findOneAndUpdate({ email: slip.requested_to },
          {
            $push: {
              pinkSlip:
              {
                id: seqId,
                department: slip.department,
                submitted_by: submitted_by,
                activity_details: slip.activity_details,
                description: slip.description,
              }
            }
          },
          { new: true }
        )
      await pushSlip(slip, submitted_by);
      return userConstants.SLIP_GENERATED
    } catch (error) {
      throw userConstants.FAILED
    }
  }
  try {
    const response = await generatePinkSlip(req.body, res.locals.email);
    res.send(new ResponseHandler(response));
  } catch (error) {
    next(error);
  }

})


app.get("/get-all-pending-slips", checkAuthenticated, async (req, res, next) => {
  try {
    const response = await getAllPendingSlips(req.user);
    res.render('pending/pending_Slip.ejs', { response: response });
  } catch (error) {
    console.log(error)
    next(error);
  }

})

app.get("/accept-slip-request",checkAuthenticated, async (req, res, next) => {
  res.render('approve.ejs')
})


app.post("/accept-slip-request", checkAuthenticated, async (req, res, next) => {
  try {
    const response = await updateSlipStatus(req.body.id, req.body.requestType)
  } catch (error) {
    next(error);
  }
  try {
    const response = await updateSlipStatusPdf(req.body.id, req.body.requestType);
  } catch (error) {
    next(error);
  }
  try {
    const response = await generateRemark(req.body, res.locals.email);
    res.send(new ResponseHandler(response));
  } catch (error) {
    next(error);
  }
  try {
    const response = await generateRemarkPdf(req.body, res.locals.email);
  } catch (error) {
    next(error);
  }

})

app.get("/remarks", checkAuthenticated, async (req, res, next) => {
  try {
    const response = await getremarks(req.user);
    res.render('pending/pRemark.ejs', { response: response });
    // res.send(new ResponseHandler(response))
  } catch (error) {
    console.log(error)
    next(error);
  }
})

app.post("/remarks", checkAuthenticated, async (req, res, next) => {
  const pdfSlips = req.user?.pdfSlips || []; // Use optional chaining to prevent error if req.user is null or undefined
  const pdfSlipsRemark = req.user?.pdfSlipsRemark || [];

  const id = req.body.id; // Get the id from the request parameter

  const pdf = pdfSlips.find((pdf) => pdf.id === parseInt(id))
  const pdfR = pdfSlipsRemark.find((pdf) => pdf.id === parseInt(id));

  if (!pdf) {
    return res.status(404).send("PDF not found"); // Return a 404 error if pdf is not found
  }
  if (!pdfR) {
    return res.status(404).send("PDF not found"); // Return a 404 error if pdf is not found
  }

  const pdfDocument = require("pdfkit");
  const doc = new pdfDocument();
  doc.rect(0, 0, 612, 792).fill("#E8A0BF");

  // pdf color change
  doc.fillColor('black');

  doc.font('Helvetica-Bold');
  doc.fontSize(12);
  doc.text("Modern Educations Society's College of Engineering,Pune-1.", {
    align: 'center'
  });
  doc.moveDown(5);
  // doc.moveDown();
  doc.font('Helvetica-Bold');
  doc.fontSize(10);
  doc.text(`Department: ${pdf.department}`, 0, 100, {
    align: 'center'
  });
  doc.font('Helvetica');
  doc.text(`Submitted: ${pdf.submitted_by}`, 30, 115, {
    align: 'left'
  });
  // doc.rect(210,100,140,20).stroke();
  doc.text(`Date: ${pdf.date}`, 0, 115, {
    align: 'right'
  });
  doc.text(`No: ${pdf.id}`, 15, 130, {
    align: 'right'
  });
  doc.text(`Activity Details: ${pdf.activity_details}`, 30, 145);
  doc.moveDown();
  doc.text(`${pdf.description}`, 35, 170, {
    align: 'justify'
  });
  doc.rect(30, 160, 530, 100).stroke();
  doc.moveDown();

  doc.text(`Remark:  ${pdfR.remark}`, 30, 270);
  doc.moveDown(10);
  doc.text("Head of Department", 30, 350, {
    align: 'left'
  });
  doc.text("Registrar", 0, 350, {
    align: 'center'
  });
  doc.text("Principle", 0, 350, {
    align: 'right'
  });


  const filename = `Pink Slip ${pdf.id}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  doc.pipe(res);

  doc.end(function () {
    console.log(`PDF ${pdf.id} generation complete.`);
  });

  // Debugging code to check whether the PDF is fully generated
  const chunks = [];
  doc.on("data", function (chunk) {
    chunks.push(chunk);
  });
  doc.on("end", function () {
    const result = Buffer.concat(chunks);
    console.log(`PDF ${pdf.id} length: ${result.length}`);
  });
});


app.get("/proforma", checkAuthenticated, async (req, res, next) => {
  res.render('proforma.ejs')
})

app.post("/proforma", checkAuthenticated, async (req, res, next) => {

  //NODEMAILER
  const output = `
    <p>You have a new Proforma request</p>
    <h3>Proforma description</h3>
    <ul>  
      <li>Particular of Equipment: ${req.body.equipment}</li>
      <li>Specification: ${req.body.specification}</li>
      <li>Vendors:</li>
      <ul>
      <li>Vendor 1: ${req.body.vendor_name}, ${req.body.vendor_address}</li>
      <li>Vendor 2: ${req.body.vendor_name1}, ${req.body.vendor_address1}</li>
      <li>Vendor 3: ${req.body.vendor_name2}, ${req.body.vendor_address2}</li>
      </ul>
      <li>Approximate Cost: ${req.body.cost}</li>
      <li>Justification for Purchase: ${req.body.justification}</li>
      <li>Departmental Committee Members: </li>
      <ul>
      <li>${req.body.member_name}</li>
      <li>${req.body.member_name1}</li>
      <li>${req.body.member_name2}</li>
      </ul>
      <li>Meeting was held on: ${req.body.meeting}</li>
    </ul>
  `;
  const { email } = req.body;

  let transporter = nodemailer.createTransport({
    // host: 'mail.YOURDOMAIN.com',
    // port: 587,
    // secure: false, // true for 465, false for other ports
    service: "hotmail",
    auth: {
      user: 'sanketnode@outlook.com', // generated ethereal user
      pass: 'qwerty@123456'  // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"W-BLP" <sanketnode@outlook.com>', // sender address
    to: email, // list of receivers
    subject: 'Proforma Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', { msg: 'Email has been sent' });
  });


//PUSHING PROFORMA
  const seqId2 = await getSeqId2();

  var userId = req.user.id;
  const generateProformaPdf = async (slip, submitted_by) => {
    try { 
      const pushProforma = async (slip, submitted_by) =>
        User.findOneAndUpdate({ _id: userId },
          {
            $push: {
              pdfPro: {
                id: seqId2,
                name: slip.name,
                equipment: slip.equipment,
                specification: slip.specification,
                vendor_name: slip.vendor_name,
                vendor_address: slip.vendor_address,
                vendor_name1: slip.vendor_name1,
                vendor_address1: slip.vendor_address1,
                vendor_name2: slip.vendor_name2,
                vendor_address2: slip.vendor_address2,
                cost: slip.cost,
                justification: slip.justification,
                member_name: slip.member_name,
                member_name1: slip.member_name1,
                member_name2: slip.member_name2,
                meeting: slip.meeting,
                submitted_to: slip.submitted_to,
                registrar: slip.registrar,
                principal: slip.principal
              }
            }
          })
      await pushProforma(slip, submitted_by);
      return userConstants.SLIP_GENERATED
    } catch (error) {
      throw userConstants.FAILED
    }
  }
  
  try {
    const response = await generateProformaPdf(req.body, userId);
  } catch (error) {
    next(error);
  }

    //Pushing pinkslip to another user
  const generateProforma = async (slip, submitted_by) => {
    try { 
      const pushProforma = async (slip, submitted_by) =>
        User.findOneAndUpdate({ email: slip.submitted_to },
          {
            $push: {
              proforma: {
                id: seqId2,
                name: slip.name,
                equipment: slip.equipment,
                specification: slip.specification,
                vendor_name: slip.vendor_name,
                vendor_address: slip.vendor_address,
                vendor_name1: slip.vendor_name1,
                vendor_address1: slip.vendor_address1,
                vendor_name2: slip.vendor_name2,
                vendor_address2: slip.vendor_address2,
                cost: slip.cost,
                justification: slip.justification,
                member_name: slip.member_name,
                member_name1: slip.member_name1,
                member_name2: slip.member_name2,
                meeting: slip.meeting,
                submitted_to: slip.submitted_to,
                registrar: slip.registrar,
                principal: slip.principal
              }
            }
          })
      await pushProforma(slip, submitted_by);
      return userConstants.SLIP_GENERATED
    } catch (error) {
      throw userConstants.FAILED
    }
  } 

  try {
    const response = await generateProforma(req.body, res.locals.email);
    res.send(new ResponseHandler(response));
  } catch (error) {
    next(error);
  }

})

app.get("/get-all-pending-proforma", checkAuthenticated, async (req, res, next) => {
  try {
    const response = await getallPendingProforma(req.user);
    res.render('pending/pending_Pro.ejs', { response: response });
  } catch (error) {
    console.log(error)
    next(error);
  }

})

app.get("/accept-proforma-request", checkAuthenticated, async (req, res, next) => {
  res.render('approveP.ejs')
})

app.post("/accept-proforma-request", checkAuthenticated, async (req, res, next) => {
  try {
    const response = await updateProformaStatus(req.body.id, req.body.requestType)
    // res.send(new ResponseHandler(response));
  } catch (error) {
    next(error);
  }
  try {
    const response = await updateProformaStatusPdf(req.body.id, req.body.requestType);
  } catch (error) {
    next(error);
  }
  try {
    const response = await generateRemarkP(req.body, res.locals.email);
    res.send(new ResponseHandler(response));
  } catch (error) {
    next(error);
  }
  try {
    const response = await generateRemarkPPdf(req.body, res.locals.email);
  } catch (error) {
    next(error);
  }
})

app.get("/remarksP", checkAuthenticated, async (req, res, next) => {

  try {
    const response = await getRemarks(req.user);
    res.render('pending/proformaRemark.ejs', { response: response });
    // res.send(new ResponseHandler(response));
  } catch (error) {
    console.log(error)
    next(error);
  }
})

app.post("/Premarks", checkAuthenticated, async (req, res, next) => {
  const pdfPro = req.user?.pdfPro || []; // Use optional chaining to prevent error if req.user is null or undefined
  const pdfProRemarks = req.user?.pdfProRemarks || [];

  const id = req.body.id; // Get the id from the request parameter

  const pdf = pdfPro.find((pdf) => pdf.id === parseInt(id))
  const pdfR = pdfProRemarks.find((pdf) => pdf.id === parseInt(id));

  if (!pdf) {
    return res.status(404).send("PDF not found"); // Return a 404 error if pdf is not found
  }
  if (!pdfR) {
    return res.status(404).send("PDF not found"); // Return a 404 error if pdf is not found
  }

  const pdfDocument = require("pdfkit");
  const doc = new pdfDocument();
  doc.rect(0, 0, 612, 792).fill("#E8A0BF");


  // pdf color change
  doc.fillColor('black');

  doc.font('Helvetica-Bold');
  doc.fontSize(12);
  doc.text("Modern Educations Society's College of Engineering,Pune-1.", {
    align: 'center'
  });
  doc.moveDown(5);

  doc.text(`Proforma No.: ${pdf.id}`)
  doc.text(`Particular of Equipment: ${pdf.equipment}`)
  doc.text(`Specification: ${pdf.specification}`)
  doc.text(`Vendor 1: ${pdf.vendor_name}, ${pdf.vendor_address}`)
  doc.text(`Vendor 2: ${pdf.vendor_name1}, ${pdf.vendor_address1}`)
  doc.text(`Vendor 3: ${pdf.vendor_name2}, ${pdf.vendor_address2}`)
  doc.text(`Approximate Cost: ${pdf.cost}`)
  doc.text(`Justification for Purchase: ${pdf.justification}`)
  doc.text(`Departmental Committee Members 1: ${pdf.member_name}`)
  doc.text(`Departmental Committee Members 2: ${pdf.member_name1}`)
  doc.text(`Departmental Committee Members 3: ${pdf.member_name2}`)
  doc.text(`Meeting was held on: ${pdf.meeting}`)

  doc.text(`Remark:  ${pdfR.remark}`);


  const filename = `Proforma ${pdf.id}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  doc.pipe(res);

  doc.end(function () {
    console.log(`PDF ${pdf.id} generation complete.`);
  });

  // Debugging code to check whether the PDF is fully generated
  const chunks = [];
  doc.on("data", function (chunk) {
    chunks.push(chunk);
  });
  doc.on("end", function () {
    const result = Buffer.concat(chunks);
    console.log(`PDF ${pdf.id} length: ${result.length}`);
  });
});

app.get("/comp_stat", checkAuthenticated, async (req, res, next) => {
  res.render('comp_stat.ejs')
})

app.post("/comp_stat", checkAuthenticated, async (req, res, next) => {
  //NODEMAILER
    const output = `
    <p>You have a new Comparative statement request</p>
    <h3>Comparative Statement description</h3>
    <ul>  
      <li>Department: ${req.body.department}</li>
      <li>Comparative Statment for: ${req.body.for}</li>
      <li>Date: ${req.body.date}</li>
      <li>Particulars:</li>
      <ul>
      <li>${req.body.particulars}</li>
      <li>${req.body.particulars1}</li>
      <li>${req.body.particulars2}</li>
      <li>${req.body.particulars3}</li>
      </ul>
      <li>Quantity to be supplied:</li>
      <ul>
      <li>${req.body.quantity}</li>
      <li>${req.body.quantity1}</li>
      <li>${req.body.quantity2}</li>
      <li>${req.body.quantity3}</li>
      </ul>
      <li>Vendors:</li>
      <ul>Vendor 1:
      <li>${req.body.price}</li>
      <li>${req.body.price1}</li>
      <li>${req.body.price2}</li>
      <li>${req.body.price3}</li>
      </ul>
      <ul>Vendor 2:
      <li>${req.body.prices}</li>
      <li>${req.body.prices1}</li>
      <li>${req.body.prices2}</li>
      <li>${req.body.prices3}</li>
      </ul>
      <ul>Vendor 3:
      <li>${req.body.pricess}</li>
      <li>${req.body.pricess1}</li>
      <li>${req.body.pricess2}</li>
      <li>${req.body.pricess3}</li>
      </ul>
    </ul>
  `;
    const { email } = req.body;

    let transporter = nodemailer.createTransport({
      // host: 'mail.YOURDOMAIN.com',
      // port: 587,
      // secure: false, // true for 465, false for other ports
      service: "hotmail",
      auth: {
        user: 'sanketnode@outlook.com', // generated ethereal user
        pass: 'qwerty@123456'  // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"W-BLP" <sanketnode@outlook.com>', // sender address
      to: email, // list of receivers
      subject: 'Comparative Statement Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', { msg: 'Email has been sent' });
    });

  //Pushing comparative statements to another user   

  const seqId = await getSeqId3();

  var userId = req.user.id;
  const generateCompStatPdf = async (slip, table) => {
    const pushCompS = async (slip, table) =>
    User.findOneAndUpdate({ _id: userId },
      {
        $push: {
          pdfComp: {
            id: seqId,
            department: slip.department,
            for: slip.for,
            date: slip.date,
            particulars: slip.particulars,
            particulars1: slip.particulars1,
            particulars2: slip.particulars2,
            particulars3: slip.particulars3,
            quantity: slip.quantity,
            quantity1: slip.quantity1,
            quantity2: slip.quantity2,
            quantity3: slip.quantity3,
            vendor: slip.vendor,
            price: slip.price,
            price1: slip.price1,
            price2: slip.price2,
            price3: slip.price3,
            vendor1: slip.vendor1,
            prices: slip.prices,
            prices1: slip.prices1,
            prices2: slip.prices2,
            prices3: slip.prices3,
            vendor2: slip.vendor2,
            pricess: slip.pricess,
            pricess1: slip.pricess1,
            pricess2: slip.pricess2,
            pricess3: slip.pricess3,
          }
        }
      });
    try {
      await pushCompS(slip, table);
      return userConstants.SLIP_GENERATED
    } catch (error) {
      throw userConstants.FAILED
    }
  } 
  try {
    const response = await generateCompStatPdf(req.body, userId);
  } catch (error) {
    next(error);
  } 

  const generateCompStat = async (slip, table) => {
    const pushCompS = async (slip, table) =>
    User.findOneAndUpdate({ email: slip.submitted_to },
      {
        $push: {
          compStat: {
            id: seqId,
            department: slip.department,
            for: slip.for,
            date: slip.date,
            particulars: slip.particulars,
            particulars1: slip.particulars1,
            particulars2: slip.particulars2,
            particulars3: slip.particulars3,
            quantity: slip.quantity,
            quantity1: slip.quantity1,
            quantity2: slip.quantity2,
            quantity3: slip.quantity3,
            vendor: slip.vendor,
            price: slip.price,
            price1: slip.price1,
            price2: slip.price2,
            price3: slip.price3,
            vendor1: slip.vendor1,
            prices: slip.prices,
            prices1: slip.prices1,
            prices2: slip.prices2,
            prices3: slip.prices3,
            vendor2: slip.vendor2,
            pricess: slip.pricess,
            pricess1: slip.pricess1,
            pricess2: slip.pricess2,
            pricess3: slip.pricess3,
          }
        }
      });
    try {
      await pushCompS(slip, table);
      return userConstants.SLIP_GENERATED
    } catch (error) {
      throw userConstants.FAILED
    }
  }  
  try {
    const response = await generateCompStat(req.body, res.locals.email);
    res.send(new ResponseHandler(response));
  } catch (error) {
    next(error);
  }

})

app.get("/get-all-Comp-Stats", checkAuthenticated, async (req, res, next) => {
  try {
    const response = await getAllPendingStats(req.user);
    // res.send(new ResponseHandler(response));
    res.render('pending/pending_Stats.ejs', { response: response });
  } catch (error) {
    console.log(error)
    next(error);
  }

})

app.get("/accept-Stats-request", checkAuthenticated, async (req, res, next) => {
  res.render('approveC.ejs')
})

app.post("/accept-Stats-request", checkAuthenticated, async (req, res, next) => {

  try {
    const response = await updateStatsStatus(req.body.id, req.body.requestType)
  } catch (error) {
    next(error);
  }

  try {
    const response = await updateStatsStatusPdf(req.body.id, req.body.requestType);
  } catch (error) {
    next(error);
  }
  try {
    const response = await generateRemarkStats(req.body, res.locals.email);
    res.send(new ResponseHandler(response));
  } catch (error) {
    next(error);
  }
  try {
    const response = await generateRemarkStatsPdf(req.body, res.locals.email);
  } catch (error) {
    next(error);
  }

})

app.get("/remarks-Stats", checkAuthenticated, async (req, res, next) => {
  try {
    // console.log(req.user);
    const response = await getremarksStats(req.user);
    res.render('pending/CompStatsRemarks.ejs', { response: response });
    // res.send(new ResponseHandler(response))
  } catch (error) {
    console.log(error)
    next(error);
  }
})

app.post("/Cremarks", checkAuthenticated, async (req, res, next) => {
  const pdfComp = req.user?.pdfComp || []; // Use optional chaining to prevent error if req.user is null or undefined
  const pdfStatsRemarks = req.user?.pdfStatsRemarks || [];

  const id = req.body.id; // Get the id from the request parameter

  const pdf = pdfComp.find((pdf) => pdf.id === parseInt(id))
  const pdfR = pdfStatsRemarks.find((pdf) => pdf.id === parseInt(id));

  if (!pdf) {
    return res.status(404).send("PDF not found"); // Return a 404 error if pdf is not found
  }
  if (!pdfR) {
    return res.status(404).send("PDF not found"); // Return a 404 error if pdf is not found
  }

  const pdfDocument = require("pdfkit");
  const doc = new pdfDocument();

  doc.font('Helvetica-Bold');
  doc.fontSize(12);
  doc.text("Modern Educations Society's College of Engineering,Pune-1.", {
    align: 'center'
  });
  doc.moveDown(5);

  doc.text(`Proforma No.: ${pdf.id}`)
  doc.text(`Department: ${pdf.department}`)
  doc.text(`Comparative Statment for: ${pdf.for}`)
  doc.text(`Date: ${pdf.date}`)
  doc.text(`Particulars: ${pdf.particulars}`)
  doc.text(`Particulars 2: ${pdf.particulars1}`)
  doc.text(`Particulars 3: ${pdf.particulars2}`)
  doc.text(`Particulars 4: ${pdf.particulars3}`)
  doc.text(`Quantity to be supplied: ${pdf.quantity}`)
  doc.text(`Quantity 2: ${pdf.quantity1}`)
  doc.text(`Quantity 3: ${pdf.quantity2}`)
  doc.text(`Quantity 4: ${pdf.quantity3}`)
  doc.text(`Vendor 1: ${pdf.vendor}`)
  doc.text(`Price 1: ${pdf.price}`)
  doc.text(`Price 2: ${pdf.price1}`)
  doc.text(`Price 3: ${pdf.price2}`)
  doc.text(`Price 4: ${pdf.price3}`)
  doc.text(`Vendor 2: ${pdf.vendor1}`)
  doc.text(`Price 1: ${pdf.prices}`)
  doc.text(`Price 2: ${pdf.prices1}`)
  doc.text(`Price 3: ${pdf.prices2}`)
  doc.text(`Price 4: ${pdf.prices3}`)
  doc.text(`Vendor 3: ${pdf.vendor2}`)
  doc.text(`Price 1: ${pdf.pricess}`)
  doc.text(`Price 2: ${pdf.pricess1}`)
  doc.text(`Price 3: ${pdf.pricess2}`)
  doc.text(`Price 4: ${pdf.pricess3}`)

  doc.text(`Remark:  ${pdfR.remark}`);


  const filename = `Comparative Statement ${pdf.id}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  doc.pipe(res);

  doc.end(function () {
    console.log(`PDF ${pdf.id} generation complete.`);
  });

  // Debugging code to check whether the PDF is fully generated
  const chunks = [];
  doc.on("data", function (chunk) {
    chunks.push(chunk);
  });
  doc.on("end", function () {
    const result = Buffer.concat(chunks);
    console.log(`PDF ${pdf.id} length: ${result.length}`);
  });
});

app.delete('/logout', (req, res) => {
  req.logOut(() => {
    res.redirect('/login')
  })
})

app.get("/pinkslip", function (req, res) {
  res.render('pinkslip.ejs')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}


app.listen(BASE_URL, 
  () => {
  console.log('http://localhost:2000')
})

