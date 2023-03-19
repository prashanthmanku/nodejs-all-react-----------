import path from 'path'

const {expect} = require('@jest/globals')
const fs = require('fs')

const jsxCode = fs.readFileSync(
  path.resolve(__dirname, '../../index.js'),
  'utf8',
)

describe(':::RJSCPKTLF1_TEST_SUITE_1:::Congrats Card tests', () => {
  it(':::RJSCPKTLF1_TEST_1:::JSX code implementation should consist of JSX syntax for HTML main heading element at least once:::5:::', () => {
    expect(jsxCode.match(/<h1[^>]*>/).length).toBeGreaterThanOrEqual(1)
  })

  it(':::RJSCPKTLF1_TEST_2:::JSX code implementation should consist of JSX syntax for HTML paragraph element at least once:::5:::', () => {
    expect(jsxCode.match(/<p[^>]*>/).length).toBeGreaterThanOrEqual(1)
  })
  
  it(':::RJSCPKTLF1_TEST_3:::JSX code implementation should consist of JSX syntax for HTML image element at least once:::5:::', () => {
    expect(jsxCode.match(/<img[^>]/).length).toBeGreaterThanOrEqual(1)
  })
})
