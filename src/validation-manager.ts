import { VMValidateResult, VMRule, VMValidator, VMRuleMap, VMValidateResultMap } from './interface'

export default class ValidationManager<T> {
  values: T

  ruleMap: VMRuleMap<T> = {} // TODO: 如何兼容 keyof T 和 {}

  results: VMValidateResultMap = {}

  constructor(values: T) {
    this.values = values
  }

  /**
   * 注册组件校验规则
   * @param name 组件名
   * @param ruleName 规则名称
   * @param validator 校验器
   */
  register(name: string, ruleName: string, validator: VMValidator<T>) {
    if (!this.ruleMap[name]) {
      this.ruleMap[name] = []
    }

    this.ruleMap[name].push({
      name: ruleName,
      validator: validator
    })
  }

  /**
   * 触发校验
   * @param name 组件名
   * @param ruleName 规则名称
   * @param params 额外参数
   */
  triggerValidate(name: string, ruleName: string, args?: any) {
    const params = args ? Object.assign({}, this.values, { params: args }) : this.values

    const validateResult = this.doValidate(name, ruleName, params)

    if (validateResult) {
      this.results[name] = validateResult
    }
  }

  /**
   * 执行校验
   * @param name 组件名
   * @param ruleName 规则名
   */
  doValidate(name: string, ruleName: string, params: any): VMValidateResult | undefined {
    if (this.ruleMap[name]) {
      const foundRule = this.ruleMap[name].find(rule => rule.name === ruleName)

      if (foundRule) {
        return foundRule.validator(params)
      }
    }
  }

  /** 校验全部 */
  triggerValidateAll() {
    Object.keys(this.ruleMap).forEach(name => {
      this.ruleMap[name].forEach(rule => this.triggerValidate(name, rule.name))
    })
  }
}
