import React, { useState } from 'react'

export interface LoadedValue<T> {
  state: 'loaded'
  value: T
}

export interface LoadingValue {
  state: 'loading'
}

export interface FailedValue {
  state: 'failed'
  errorMessage: string
}

export type LoadableValue<T> = { promise: Promise<T>, value?: T } & (LoadedValue<T> | LoadingValue | FailedValue)

export function useLoadableState<T> (initialValue: T): [ LoadableValue<T>, (promise: Promise<T>) => Promise<LoadableValue<T>> ] {
  const [currentValue, reactStateValue] = useState<LoadableValue<T>>({
    promise: Promise.resolve(initialValue),
    state: 'loaded',
    value: initialValue
  })

  const setValue = (value: LoadableValue<T>) => {
    reactStateValue(value)
    return value
  }

  return [
    currentValue,
    async (promise: Promise<T>) => {
      setValue({ promise, state: 'loading' })

      return await promise.then(
        value => {
          return setValue({ promise, state: 'loaded', value })
        },
        error => {
          if (error instanceof Error) {
            return setValue({ promise, state: 'failed', errorMessage: error.message })
          } else {
            return setValue({ promise, state: 'failed', errorMessage: String(error) })
          }
        }
      )
    }
  ]
}

export function Loader<T> (props: {
  value: LoadableValue<T>
  placeholder: NonNullable<T>
  children: (value: NonNullable<T>) => JSX.Element
}) {
  const [lastValue, setLastValue] = useState(props.value?.value ?? props.placeholder)

  switch (props.value.state) {
    case 'loaded': {
      const currentValue = props.value.value ?? props.placeholder
      if (currentValue !== lastValue) {
        setLastValue(currentValue)
      }
      return <div className="relative">
        {props.children(lastValue)}
      </div>
    }
    case 'loading':
      return <div className="relative">
        {props.children(lastValue)}

        <div className="absolute bg-gray-900 bg-opacity-90 top-0 left-0 w-full h-full flex justify-center items-center">
          Loading...
        </div>
      </div>
    case 'failed':
      return <div className="relative">
        {props.children(lastValue)}

        <div className="absolute bg-gray-900 bg-opacity-90 backdrop-opacity-50 top-0 left-0 w-full h-full flex justify-center items-center">
          Failed: {props.value.errorMessage}
        </div>
      </div>
  }
}
