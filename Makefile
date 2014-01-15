STYLESRC = client/styles/normalize.css client/styles/grid.css \
	client/styles/user.css

SRC = client/javascripts/app.js app.js $(wildcard server/routes/*.js) \
	$(wildcard server/controllers/*.js)

TEMPLATES = $(wildcard client/templates/*.handlebars)
CLIENTSRC = client/javascripts/vendor/jquery-min.js \
	client/javascripts/vendor/underscore-min.js \
	client/javascripts/vendor/handlebars.js \
	client/javascripts/vendor/backbone-min.js \
	public/javascripts/templates.js \
	client/javascripts/app.js

all: lint build min

lint: $(SRC)
	@node_modules/.bin/jshint $^

build:
	@echo Compiling Handlebars templates...
	@node_modules/.bin/handlebars $(TEMPLATES) \
	--output public/javascripts/templates.js \
	--min
	@echo Concatenating scripts...
	@cat $(CLIENTSRC) > public/javascripts/app.js
	@echo Compiling stylesheets...
	@cat $(STYLESRC) > public/styles/style.tmp.css && \
	node_modules/.bin/myth public/styles/style.tmp.css public/styles/style.css
	@echo Cleaning up...
	@rm public/styles/style.tmp.css
	@rm public/javascripts/templates.js

min:
	@node_modules/.bin/cleancss --s0 \
	--output public/styles/style.min.css \
	public/styles/style.css

test: lint
