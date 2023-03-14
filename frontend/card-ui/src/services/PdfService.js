import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8181/api/pdf",
    headers: {
        "Content-type": "application/pdf"
    },
    responseType: "blob"
});

const getPdf = (cardId, userId) => {
    return http.get('/', { params: { cardId: cardId, userId: userId } })
};

const PdfService = {
    getPdf
};

export default PdfService;