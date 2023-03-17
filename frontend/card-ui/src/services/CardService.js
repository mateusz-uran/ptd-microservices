import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8181/api/card",
    headers: {
        "Content-type": "application/json"
    }
});

const getCardByUser = username => {
    return http.get('/', { params: { username: username } })
};

const getCardByUserAndMonth = (username, year, month) => {
    return http.get('/all', {
        params:
        {
            username: username,
            year: year,
            month: month
        }
    })
}

const create = (card, year, month, dayOfMonth) => {
    return http.post('/', card, {
        params:
        {
            year: year,
            month: month,
            dayOfMonth: dayOfMonth
        }
    });
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

const toggleCard = (cardId, username) => {
    return http.get("/toggle", { params: { cardId: cardId, username: username } })
};

const singleCard = id => {
    return http.get('/single', { params: { id: id } })
}

const CardService = {
    getCardByUser,
    getCardByUserAndMonth,
    create,
    getTripFromCard,
    getFuelFromCard,
    deleteCard,
    toggleCard,
    singleCard
};

export default CardService;