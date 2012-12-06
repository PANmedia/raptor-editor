#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TEMP_DIRECTORY=$1

if [[ -z $TEMP_DIRECTORY ]]; then
    echo "usage: $0 TEMP_DIRECTORY"
    exit 1;
fi

mkdir -p $TEMP_DIRECTORY

for SUBDIR in "example" "packages"
do
    cp -rp "$DIR/$SUBDIR" "$TEMP_DIRECTORY/"
done

exit 1
