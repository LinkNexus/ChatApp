php := docker compose exec php
sy := $(php) bin/console

cache-clear:
	$(sy) cache:clear

composer-install: vendor/autoload.php
	$(php) composer install
	touch vendor/autoload.php

fixtures-load:
	$(sy) doctrine:fixtures:load

controller:
	$(sy) make:controller --no-template

build:
	docker compose build --no-cache

run:
	SERVER_NAME=http://levynkeneng-2.tail6ac1e7.ts.net \
    MERCURE_PUBLIC_URL=http://levynkeneng-2.tail6ac1e7.ts.net/.well-known/mercure \
    docker compose up --pull always -d --wait

migration:
	$(sy) make:migration

migrate:
	$(sy) doctrine:migration:migrate
