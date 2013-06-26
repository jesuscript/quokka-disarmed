"""Provides the deployment of a meteor app on the live server

This is the standard application deployment script for a server. It is aggressive and will wipe anything in its path.
This script replaces the old 'deploy.sh' allowing for an upgraded security standard


USAGE:
fab [live, stage] app_deploy
... etc

PREREQUISITES:

- fabric:
pip install fabric


VERSION HISTORY:

0.0.1 - Wednesday 26th June 2013
- initial release

"""


########## IMPORTS AND STRINGS ##########

from fabric.api import *
from fabric.colors import *
from fabric.contrib.files import *
from fabric.contrib.console import *
from fabric.utils import *
from fabric.operations import *


__author__ = 'Johan Daugh'
__version__ = '0.0.1'
__maintainer__ = 'Johan Daugh'
__email__ = 'johan.daugh@gmail.com'
__status__ = 'Development'


LOGO = """
##################################
#     ___ __________             #
#    / _ )_  __/ __ \            #
#   / _  |/ / / /_/ /            #
#  /____//_/  \____/             #
#                                #
#  app_deploy fabfile            #
#                                #
##################################    
"""




########## FABRIC ENVIRONMENT ##########

#env.warn_only = True

PROJECT_ROOT = '/Users/stephantual/Dropbox/bittheodds'

LIVE_IP = '108.174.49.93'
STAGE_IP = '' # we don't have a stage env yet
PORT = 2378





########## ENV TASK FUNCTIONS ##########

@task
def live():
  env.hosts = LIVE_IP # one host only please!


@task
def vm():
  env.hosts = STAGE_IP # one host only please!


def define_key_connection():
  env.user = 'johan'
  env.port = PORT
  env.key_filename = PROJECT_ROOT + '/keys/' + env.host_string + '/' + env.host_string + '_' + env.user






########## UTILITY FUNCTIONS ##########

def intro():
  cmt(LOGO)
  cmt('Fabfile %s, using Fabric %s' % (__version__, env.version))

def cmt(str_msg, bool_bold=False):
  print(yellow(str_msg, bold=bool_bold))


   


########## ACTION TASKS ##########

intro()

@task
def app_deploy():

  define_key_connection()

  cmt('*************** WARNING ***************')
  cmt('THIS SCRIPT WILL OVERWRITE ANY APP ON LIVE')
  confirmation = confirm('Continue?', default=False)

  if confirmation:
    cmt('Deploying app to %(host_string)s as %(user)s' % (env))
    cmt('Bundling app, may take a while')
    local('meteor bundle bto.tgz')
    cmt('Pushing bundle to server')
    put('bto.tgz', '')
    cmt('Deleting local bundle')
    local('rm -f bto.tgz')
    with settings(warn_only=True): # in case meteor-app is already down
      cmt('Stopping meteor service')
      sudo('stop meteor-app')
    cmt('Wiping /var/www/* clean')
    sudo('rm -rf /var/www/*')
    cmt('Moving bundle to the correct folder')
    sudo('mv bto.tgz /var/www/')
    with cd('/var/www/'):
      cmt('Decompressing bundle')
      sudo('tar xzf bto.tgz -C /var/www')
      cmt('Deleting remote bundle')
      sudo('rm -f bto.tgz')
    with cd('/var/www/bundle/server/node_modules/'):
      cmt('Deleting native fibers from the untarred bundle')
      sudo('rm -rf ./fibers')
      cmt('Recreating native fibers')
      sudo('/root/.nave/installed/0.8.25/bin/npm install fibers@1.0.0')
    cmt('Restarting meteor-app service')
    sudo('start meteor-app')
    cmt('Script Completed Successfully')

  else:
    cmt('Cancelling app_deploy. No changes made')


