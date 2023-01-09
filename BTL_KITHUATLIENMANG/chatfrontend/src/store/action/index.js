export const process = (encrypt, text, cypher) => {
    return {
      type: "PROCESS",
      payload: {
        encrypt,
        text,
        cypher,
      },
    };
  };
  export const key = (key) => {
    return {
      type: "KEY",
      payload: {
        key,
      },
    };
  };