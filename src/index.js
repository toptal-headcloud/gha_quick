function trigger() {
  document.write(`${new Date().toLocaleString()}: info <br>`);
}

setInterval(trigger, 1000 * 20);
