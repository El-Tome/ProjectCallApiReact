start:
	docker compose up -d

startDev:
	docker compose up -d && \
	cd app/ && \
	npm run watch

stop:
	docker compose down

bash:
	docker exec -ti symfony_php_blog bash

build:
	docker compose up -d --build && \
	docker exec symfony_php_blog composer install && \
	cd app/ && \
	npm i && \
	npm run build

cc:
	docker exec symfony_php_blog php bin/console cache:clear

restart:
	docker compose down && \
	docker compose up -d && \
	docker exec symfony_php_blog php bin/console cache:clear

