import * as yup from 'yup';

export const cardSchema = yup.object().shape({
    number: yup.string().min(4, 'Must be longer then 4 characters').required("Cannot be empty")
})