#!/bin/bash
printenv >> /etc/environment
exec cron -f
