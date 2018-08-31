#!/bin/sh

export PATH=$PATH:/usr/local/bin:/usr/local/sbin

echo '[git hook] executing prettier and lint before commit'

# stash any unstaged changes
git stash -q --keep-index

# run lint
npm run lint

# store the last exit code in a variable
RESULT=$?

# unstash the unstashed changes
git stash pop -q

# return the 'npm run lint' exit code
exit $RESULT
