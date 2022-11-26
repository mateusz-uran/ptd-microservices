import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api/card",
    headers: {
        "Content-type": "application/json"
    }
});

const getCardByUser = username => {
    return http.get(`/?username=${username}`)
};

const CardService = {
    getCardByUser
};

export default CardService;