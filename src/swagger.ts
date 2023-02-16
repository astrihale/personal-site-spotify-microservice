import swaggerAutogen from "swagger-autogen";
import {mkdir} from "fs/promises";
import {existsSync} from "fs";

const SwaggerOutputFolder = '/openapi/';
const SwaggerOutputPath = '.' + SwaggerOutputFolder + 'openapi-output.json';
const EndpointsPaths = ['./routes/**/*.*s'];
const SwaggerAutogenOptions = {
    openapi: '3.0.3'
};

const SwaggerConfiguration = {
    info: {
        title: 'Astrihale.me Spotify Microservice',
        description: 'This is a small api that is supposed to serve Spotify data to my personal site found at https://astrihale.me',
        version: '0.1.0'
    },
    host: 'api.astrihale.me/spotify',
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json']
};

const generateOpenApi = async () => {
    const path = __dirname + SwaggerOutputFolder;
    if (!existsSync(path))
        await mkdir(path);
    await swaggerAutogen(SwaggerAutogenOptions)(SwaggerOutputPath, EndpointsPaths, SwaggerConfiguration);
    return SwaggerOutputPath;
};

export {generateOpenApi};
