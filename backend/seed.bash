#! /usr/bin/env bash

ERR="seed.err"

# delete previous errors
rm $ERR

# array of failed records
declare -a failed

for ticket in ./tickets/*; do
  printf "\nCreating '$(basename $ticket)'...";
  if uv run create $ticket 2>> $ERR ; then
    printf " \xE2\x9C\x85";
  else
    failed+=($(basename $ticket))
    printf " \xE2\x9D\x8C";
  fi
done

printf "\n\nFailed to create the following:\n"
for f in "${failed[@]}"; do
  printf "$f\n"
done
