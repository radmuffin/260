function testAll(input, tester) {
    let result = true
    for (let i = 0; i < input.length; i++) {
      if (!tester(input[i])) {
        result = false
        break
      }
    }
    return result
  }
  
  const strings = ['hello', 'world', 'this', 'is', 'a', 'test']
  const result = testAll(strings, (str) => str.length > 3)
  
  console.log(result);