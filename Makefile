STYLESRC = styles/normalize.css styles/grid.css styles/nodemavens.css

SRC = public/javascripts/app.js app.js $(wildcard public/lib/*.js) \
	$(wildcard server/routes/*.js) $(wildcard server/controllers/*.js) \
	$(wildcard models/*.js)

TEMPLATES = $(wildcard templates/*.handlebars)

all: lint build min

lint: $(SRC)
	@node_modules/.bin/jshint $^

build:
	@echo Compiling templates...
	@node_modules/.bin/handlebars $(TEMPLATES) \
	--output public/javascripts/templates.js \
	--min
	@echo Compiling styles...
	@cat $(STYLESRC) > public/styles/style.tmp.css && \
	node_modules/.bin/myth public/styles/style.tmp.css public/styles/style.css
	@echo Cleaning up...
	@rm public/styles/style.tmp.css

min:
	@node_modules/.bin/cleancss --s0 \
	--output public/styles/style.min.css \
	public/styles/style.css

test: lint
