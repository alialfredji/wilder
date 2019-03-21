
db:
	humble up -d postgres

grafana:
	humble up -d grafana

wilder:
	humble up -d wilder
	humble logs -f wilder

dev: db
	humble up -d wilder
	humble up -d grafana

undev:
	humble down
