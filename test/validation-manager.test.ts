import ValidationManager from '../src/validation-manager'

const inputValues = {
  select: [] as string[],
  input: ''
}

type Values = typeof inputValues

const hasErrorWith = (message: string) => ({
  hasError: true,
  errorMessage: message
})

const hasNoError = () => ({
  hasError: false,
  errorMessage: ''
})

const selectValidator = (values: Values) => {
  if (values.select.length === 0) {
    return hasErrorWith('select is required');
  }

  return hasNoError();
}

const isSelectLegalValidator = (values: Values) => {
  if (values.select.includes('unlegal')) {
    return hasErrorWith('select is not legal')
  }

  return hasNoError();
}



describe('Validation Manager test', () => {
  it('test register with mutiple name:select', () => {
    const vm = new ValidationManager<Values>(inputValues)

    vm.register('select', 'is-required', selectValidator)

    expect(vm.ruleMap).toEqual({
      select: [
        {
          name: 'is-required',
          validator: expect.any(Function)
        }
      ]
    })

    vm.register('select', 'is-legal', isSelectLegalValidator)

    expect(vm.ruleMap['select']).toHaveLength(2);

  })

  it('test triggerValidate without any validator', () => {
    const vm = new ValidationManager<Values>(inputValues)

    vm.triggerValidate('select', 'mockFn');

    expect(vm.results).toEqual({});

  })
})
