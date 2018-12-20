.DEFAULT_GOAL := help

FRONT_BUNDLE ?= ../araragame.tar.gz

.PHONY: araragame
araragame:
	cd araragame/ && BUNDLE=$(FRONT_BUNDLE) $(MAKE) tar

.PHONY: help
help:
    @grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS =     ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'