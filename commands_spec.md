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
**requires authorization**  
clears logs  
## tributes  
takes additional parameter which can be 'all' or 'resistance' or 'capitol'  
sends list of tributes  
## Unregister
**requires authorization**  
unregisters a tribute  
## random  
select a random tribute from a district  
## sudoTest  
logs "hello" to console and replies with the sender's id  
## Revive (tributeName)
**requires authorization**  
revive a tribute  
**works but causes an error**  
## SendToAll
**requires authorization**  
**have not tested**  
## SendTo
**requires authorization**  
**works but will have an issue for people with space in their names**