import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api/card/trip",
    headers: {
        "Content-type": "application/json"
    }
});

const getTripFromCard = id => {
    return http.get(`/?id=${id}`)
};

const TripService = {
    getTripFromCard
};

export default TripService;