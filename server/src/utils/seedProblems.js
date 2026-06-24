import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Problem from '../models/Problem.js'

dotenv.config()

const problems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    description: `Ek integer array \`nums\` aur ek integer \`target\` diya gaya hai.
Do numbers ke indices return karo jinka sum target ke barabar ho.
Assume karo ki exactly ek solution hai, aur same element do baar use nahi kar sakte.`,
    difficulty: 'Easy',
    tags: ['Array', 'Hash Map'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] = 6' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Yahan apna code likhein\n}`,
      python: `def two_sum(nums, target):\n    # Yahan apna code likhein\n    pass`
    },
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true }
    ],
    xpReward: 10
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    description: `Ek string \`s\` diya gaya hai jisme sirf \`(\`, \`)\`, \`{\`, \`}\`, \`[\` aur \`]\` hain.
Determine karo ki input string valid hai ya nahi.
String valid hai agar: open brackets sahi order mein close hon.`,
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^4'],
    starterCode: {
      javascript: `function isValid(s) {\n  // Yahan apna code likhein\n}`,
      python: `def is_valid(s):\n    # Yahan apna code likhein\n    pass`
    },
    testCases: [
      { input: '()', expectedOutput: 'true' },
      { input: '()[{}]', expectedOutput: 'true' },
      { input: '(]', expectedOutput: 'false', isHidden: true }
    ],
    xpReward: 10
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    description: `Ek integer array \`nums\` diya gaya hai.
Largest sum wala contiguous subarray dhundho aur uska sum return karo.
(Kadane's Algorithm use karo!)`,
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', "Kadane's Algorithm"],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] ka sum = 6' },
      { input: 'nums = [1]', output: '1' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Yahan apna code likhein\n}`,
      python: `def max_sub_array(nums):\n    # Yahan apna code likhein\n    pass`
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[-1,-2,-3]', expectedOutput: '-1', isHidden: true }
    ],
    xpReward: 20
  }
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  await Problem.deleteMany({})
  await Problem.insertMany(problems)
  console.log('3 problems seed ho gaye!')
  process.exit(0)
}

seed()