# STD

A helper and utility library for better and cleaner code. 

## Importing
This library ships as compiled typescript that can directly be imported in node or the browser. It is recommended to use a bundler for frontend use since this lib contains quite a lot of small files. This library uses ES6 syntax and you may need some polyfills for older browsers.

To import in node:

~~~js
// complete 
const std = require('@vdbst/standard');

// only some features
const { Result, Ok, Err, fun } = require('@vdbst/standard');
~~~

# Options

## Usage 
The option class is intended to be used as a return in functions that may or may not return a value. It should move the responibility of handling null/undefined values to the callee of the function. It should also make the developer that uses functions aware of the possibility of a null/undefined value.

Basic usage:
~~~js
const { Option, OptionState } = require('@vdbst/standard');

function test (){
    const nullOrvalue = someCode();
    if(nullOrvalue === null || nullOrvalue === undefined)
        return new Option(Optionstate.none);

    return new Option(Optionstate.some, nullOrvalue);
}
~~~

## Shorthands 
To reduce the amount of code needed for that simple return there are shorter versions of new Option(...):

- Some(value) 
- None()

In most cases these should be used since they are way more readable.


~~~js
const { Option, Some, None } = require('@vdbst/standard');

function test (){
    const nullOrvalue = someCode();
    if(nullOrvalue === null || nullOrvalue === undefined)
        // same as new Option(Optionstate.none);
        return None();

    // same as new Option(Optionstate.some, nullOrvalue);
    return Some(nullOrValue);
}
~~~

But thats still pretty long. This implementeation is perfect if you want to do some null/none handling yourself, or if you have some specific cases that need to return a none value. If you just want to convert a value that may be null or undefined into an option there is another shorthand: 
~~~js
const { Option, Perhaps } = require('@vdbst/standard');

function test (){
    const nullOrvalue = someCode();
    return Perhaps(nullOrvalue) // returns a None option if null or undefined
}
~~~

## Functions
Now that we know how to create options we need a way to interact with them.

Each option object has some member functions that can be used to interact with it.

### Checking 

~~~js
Option.isSome(); // true if the option has a value
Option.isNone(); // true if the option has no value
~~~

### Getting the value 

~~~js
Option.unwrap(); // returns the value or throws an error if there is none
~~~
  
### Chaining
Options can be chained like promises! If the callback returns a value it will be converted to an Options object:
    
~~~js
// executes the function if a none option is present. 
option.or( () => {} ); // returns a new Option

// executes the function if a some option is present
option.and( () => {} ); // returns a new Option

// throws if the option is none
option.orFail(); // returns a new some option
~~~

There are some utility functions for better usage with callbacks and promises:

### Callbacks 
~~~js
const resolver = (Option: Option) => {
    // some code
}
someFunctionCall(Option.fromCallback(resolver));

// this can also be used for promise wrapping:
var x = new Promise(resolve => {
        someFunctionCall(Option.fromCallback(resolve));
});
//this will return an Option Promise    
~~~

### Promises
~~~js
const prom = Promise.resolve('all good!');
const opt = Option.fromPromise(prom);
// await opt => Some("all good!")
~~~

# Results
## Usage 
A result value is used to indicate that an operation might fail. They are very similar to Options, but the error case needs some value. It should move the responibility of handling errors to the callee of the function. It should also make the developer that uses functions aware of the possibility of an Error.

Basic usage:
~~~js
const { Result, ResultState } = require('@vdbst/standard');

function test (){
    // something that can fail
    if(error){
        return new Result(ResultState.Ok, "all good!");
    }elsE{
        return new Result(ResultState.Err, "oh no!");
    }
}
~~~

### Shorthands 
To reduce the amount of code needed for that simple return there are shorter versions of new Result(...): 

- Ok(value) 
- Err(reason)

In most cases these should be used since they are way more readable.


~~~js
const { Result, Ok, Err } = require('@vdbst/standard');

function test (){
    // something that can fail
    if(error){
        return Ok("all good!");
    }else{
        return Err("oh no!");
    }
~~~


## Functions
Now that we know how to create results we need a way to interact with them.

Each result object has some member functions that can be used to interact with it.

### Checking 

~~~js
Result.isOk(); // true if the result holds a value
Option.isErr(); // true if the result holds an error
~~~

### Getting the value

~~~js
Result.unwrap(); // returns the value or throws the error it contains
~~~
  
### Chaining

Results can be chained like promises! If the callback returns a value it will be wraped in a Result object:

~~~js
// executes the function if an error result is present. 
result.or( () => {} ); // returns a new Result

// executes the function if a value result is present
result.and( () => {} ); // returns a new Result

// throws if the option is none
result.orFail(); // returns a new Result
~~~

There are some utility functions for better usage with callbacks and promises:

### Callbacks 
~~~js
// this expects 

const resolver = (result: Result) => {
    // some code
}
someFunctionCall(Result.fromCallback(resolver));


// this can also be used for promise wrapping:
var x = new Promise(resolve => {
        someFunctionCall(Result.fromCallback(resolve));
});
//this will return a Result Promise    
~~~

### Promises
~~~js
const prom = Promise.resolve('all good!');
const res = Result.fromPromise(prom);
// await opt => Ok("all good!")

const err = Promise.reject('oh no!');
const errRes = Result.fromPromise(prom);
// await errRes => Err("oh no!")
~~~

# Fun
Using option and result is a nice way to handle Errors and Null values, but handling them requires quite a lot of code. Luckily Passing Results and Options up the scope chain can be simplified with the fun syntax!
Functions wrapped with fun will allways return Results.

## Usage
Basic usage:

~~~js
const { fun, Ok, Err } = require('@vdbst/standard');

const betterErrorFunction = fun(params => {
    // if any err results or none options are unwrapped here fun will return an error result
    someErrorResult.unwrap();
});
const betterOkFunction = fun(params => {
    return "all good!";
});

betterFunction(); // => Err(...)
betterOkFunction(); // => Ok("all good!")
~~~

This is extremely powerfull to specify requirements for a function execution to be considered a success:

~~~js
const { fun, Ok, Err } = require('@vdbst/standard');

const betterErrorFunction = fun(params => {
    var x = reallyImportantExecution().unwrap()
    logSomethingIntoDB();
    anotherImportantThing(x).orFail();
});
~~~
This will return an Err result if reallyImportantExecution or anotherImportantThing Fail, but ignore any errors in logSomethingIntoDB.

# Match
Match is a function for patternmatching. It's like a switch statement on steroids. With return value.

## Usage
~~~js
const { match, Ok } = require('@vdbst/standard');

const x = Ok("nice"); // or Err, None, Some or just any value

const res = match(x, {
    // this will match and unwrap ok results 
    Ok: (value) => true,

    // this will match err results
    Err: (error) => false,

    // this will match values like 10
    10: (val) => {console.log("its 10!"); return true;}, 

    // this will match null or undefined 
    null: (val) => {console.log("nothing is here!"); return false;}, 

    // this  will macht anything
    _: (val) => {console.log("i did not think about that"); return false;} 
});

res // => true
~~~

Only one handler will be executed. The priority is:

Result/Option type > null > value > _ 

## Returns 

Match statements will return the result of the handler. If nothing matches it will return undefined:
~~~js
const res = match(x,{});
res // => undefined
~~~
