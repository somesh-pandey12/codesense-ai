import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Problem from '../models/Problem.js'

dotenv.config()

const problems = [
  // ==================== ARRAYS ====================
  {
    title: 'Two Sum',
    slug: 'two-sum',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    difficulty: 'Easy',
    tags: ['Array', 'Hash Map'],
    company: ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple'],
    hints: ['Try using a hash map to store complements', 'For each element, check if target - element exists in map'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists'],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Your solution here\n}`,
      python: `def two_sum(nums, target):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true }
    ],
    xpReward: 10, acceptanceRate: 49.1, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-sell-stock',
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve. If you cannot achieve any profit, return 0.`,
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming', 'Sliding Window'],
    company: ['Amazon', 'Microsoft', 'Facebook', 'Goldman Sachs'],
    hints: ['Track the minimum price seen so far', 'At each step, calculate profit if sold today'],
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6), profit = 5' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profit possible' }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    starterCode: {
      javascript: `function maxProfit(prices) {\n  // Your solution here\n}`,
      python: `def max_profit(prices):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      { input: '[7,6,4,3,1]', expectedOutput: '0' },
      { input: '[1,2]', expectedOutput: '1', isHidden: true }
    ],
    xpReward: 10, acceptanceRate: 54.2, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    difficulty: 'Easy',
    tags: ['Array', 'Hash Set', 'Sorting'],
    company: ['Amazon', 'Apple', 'Netflix'],
    hints: ['Use a Set to track seen elements'],
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' },
      { input: 'nums = [1,2,3,4]', output: 'false' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      javascript: `function containsDuplicate(nums) {\n  // Your solution here\n}`,
      python: `def contains_duplicate(nums):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[1,2,3,1]', expectedOutput: 'true' },
      { input: '[1,2,3,4]', expectedOutput: 'false' },
      { input: '[1,1,1,3,3,4,3,2,4,2]', expectedOutput: 'true', isHidden: true }
    ],
    xpReward: 10, acceptanceRate: 61.3, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nThis is the classic Kadane's Algorithm problem asked in almost every company interview.`,
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', "Kadane's Algorithm"],
    company: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Adobe'],
    hints: ["Use Kadane's algorithm", 'Track current sum and max sum'],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has largest sum = 6' },
      { input: 'nums = [1]', output: '1' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Your solution here\n}`,
      python: `def max_sub_array(nums):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[-1,-2,-3]', expectedOutput: '-1', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 49.6, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.`,
    difficulty: 'Medium',
    tags: ['Array', 'Prefix Sum'],
    company: ['Amazon', 'Facebook', 'Microsoft', 'Apple', 'Lyft'],
    hints: ['Calculate prefix products from left', 'Calculate suffix products from right', 'Multiply them together'],
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' }
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
    starterCode: {
      javascript: `function productExceptSelf(nums) {\n  // Your solution here\n}`,
      python: `def product_except_self(nums):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]' },
      { input: '[-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]' }
    ],
    xpReward: 20, acceptanceRate: 65.1, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Maximum Product Subarray',
    slug: 'maximum-product-subarray',
    description: `Given an integer array nums, find a subarray that has the largest product, and return the product.\n\nTrick: You need to track both maximum and minimum at each step because a negative times negative = positive.`,
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    company: ['Amazon', 'Microsoft', 'LinkedIn'],
    hints: ['Track both max and min product at each position', 'Negative number can flip max to min'],
    examples: [
      { input: 'nums = [2,3,-2,4]', output: '6', explanation: 'Subarray [2,3] has largest product = 6' },
      { input: 'nums = [-2,0,-1]', output: '0' }
    ],
    constraints: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10'],
    starterCode: {
      javascript: `function maxProduct(nums) {\n  // Your solution here\n}`,
      python: `def max_product(nums):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[2,3,-2,4]', expectedOutput: '6' },
      { input: '[-2,0,-1]', expectedOutput: '0' },
      { input: '[-2,3,-4]', expectedOutput: '24', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 34.8, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Find Minimum in Rotated Sorted Array',
    slug: 'find-minimum-rotated-sorted-array',
    description: `Suppose an array of length n sorted in ascending order is rotated between 1 and n times.\n\nGiven the sorted rotated array nums of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.`,
    difficulty: 'Medium',
    tags: ['Array', 'Binary Search'],
    company: ['Microsoft', 'Amazon', 'Facebook'],
    hints: ['Use binary search', 'Compare mid with right boundary to determine which half to search'],
    examples: [
      { input: 'nums = [3,4,5,1,2]', output: '1' },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0' }
    ],
    constraints: ['n == nums.length', '1 <= n <= 5000', 'All elements unique'],
    starterCode: {
      javascript: `function findMin(nums) {\n  // Your solution here\n}`,
      python: `def find_min(nums):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[3,4,5,1,2]', expectedOutput: '1' },
      { input: '[4,5,6,7,0,1,2]', expectedOutput: '0' },
      { input: '[11,13,15,17]', expectedOutput: '11', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 48.7, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Search in Rotated Sorted Array',
    slug: 'search-rotated-sorted-array',
    description: `Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.`,
    difficulty: 'Medium',
    tags: ['Array', 'Binary Search'],
    company: ['Google', 'Amazon', 'Facebook', 'Microsoft', 'Bloomberg'],
    hints: ['Modified binary search', 'Determine which half is sorted, then check if target is in that half'],
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' }
    ],
    constraints: ['1 <= nums.length <= 5000', 'All values unique'],
    starterCode: {
      javascript: `function search(nums, target) {\n  // Your solution here\n}`,
      python: `def search(nums, target):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[4,5,6,7,0,1,2]\n0', expectedOutput: '4' },
      { input: '[4,5,6,7,0,1,2]\n3', expectedOutput: '-1' },
      { input: '[1]\n0', expectedOutput: '-1', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 38.9, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: '3Sum',
    slug: 'three-sum',
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.`,
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    company: ['Amazon', 'Facebook', 'Microsoft', 'Adobe', 'Apple'],
    hints: ['Sort the array first', 'Use two pointers for the remaining two elements', 'Skip duplicates carefully'],
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' }
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    starterCode: {
      javascript: `function threeSum(nums) {\n  // Your solution here\n}`,
      python: `def three_sum(nums):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
      { input: '[0,1,1]', expectedOutput: '[]' },
      { input: '[0,0,0]', expectedOutput: '[[0,0,0]]', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 32.4, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.`,
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    company: ['Amazon', 'Bloomberg', 'Google', 'Facebook'],
    hints: ['Use two pointers from both ends', 'Move the pointer with smaller height inward'],
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: 'height = [1,1]', output: '1' }
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    starterCode: {
      javascript: `function maxArea(height) {\n  // Your solution here\n}`,
      python: `def max_area(height):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
      { input: '[1,1]', expectedOutput: '1' }
    ],
    xpReward: 20, acceptanceRate: 54.0, timeLimit: 1000, memoryLimit: 256
  },

  // ==================== STRINGS ====================
  {
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    difficulty: 'Easy',
    tags: ['String', 'Hash Map', 'Sorting'],
    company: ['Amazon', 'Microsoft', 'Bloomberg'],
    hints: ['Count character frequencies', 'Compare frequency maps'],
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' }
    ],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters'],
    starterCode: {
      javascript: `function isAnagram(s, t) {\n  // Your solution here\n}`,
      python: `def is_anagram(s, t):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: 'anagram\nnagaram', expectedOutput: 'true' },
      { input: 'rat\ncar', expectedOutput: 'false' }
    ],
    xpReward: 10, acceptanceRate: 63.1, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n- Open brackets must be closed by the same type of brackets.\n- Open brackets must be closed in the correct order.\n- Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    company: ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Bloomberg'],
    hints: ['Use a stack', 'Push open brackets, pop and verify for close brackets'],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
    starterCode: {
      javascript: `function isValid(s) {\n  // Your solution here\n}`,
      python: `def is_valid(s):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '()', expectedOutput: 'true' },
      { input: '()[{}]', expectedOutput: 'true' },
      { input: '(]', expectedOutput: 'false', isHidden: true }
    ],
    xpReward: 10, acceptanceRate: 40.2, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating',
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    difficulty: 'Medium',
    tags: ['String', 'Sliding Window', 'Hash Map'],
    company: ['Amazon', 'Bloomberg', 'Microsoft', 'Google', 'Facebook'],
    hints: ['Use sliding window with a set', 'Expand right, shrink left when duplicate found'],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'Substring "abc" has length 3' },
      { input: 's = "bbbbb"', output: '1' },
      { input: 's = "pwwkew"', output: '3' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Your solution here\n}`,
      python: `def length_of_longest_substring(s):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3' },
      { input: 'bbbbb', expectedOutput: '1' },
      { input: 'pwwkew', expectedOutput: '3', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 33.8, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Longest Palindromic Substring',
    slug: 'longest-palindromic-substring',
    description: `Given a string s, return the longest palindromic substring in s.\n\nA string is palindromic if it reads the same forward and backward.`,
    difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming', 'Two Pointers'],
    company: ['Amazon', 'Microsoft', 'Google', 'Bloomberg'],
    hints: ['Expand around center for each character', 'Check both odd and even length palindromes'],
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also valid' },
      { input: 's = "cbbd"', output: '"bb"' }
    ],
    constraints: ['1 <= s.length <= 1000', 's consists of digits and English letters'],
    starterCode: {
      javascript: `function longestPalindrome(s) {\n  // Your solution here\n}`,
      python: `def longest_palindrome(s):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: 'babad', expectedOutput: 'bab' },
      { input: 'cbbd', expectedOutput: 'bb' },
      { input: 'a', expectedOutput: 'a', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 32.5, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    difficulty: 'Medium',
    tags: ['String', 'Hash Map', 'Sorting'],
    company: ['Amazon', 'Facebook', 'Google', 'Apple', 'Uber'],
    hints: ['Sort each string to get a key', 'Group strings with same sorted key'],
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
    starterCode: {
      javascript: `function groupAnagrams(strs) {\n  // Your solution here\n}`,
      python: `def group_anagrams(strs):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: '[""]', expectedOutput: '[[""]]' }
    ],
    xpReward: 20, acceptanceRate: 67.2, timeLimit: 1000, memoryLimit: 256
  },

  // ==================== LINKED LIST ====================
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nThis is one of the most fundamental linked list problems asked in every company.`,
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    company: ['Amazon', 'Microsoft', 'Facebook', 'Apple', 'Google'],
    hints: ['Use three pointers: prev, curr, next', 'Or use recursion'],
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' }
    ],
    constraints: ['The number of nodes in the list is in range [0, 5000]'],
    starterCode: {
      javascript: `function reverseList(head) {\n  // Your solution here\n}`,
      python: `def reverse_list(head):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { input: '[1,2]', expectedOutput: '[2,1]' },
      { input: '[]', expectedOutput: '[]', isHidden: true }
    ],
    xpReward: 10, acceptanceRate: 73.6, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    description: `You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.`,
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    company: ['Amazon', 'Microsoft', 'Google', 'Apple'],
    hints: ['Use a dummy head node', 'Compare nodes one by one'],
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' }
    ],
    constraints: ['Both lists are sorted in non-decreasing order'],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {\n  // Your solution here\n}`,
      python: `def merge_two_lists(list1, list2):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[1,2,4]\n[1,3,4]', expectedOutput: '[1,1,2,3,4,4]' },
      { input: '[]\n[]', expectedOutput: '[]' }
    ],
    xpReward: 10, acceptanceRate: 62.4, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Linked List Cycle',
    slug: 'linked-list-cycle',
    description: `Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.\n\nReturn true if there is a cycle in the linked list. Otherwise, return false.`,
    difficulty: 'Easy',
    tags: ['Linked List', 'Two Pointers', "Floyd's Algorithm"],
    company: ['Amazon', 'Microsoft', 'Google'],
    hints: ["Use Floyd's cycle detection (fast & slow pointers)", 'If they meet, cycle exists'],
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'true' },
      { input: 'head = [1,2], pos = 0', output: 'true' },
      { input: 'head = [1], pos = -1', output: 'false' }
    ],
    constraints: ['Number of nodes is in range [0, 10^4]'],
    starterCode: {
      javascript: `function hasCycle(head) {\n  // Your solution here\n}`,
      python: `def has_cycle(head):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[3,2,0,-4]\n1', expectedOutput: 'true' },
      { input: '[1]\n-1', expectedOutput: 'false' }
    ],
    xpReward: 10, acceptanceRate: 46.2, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Remove Nth Node From End of List',
    slug: 'remove-nth-node-from-end',
    description: `Given the head of a linked list, remove the nth node from the end of the list and return its head.`,
    difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers'],
    company: ['Amazon', 'Microsoft', 'Facebook'],
    hints: ['Use two pointers with n gap between them', 'When fast reaches end, slow is at target'],
    examples: [
      { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]' },
      { input: 'head = [1], n = 1', output: '[]' }
    ],
    constraints: ['Number of nodes is sz', '1 <= sz <= 30', '1 <= n <= sz'],
    starterCode: {
      javascript: `function removeNthFromEnd(head, n) {\n  // Your solution here\n}`,
      python: `def remove_nth_from_end(head, n):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[1,2,3,4,5]\n2', expectedOutput: '[1,2,3,5]' },
      { input: '[1]\n1', expectedOutput: '[]' }
    ],
    xpReward: 20, acceptanceRate: 42.8, timeLimit: 1000, memoryLimit: 256
  },

  // ==================== TREES ====================
  {
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-binary-tree',
    description: `Given the root of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    difficulty: 'Easy',
    tags: ['Tree', 'DFS', 'BFS', 'Recursion'],
    company: ['Amazon', 'LinkedIn', 'Apple', 'Google'],
    hints: ['Use DFS recursively', 'Depth = 1 + max(left depth, right depth)'],
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
      { input: 'root = [1,null,2]', output: '2' }
    ],
    constraints: ['Number of nodes is in range [0, 10^4]'],
    starterCode: {
      javascript: `function maxDepth(root) {\n  // Your solution here\n}`,
      python: `def max_depth(root):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '3' },
      { input: '[1,null,2]', expectedOutput: '2' },
      { input: '[]', expectedOutput: '0', isHidden: true }
    ],
    xpReward: 10, acceptanceRate: 73.9, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    description: `Given the root of a binary tree, invert the tree, and return its root.\n\nFun fact: This problem was used by Max Howell (homebrew creator) in his infamous Google interview tweet.`,
    difficulty: 'Easy',
    tags: ['Tree', 'DFS', 'BFS'],
    company: ['Google', 'Amazon', 'Apple', 'Microsoft'],
    hints: ['Recursively swap left and right children', 'Or use BFS with a queue'],
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
      { input: 'root = [2,1,3]', output: '[2,3,1]' }
    ],
    constraints: ['Number of nodes is in range [0, 100]'],
    starterCode: {
      javascript: `function invertTree(root) {\n  // Your solution here\n}`,
      python: `def invert_tree(root):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]' },
      { input: '[2,1,3]', expectedOutput: '[2,3,1]' }
    ],
    xpReward: 10, acceptanceRate: 75.2, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Binary Tree Level Order Traversal',
    slug: 'binary-tree-level-order-traversal',
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
    difficulty: 'Medium',
    tags: ['Tree', 'BFS', 'Queue'],
    company: ['Amazon', 'Facebook', 'Microsoft', 'Bloomberg'],
    hints: ['Use a queue for BFS', 'Process all nodes at current level before moving to next'],
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' }
    ],
    constraints: ['Number of nodes is in range [0, 2000]'],
    starterCode: {
      javascript: `function levelOrder(root) {\n  // Your solution here\n}`,
      python: `def level_order(root):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]' },
      { input: '[1]', expectedOutput: '[[1]]' },
      { input: '[]', expectedOutput: '[]', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 65.4, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Validate Binary Search Tree',
    slug: 'validate-binary-search-tree',
    description: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys less than the node's key.\n- The right subtree of a node contains only nodes with keys greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.`,
    difficulty: 'Medium',
    tags: ['Tree', 'DFS', 'BST'],
    company: ['Amazon', 'Bloomberg', 'Microsoft', 'Facebook'],
    hints: ['Pass min and max bounds to each recursive call', 'Left child must be < current, right must be > current'],
    examples: [
      { input: 'root = [2,1,3]', output: 'true' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false' }
    ],
    constraints: ['Number of nodes is in range [1, 10^4]'],
    starterCode: {
      javascript: `function isValidBST(root) {\n  // Your solution here\n}`,
      python: `def is_valid_bst(root):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[2,1,3]', expectedOutput: 'true' },
      { input: '[5,1,4,null,null,3,6]', expectedOutput: 'false' }
    ],
    xpReward: 20, acceptanceRate: 32.1, timeLimit: 1000, memoryLimit: 256
  },

  // ==================== DYNAMIC PROGRAMMING ====================
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    description: `You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nThis is essentially the Fibonacci sequence!`,
    difficulty: 'Easy',
    tags: ['Dynamic Programming', 'Math', 'Fibonacci'],
    company: ['Amazon', 'Google', 'Apple', 'Adobe'],
    hints: ['dp[i] = dp[i-1] + dp[i-2]', 'Base cases: dp[1] = 1, dp[2] = 2'],
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' }
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript: `function climbStairs(n) {\n  // Your solution here\n}`,
      python: `def climb_stairs(n):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '45', expectedOutput: '1836311903', isHidden: true }
    ],
    xpReward: 10, acceptanceRate: 51.8, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'House Robber',
    slug: 'house-robber',
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed.\n\nAll houses are arranged in a line. Adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Array'],
    company: ['Amazon', 'Google', 'Microsoft', 'Airbnb'],
    hints: ['dp[i] = max(dp[i-1], dp[i-2] + nums[i])', 'Either rob current house or skip it'],
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 1 (1) and house 3 (3)' },
      { input: 'nums = [2,7,9,3,1]', output: '12' }
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    starterCode: {
      javascript: `function rob(nums) {\n  // Your solution here\n}`,
      python: `def rob(nums):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[1,2,3,1]', expectedOutput: '4' },
      { input: '[2,7,9,3,1]', expectedOutput: '12' },
      { input: '[2,1,1,2]', expectedOutput: '4', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 49.5, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.`,
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'BFS'],
    company: ['Amazon', 'Google', 'Microsoft', 'Goldman Sachs', 'Facebook'],
    hints: ['Bottom-up DP', 'dp[i] = min coins needed to make amount i'],
    examples: [
      { input: 'coins = [1,5,11], amount = 11', output: '1' },
      { input: 'coins = [2], amount = 3', output: '-1' }
    ],
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n  // Your solution here\n}`,
      python: `def coin_change(coins, amount):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[1,5,11]\n11', expectedOutput: '1' },
      { input: '[2]\n3', expectedOutput: '-1' },
      { input: '[1,2,5]\n11', expectedOutput: '3', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 42.9, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Longest Common Subsequence',
    slug: 'longest-common-subsequence',
    description: `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.`,
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'String'],
    company: ['Google', 'Amazon', 'Microsoft', 'Bloomberg'],
    hints: ['2D DP table', 'If chars match: dp[i][j] = dp[i-1][j-1] + 1'],
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'LCS is "ace"' },
      { input: 'text1 = "abc", text2 = "abc"', output: '3' }
    ],
    constraints: ['1 <= text1.length, text2.length <= 1000'],
    starterCode: {
      javascript: `function longestCommonSubsequence(text1, text2) {\n  // Your solution here\n}`,
      python: `def longest_common_subsequence(text1, text2):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: 'abcde\nace', expectedOutput: '3' },
      { input: 'abc\nabc', expectedOutput: '3' },
      { input: 'abc\ndef', expectedOutput: '0', isHidden: true }
    ],
    xpReward: 20, acceptanceRate: 57.8, timeLimit: 1000, memoryLimit: 256
  },

  // ==================== GRAPHS ====================
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    description: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    difficulty: 'Medium',
    tags: ['Graph', 'DFS', 'BFS', 'Union Find'],
    company: ['Amazon', 'Google', 'Microsoft', 'Facebook', 'Bloomberg'],
    hints: ['DFS from each unvisited land cell', 'Mark visited cells as water to avoid revisiting'],
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'],
    starterCode: {
      javascript: `function numIslands(grid) {\n  // Your solution here\n}`,
      python: `def num_islands(grid):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3' }
    ],
    xpReward: 20, acceptanceRate: 57.5, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Clone Graph',
    slug: 'clone-graph',
    description: `Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.\n\nEach node in the graph contains a value (int) and a list of its neighbors.`,
    difficulty: 'Medium',
    tags: ['Graph', 'DFS', 'BFS', 'Hash Map'],
    company: ['Facebook', 'Amazon', 'Google'],
    hints: ['Use a map to track cloned nodes', 'DFS to clone each node and its neighbors'],
    examples: [
      { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' }
    ],
    constraints: ['Number of nodes is in range [0, 100]'],
    starterCode: {
      javascript: `function cloneGraph(node) {\n  // Your solution here\n}`,
      python: `def clone_graph(node):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[[2,4],[1,3],[2,4],[1,3]]', expectedOutput: '[[2,4],[1,3],[2,4],[1,3]]' }
    ],
    xpReward: 20, acceptanceRate: 55.3, timeLimit: 1000, memoryLimit: 256
  },

  // ==================== HARD ====================
  {
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).`,
    difficulty: 'Hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    company: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Goldman Sachs'],
    hints: ['Binary search on smaller array', 'Find correct partition where left half <= right half'],
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000' }
    ],
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m, n <= 1000'],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n  // Your solution here\n}`,
      python: `def find_median_sorted_arrays(nums1, nums2):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[1,3]\n[2]', expectedOutput: '2.00000' },
      { input: '[1,2]\n[3,4]', expectedOutput: '2.50000' }
    ],
    xpReward: 50, acceptanceRate: 38.2, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\nThis is one of the most classic interview problems at top companies.`,
    difficulty: 'Hard',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    company: ['Amazon', 'Google', 'Microsoft', 'Goldman Sachs', 'Facebook'],
    hints: ['For each bar, water = min(maxLeft, maxRight) - height', 'Use two pointers to optimize to O(n)'],
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' }
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    starterCode: {
      javascript: `function trap(height) {\n  // Your solution here\n}`,
      python: `def trap(height):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9' }
    ],
    xpReward: 50, acceptanceRate: 58.9, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Word Ladder',
    slug: 'word-ladder',
    description: `A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words such that:\n- The first word is beginWord\n- The last word is endWord\n- Only one letter can be changed at a time\n- Each transformed word must exist in the word list\n\nReturn the number of words in the shortest transformation sequence, or 0 if no such sequence exists.`,
    difficulty: 'Hard',
    tags: ['BFS', 'Hash Set', 'String'],
    company: ['Amazon', 'Facebook', 'Google', 'LinkedIn'],
    hints: ['Use BFS for shortest path', 'Change each character and check if word exists in set'],
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5' }
    ],
    constraints: ['1 <= beginWord.length <= 10', 'All words have the same length'],
    starterCode: {
      javascript: `function ladderLength(beginWord, endWord, wordList) {\n  // Your solution here\n}`,
      python: `def ladder_length(begin_word, end_word, word_list):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: 'hit\ncog\n["hot","dot","dog","lot","log","cog"]', expectedOutput: '5' },
      { input: 'hit\ncog\n["hot","dot","dog","lot","log"]', expectedOutput: '0' }
    ],
    xpReward: 50, acceptanceRate: 36.4, timeLimit: 2000, memoryLimit: 256
  },
  {
    title: 'LRU Cache',
    slug: 'lru-cache',
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n- LRUCache(int capacity) — Initialize with positive size capacity\n- int get(int key) — Return value if key exists, else -1\n- void put(int key, int value) — Update value if key exists, otherwise add. If capacity exceeded, evict LRU key.\n\nBoth get and put must run in O(1) time complexity.`,
    difficulty: 'Hard',
    tags: ['Hash Map', 'Doubly Linked List', 'Design'],
    company: ['Amazon', 'Microsoft', 'Google', 'Facebook', 'Apple'],
    hints: ['Combine HashMap with Doubly Linked List', 'HashMap gives O(1) access, DLL gives O(1) insertion/deletion'],
    examples: [
      { input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', output: '[null,null,null,1,null,-1,null,-1,3,4]' }
    ],
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4'],
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    // Your solution here\n  }\n  get(key) {\n    // Your solution here\n  }\n  put(key, value) {\n    // Your solution here\n  }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity):\n        # Your solution here\n        pass\n    def get(self, key):\n        # Your solution here\n        pass\n    def put(self, key, value):\n        # Your solution here\n        pass`
    },
    testCases: [
      { input: '2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4', expectedOutput: '1\n-1\n-1\n3\n4' }
    ],
    xpReward: 50, acceptanceRate: 42.1, timeLimit: 1000, memoryLimit: 256
  },
  {
    title: 'Merge K Sorted Lists',
    slug: 'merge-k-sorted-lists',
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.`,
    difficulty: 'Hard',
    tags: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'],
    company: ['Amazon', 'Google', 'Microsoft', 'Facebook'],
    hints: ['Use divide and conquer — merge pairs', 'Or use a min-heap of size k'],
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' }
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4'],
    starterCode: {
      javascript: `function mergeKLists(lists) {\n  // Your solution here\n}`,
      python: `def merge_k_lists(lists):\n    # Your solution here\n    pass`
    },
    testCases: [
      { input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]' },
      { input: '[]', expectedOutput: '[]' }
    ],
    xpReward: 50, acceptanceRate: 51.2, timeLimit: 1000, memoryLimit: 256
  }
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    await Problem.deleteMany({})
    await Problem.insertMany(problems)
    console.log(`✓ ${problems.length} problems seeded successfully!`)
    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  }
}

seed()