export type VMValidator<T> = (values: T) => VMValidateResult

export interface VMValidateResult {
  hasError: boolean
  errorMessage: string
}

export interface VMRule<T> {
  name: string
  validator: VMValidator<T>
}

export type VMRuleMap<T> = {
  [key:string]: VMRule<T>[] // TODO
}

export type VMValidateResultMap = {
  [key:string]: VMValidateResult
}
