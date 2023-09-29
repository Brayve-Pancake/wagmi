'use client'

import { useQueryClient } from '@tanstack/react-query'
import {
  type Config,
  type GetBlockNumberErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import {
  type Evaluate,
  type UnionEvaluate,
  type UnionOmit,
} from '@wagmi/core/internal'
import {
  type GetBlockNumberData,
  type GetBlockNumberOptions,
  type GetBlockNumberQueryFnData,
  type GetBlockNumberQueryKey,
  getBlockNumberQueryOptions,
} from '@wagmi/core/query'

import type { ConfigParameter } from '../types/properties.js'
import {
  type UseQueryParameters,
  type UseQueryReturnType,
  useQuery,
} from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'
import {
  type UseWatchBlockNumberParameters,
  useWatchBlockNumber,
} from './useWatchBlockNumber.js'

export type UseBlockNumberParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockNumberData,
> = Evaluate<
  GetBlockNumberOptions<config, chainId> &
    ConfigParameter<config> & {
      query?:
        | UseQueryParameters<
            GetBlockNumberQueryFnData,
            GetBlockNumberErrorType,
            selectData,
            GetBlockNumberQueryKey<config, chainId>
          >
        | undefined
      watch?:
        | boolean
        | UnionEvaluate<
            UnionOmit<
              UseWatchBlockNumberParameters<config, chainId>,
              'chainId' | 'config' | 'onBlockNumber' | 'onError'
            >
          >
        | undefined
    }
>

export type UseBlockNumberReturnType<selectData = GetBlockNumberData> =
  UseQueryReturnType<selectData, GetBlockNumberErrorType>

/** https://alpha.wagmi.sh/react/api/hooks/useBlockNumber */
export function useBlockNumber<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockNumberData,
>(
  parameters: UseBlockNumberParameters<config, chainId, selectData> = {},
): UseBlockNumberReturnType<selectData> {
  const { query = {}, watch } = parameters

  const config = useConfig(parameters)
  const queryClient = useQueryClient()
  const configChainId = useChainId()
  const chainId = parameters.chainId ?? configChainId

  const queryOptions = getBlockNumberQueryOptions(config, {
    ...parameters,
    chainId,
  })

  useWatchBlockNumber({
    ...{
      config: parameters.config,
      chainId: parameters.chainId as number,
    },
    ...(typeof watch === 'object'
      ? (watch as UseWatchBlockNumberParameters)
      : {}),
    enabled: Boolean(
      (query.enabled ?? true) &&
        (typeof watch === 'object' ? watch.enabled : watch),
    ),
    onBlockNumber(blockNumber) {
      queryClient.setQueryData(queryOptions.queryKey, blockNumber)
    },
  })

  return useQuery({ ...queryOptions, ...query })
}
