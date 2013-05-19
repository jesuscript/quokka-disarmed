#!/bin/bash
# v.1.0.0 (15th May 2013)
# Deploys the meteor app present in the current directory
# OVERWRITES ANYTHING IN ITS WAY

## standard fare to detect proper shell
if [ -z "$BASH" ]; then
  cat >&2 <<MSG
deploy is a bash program, and must be run with bash.
MSG
  exit 1
fi

shell=`basename "$SHELL"`
case "$shell" in
  bash) ;;
  zsh) ;;
  *)
    echo "deploy only supports zsh and bash shells." >&2
    exit 1
    ;;
esac

# check for args
if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    echo "USAGE: ./deploy.sh <username>"
    exit 1
fi

# defines vars
USERNAME=$1


echo "Starting..."

echo "Bundling app, may take a while"
meteor bundle bto.tgz

echo "SCPing bundle to server"
scp -P 2378 bto.tgz $USERNAME@108.174.49.93:

rm -f bto.tgz

ssh -t -t -p 2378 108.174.49.93 <<'ENDSSH'
# stop meteor service
sudo stop meteor-app
# wipe everything
sudo rm -rf /var/www/*
# move to the righ folder
sudo mv bto.tgz /var/www/
# untar the bundle
sudo tar xzf /var/www/bto.tgz -C /var/www
# delete source
sudo rm -f /var/www/bto.tgz
# delete native fibers from untarred bundle
sudo rm -rf /var/www/bundle/server/node_modules/fibers
# recreate native fibers
cd /var/www/bundle/server/node_modules
sudo /usr/local/bin/npm install fibers@1.0.0
# restart meteor service
sudo start meteor-app
# exits
exit
ENDSSH
echo "Deployed!"

