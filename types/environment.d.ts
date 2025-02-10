declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SWAG_LABS_URL: string;
            SWAG_LABS_USERNAME: string;
            SWAG_LABS_PASSWORD: string;
        }
    }
}
export {};