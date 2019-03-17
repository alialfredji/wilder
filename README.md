This a simple instagram scraping project. Running through docker. It uses [Fetchq's node extension](https://github.com/fetchq/node-client) to process queues and Grafana to show how the queues is processing.

## Containers
- grafana - displaying nice charts
- postgres - database for storage
- wilder - Node process handling the queues

## Start the project

1. Start by running the database. Both grafana and wilder relies on it. 
````
make db
````

2. Run Grafana and wilder
````
make dev
````

3. Start scraping

Add a document in `fetchq__profile__documents` where the subject is a username from instagram. example 'instagram'

## Stop project

````
make undev
````
