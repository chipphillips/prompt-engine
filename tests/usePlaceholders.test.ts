import { test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { create } from 'react-test-renderer'
import { usePlaceholders, extractPlaceholders } from '../lib/usePlaceholders'

test('extractPlaceholders ignores helpers like {{else}}', () => {
  const template = '{{greeting}} {{#if name}}{{name}}{{else}}no name{{/if}}'
  const result = extractPlaceholders(template)
  assert.deepEqual(result, ['greeting', 'name'])
})

test('usePlaceholders returns placeholders and ignores helpers', async () => {
  let value: string[] = []
  const Wrapper = ({ template }: { template: string }) => {
    value = usePlaceholders(template)
    return null
  }

  await act(async () => {
    create(<Wrapper template="{{#if foo}}{{foo}}{{else}}bar{{/if}} {{bar}}" />)
  })

  // wait for useEffect
  await Promise.resolve()
  assert.deepEqual(value, ['foo', 'bar'])
})
