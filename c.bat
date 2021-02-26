#!/bin/sh
tsc --version
tsc --rootDir src/ --outDir distrib/  src/controller/*.ts src/controller/**/*.ts src/model/*.ts