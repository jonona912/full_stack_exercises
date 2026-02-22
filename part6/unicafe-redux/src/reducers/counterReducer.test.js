import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './counterReducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
  test ('all actions incremented', () => {
    const goodAction = {
      type: 'GOOD'
    }
    const okAction = {
      type: 'OK'
    }
    const badAction = {
      type: 'BAD'
    }
    const resetAction = {
      type: 'RESET'
    }

    deepFreeze(initialState)
    const newGoodState = counterReducer(initialState, goodAction)
    deepFreeze(newGoodState)
    expect(newGoodState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
    const newOkState = counterReducer(newGoodState, okAction)
    deepFreeze(newOkState)
    expect(newOkState).toEqual({
      good: 1,
      ok: 1,
      bad: 0
    })
    const newBadState = counterReducer(newOkState, badAction)
    deepFreeze(newBadState)
    expect(newBadState).toEqual({
      good: 1,
      ok: 1,
      bad: 1
    })
    expect(counterReducer(newBadState, resetAction)).toEqual({
      good: 0,
      ok: 0,
      bad: 0
    })
  })
})
