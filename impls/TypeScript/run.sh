#!/bin/bash
exec yarn run $(dirname $0)/${STEP:-stepA_mal}.ts "${@}"
