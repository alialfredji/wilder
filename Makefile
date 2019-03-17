
db:
	humble up -d postgres

grafana:
	humble up -d grafana

dev: db
	humble up -d wilder
	humble up -d grafana

undev:
	humble down
