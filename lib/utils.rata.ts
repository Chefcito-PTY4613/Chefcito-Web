export const runAll = (arr: Array<Function>) => {
  arr.forEach((fn) => {
    return fn();
  });
};

export const noNullStr = (arr: Array<String>) =>
  arr.reduce((acc, cur) => {
    if (acc === false) return false;
    if (cur === undefined) acc = false;
    if (cur === null) acc = false;
    if (cur === "") acc = false;
    return acc;
  }, true);

export const transforDateTime = (date:string) =>  `${new Date(date).getHours()}:${new Date(date).getMinutes()}`;
export const transforDate = (date:string) =>
  `${new Date(date).getDate()}/${new Date(date).getMonth()+1}`;