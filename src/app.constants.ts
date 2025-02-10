import dotenv from "dotenv";

dotenv.config();

export const APPCONSTANTS = {
    SWAG_LABS_URL: process.env.SWAG_LABS_URL,
    SWAG_LABS_USER: process.env.SWAG_LABS_USERNAME,
    SWAG_LABS_PW: process.env.SWAG_LABS_PASSWORD,
};