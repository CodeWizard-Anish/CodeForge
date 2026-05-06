export const problemBank = [
  // 🟢 BASIC
  {
    id: 'b1', title: 'Fizz Buzz', difficulty: 'Basic',
    description: 'Given an integer n, return a string array answer where answer[i] == "FizzBuzz" if i is divisible by 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, and i (as a string) if none of the above.',
    templates: {
      javascript: "function fizzBuzz(n) {\n    \n}",
      cpp: "vector<string> fizzBuzz(int n) {\n    \n}",
      python: "def fizzBuzz(n: int) -> List[str]:\n    "
    }
  },
  {
    id: 'b2', title: 'Reverse String', difficulty: 'Basic',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.',
    templates: {
      javascript: "function reverseString(s) {\n    \n}",
      cpp: "void reverseString(vector<char>& s) {\n    \n}",
      python: "def reverseString(s: List[str]) -> None:\n    "
    }
  },

  // 🟢 EASY
  {
    id: 'e1', title: ' Two Sum', difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    templates: {
      javascript: "function twoSum(nums, target) {\n    \n}",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n    \n}",
      python: "def twoSum(nums: List[int], target: int) -> List[int]:\n    "
    }
  },
  {
    id: 'e2', title: ' Valid Parentheses', difficulty: 'Easy',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.',
    templates: {
      javascript: "function isValid(s) {\n    \n}",
      cpp: "bool isValid(string s) {\n    \n}",
      python: "def isValid(s: str) -> bool:\n    "
    }
  },
  {
    id: 'e3', title: ' Valid Anagram', difficulty: 'Easy',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    templates: {
      javascript: "function isAnagram(s, t) {\n    \n}",
      cpp: "bool isAnagram(string s, string t) {\n    \n}",
      python: "def isAnagram(s: str, t: str) -> bool:\n    "
    }
  },
  {
    id: 'e4', title: ' Contains Duplicate', difficulty: 'Easy',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    templates: {
      javascript: "function containsDuplicate(nums) {\n    \n}",
      cpp: "bool containsDuplicate(vector<int>& nums) {\n    \n}",
      python: "def containsDuplicate(nums: List[int]) -> bool:\n    "
    }
  },

  // 🟡 MEDIUM
  {
    id: 'm1', title: ' Container With Most Water', difficulty: 'Medium',
    description: 'Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    templates: {
      javascript: "function maxArea(height) {\n    \n}",
      cpp: "int maxArea(vector<int>& height) {\n    \n}",
      python: "def maxArea(height: List[int]) -> int:\n    "
    }
  },
  {
    id: 'm2', title: '3. Longest Substring Without Repeats', difficulty: 'Medium',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    templates: {
      javascript: "function lengthOfLongestSubstring(s) {\n    \n}",
      cpp: "int lengthOfLongestSubstring(string s) {\n    \n}",
      python: "def lengthOfLongestSubstring(s: str) -> int:\n    "
    }
  },
  {
    id: 'm3', title: ' Number of Islands', difficulty: 'Medium',
    description: 'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    templates: {
      javascript: "function numIslands(grid) {\n    \n}",
      cpp: "int numIslands(vector<vector<char>>& grid) {\n    \n}",
      python: "def numIslands(grid: List[List[str]]) -> int:\n    "
    }
  },
  {
    id: 'm4', title: ' Merge Intervals', difficulty: 'Medium',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    templates: {
      javascript: "function merge(intervals) {\n    \n}",
      cpp: "vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    \n}",
      python: "def merge(intervals: List[List[int]]) -> List[List[int]]:\n    "
    }
  },

  // 🔴 HARD
  {
    id: 'h1', title: ' Trapping Rain Water', difficulty: 'Hard',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    templates: {
      javascript: "function trap(height) {\n    \n}",
      cpp: "int trap(vector<int>& height) {\n    \n}",
      python: "def trap(height: List[int]) -> int:\n    "
    }
  },
  {
    id: 'h2', title: ' N-Queens', difficulty: 'Hard',
    description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return all distinct solutions to the n-queens puzzle.',
    templates: {
      javascript: "function solveNQueens(n) {\n    \n}",
      cpp: "vector<vector<string>> solveNQueens(int n) {\n    \n}",
      python: "def solveNQueens(n: int) -> List[List[str]]:\n    "
    }
  },
  {
    id: 'h3', title: ' Median of Two Sorted Arrays', difficulty: 'Hard',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    templates: {
      javascript: "function findMedianSortedArrays(nums1, nums2) {\n    \n}",
      cpp: "double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    \n}",
      python: "def findMedianSortedArrays(nums1: List[int], nums2: List[int]) -> float:\n    "
    }
  },

  // 🟣 TRICKY
  {
    id: 't1', title: ' Single Number', difficulty: 'Tricky',
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space. (Hint: Bitwise XOR)',
    templates: {
      javascript: "function singleNumber(nums) {\n    \n}",
      cpp: "int singleNumber(vector<int>& nums) {\n    \n}",
      python: "def singleNumber(nums: List[int]) -> int:\n    "
    }
  },
  {
    id: 't2', title: ' Find the Duplicate Number', difficulty: 'Tricky',
    description: 'Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums, return this repeated number. You must solve the problem without modifying the array nums and uses only constant extra space. (Hint: Floyd\'s Tortoise and Hare)',
    templates: {
      javascript: "function findDuplicate(nums) {\n    \n}",
      cpp: "int findDuplicate(vector<int>& nums) {\n    \n}",
      python: "def findDuplicate(nums: List[int]) -> int:\n    "
    }
  }
];