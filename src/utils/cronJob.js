import cron from 'node-cron';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { run as sendEmail } from './sendEmail.js';
import ConnectionRequest from '../models/connectionRequest.js';

cron.schedule('57 4 * * *', async () => {
    //send mail to everyone who received a like
    try {
        const yesterday = subDays(new Date(), 1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.email))];

        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run("New friend request pending for " + email,
                    "Please Login to Dinder, Requests pending");
                console.log(res);
            } catch (error) {
                console.error(error);
            }
        }

    } catch (error) {
        console.error(error);
    }
});