const gameDetails = require("../../admin/models/gameDetails");

const fetchedData = async (req, res) => {
    try {
        // Get the current date and time
        const now = new Date();

        // Set today's date at 9:00 AM UTC
        const startOfToday = new Date(now);
        startOfToday.setUTCHours(9, 0, 0, 0);

        // Set the start of the previous day at 9:00 AM UTC
        const startOfPreviousDay = new Date(startOfToday);
        startOfPreviousDay.setUTCDate(startOfToday.getUTCDate() - 1);

        // Fetch data from the start of the previous day at 9:00 AM to now
        const data = await gameDetails.find({
            createdAt: {
                $gte: startOfPreviousDay,
                $lt: now
            }
        });

        res.status(200).send({ message: "Data successfully fetched", data });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
};

module.exports = { fetchedData };
