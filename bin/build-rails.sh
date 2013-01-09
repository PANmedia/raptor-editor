#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
php $DIR/../scripts/expose.php > $DIR/../src/expose.js
phing -Dfiles.manifest=build/rails.manifest -Dfilename=raptor.rails
