import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api/card/fuel",
    headers: {
        "Content-type": "application/json"
    }
});

const getFuelFromCard = id => {
    return http.get(`/?id=${id}`)
};

const FuelService = {
    getFuelFromCard
};

export default FuelService;