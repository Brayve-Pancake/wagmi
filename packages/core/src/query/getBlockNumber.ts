import { type QueryOptions } from '@tanstack/query-core'

import {
  type GetBlockNumberError,
  type GetBlockNumberParameters,
  type GetBlockNumberReturnType,
  getBlockNumber,
} from '../actions/getBlockNumber.js'
import type { Config } from '../config.js'

export type GetBlockNumberOptions<config extends Config> =
  GetBlockNumberParameters<config>

export function getBlockNumberQueryOptions<config extends Config>(
  config: Config,
  options: GetBlockNumberOptions<config> = {},
) {
  return {
    gcTime: 0,
    async queryFn({ queryKey }) {
      const blockNumber = await getBlockNumber(config, queryKey[1])
      return blockNumber ?? null
    },
    queryKey: getBlockNumberQueryKey(options),
  } as const satisfies QueryOptions<
    GetBlockNumberQueryFnData,
    GetBlockNumberError,
    GetBlockNumberData,
    GetBlockNumberQueryKey<config>
  >
}

export type GetBlockNumberQueryFnData =
  NonNullable<GetBlockNumberReturnType> | null

export type GetBlockNumberData = GetBlockNumberQueryFnData

export function getBlockNumberQueryKey<config extends Config>(
  options: GetBlockNumberOptions<config> = {},
) {
  return ['blockNumber', options] as const
}

export type GetBlockNumberQueryKey<config extends Config> = ReturnType<
  typeof getBlockNumberQueryKey<config>
>