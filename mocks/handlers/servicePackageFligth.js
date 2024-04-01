import { http, HttpResponse } from "msw";
import { reviewPackage } from "../data/reviewPackage.js";

export const packagesFligth = [
   http.get("https://mihost.web-travel.com/users", () => {
      return HttpResponse.json(reviewPackage);
   }),
];
