'use client'

import type {
  Config,
  ReadContractsErrorType,
  ResolvedRegister,
} from '@wagmi/core'
import {
  type InfiniteReadContractsQueryFnData,
  type InfiniteReadContractsQueryKey,
  infiniteReadContractsQueryOptions,
} from '@wagmi/core/query'
import type { ContractFunctionParameters } from 'viem'

import type {
  InfiniteReadContractsData,
  InfiniteReadContractsOptions,
} from '../exports/query.js'
import type { ConfigParameter } from '../types/properties.js'
import {
  type UseInfiniteQueryParameters,
  type UseInfiniteQueryReturnType,
  structuralSharing,
  useInfiniteQuery,
} from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseInfiniteContractReadsParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  config extends Config = Config,
  pageParam = unknown,
  selectData = InfiniteReadContractsData<contracts, allowFailure>,
> = InfiniteReadContractsOptions<contracts, allowFailure, pageParam, config> &
  ConfigParameter<config> & {
    query: UseInfiniteQueryParameters<
      InfiniteReadContractsQueryFnData<contracts, allowFailure>,
      ReadContractsErrorType,
      selectData,
      InfiniteReadContractsData<contracts, allowFailure>,
      InfiniteReadContractsQueryKey<contracts, allowFailure, pageParam, config>,
      pageParam
    >
  }

export type UseInfiniteContractReadsReturnType<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  selectData = InfiniteReadContractsData<contracts, allowFailure>,
> = UseInfiniteQueryReturnType<selectData, ReadContractsErrorType>

/** https://alpha.wagmi.sh/react/api/hooks/useInfiniteContractReads */
export function useInfiniteContractReads<
  const contracts extends readonly unknown[],
  allowFailure extends boolean = true,
  config extends Config = ResolvedRegister['config'],
  pageParam = unknown,
  selectData = InfiniteReadContractsData<contracts, allowFailure>,
>(
  parameters: UseInfiniteContractReadsParameters<
    contracts,
    allowFailure,
    config,
    pageParam,
    selectData
  >,
): UseInfiniteContractReadsReturnType<contracts, allowFailure, selectData> {
  const { contracts = [], query } = parameters

  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = infiniteReadContractsQueryOptions(config, {
    ...parameters,
    chainId,
    contracts: contracts as UseInfiniteContractReadsParameters['contracts'],
    query: query as UseInfiniteQueryParameters,
  })

  return useInfiniteQuery({
    ...queryOptions,
    ...(query as any),
    initialPageParam: queryOptions.initialPageParam,
    structuralSharing: query.structuralSharing ?? structuralSharing,
  })
}
