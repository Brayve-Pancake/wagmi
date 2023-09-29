'use client'

import {
  type Config,
  type ReadContractsErrorType,
  type ResolvedRegister,
} from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type ReadContractsData,
  type ReadContractsOptions,
  type ReadContractsQueryFnData,
  type ReadContractsQueryKey,
  readContractsQueryOptions,
} from '@wagmi/core/query'
import { useMemo } from 'react'
import type { ContractFunctionParameters } from 'viem'

import type { ConfigParameter } from '../types/properties.js'
import {
  type UseQueryParameters,
  type UseQueryReturnType,
  structuralSharing,
  useQuery,
} from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseReadContractsParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  config extends Config = Config,
  selectData = ReadContractsData<contracts, allowFailure>,
> = Evaluate<
  ReadContractsOptions<contracts, allowFailure, config> &
    ConfigParameter<config> & {
      query?:
        | UseQueryParameters<
            ReadContractsQueryFnData<contracts, allowFailure>,
            ReadContractsErrorType,
            selectData,
            ReadContractsQueryKey<contracts, allowFailure, config>
          >
        | undefined
    }
>

export type UseReadContractsReturnType<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  selectData = ReadContractsData<contracts, allowFailure>,
> = UseQueryReturnType<selectData, ReadContractsErrorType>

/** https://alpha.wagmi.sh/react/api/hooks/useReadContracts */
export function useReadContracts<
  const contracts extends readonly unknown[],
  allowFailure extends boolean = true,
  config extends Config = ResolvedRegister['config'],
  selectData = ReadContractsData<contracts, allowFailure>,
>(
  parameters: UseReadContractsParameters<
    contracts,
    allowFailure,
    config,
    selectData
  > = {},
): UseReadContractsReturnType<contracts, allowFailure, selectData> {
  const { contracts = [], query = {} } = parameters

  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = readContractsQueryOptions(config, {
    ...parameters,
    chainId,
    contracts,
  })
  const enabled = useMemo(() => {
    let isContractsValid = false
    for (const contract of contracts) {
      const { abi, address, functionName } =
        contract as ContractFunctionParameters
      if (!abi || !address || !functionName) {
        isContractsValid = false
        break
      }
      isContractsValid = true
    }
    return Boolean(isContractsValid && (query.enabled ?? true))
  }, [contracts, query.enabled])

  return useQuery({
    ...queryOptions,
    ...query,
    enabled,
    structuralSharing: query.structuralSharing ?? structuralSharing,
  })
}
