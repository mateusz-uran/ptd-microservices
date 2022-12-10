import * as yup from 'yup';

export const cardSchema = yup.object().shape({
    number: yup.string().min(4, 'Must be longer then 4 characters').required("Cannot be empty")
});

export const tripSchema = yup.object().shape({
    dayStart: yup.string().required("Day start cannot be empty"),
    hourStart: yup.string().required("Hour start cannot be empty"),
    locationStart: yup.string().required("Location start cannot be empty"),
    countryStart: yup.string().required("Country start cannot be empty"),
    counterStart: yup.number().positive("Must be positive").integer().required("Counter start cannot be empty"),

    dayEnd: yup.string().required("Day end cannot be empty"),
    hourEnd: yup.string().required("Hour end cannot be empty"),
    locationEnd: yup.string().required("Location end cannot be empty"),
    countryEnd: yup.string().required("Country end cannot be empty"),
    counterEnd: yup.number().positive("Must be positive").integer().required("Counter end cannot be empty"),
});

export const fuelSchema = yup.object().shape({});

export const trips = yup.object({
    inputFields: yup.array().of(
        yup.object().shape({
            dayStart: yup.string().min(2, 'Must be longer then 2 characters').required("Day start cannot be empty"),
            hourStart: yup.string().required("Hour start cannot be empty"),
            locationStart: yup.string().required("Location start cannot be empty"),
            countryStart: yup.string().required("Country start cannot be empty"),
            counterStart: yup.number().positive("Must be positive").integer().required("Counter start cannot be empty"),

            dayEnd: yup.string().required("Day end cannot be empty"),
            hourEnd: yup.string().required("Hour end cannot be empty"),
            locationEnd: yup.string().required("Location end cannot be empty"),
            countryEnd: yup.string().required("Country end cannot be empty"),
            counterEnd: yup.number().positive("Must be positive").integer().required("Counter end cannot be empty"),
        })
    )
})

export const tripsHook = yup.object({
    tripInputs: yup.array().of(
        yup.object().shape({
            dayStart: yup.string().min(2, 'Must be longer then 2 characters').required("Day start cannot be empty"),
            hourStart: yup.string().required("Hour start cannot be empty"),
            locationStart: yup.string().required("Location start cannot be empty"),
            countryStart: yup.string().required("Country start cannot be empty"),
            counterStart: yup.number().positive("Must be positive").integer().required("Counter start cannot be empty"),

            dayEnd: yup.string().required("Day end cannot be empty"),
            hourEnd: yup.string().required("Hour end cannot be empty"),
            locationEnd: yup.string().required("Location end cannot be empty"),
            countryEnd: yup.string().required("Country end cannot be empty"),
            counterEnd: yup.number().positive("Must be positive").integer().required("Counter end cannot be empty"),
        })
    )
})