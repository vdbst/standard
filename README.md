# STD

videoboost helper and utility library for better and cleaner code.

## Importing
This library ships bundled in umd2 format and is usable in the browser and node.js

to import in node:
~~~
const std = require("@vdbst/std");

std.match(...);
~~~

you can also use object destructing to import just the needed features:
~~~
const { match, ... }  = require("@vdbst/std")

match(...);
~~~

the library can be directly used in the browser
~~~
--- html ---
<script src="path/to/script"> </script>

--- js ---
vdbststd.match(...);
~~~

or it can be imported and bundled with webpack
~~~
import {match} from "@vdbst/std";

match(...)
~~~

## Features

### Results
Results can be used as a return value for an operation that can fail.

~~~


~~~


### Match
