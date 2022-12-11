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
    return http.post('/', card);
}

const getTripFromCard = id => {
    return http.get('/trip', { params: { id: id } })
};

const getFuelFromCard = id => {
    return http.get('/fuel', { params: { id: id } })
};

const deleteCard = id => {
    return http.delete('/', { params: { id: id } })
};

const toggleCard = id => {
    return http.get("/toggle", { params: { id: id } })
};

const singleCard = id => {
    return http.get('/single', { params: { id: id } })
}

const CardService = {
    getCardByUser,
    create,
    getTripFromCard,
    getFuelFromCard,
    deleteCard,
    toggleCard,
    singleCard
};

export default CardService;