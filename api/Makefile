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
	$(sy) make:controller

build:
	docker compose build --no-cache

run:
	docker compose up --pull always -d --wait

stop:
	docker compose down --remove-orphans
