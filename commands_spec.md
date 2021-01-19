# user commands  
  
## start  
sends welcome message  
## help  
sends help text  
## compliment  
sends an insult or compliment with adjustable probability.  
Insult is based on a local insult list.  
Uses the complimentr.com API
## register
registers a new player
## dead
record being killed. self kill not allowed.
## kill  
record a kill (shan or stick)
## players
get list of players
## Targets  
get list of people still alive, and their kill count  
  
  
# admin commands  
## say  
repeats a message back to the sender  
can log details, used for debugging
## random
select a random player from a team
## sudoTest
logs "hello" to console and replies with the sender's id
## clear_logs  
**requires authorization**  
clears logs  
## Unregister (playerName)
**requires authorization**  
unregisters a player  
## Revive (playerName)
**requires authorization**  
revive a player  
**works but causes an error**  
## SendToAll
**requires authorization**  
**have not tested**  
## SendTo
**requires authorization**  
**works but will have an issue for people with space in their names**