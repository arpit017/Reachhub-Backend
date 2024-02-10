import axios from "axios"
// import { PlayerModel } from "./models/Player.Model";


let data = []

export default async function userPut() {
    try {
        // First, fetch the list of top players.

        
        const topPlayersResponse = await axios.get('https://lichess.org/api/player/top/500/classical');
        const users = topPlayersResponse.data.users;

        // Then, for each user, fetch their rating history in series.
        for (const user of users) {
            try {
                const ratingHistoryResponse = await axios.get(`https://lichess.org/api/user/${user.username}/rating-history`);
                // Find the classical rating history, if available. Adjust based on actual API response structure.
                const classicalRatingHistory = ratingHistoryResponse.data.find(history => history.name === 'Classical');
                if (classicalRatingHistory) {
                    let time = new Date();
                    console.log(user.username)
                    console.log(user.perfs.classical.rating)
                    console.log(time)
                    data.push({
                        name:user.username,
                        rating:user.perfs.classical.rating,
                        history:classicalRatingHistory.points
                    })
                }
            } catch (error) {
                console.error(`Error fetching rating history for ${user.username}:`, error);
            }
        }
        // console.log(data)
        return data;
    } catch (error) {
        console.error("Error fetching top players:", error);
    }
}


