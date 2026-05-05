const { Log } = require('./logger');

async function test() {
  await Log("backend", "info", "handler", "testing logging middleware");
}

test();