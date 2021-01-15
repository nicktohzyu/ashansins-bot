# user commands

## start
sends welcome message
## help
sends help text
## compliment
sends an insult or compliment with adjustable probability.
Insult is based on a local insult list.
Compliments uses the complimentr.com API
## register
registers a new tribute
## kill
record a kill (shan)
## Targets
get list of people still alive and their kill count
## dead
record being killed
## stick
record a stick


# admin commands
## say
repeats a message back to the sender
can log details, used for debugging
## clear_logs
clears logs
## tributes
takes additional parameter which can be 'all' or 'resistance' or 'capitol'
sends list of tributes
## Unregister 
**doesn't work**
unregisters a tribute
## random
select a random tribute from a district
## sudoTest
logs "hello" to console and replies with the sender's id
## Revive (tributeName)
revive a tribute
**works but causes an error**
## SendToAll
**have not tested**
## SendTo
**works but will have an issue for people with space in their names**