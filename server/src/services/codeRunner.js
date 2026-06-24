import { VM } from 'vm2'

export const runJavaScript = (code, testCases) => {
  const results = []

  for (const test of testCases) {
    const startTime = Date.now()
    try {
      const vm = new VM({
        timeout: 3000,  
        sandbox: {}
      })

      const fullCode = `
        ${code}
        
        // Test input parse karo
        const lines = \`${test.input}\`.trim().split('\\n');
        
        // Common patterns handle karo
        let result;
        try {
          // Array input detect karo
          if (lines[0].startsWith('[')) {
            const args = lines.map(l => JSON.parse(l));
            // Function name auto-detect karo
            const fnMatch = \`${code}\`.match(/function\\s+(\\w+)/);
            if (fnMatch) {
              result = eval(fnMatch[1] + '(' + args.map(a => JSON.stringify(a)).join(',') + ')');
            }
          } else {
            // Number ya string input
            const args = lines.map(l => isNaN(l) ? l.trim() : Number(l));
            const fnMatch = \`${code}\`.match(/function\\s+(\\w+)/);
            if (fnMatch) {
              result = eval(fnMatch[1] + '(' + args.join(',') + ')');
            }
          }
        } catch(e) {
          result = eval(\`(${code.replace(/`/g, '\\`')})\`);
        }
        
        JSON.stringify(result);
      `

      const output = vm.run(fullCode)
      const runtime = Date.now() - startTime
      const expected = test.expectedOutput.trim()
      const actual = output?.toString().trim()

      results.push({
        passed: actual === expected,
        input: test.input,
        expected,
        actual: actual || 'undefined',
        runtime,
        hidden: test.isHidden || false
      })
    } catch (err) {
      results.push({
        passed: false,
        input: test.input,
        expected: test.expectedOutput,
        actual: 'Runtime Error',
        error: err.message,
        runtime: Date.now() - startTime,
        hidden: test.isHidden || false
      })
    }
  }

  return results
}