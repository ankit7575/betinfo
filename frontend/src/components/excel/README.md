# Run the APP
chmod +x ./paymate
./paymate -i ./sample/1.json

# Input Example
{
    "investment_limit":10000,
    "data":[
        {
            "name":"Hyd",
            "to_back":2.00,
            "to_lay":1.90

        },
        {
            "name":"Lkn",
            "to_back":2.40,
            "to_lay":2.30
        }
    ]
}
