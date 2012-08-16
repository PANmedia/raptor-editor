#!/bin/bash
# If an argument is provided, run phing builds sequentially

if [[ -z $1 ]]; then
    BACKGROUND="&"
fi

# Run build tasks
for TARGET in "0deps" "nc" "light" "debug" ""
do
    phing $TARGET $BACKGROUND
done

exit 1
