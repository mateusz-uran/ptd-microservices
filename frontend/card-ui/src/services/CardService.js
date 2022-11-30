import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api/card",
    headers: {
        "Content-type": "application/json"
    }
});

const getCardByUser = username => {
    return http.get('/', { params: { username: username } })
};

const create = card => {
    return http.post("/", card);
}

const getTripFromCard = id => {
    return http.get('/trip', { params: { id: id } })
};

const CardService = {
    getCardByUser,
    create,
    getTripFromCard
};

export default CardService;