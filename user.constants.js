const MessageHandler = require('./response_handler')

const userConstants = {
    FAILED: new MessageHandler(500, "Internal Error!!!"),
    INVALID_DETAILS: new MessageHandler(401, "Invalid User Details!!!"),
    SLIP_GENERATED: new MessageHandler(201,"Slip Generated Sucessfully!!!"),
    NO_PENDING_SLIPS: new MessageHandler(200,"There are no Pending Slips!!!"),
    SLIP_ACCEPTED : new MessageHandler(200,"Slip Status Updated!!!"),
    REMARK_GENERATED: new MessageHandler(402, "Remark successfully generated!!!"),
    REMARKS: new MessageHandler(403, "REMARKS")
}

module.exports = userConstants