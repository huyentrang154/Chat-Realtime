export const KeyReducer = (state = {key:"uI2ooxtwHeI6q69PS98fx9SWVGbpQohO"}, action) => {
    switch (action.type) {
      //returns updated state
      case "KEY":
        return { ...action.payload };
      //else the current state is retained
      default:
        return state;
    }
  };