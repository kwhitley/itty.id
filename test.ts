const start = performance.now()

let results = await Promise.all(
  Array(1).fill(0).map(() =>
    fetch('https://itty.id/uuid/v4').then(res => res.text())
  ),
)

console.log(results)
console.log(`fetched ${results.length} results in ${performance.now() - start}ms`)