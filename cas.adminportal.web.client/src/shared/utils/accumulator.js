
export const accumulator = (array = [], key = 'id') => {

    return array.reduce((accumulator, current) => {
      accumulator[current[key]] = current;
      return accumulator;
    }, {});
  }