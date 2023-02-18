import { parseManaCost } from './ManaCost'

test('parseManaCost', () => {
  expect(parseManaCost('1 white')).toEqual({ white: 1 })
  expect(parseManaCost('2 white')).toEqual({ white: 2 })
  expect(parseManaCost('2, white')).toEqual({ colorless: 2, white: 1 })
  expect(parseManaCost('2, white, 1 colorless')).toEqual({ white: 1, colorless: 3 })
})
