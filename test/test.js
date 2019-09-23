
const std = require("./../dist/bundle")

const { fn, Ok, Err, match } = std;


var okResult = fn(() => {
    return Ok("working")
})

var errResult = fn(() => {
    return Err("Oh, oh")
})

match(okResult, {
    Ok: (val) => console.log("ok result is ok!", val),
    Err: (val) => console.log("ok result is err!", val)
});

match(errResult, {
    Ok: (val) => console.log("err result is ok!", val),
    Err: (val) => console.log("err result is err!", val)
});

var encErrResult = fn(() => {
    errResult.or_Fail();
    console.log("enc exec continued after error... :(");
    okResult.or_Fail();
});

console.log("matching...")

match(encErrResult, {
    Ok: (val) => console.log("enc result is ok!", val),
    Err: (val) => console.log("enc result is err!", val)
})

const matchTest = (val) => {
    match(val, {
        1: () => console.log("first"),
        2: () => console.log("second"),
        _: (val) => console.log(val+"th")
    })
}

matchTest(1);
matchTest(2);
matchTest(3);

console.log("unwraping...");

var o = okResult.unwrap();
console.log("ok result", o);

var e = errResult.unwrap();
console.log("err result", e);