const progress = require('progress');
const colors = require('colors');

function formatName(item) {
   let str = item && (item.name || item.email || item.id || item).toString() || '';
   if (str.length > 60) {
       return str.substr(0, 60) + '...';
   }

   return str;
}

function processArray(array, fn) {
    var results = [];
    var bar = new progress(`${'#'.grey} ${':bar'.magenta} ${':current/:total'.grey} (${':percent'.cyan}) :etas ${'-'.grey} ${':name'.cyan}`, { 
       total: array.length,
       complete: '█',
       clear: true,
       incomplete: '░',
       width: 20,
    });

    return array.reduce(function(p, item) {
       return p.then(function() {
            return fn(item).then(function(data) {
                bar.tick(1, {name: formatName(item)});
                if (data)
                    results.push(data);
                return results;
            });
       });
   }, Promise.resolve(array));
}

function splitForChunks(arr, size = 3) {
    var arrays = [];
    
    while (arr.length > 0)
        arrays.push(arr.splice(0, size));
    
    return Promise.resolve(arrays);
}

function processChunk(fn, atTheChunkEnd, array) {
    return processArray(array, fn).then(atTheChunkEnd);
}

function processArrayInChuncks(arr, fn, atTheChunkEnd, size=3) {
    return splitForChunks(arr, size).then(result=> processArray(result, processChunk.bind(this, fn, atTheChunkEnd || Promise.resolve)));
}

module.exports.processArrayInChuncks = processArrayInChuncks;
module.exports.processArray = processArray;