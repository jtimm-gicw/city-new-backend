// Create a simple in-memory cache to store API responses at the root level of our application. This cache will be an object where the keys are search queries and the values are objects containing the cached data and a timestamp.

'use strict';

// Simple shared in-memory cache object
// This MUST remain mutable for caching to work

const cache = {};

module.exports = cache;
/*
This object acts as temporary storage
for API responses.

The keys will be search terms such as:

cache["pizza"]
cache["chicken soup"]

and the values will contain:
- recipe data
- timestamp
*/

