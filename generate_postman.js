const fs = require('fs');

const postmanCollection = {
  "info": {
    "name": "Sales Dashboard API",
    "description": "API for Sales Dashboard Data",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Dashboard Data",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/dashboard?date=2026-05-25",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "dashboard"
          ],
          "query": [
            {
              "key": "date",
              "value": "2026-05-25"
            }
          ]
        }
      },
      "response": [
        {
          "name": "Success 2026-05-25",
          "originalRequest": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/dashboard?date=2026-05-25",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "dashboard"
              ],
              "query": [
                {
                  "key": "date",
                  "value": "2026-05-25"
                }
              ]
            }
          },
          "status": "OK",
          "code": 200,
          "_postman_previewlanguage": "json",
          "header": [
            {
              "key": "Content-Type",
              "value": "application/json"
            }
          ],
          "cookie": [],
          "body": fs.readFileSync('response.json', 'utf8')
        }
      ]
    }
  ]
};

fs.writeFileSync('Sales_Dashboard_Collection.json', JSON.stringify(postmanCollection, null, 2));
console.log('Postman collection created!');
