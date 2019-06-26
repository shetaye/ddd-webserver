# Architecture
Client -> Web Server -> Discord Gateway -> Discord
                     -> DB
## Client - 
* Vue.js
* * Vuex
* * Vue Routers
* Axios - API Connection
Handles the display (vue.js) of proposals, votes, etc.
## Web Server - Node JS 
* Express
* CORS Library - Ease development
Responds to all API requests from the client (including file requests) and communicates with the DB
## DB - MySQL
* Knex.JS migration
Old-school :)
## Discord Gateway - Node JS
* Express
* Discord.JS
Responds to requests from the API server regarding discord info and actions (get users, execute kick, etc.)
The Discord Gateway is always running and has a gateway connection to Discord

# TODO:
## Vote submitting + Server properties
* Error handling ✓ 6th March 2019
    * Create new error object
    * Have abstraction methods in webserver all return the same type of error object (Simplify and debug error code responses + messages)
    * Promise chains in abstraction methods should handle with .catch, create a new, standard error (Adapt from axios, discord.js, sql, etc.) and throw it down the chain.
* Login Overhaul ✓ 9th March 2019
    * Dynamic module time! Use them to hold the current user constantly in state (along side auth data)
    * This user component will hold important things like the ID (for lookup of the avatar) and the name (for profile drop downs)
    * Dynamic modules will also pave the way for the forms later on when you have to store lots of different instances.
    * Refresh token usage
    * Prevent user from using pages without login (redirect to login / trigger login action)
* Security + Boundary system ✓ 26th March 2019
    * Backend checks for boundaries
    * Proposals can only be accessed by members of their's parent server
    * Users can only be accessed by members of mutual servers
    * Servers can only be accessed by their members (duh)
    * Boundaries should be implemented as client side prevention + server side prevention
    * Server should also only respond with viable proposals (e.g. only return proposals that the user can see)
    * STATE variable usage
* Votes ✓ 19th April 2019
    * Proposal live updating (Frontend)
    * Add UI elements to vote and view your vote + vote count
    * Add endpoint to push a vote
    * Add polling to UI to update view (5s delay maybe?)
    * Add a role that is required to vote (Prevent new invites / alt-accounts from voting)

## Publish proposals
* Real actions ✓ ?th April 2019
    * Flesh out existing data with real action info
    * Fill out db with actions
* Autocomplete framework ✓ 28th April 2019
    * Endpoints for listing all servers, users, channels, roles, etc.
    * Server listing is already available for the currentUser module
    * /servers/ - All servers available to the user
    * /servers/:id/autocomplete - Monolithic autocomplete object
    * Other things like action names can be hardcoded
    * These endpoints would really only provide basic ID and display info (ID + name is most important)
* Minor fixes
    * Have liveupdate either not update the entire proposal or send a resolved proposal
    * Add description to proposals
* Finish autocomplete
    * User autocompletes (/users/autocomplete)
    * Channel autocompletes (part of server)
    * Role autocompletes (part of server)
* Publish proposals
    * New backend POST endpoint
    * Wizard to create proposals
    * Backend validation of action parameters
* Edit proposals
    * New backend PATCH/PUT endpoint
    * New backend DELETE endpoint
    * Wizard to edit proposal
* Better UI elements and frontend error handling
    * Loading bar
    * Error reactions for auth (State failure, auth failure, refresh failure)
    * Error reactions for endpoints (Request failure, different reactions for 500, 401, 400, etc.)
    * Zero state
* Clean up
    * Implement all unimplemented liveupdate client events
    * Finish all TODOs
    *   * Reinforce auth state usage
    *   * Trim excess code errors + TS
## Real actions and server sttings
* Server and Proposal Properties
    * Add new table columns and DB methods
    * Add new endpoint (or actually fill out PATCH /servers/:id)
    * Add UI elements to handle setting changes


# Milestones
* Skeleton view ✓
* Real data ✓
* Votes submitting ✓
* Publish proposals
* Server sttings and actions executing
* Dashboard
* Release
