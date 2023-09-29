'use client'

import type { Config, GetEnsNameErrorType, ResolvedRegister } from '@wagmi/core'
import { type Evaluate } from '@wagmi/core/internal'
import {
  type GetEnsNameData,
  type GetEnsNameOptions,
  type GetEnsNameQueryFnData,
  type GetEnsNameQueryKey,
  getEnsNameQueryOptions,
} from '@wagmi/core/query'

import type { ConfigParameter } from '../types/properties.js'
import {
  type UseQueryParameters,
  type UseQueryReturnType,
  useQuery,
} from '../utils/query.js'
import { useChainId } from './useChainId.js'
import { useConfig } from './useConfig.js'

export type UseEnsNameParameters<
  config extends Config = Config,
  selectData = GetEnsNameData,
> = Evaluate<
  GetEnsNameOptions<config> &
    ConfigParameter<config> & {
      query?:
        | UseQueryParameters<
            GetEnsNameQueryFnData,
            GetEnsNameErrorType,
            selectData,
            GetEnsNameQueryKey<config>
          >
        | undefined
    }
>

export type UseEnsNameReturnType<selectData = GetEnsNameData> =
  UseQueryReturnType<selectData, GetEnsNameErrorType>

/** https://alpha.wagmi.sh/react/api/hooks/useEnsName */
export function useEnsName<
  config extends Config = ResolvedRegister['config'],
  selectData = GetEnsNameData,
>(
  parameters: UseEnsNameParameters<config, selectData> = {},
): UseEnsNameReturnType<selectData> {
  const { address, query = {} } = parameters

  const config = useConfig(parameters)
  const chainId = useChainId()

  const queryOptions = getEnsNameQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  })
  const enabled = Boolean(address && (query.enabled ?? true))

  return useQuery({ ...queryOptions, ...query, enabled })
}
