# Google Reporting Analytics API

## v1

- path: localhost:5004/api/v1/analytics
- method: POST

### Headers

private_key_id
client_email
client_id

### Body

example:

```
{
    "date_ranges": [
            { "endDate": "2021-02-25", "startDate": "2010-02-11" }
          ],
}
```

date cannot be before 2005-01-01

If the body is invalid an error will occur

```
{
    "error": [
        {
            "message": "request body is not valid"
        }
    ]
}
```
