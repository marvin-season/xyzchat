// src/mocks/handlers.js
import {http, HttpResponse} from "msw";
import {content} from "./content.js";
import convertorAzure from "./convertor/convertor-azure.js";
import {createResolver} from "./utils.js";


export const handlers = [
    http.get("/user", () => {
        return HttpResponse.json({firstName: "alex"});
    }),
    http.get("/completion", createResolver(content, convertorAzure)),
];

