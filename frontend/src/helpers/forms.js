export function formReducer(state, action) {
  switch (action.type) {
    case 'error':
      return {
        errors: action.payload
      };
    case 'reset':
      return {
        errors: null
      };
    default:
      throw new Error();
  }
}

export function getFieldError(state, field) {
  if (state && state['errors'] && state['errors'][field]) {
    return state['errors'][field][0]
  }
  return null
}
