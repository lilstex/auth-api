const Response = require('../helpers/response');
const generalHelper = require('../helpers/generalHelper');
const Room = require('../model/room');

const createRoom = async(req, res) => {
    try{
        // Check if the account is authorised to create room
        if(req.auth.role !== 'manager') {
            return Response.unAuthorizedResponse('You are not authorized to perform this task!', res);
        }
        const { roomNumber, ...roomDetails } = req.body;
        // Check if room with this number already exist
        const existingRoom = await Room.findOne({roomNumber});
        if(existingRoom) {
            return Response.failureResponse("Room Number already exist", {roomNumber}, res);
        }
        // Create Room
        const newRoom = await Room.create({
            roomNumber,
            ...roomDetails
        });
        // Remove confidential data from the return room data
        const roomData = generalHelper.removeConfidentialData(newRoom);
        return Response.createdResponse('Room creation successful', roomData, res)
    } catch(err) {
        logger.error(err);
        return Response.serverError(
            'Ooops...Something occured in Room Creation endpoint',
            res, err
        );
    }
}

module.exports = {
    createRoom,
}